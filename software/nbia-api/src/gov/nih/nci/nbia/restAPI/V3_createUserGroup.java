//To Test: http://localhost:8080/nbia-auth/services/v3/createProtecionGroup?PGName=NCIA.TestAuth

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Application;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/createUserGroup")
public class V3_createUserGroup extends getData{
	@Context private HttpServletRequest httpRequest;

	/**
	 * This method create a new user Group
	 *
	 * @return String - the status of operation 
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response  constructResponse(@QueryParam("GroupName") String groupName, @QueryParam("description") String desp) {
		try {
			UserProvisioningManager upm = getUpm();
			Application ap = upm.getApplication(NCIAConfig.getCsmApplicationName());
			if (ap == null) {
				return Response.ok("{\"status\": \"Server error: Application defined in nbia.properties does not match application name in Database.\"}").type("application/json").build();
			}
			Group grp = new Group();
			grp.setGroupName(groupName);
			grp.setGroupDesc(desp);
			grp.setUpdateDate(new Date());
			grp.setApplication(ap);
			upm.createGroup(grp);
		} catch (CSConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	 
		
		return Response.ok("{\"status\": \"Submited the creation request.\"}").type("application/json").build();
	}	
}
