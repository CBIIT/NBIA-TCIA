//To Test: http://localhost:8080/nbia-auth/services/v3/getIncludedPEsForPG?PGName=NCIA.IDRI//IDRI&format=html

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.ProtectionElement;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
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


@Path("/v3/getAssociatedPGsForPEs")
public class V3_getAssociatedPGsForPEs extends getData{
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
		List<Object []> pgOptions= new ArrayList<Object[]>();

		try {
			UserProvisioningManager upm = getUpm();
			Set pgs = upm.getProtectionGroups(upm.getProtectionElement("NCIA."+peName, "NCIA.PROJECT//DP_SITE_NAME").getProtectionElementId().toString());
			
			if (pgs!= null) {
				ProtectionGroup[] pgList = (ProtectionGroup[]) pgs.toArray(new ProtectionGroup[0]);
				
				for (int i = 0; i<pgList.length; ++i) {					
					Object [] objs = {pgList[i].getProtectionGroupName(), pgList[i].getProtectionGroupName()};
					pgOptions.add(objs);										
				}
				
				Collections.sort(pgOptions, new Comparator<Object[]>() {
					public int compare(Object[] s1, Object[] s2) {
					   //ascending order
					   return s1[0].toString().compareTo(s2[0].toString());
				    }
				});									
			}			
			else {
					Object [] objs = {"Warning: No Protection Group Assigned Yet!", "Warning: No Protection Group Assigned Yet!"};
					pgOptions.add(objs);
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
		
		return formatResponse(format, pgOptions, columns);
	}
}
