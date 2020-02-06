//To Test: http://localhost:8080/nbia-auth/services/v3/modifyProtecionGroup?PGName=NCIA.TestAuth&description=aTestGroup

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
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

@Path("/v3/modifyUserGroup")
public class V3_modifyUserGroup extends getData{
	@Context private HttpServletRequest httpRequest;

	/**
	 * This method create a new Protection Group
	 *
	 * @return String - the status of operation 
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response  constructResponse(@QueryParam("GroupName") String groupName, @QueryParam("description") String desp) {
		try {
			UserProvisioningManager upm = getUpm();
			Group userGrp = getGroupByGroupName(groupName);
			userGrp.setGroupDesc(desp);

			upm.modifyGroup(userGrp); 
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
		
		return Response.ok("{\"status\": \"Submited the creation request.\"}").type("application/json").build();
	}	
}
