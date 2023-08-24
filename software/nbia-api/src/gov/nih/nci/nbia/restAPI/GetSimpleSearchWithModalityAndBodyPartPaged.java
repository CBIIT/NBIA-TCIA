package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.PatientSearchSummary;
import gov.nih.nci.nbia.restUtil.SearchUtil;
import gov.nih.nci.nbia.util.NCIAConfig;

@Path("/getSimpleSearchWithModalityAndBodyPartPaged")
public class GetSimpleSearchWithModalityAndBodyPartPaged extends getData{

	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) throws Exception {
		PatientSearchSummary  returnValue= null;	
        SearchUtil util=new SearchUtil();
		if ("keycloak".equalsIgnoreCase(NCIAConfig.getAuthenticationConfig())) {
			String user = getUserName();
			returnValue=util.getPatients(inFormParams, user, true);
		}
		else
			returnValue=util.getPatients(inFormParams, null, false);
		return Response.ok(JSONUtil.getJSONforPatientSearchSummary(returnValue)).type("application/json")
				.build();
	}
}

