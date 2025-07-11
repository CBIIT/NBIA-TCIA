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

import javax.ws.rs.core.Response.Status;


@Path("/v4/getSOPInstanceUIDs")
public class V4_getSOPInstanceUIDs extends getData {
	private static final String column="SOPInstanceUID";
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUID, @QueryParam("format") String format, @Context UriInfo uriInfo) {

    Set<String> allowedParams = Set.of("SeriesInstanceUID", "format");
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
		if (seriesInstanceUID == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, SeriesInstanceUID is required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}
		try {
			authorizedCollections = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<String> data = getSOPUIDS_v4(seriesInstanceUID, authorizedCollections);
		return formatResponse(format, data, column);
	}
}
