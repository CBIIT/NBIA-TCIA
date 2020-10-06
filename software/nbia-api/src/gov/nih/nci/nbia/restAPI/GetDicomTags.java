//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.textsupport.NCIADicomTextObject;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;

import java.io.File;
import java.text.SimpleDateFormat;

import gov.nih.nci.nbia.dao.ImageDAO;
import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.nbia.dao.ValueAndCountDAOImpl;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;
import gov.nih.nci.nbia.dto.*;

import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Path("/getDicomTags")
public class GetDicomTags extends getData{


	@Context private HttpServletRequest httpRequest;

	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@QueryParam("SeriesUID") String seriesUID) {
		String message="";
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
				AuthorizationCriteria auth = new AuthorizationCriteria();
				auth.setSeriesSecurityGroups(new ArrayList<String>());
				auth.setSites(authorizedSiteData);
				List<String> seriesSecurityGroups = new ArrayList<String>();
	        	ImageDAO imageDAO = (ImageDAO)SpringApplicationContext.getBean("imageDAO");
	        	List<String>seriesList=new ArrayList<String>();
	        	seriesList.add(seriesUID);
	        	
	        	List<ImageDTO> images = imageDAO.findImagesbySeriesInstandUid(seriesList);
	        	if (images!=null&&images.size()>0){
	        		ImageDTO idto=images.get(0);
	        		String dicomFilePath = idto.getFileURI();
	        		NCIADicomTextObject dicomObject=NCIADicomTextObject.getInstance();
					File dicomFile = new File(dicomFilePath);
					if (dicomFile.exists())
					{
   				        List<DicomTagDTO> tags=dicomObject.getTagElements(dicomFile);
				        return Response.ok(JSONUtil.getJSONforDicomTagDTOs(tags)).type("application/json")
						.build();
	        	    }  else  {
	        	    	message=" file not found";
	        	    }
	        	}	else  {
	        		message=" image not found";
	        	}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				return Response.status(500)
						.entity("Server was not able to process your request"+message).build();
	}
}
