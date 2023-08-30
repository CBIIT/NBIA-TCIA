package gov.nih.nci.nbia.restAPI;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dao.CollectionDescDAO;
import gov.nih.nci.nbia.dto.CollectionDescDTO;
import gov.nih.nci.nbia.restUtil.RoleCache;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import io.swagger.annotations.*;
@Path("/submitCollectionDescription")
public class SubmitCollectioDescription extends getData{
	public final static String TEXT_CSV = "text/csv";

	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@ApiOperation(value = "Submit a new or updated collection description",
	  notes = "This method accepts a new collection description, if a description does not exist for the collection on is created")
   @ApiResponses(value = {
      @ApiResponse(code = 200, message = "The collection description has been sucessfully processed"),
      @ApiResponse(code = 500, message = "An unexpected error has occurred. The error has been logged.") })

	public Response constructResponse(@ApiParam(name =  "name", 
			   value = "The name of the collection to have the description", example = "4D-Lung", required = true) 
	        @FormParam("name") String name,
	        @ApiParam(name =  "description", 
			   value = "The description of the collection", example = "This is my collection", required = true) 
			@FormParam("description") String description,
	        @ApiParam(name =  "license", 
			   value = "The license id for the collection", example = "2", required = false)
	         @FormParam("license") Integer license) {

		String user = getUserName();
		List<String> roles=RoleCache.getRoles(user);
		if (roles==null) {
			roles=new ArrayList<String>();

			NCIASecurityManager sm = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
			roles.addAll(sm.getRoles(user));
			RoleCache.setRoles(user, roles);
		}
		boolean hasRole=false;
		for (String role:roles) {
			if(role.equalsIgnoreCase("NCIA.MANAGE_COLLECTION_DESCRIPTION")) {
				hasRole=true;
			}
		}
		if (!hasRole) {
			return Response.status(401)
				.entity("Insufficiant Privileges").build();
		}
		CollectionDescDAO collectionDescDAO = (CollectionDescDAO)SpringApplicationContext.getBean("collectionDescDAO");
		CollectionDescDTO collectionDescDTO=new CollectionDescDTO();
		collectionDescDTO.setCollectionName(name);
		collectionDescDTO.setDescription(description);
		collectionDescDTO.setUserName(user);
		collectionDescDTO.setLicenseId(license);
		collectionDescDAO.save(collectionDescDTO);

		return Response.ok().type("text/plain")
				.entity("Description updated")
				.build();
	}
}
