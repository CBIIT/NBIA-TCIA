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


@Path("/v4/getPatient")
public class V4_getPatient extends getData{
	private static final String[] columns={"PatientId", "PatientName", "PatientBirthDate", "PatientSex", "EthnicGroup", "Collection","Phantom","SpeciesCode","SpeciesDescription", "Authorized"};
	public final static String TEXT_CSV = "text/csv";
	/**
	 * This method get a set of patient objects filtered by collection
	 * 
	 * @return String - set of patient
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("Collection") String collection, @QueryParam("format") String format, @QueryParam("PatientId") String patientId, @Context UriInfo uriInfo) {

    Set<String> allowedParams = Set.of("Collection", "PatientId", "format");
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
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		List<Object[]> data = null;
    if (patientId != null) {
		   data = getPatientByCollectionAndId(collection, patientId, authorizedCollections );
    } else {
		   data = getPatientByCollection(collection, authorizedCollections );
    }
		
		return formatResponse(format, data, columns);
	}
}
