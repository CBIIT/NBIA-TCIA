//To Test: http://localhost:8080/nbia-api/v2/getPatient?Collection=IDRI
//To Test: http://localhost:8080/nbia-api/v2/getPatient?format=json
//To Test: http://localhost:8080/nbia-api/v2/getPatient?format=html
//To Test: http://localhost:8080/nbia-api/v2/getPatient?format=xml
//To Test: http://localhost:8080/nbia-api/v2/getPatient?format=csv
//To Test: http://localhost:8080/nbia-api/v2/getPatient?Collection=IDRI&format=json
//To Test: http://localhost:8080/nbia-api/v2/getPatient?Collection=IDRI&format=html
//To Test: http://localhost:8080/nbia-api/v2/getPatient?Collection=IDRI&format=xml
//To Test: http://localhost:8080/nbia-api/v2/getPatient?Collection=IDRI&format=csv

package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;

import javax.ws.rs.core.Response.Status;
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


@Path("/v4/NewPatientsInCollection")
public class V4_getNewPatientsInCollection extends getData{
	private static final String[] columns={"PatientId", "PatientName", "PatientBirthDate", "PatientSex", "EthnicGroup", "Collection","Phantom","SpeciesCode","SpeciesDescription", "Authorization"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of patient objects filtered by collection
	 * 
	 * @return String - set of patient
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("Collection") String collection, @QueryParam("Date") String dateFrom,
			@QueryParam("format") String format, @Context UriInfo uriInfo) {

    Set<String> allowedParams = Set.of("Collection", "Date", "format");
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
		if (collection == null||dateFrom == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, Collection and Date are required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}
		try {
			authorizedCollections = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<Object[]> data = getPatientByCollection(collection, dateFrom, authorizedCollections);
		return formatResponse(format, data, columns);
	}
}
