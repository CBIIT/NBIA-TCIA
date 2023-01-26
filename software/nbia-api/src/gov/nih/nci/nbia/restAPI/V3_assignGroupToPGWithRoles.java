package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
import gov.nih.nci.security.authorization.domainobjects.Role;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/assignGroupToPGWithRoles")
public class V3_assignGroupToPGWithRoles extends getData{

	/**
	 * This method assign an user to a protection group with a role
	 *
	 * @return String - the status of operation 
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response  constructResponse(@QueryParam("groupName") String groupName, @QueryParam("PGName") String pgName, @QueryParam("roleNames") String roleNames) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		try {
			UserProvisioningManager upm = getUpm();
			//getProtection using protection group name
			ProtectionGroup pg = getPGByPGName(pgName);
			String [] roleNameList = roleNames.split(",");
			Group group = getGroupByGroupName(groupName);
			String [] roleIds = new String[roleNameList.length];
			for (int i=0; i < roleNameList.length; ++i) {
				Role role = getRoleByRoleName(roleNameList[i]);
				roleIds[i] = role.getId().toString();
			}
			upm.addGroupRoleToProtectionGroup(pg.getProtectionGroupId().toString(), group.getGroupId().toString(), roleIds);

		} catch (CSConfigurationException e) {
			e.printStackTrace();
		} catch (CSException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return Response.ok("Submited the assign request.").type("application/json").build();
	}	
}
