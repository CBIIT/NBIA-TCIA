//To Test: http://localhost:8080/nbia-api/v3/modifyUser?loginName=authTest&email=test@mail.nih.gov&active=true

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/modifyUser")
public class V3_modifyUser extends getData{

	/**
	 * This method modify an existing user
	 *
	 * @return String - the status of operation 
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response  constructResponse(@QueryParam("loginName") String loginName, @QueryParam("email") String email, @QueryParam("active") String active) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		try {
			UserProvisioningManager upm = getUpm();
			User user = getUserByLoginName(loginName);

			user.setEmailId(email);
			if (Boolean.parseBoolean(active))
				user.setActiveFlag((byte) 1);
			else user.setActiveFlag((byte) 0);
			upm.modifyUser(user);
		} catch (CSConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return Response.ok("[\"status\", \"Submited the modification request.\"]").type("application/json").build();
	}	
}
