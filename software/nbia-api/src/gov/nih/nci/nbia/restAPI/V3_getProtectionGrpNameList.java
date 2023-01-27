//To Test:http://localhost:8080/nbia-auth/services/v3/getProtectionGrpNameList?format=html

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
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

@Path("/v3/getProtectionGrpNameList")
public class V3_getProtectionGrpNameList extends getData{
	private static final String column="Protection Group";
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a list of names of protection group
	 *
	 * @return String - list of names of protection group
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("format") String format) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		List<String> protectionGrpNames = null;

		try {
			UserProvisioningManager upm = getUpm();
			java.util.List<ProtectionGroup> protectionGrpLst = upm.getProtectionGroups();

			if ( protectionGrpLst != null) {
				protectionGrpNames = new ArrayList<String>();
				for(ProtectionGroup protectionGrp : protectionGrpLst) {
		            protectionGrpNames.add(protectionGrp.getProtectionGroupName());
		        }
			}
			else {
				String status = new String("Warning: No protection group has defined yet!");
				protectionGrpNames.add(status);
			}
		} catch (CSConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return formatResponse(format, protectionGrpNames, column);
	}

}
