//To Test: http://localhost:8080/nbia-auth/services/v3/getUserList?format=html

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.ProtectionElement;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
//import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.dao.SearchCriteria;
import gov.nih.nci.security.dao.UserSearchCriteria;
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

@Path("/v3/getPEListWithPGs")
public class V3_getPEListWithPGs extends getData{
	private static final String[] columns={"collection", "site", "dataSets" };
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;

	/**
	 * This method get a list of collection and site available in database
	 *
	 * @return String - list of PE with associated PGs
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("format") String format) {
		List<String> results = null;
		List<Object[]> data = null;

		TrialDataProvenanceDAO tDao = (TrialDataProvenanceDAO)SpringApplicationContext.getBean("trialDataProvenanceDAO");
		try {

			results = tDao.getProjSiteValues();
			if (results != null) {
				data = new ArrayList<Object []>();
				UserProvisioningManager upm = getUpm();
				for (String projSiteName : results) {
						if (projSiteName != null) {
							StringBuffer allPgNames = new StringBuffer();
							ProtectionElement pe = upm.getProtectionElement("NCIA."+projSiteName, "NCIA.PROJECT//DP_SITE_NAME");
							if (pe == null)
								allPgNames.append("");
							else {
								Set pgs = upm.getProtectionGroups(upm.getProtectionElement("NCIA."+projSiteName, "NCIA.PROJECT//DP_SITE_NAME").getProtectionElementId().toString());
								
									if (pgs!= null) {
										ProtectionGroup[] pgList = (ProtectionGroup[]) pgs.toArray(new ProtectionGroup[0]);
											if (pgList.length > 0) {
											allPgNames.append(pgList[0].getProtectionGroupName());
											for (int i = 1; i<pgList.length; ++i) {
												allPgNames.append(", ");
												allPgNames.append(pgList[i].getProtectionGroupName());
											}
										}
										else allPgNames.append("");
								}
							}
							
							String [] s = projSiteName.split("//");
						Object [] objs = {s[0], s[1], allPgNames.toString()};
						data.add(objs);
					}
				}
			}
			else {
				data = new ArrayList<Object []>();
				Object [] objs = {"Warning: No user has defined yet!", "NA"};
				data.add(objs);
			}
			
			Collections.sort(data, new Comparator<Object[]>() {
				public int compare(Object[] s1, Object[] s2) {
				   //ascending order
				   return s1[0].toString().compareTo(s2[0].toString());
			    }
			});

		}
		catch (Exception ex) {
			ex.printStackTrace();
		} 
		return formatResponse(format, data, columns);
	}
}
