//To Test: http://localhost:8080/nbia-auth/services/v3/getAllPGsWithPEs?format=html
//To Test: http://localhost:8080/nbia-auth/services/v3/getAllPGsWithPEs?format=json

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.util.NCIAConfig;

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

@Path("/v3/getConfigParams")
public class V3_getConfigParams extends getData{
	private static final String[] columns={"paramName","paramValue"};
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a list of configure parameters
	 * 
	 * @return String - list of configure parameters
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("format") String format) {
		List<Object []> data = new ArrayList<Object[]>();
		Object [] urlObjs = {"wikiBaseUrl", NCIAConfig.getWikiURL()};
        data.add(urlObjs);
        Object [] peObjs = {"peOption", NCIAConfig.getUatCreationNewProjectSite()};
        data.add(peObjs);
        Object [] userAuthorUGObjs = {"assignToUG", NCIAConfig.getUatUserAssginToUG()};
        data.add(userAuthorUGObjs);
        Object [] userAuthorPGObjs = {"assignToPG", NCIAConfig.getUatUserAssginToPG()};
        data.add(userAuthorPGObjs);

		return formatResponse(format, data, columns);
	}	
}