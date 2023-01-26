//To Test: http://localhost:8080/nbia-api/v3/getUserList?format=html

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.dao.SearchCriteria;
import gov.nih.nci.security.dao.UserSearchCriteria;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/getUserList")
public class V3_getUserList extends getData{
	private static final String[] columns={"loginName", "email", "active"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a list of user login names
	 *
	 * @return String - list of user login names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("format") String format) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		List<Object[]> data = null;
		
		try {
			UserProvisioningManager upm = getUpm();
			User user = new User();
			SearchCriteria searchCriteria = new UserSearchCriteria(user);

			java.util.List<User> existUserLst = upm.getObjects(searchCriteria);

			if ( existUserLst != null) {
				data = new ArrayList<Object []>();

				for(User existUser : existUserLst) {
					Object [] objs = {existUser.getLoginName(), existUser.getEmailId(), existUser.getActiveFlag()};
		            data.add(objs);
		        }
			}
			else {
				Object [] objs = {"Warning: No user has defined yet!", "NA", "NA"};
				data.add(objs);
			}
		} catch (CSConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return formatResponse(format, data, columns);
	}
}
