//To Test: http://localhost:8080/nbia-auth/services/v3/deassignPEsFromPG?projAndSite=TCGA//DUKE&PGName=NCIA.Test&projAndSite=IDRI//IDRI

package gov.nih.nci.nbia.restAPI;

import java.util.Set;

import gov.nih.nci.security.SecurityServiceProvider;
import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.ProtectionElement;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
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
import javax.ws.rs.core.Response.Status;

@Path("/v3/deassignPGsFromPE")
public class V3_deassignPGsFromPE extends getData{
	@Context private HttpServletRequest httpRequest;

	/**
	 * This method deassign a combination of Project and Site to a Protection Group
	 *
	 * @return String - the status of operation 
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response constructResponse(@QueryParam("PGNames") String pgNames, @QueryParam("PEName") String peName) {
		// String projName = null;
		if ((peName == null) || peName.isEmpty()) {
			return Response.status(Status.BAD_REQUEST).entity("A value for PEName is needed.").build();
		}
		String pe1 = "NCIA."+ peName;
		String pe2 = "NCIA."+ peName.split("//")[0];

		if (pgNames != null) {
			String[] pgs = pgNames.split(",");
			try {
				UserProvisioningManager upm = getUpm();
				for (int i = 0; i< pgs.length; ++i) {
					ProtectionGroup pg = getPGByPGName(pgs[i]);
					ProtectionElement protectionElm1 = upm.getProtectionElement(pe1);
					ProtectionElement protectionElm2 = upm.getProtectionElement(pe2);
					String peId1 = protectionElm1.getProtectionElementId().toString();
					String peId2 = protectionElm2.getProtectionElementId().toString();
					String [] peIds = {peId1, peId2};
					//System.out.println("remove " + pe1 + " and "+pe2 + "from pg=" +pgs[i]);
					upm.removeProtectionElementsFromProtectionGroup(pg.getProtectionGroupId().toString(), peIds);
				}
			} catch (CSConfigurationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return Response.status(Status.SERVICE_UNAVAILABLE)
						.entity("Server failed to perform requested action")
						.build();
			} catch (CSException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return Response.status(Status.SERVICE_UNAVAILABLE)
						.entity("Server failed to perform requested action")
						.build();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return Response.status(Status.SERVICE_UNAVAILABLE)
						.entity("Server failed to perform requested action")
						.build();
			}
		} 
		else {
			return Response.status(Status.BAD_REQUEST)
					.entity("A value for PGNames is needed. The values should have a format of comma seperated protection group names.")
					.build();
		}

		return Response.ok("Deassigned").type("application/json").build();
	}
}
