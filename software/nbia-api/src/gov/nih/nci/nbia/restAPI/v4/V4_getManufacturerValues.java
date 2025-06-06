//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?format=csv
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&BodyPartExamined=ABDOMEN&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&BodyPartExamined=ABDOMEN&format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&BodyPartExamined=ABDOMEN&format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&BodyPartExamined=ABDOMEN&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&Modality=CT&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&BodyPartExamined=ABDOMEN&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&BodyPartExamined=ABDOMEN&format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&BodyPartExamined=ABDOMEN&format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&BodyPartExamined=ABDOMEN&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&BodyPartExamined=ABDOMEN&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&BodyPartExamined=ABDOMEN&format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&BodyPartExamined=ABDOMEN&format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&BodyPartExamined=ABDOMEN&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Modality=CT&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?Collection=IDRI&format=csv
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?BodyPartExamined=ABDOMEN&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?BodyPartExamined=ABDOMEN&format=html
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?BodyPartExamined=ABDOMEN&format=json
//To Test: http://localhost:8080/nbia-api/v2/getManufacturerValues?BodyPartExamined=ABDOMEN&format=csv

package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.MultivaluedMap;

import java.util.Set;


@Path("/v4/getManufacturerValues")
public class V4_getManufacturerValues extends getData{
	private static final String column="Manufacturer";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;

	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of manufacture values
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("Collection") String collection, @QueryParam("format") String format,
			@QueryParam("Modality") String modality, @QueryParam("BodyPartExamined") String bodyPart, @Context UriInfo uriInfo) {

    Set<String> allowedParams = Set.of( "Collection", "format", "Modality", "BodyPartExamined");
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

		List<String> authorizedCollections = null;
		try {
			authorizedCollections = getAuthorizedCollections();
		} 
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<String> data = getManufacturerValues_v4(collection, modality, bodyPart, authorizedCollections);
		return formatResponse(format, data, column);
	}
}
