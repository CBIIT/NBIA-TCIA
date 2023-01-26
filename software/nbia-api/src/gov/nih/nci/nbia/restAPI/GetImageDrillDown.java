package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.ImageDTO;
import gov.nih.nci.nbia.dao.ImageDAO;

@Path("/getImageDrillDown")
public class GetImageDrillDown extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("list") List<String> list) {

		try {	
//		Authentication authentication = SecurityContextHolder.getContext()
//					.getAuthentication();
//		String user = (String) authentication.getPrincipal();
		String user = getUserName(); 

		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(user);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(user, authorizedSiteData);
		}
		List<String> seriesSecurityGroups = new ArrayList<String>();
		ImageDAO imageDAO = (ImageDAO)SpringApplicationContext.getBean("imageDAO");
		List<Integer> input = new ArrayList<Integer>();
		for (String item:list){
			input.add(Integer.valueOf(item));
		}
 		List<ImageDTO> images = imageDAO.findImagesbySeriesPkID(input);

		
		return Response.ok(JSONUtil.getJSONforImages(images)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
}
