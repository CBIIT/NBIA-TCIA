//To Test: http://localhost:8080/nbia-auth/services/v3/assignUserToPGWithRoles?loginName=authTest&PGName=NCIA.Test&roleName=NCIA.READ

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/assignUserToGroups")
public class V3_assignUserToGroups extends getData{
	@Context private HttpServletRequest httpRequest;

	/**
	 * This method assign an user to a protection group with a role
	 *
	 * @return String - the status of operation 
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response  constructResponse(@QueryParam("loginName") String loginName, @QueryParam("groupNames") String groupNames) {
		try {
			UserProvisioningManager upm = getUpm();
			String [] groupNameList = groupNames.split(",");
			User user = getUserByLoginName(loginName);
			String [] groupIds = new String[groupNameList.length];
			for (int i=0; i < groupNameList.length; ++i) {
				Group group = getGroupByGroupName(groupNameList[i]);
				groupIds[i] = group.getGroupId().toString();
			}
			upm.addGroupsToUser(user.getUserId().toString(), groupIds);

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
		
		return Response.ok("Submited the assign request.").type("application/json").build();
	}	
}
