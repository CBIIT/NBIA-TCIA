package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.dao.DataAccessException;


@Path("/v3/getProjSiteList")
public class V3_getProjSiteList extends getData{
	private static final String column="Collection//Site";
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a list of Project(or Collection, used interchangeably) and Site combination
	 *
	 * @return String - list of <Project Name>//<Site Name>
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("format") String format) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		List<String> results = null;

		TrialDataProvenanceDAO tDao = (TrialDataProvenanceDAO)SpringApplicationContext.getBean("trialDataProvenanceDAO");
		try {
			results = tDao.getProjSiteValues();
			for (String projSiteName : results)
				System.out.println("Get project site combination="+ projSiteName);
		}
		catch (DataAccessException ex) {
			ex.printStackTrace();
		}

		return formatResponse(format, results, column);
	}
}
