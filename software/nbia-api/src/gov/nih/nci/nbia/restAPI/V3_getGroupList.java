//To Test: http://localhost:8080/nbia-auth/services/v3/getUserList?format=html

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.dao.SearchCriteria;
import gov.nih.nci.security.dao.GroupSearchCriteria;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/getGroupList")
public class V3_getGroupList extends getData{
	private static final String[] columns={"userGroup", "description"};
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;

	/**
	 * This method get a list of group names
	 *
	 * @return String - list of group names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("format") String format) {
		List<Object[]> data = null;
		
		try {
			UserProvisioningManager upm = getUpm();
			Group group = new Group();
			SearchCriteria searchCriteria = new GroupSearchCriteria(group);

			java.util.List<Group> existGroupLst = upm.getObjects(searchCriteria);
			data = new ArrayList<Object []>();
			if ( existGroupLst != null) {
				
				for(Group existGroup : existGroupLst) {
					Object [] objs = {existGroup.getGroupName(), existGroup.getGroupDesc()};
		            data.add(objs);
		        }
			}
			else {
				Object [] objs = {"Warning: No group has defined yet!", "NA"};
				data.add(objs);
			}
		} catch (CSConfigurationException e) {

			e.printStackTrace();
		} catch (CSException e) {
			e.printStackTrace();
		}

		return formatResponse(format, data, columns);
	}
}
