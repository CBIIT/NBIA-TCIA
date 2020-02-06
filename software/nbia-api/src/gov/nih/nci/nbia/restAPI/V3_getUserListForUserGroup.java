//To Test: http://localhost:8080/nbia-auth/services/v3/getUserList?format=html

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.exceptions.CSConfigurationException;
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

@Path("/v3/getUserListForUserGroup")
public class V3_getUserListForUserGroup extends getData{
	public final static String TEXT_CSV = "text/csv";
	private static final String column ="UserName";
	
	@Context private HttpServletRequest httpRequest;

	/**
	 * This method get a list of user login names assigned to the given group
	 *
	 * @return String - list of user login names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response constructResponse(@QueryParam("groupName")String groupName, @QueryParam("format") String format) {
		
		List<String> data = new ArrayList();
		 		
		try {
			Group group = getGroupByGroupName(groupName);
			UserProvisioningManager upm = getUpm();
			Set associatedUsers = upm.getUsers(group.getGroupId().toString());
			
			Iterator itr = associatedUsers.iterator();
			while (itr.hasNext()) {
				User user = (User)itr.next();
				data.add(user.getLoginName());
			}
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
		
		if (data.size() >= 1) {
			return formatResponse(format, data, column);
		}
		else {
			data.add("Info: No user has defined yet!");
			return formatResponse(format, data, column);
		}
	}
}
