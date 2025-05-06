package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.textsupport.NCIADicomTextObject;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;

import java.io.File;

import gov.nih.nci.nbia.dao.ImageDAO;
import gov.nih.nci.nbia.dto.*;

@Path("/v4/getDicomTagsByImageID")
public class GetDicomTagByImageID extends getData{

	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@QueryParam("imageID") Integer imageID) {
		String message="";
		String user = getUserName();
		try {

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

        	ImageDTO image = imageDAO.getGeneralImageByImagePkId(imageID);
        	if (image!=null){
        		String dicomFilePath = image.getFileURI();
        		System.out.println(dicomFilePath);
            	NCIADicomTextObject dicomObject;
				File dicomFile = new File(dicomFilePath);
				if (dicomFile.exists())
				{
				        List<DicomTagDTO> tags=NCIADicomTextObject.getTagElements(dicomFile);
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
