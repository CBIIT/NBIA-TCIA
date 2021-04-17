//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.*;
import java.text.*;

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

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.DOIDTO;
import gov.nih.nci.nbia.dto.QcSearchResultDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.deletion.DeletionDisplayObject;
import gov.nih.nci.nbia.deletion.ImageDeletionService;
import gov.nih.nci.nbia.restUtil.QAUserUtil;
import gov.nih.nci.nbia.restUtil.RoleCache;
@Path("/getMD5Hierarchy")
public class GetMD5Heirarchy extends getData{


	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response  constructResponse(@FormParam("SeriesInstanceUID") String seriesInstanceUID, 
			                           @FormParam("StudyInstanceUID") String studyInstanceUID,
			                           @FormParam("PatientID") String patientID,
			                           @FormParam("Collection") String collection) {
		String md5 = "";
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
	
            if (seriesInstanceUID!=null&&seriesInstanceUID.length()>0) {
    			GeneralSeriesDAO tDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
    			md5=tDao.getMD5ForSeries(seriesInstanceUID);
            }
            if (studyInstanceUID!=null&&studyInstanceUID.length()>0) {
    			GeneralSeriesDAO tDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
    			md5=tDao.getMD5ForStudy(studyInstanceUID, authorizedSiteData);
            }	
            if (patientID!=null&&patientID.length()>0) {
    			GeneralSeriesDAO tDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
    			md5=tDao.getMD5ForPatientId(patientID, collection, authorizedSiteData);
            }	
            if ((collection!=null&&collection.length()>0)&&!(patientID!=null&&patientID.length()>0)) {
    			GeneralSeriesDAO tDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
    			md5=tDao.getMD5ForCollection(collection, authorizedSiteData);
            }            
            
            
    		return Response.ok().type("text/plain")
    				.entity(md5)
    				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	
	private Date getDate(String date) {
		Date returnValue=null;
		
		if (date==null)
		{
			return Calendar.getInstance().getTime();
		}
		DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
		try {
		returnValue=format.parse(date);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String today = format.format(new Date());
		System.out.println("today-"+today);
		return returnValue;
	}
	
}
