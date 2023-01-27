//To Test: http://localhost:8080/nbia-api/v3/modifyProtecionGroup?PGName=NCIA.TestAuth&description=aTestGroup

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/modifyProtecionGroup")
public class V3_modifyProtecionGroup extends getData{

	/**
	 * This method create a new Protection Group
	 *
	 * @return String - the status of operation 
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response  constructResponse(@QueryParam("PGName") String pgName, @QueryParam("description") String desp) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		try {
			UserProvisioningManager upm = getUpm();
			ProtectionGroup protectionGrp = getPGByPGName(pgName);
			protectionGrp.setProtectionGroupDescription(desp);

			upm.modifyProtectionGroup(protectionGrp); 
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
