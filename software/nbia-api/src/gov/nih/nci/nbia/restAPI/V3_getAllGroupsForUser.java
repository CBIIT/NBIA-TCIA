//To Test: http://localhost:8080/nbia-auth/services/v3/getAllPGsWithRolesForUser?loginName=panq&format=html
//To Test: http://localhost:8080/nbia-auth/services/v3/getAllPGsWithRolesForUser?loginName=panqformat=json

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.exceptions.CSException;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


@Path("/v3/getAllGroupsForUser")
public class V3_getAllGroupsForUser extends getData{
	private static final String column ="GroupName";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a list of groups assigned to the user
	 * 
	 * @return String - list of protection groups with associated protection elements
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("loginName") String loginName, @QueryParam("format") String format) {
		List<String> data = new ArrayList();
		try {
			UserProvisioningManager upm = getUpm();
			User user = getUserByLoginName(loginName);

			Set groups = upm.getGroups(user.getUserId().toString());
				
			Iterator itr = groups.iterator();
			while (itr.hasNext()) {
				Group group = (Group)itr.next();
				data.add(group.getGroupName());
			}

		} catch (CSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	 	
		
		if (data.size() >= 1) {
			return formatResponse(format, data, column);
		}
		else {
			data.add("Info: No group associated with the selected user yet!");
			return formatResponse(format, data, column);
		}
	}
}
