//Get all available PGs which has no given PE assigned to yet.

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.ProtectionElement;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroupRoleContext;
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

@Path("/v3/getAvailablePGsForPE")
public class V3_getAvailablePGsForPE extends getData{
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

	public Response  constructResponse(@QueryParam("PEName") String peName, @QueryParam("format") String format) {
		Set<String> allPg = null;

		try {
			UserProvisioningManager upm = getUpm();
			List<ProtectionGroup> protectionGrps = upm.getProtectionGroups();

			if ((protectionGrps != null) && (!protectionGrps.isEmpty())) {
				allPg = new HashSet<String>();
				for (ProtectionGroup pg: protectionGrps) {
					allPg.add(pg.getProtectionGroupName());
				}
				Set<String> usedPg = new HashSet<String>();
				ProtectionElement pe = upm.getProtectionElement(peName, "NCIA.PROJECT//DP_SITE_NAME");
				if (pe != null) {				
					Set pgs = upm.getProtectionGroups(pe.getProtectionElementId().toString());
						
					if (pgs!= null) {
						ProtectionGroup[] pgList = (ProtectionGroup[]) pgs.toArray(new ProtectionGroup[0]);
						for (int i = 0; i<pgList.length; ++i) {
							usedPg.add(pgList[i].getProtectionGroupName());
						}
					}
				}
							
			    allPg.removeAll(usedPg);
			    Collections.sort(new ArrayList<String>(allPg));
			}
			else allPg.add("Warning: No Data Group found. Please create one first.");
		} catch (CSConfigurationException e) {
			e.printStackTrace();
		} catch (CSException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}	 

		List<Object []> pgOptions= new ArrayList<Object[]>();
		if (!(allPg.isEmpty())) {
			for (String apg: allPg) {
				Object [] objs = {apg, apg};
				pgOptions.add(objs);
			}
			
			Collections.sort(pgOptions, new Comparator<Object[]>() {
				public int compare(Object[] s1, Object[] s2) {
				   //ascending order
				   return s1[0].toString().compareTo(s2[0].toString());
			    }
			});
		}
		return formatResponse(format, pgOptions, columns);
	}	
}
