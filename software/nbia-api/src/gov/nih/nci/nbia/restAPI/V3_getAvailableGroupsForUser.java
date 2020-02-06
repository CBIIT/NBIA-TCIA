//To Test: http://localhost:8080/nbia-auth/services/v3/getAvailablePGsForUser?loginName=panq

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.dao.GroupSearchCriteria;
import gov.nih.nci.security.dao.SearchCriteria;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
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

import org.springframework.dao.DataAccessException;


@Path("/v3/getAvailableGroupsForUser")
public class V3_getAvailableGroupsForUser extends getData{
	private static final String[] columns={"label", "value"};
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;

	/**
	 * This method get a list of protection element names
	 *
	 * @return String - list of protection element names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response constructResponse(@QueryParam("loginName") String loginName, @QueryParam("format") String format) {
		// Set<String> allGroup = null;
		List<Object[]> gOptions = new ArrayList<Object[]>();
		try {
			UserProvisioningManager upm = getUpm();
			Group group = new Group();
			SearchCriteria searchCriteria = new GroupSearchCriteria(group);

			java.util.List<Group> allGroupLst = upm.getObjects(searchCriteria);
			if ((allGroupLst != null) && (!allGroupLst.isEmpty())) {
				Set<Group> allGroupSet = new HashSet<>(allGroupLst);

				User user = getUserByLoginName(loginName);
				Set usedGroups = upm.getGroups(user.getUserId().toString());
				allGroupSet.removeAll(usedGroups);

				if (!(allGroupSet.isEmpty())) {

					for (Group ag : allGroupSet) {
						Object[] objs = { ag.getGroupName(), ag.getGroupName() };
						gOptions.add(objs);
					}

					Collections.sort(gOptions, new Comparator<Object[]>() {
						public int compare(Object[] s1, Object[] s2) {
							// ascending order
							return s1[0].toString().compareTo(s2[0].toString());
						}
					});
				}
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
		return formatResponse(format, gOptions, columns);
	}
}
