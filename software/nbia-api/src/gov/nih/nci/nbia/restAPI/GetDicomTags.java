package gov.nih.nci.nbia.restAPI;

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

@Path("/getDicomTags")
public class GetDicomTags extends getData{

  @GET
  @Produces(MediaType.APPLICATION_JSON)

  public Response constructResponse(@QueryParam("SeriesUID") String seriesUID) {
    String message="";
    try {	
      //			   Authentication authentication = SecurityContextHolder.getContext()
      //						.getAuthentication();
      //				String user = (String) authentication.getPrincipal();
      String user = getUserName(); 

      final String sid = seriesUID
      Map<String, String> paramMap = new HashMap<String, String>();
      paramMap.put("seriesInstanceUID", sid);
      //SecurityContextHolder will be used to get the user name later.
      if (!isUserHasAccess(userName, paramMap)) {
        return Response.status(Status.BAD_REQUEST)
          .entity("The user has not been granted the access to image with given SeriesInstanceUID," + sid + ". Please contact System Admin to resolve this issue.")
          .type(MediaType.APPLICATION_JSON).build();
      }

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
