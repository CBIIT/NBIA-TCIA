//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?format=xml
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?format=html
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?format=json
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?format=csv
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&Modality=CT&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&Modality=CT&format=html
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&Modality=CT&format=json
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&Modality=CT&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Modality=CT&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Modality=CT&format=html
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Modality=CT&format=json
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Modality=CT&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&format=html
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&format=json
//To Test: http://localhost:8080/nbia-api/v2/getBodyPartValues?Collection=IDRI&format=csv

package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.MultivaluedMap;

import java.util.Set;


@Path("/v4/getBodyPartValues")
public class V4_getBodyPartValues extends getData{
	private static final String column="BodyPartExamined";
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of body part values filtered by query keys
	 *
	 * @return String - set of patient
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("Collection") String collection, @QueryParam("format") String format,
			@QueryParam("Modality") String modality, @Context UriInfo uriInfo) {

    Set<String> allowedParams = Set.of("Collection", "format", "Modality");
    MultivaluedMap<String, String> queryParams = uriInfo.getQueryParameters();

    for (String param : queryParams.keySet()) {
        if (!allowedParams.contains(param)) {
            String msg = "Invalid query parameter: '" + param +
                         "'. Allowed parameters are: " + allowedParams;
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(msg)
                           .build();
        }
    }
		//String returnString = null;
		List<String> authorizedCollections = null;
		try {
			authorizedCollections = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<String> data = getBodyPartValues_v4(collection, modality, authorizedCollections);
		return formatResponse(format, data, column);
	}
}
