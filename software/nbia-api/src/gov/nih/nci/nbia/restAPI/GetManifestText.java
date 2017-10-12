//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import org.apache.commons.io.IOUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.lookup.*;
import gov.nih.nci.nbia.basket.DynamicJNLPGenerator;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.util.StringEncrypter;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.searchresult.SeriesSearchResult;
import gov.nih.nci.nbia.util.SeriesDTOConverter;
@Path("/getManifestText")
public class GetManifestText extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	private HashSet<String> collectionSet;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(@FormParam("list") List<String> list, @FormParam("password") String password, @FormParam("includeAnnotation") String includeAnnotation, @FormParam("manifestFileName") String manifestFileName ) {

		try {	
	   Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		String user = (String) authentication.getPrincipal();
		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(user);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(user, authorizedSiteData);
		}
		List<String> seriesSecurityGroups = new ArrayList<String>();
		GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
		List<String> input = new ArrayList<String>();
		for (String item:list){
			input.add(item);
			System.out.println("Input is :"+item);
		}
        List<SeriesDTO> ssList = generalSeriesDAO.findSeriesBySeriesInstanceUIDAnyVisibility(input);

		List<SeriesSearchResult> seriesFound=SeriesDTOConverter.convert(ssList);
		List<BasketSeriesItemBean> seriesItems=new ArrayList<BasketSeriesItemBean>();
		for (SeriesSearchResult series:seriesFound){
			seriesItems.add(convert(series));
		}
		boolean includeAnnotationVariable=false;
		if (includeAnnotation.equals("true"))
		{
			includeAnnotationVariable=true;
		}
		
		List<String> seriesDownloadData = new ArrayList<String>();
		boolean hasPrivateCollection = false;
		for (BasketSeriesItemBean seriesItem : seriesItems) {

			String collection = seriesItem.getProject();
			String patientId = seriesItem.getPatientId();
			String studyInstanceUid = seriesItem.getStudyId();
			String seriesInstanceUid = seriesItem.getSeriesId();
			String annotation = seriesItem.getAnnotated();
			Integer numberImages = seriesItem.getTotalImagesInSeries();
			Long imagesSize = seriesItem.getTotalSizeForAllImagesInSeries();
			Long annoSize = seriesItem.getAnnotationsSize();
			String url = "url";
			String displayName = "displayName";
			String studyDate = seriesItem.getStudyDate();
			String studyDesc = cleanStr(seriesItem.getStudyDescription());
			String seriesDesc = cleanStr(seriesItem.getSeriesDescription());
			String study_id = cleanStr(seriesItem.getStudy_id());
			String seriesNumber = seriesItem.getSeriesNumber();
			
			if (!isPublicCollection(collection)) {
				hasPrivateCollection = true;
			}

			String argument = "" + collection + "|" + patientId + "|" + studyInstanceUid + "|" + seriesInstanceUid + "|"
					+ annotation + "|" + numberImages + "|" + imagesSize + "|" + annoSize + "|" + url + "|"
					+ displayName + "|" + true + "|" + studyDate + "|" + study_id + "|" + studyDesc + "|" + seriesNumber + "|" + seriesDesc;
			seriesDownloadData.add(argument);
		}
		long currentTimeMillis = System.currentTimeMillis();
		String dataFileName = manifestFileName;
		if (manifestFileName==null||manifestFileName==""){
			dataFileName = "manifest-" + user + "-" + currentTimeMillis;
		}
		File dataFile = new File(System.getProperty("java.io.tmpdir"), dataFileName);
		OutputStream os = new FileOutputStream(dataFile);
		IOUtils.writeLines(seriesDownloadData, System.getProperty("line.separator"), os);
		if (hasPrivateCollection) {
			String encryptedPassword = encrypt(user, password);
			IOUtils.write(user + "\n" + encryptedPassword + "\n" + NCIAConfig.getEncryptionKey(), os);
		}
		os.close();

		StringBuffer outSB = new StringBuffer();
		outSB.append("downloadServerUrl=" + NCIAConfig.getDownloadServerUrl() + "\n");
		outSB.append("includeAnnotation=" + includeAnnotationVariable + "\n");

		outSB.append("noOfrRetry=" + NCIAConfig.getNoOfRetry() + "\n");
		String tmpDir = System.getProperty("java.io.tmpdir");
		if (File.separatorChar != '/')
			tmpDir = tmpDir.replace(File.separatorChar, '/');
		outSB.append("tempLoc=" + tmpDir + "/\n");

		if (hasPrivateCollection) {
			outSB.append("databasketId=" + dataFileName + "-x\n");
		} else {
			outSB.append("databasketId=" + dataFileName + "\n");
		}

        
		return Response.ok(outSB.toString()).type("application/x-nbia-manifest-file")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	
	private static BasketSeriesItemBean convert(SeriesSearchResult seriesDTO){
		BasketSeriesItemBean returnBean = new BasketSeriesItemBean(seriesDTO);

		returnBean.setAnnotationsFlag(seriesDTO.isAnnotated());
		returnBean.setAnnotationsSize(seriesDTO.getAnnotationsSize());
		returnBean.setPatientId(seriesDTO.getPatientId());
		returnBean.setProject(seriesDTO.getProject());
		returnBean.setSeriesId(seriesDTO.getSeriesInstanceUid());
		returnBean.setSeriesPkId(seriesDTO.getId());
		returnBean.setStudyId(seriesDTO.getStudyInstanceUid());
		returnBean.setStudyPkId(seriesDTO.getStudyId());
		returnBean.setTotalImagesInSeries(seriesDTO.getNumberImages());
		returnBean.setTotalSizeForAllImagesInSeries(seriesDTO.getTotalSizeForAllImagesInSeries());
		returnBean.setStudyDate(seriesDTO.getStudyDate());
		returnBean.setStudyDescription(seriesDTO.getStudyDescription());
		returnBean.setSeriesDescription(seriesDTO.getDescription());
		returnBean.setStudy_id(seriesDTO.getStudy_id());
		returnBean.setSeriesDescription(seriesDTO.getDescription());
		returnBean.setSeriesNumber(seriesDTO.getSeriesNumber());
		returnBean.setPatientpk(seriesDTO.getPatientpk());
		return returnBean;
	}
	private String cleanStr(String in) {
		if ((in != null) && (in.length() > 0)) {
			String out= in.replaceAll("[^a-zA-Z0-9 .-]", "");
			return out;
		}
		else return null;
	}
	private HashSet<String> getPubicCollections() throws Exception {
		HashSet<String> pubCollectionSet = new HashSet<String>();
		List<String> pubCollections = null;
		String user =  NCIAConfig.getGuestUsername();
		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(user);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(user, authorizedSiteData);
		}
		for (SiteData site : authorizedSiteData) {
			pubCollectionSet.add(site.getCollection());
		}
		return pubCollectionSet;
	}
	 private boolean isPublicCollection(String collection) {
			try {
				if (collectionSet==null){
					collectionSet = getPubicCollections();
				}	
				if (collectionSet.contains(collection)) {
					return true;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

			return false;
		}
	    private String encrypt(String userId, String password) throws Exception{
	        if(userId.equals(NCIAConfig.getGuestUsername())){
	            return "";
	        }
	        StringEncrypter encrypter = new StringEncrypter();
	        return encrypter.encryptString(password);
	    }
}
