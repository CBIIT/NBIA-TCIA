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

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) {

		try {	

        SearchUtil util=new SearchUtil();
        
		PatientSearchSummary  returnValue=util.getPatients(inFormParams);
		return Response.ok(JSONUtil.getJSONforPatientSearchSummary(returnValue)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	

}	

