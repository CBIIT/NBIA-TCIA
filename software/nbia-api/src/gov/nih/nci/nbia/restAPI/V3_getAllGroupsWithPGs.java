//To Test: http://localhost:8080/nbia-auth/services/v3/getAllPGsWithPEs?format=html
//To Test: http://localhost:8080/nbia-auth/services/v3/getAllPGsWithPEs?format=json

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroupRoleContext;
import gov.nih.nci.security.authorization.domainobjects.Role;
import gov.nih.nci.security.dao.GroupSearchCriteria;
import gov.nih.nci.security.dao.SearchCriteria;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;
import gov.nih.nci.security.util.ProtectionGroupRoleContextComparator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;


@Path("/v3/getAllGroupsWithPGs")
public class V3_getAllGroupsWithPGs extends getData{
	private static final String[] columns={"userGroup", "description", "pgs"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a list of groups with associated protection groups
	 * 
	 * @return String - list of groups with associated protection groups
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("format") String format) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		List<Object []> result = new ArrayList<Object[]>();
		try {
			UserProvisioningManager upm = getUpm();
			
			List<Group> groups = getAllGroups();
			for (Group grp : groups) {
				HashSet<ProtectionGroupRoleContext> groupRoles = (HashSet<ProtectionGroupRoleContext>)upm.getProtectionGroupRoleContextForGroup(grp.getGroupId().toString());
				ArrayList<ProtectionGroupRoleContext> sortedList = new ArrayList<ProtectionGroupRoleContext>(groupRoles);
				Collections.sort(sortedList, new ProtectionGroupRoleContextComparator());
				JSONArray json = new JSONArray();
				
				for(ProtectionGroupRoleContext gp: sortedList) {
					JSONObject jobjpg = new JSONObject();
					StringBuffer allRoleNames = new StringBuffer();

					Iterator itr = gp.getRoles().iterator();
					while (itr.hasNext()) {
						Role role = (Role)itr.next();

						if (allRoleNames.length()>0)
							allRoleNames.append(", "+role.getName());
						else 
							allRoleNames.append(role.getName());
					}

					jobjpg.put("pgName", gp.getProtectionGroup().getProtectionGroupName());
					jobjpg.put("roleNames", allRoleNames.toString());

					json.put(jobjpg);
				}
				
				Object [] objs = {grp.getGroupName(), grp.getGroupDesc(), json};
				result.add(objs);
			}
			} catch (CSException e) {				
				e.printStackTrace();
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		
		return formatResponse(format, result, columns);
	}
	
	private List<Group> getAllGroups() {
		try {
			UserProvisioningManager upm = getUpm();
			Group group = new Group();
			SearchCriteria searchCriteria = new GroupSearchCriteria(group);

			java.util.List<Group> existGroupLst = upm.getObjects(searchCriteria);
			return existGroupLst;
			
		} catch (CSConfigurationException e) {
			e.printStackTrace();
		} catch (CSException e) {
			e.printStackTrace();
		}
		return null ;
	}
	
}