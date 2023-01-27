//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import gov.nih.nci.nbia.restUtil.PatientResultSetCache;

@Path("/v1/clearCache")
public class ClearCache extends getData{

	/**
	 * Clears the resultset cache
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse() {

		try {	

			PatientResultSetCache cache = PatientResultSetCache.getInstance();
			cache.clearCache();
       
		return Response.ok("cleared").type(MediaType.TEXT_PLAIN)
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	
}
	
