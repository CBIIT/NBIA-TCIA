package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.util.SpringApplicationContext;
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

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.dao.DataAccessException;

@Path("/v3/getPEList")
public class V3_getPEList extends getData{
	private static final String[] columns={"collection", "site"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a list of collection and site available in database
	 *
	 * @return String - list of user login names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("format") String format) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		List<String> results = null;
		List<Object[]> data = null;

		TrialDataProvenanceDAO tDao = (TrialDataProvenanceDAO)SpringApplicationContext.getBean("trialDataProvenanceDAO");
		try {
			results = tDao.getProjSiteValues();
			if (results != null) {
				data = new ArrayList<Object []>();
				for (String projSiteName : results) {
						System.out.println("Get project site combination="+ projSiteName);
						if (projSiteName != null) {
						String [] s = projSiteName.split("//");
						Object [] objs = {s[0], s[1]};
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
		catch (DataAccessException ex) {
			ex.printStackTrace();
		}
		
		return formatResponse(format, data, columns);
	}
}
