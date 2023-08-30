package gov.nih.nci.nbia.restAPI;

import java.util.List;

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
import gov.nih.nci.nbia.dto.CustomSeriesListDTO;
import gov.nih.nci.nbia.dao.CustomSeriesListDAO;

@Path("/deleteSharedList")
public class DeleteSharedList extends getData{
	public final static String TEXT_CSV = "text/csv";
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(@FormParam("name") String name) {

 		String user = getUserName();
		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(user);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(user, authorizedSiteData);
		}

		CustomSeriesListDAO customSeriesListDAO = (CustomSeriesListDAO)SpringApplicationContext.getBean("customSeriesListDAO");
		CustomSeriesListDTO  csDTO=customSeriesListDAO.findCustomSeriesListByName(name);
		if (csDTO==null){
    		return Response.status(400).type("text/plain")
			.entity("List name not found")
			.build();
		}
		if (!csDTO.getUserName().equals(user)){
    		return Response.status(400).type("text/plain")
			.entity("Only the owner can delete a list")
			.build();
		}
		customSeriesListDAO.delete(csDTO);
		return Response.ok().type("text/plain")
				.entity("List deleted")
				.build();
	}

}
