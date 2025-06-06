//To Test: curl -H "Authorization:Bearer <access KeycloakGetToken>"  -d "<series instance uid>" -d "seriesId=<series instance uid>" "http://localhost:8080/nbia-api/services/v2/getSeriesQCInfo"

package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Context;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.Set;

@Path("/v4/getSeriesQCInfo")
public class V4_getSeriesQCInfo extends getData {
	private static final String[] columns = {
		"SeriesInstanceUID", 
		"Visibility", 
		"ReleaseStatus", 
		"ReleaseDate", 
		"ImageCount",
		"Doi",
		"LicenseName",
		"Site",
		"Project",
		"PatientID",
		"Modality",
		"StudyDescription",
		"SeriesDescription"	 
	};
	public final static String TEXT_CSV = "text/csv"; 
	/**
	 * This method get a set of series info filtered by series instance UID
	 *
	 * @return List<String> - set of series info
	 */
	@POST
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@FormParam("seriesId") List<String> seriesList, @FormParam("format") String format, @Context HttpServletRequest request)  {

    Set<String> allowedParams = Set.of("seriesId", "format");

    Enumeration<String> paramNames = request.getParameterNames();
    while (paramNames.hasMoreElements()) {
        String param = paramNames.nextElement();
        if (!allowedParams.contains(param)) {
            String msg = "Invalid form parameter: '" + param +
                         "'. Allowed parameters are: " + allowedParams;
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(msg)
                           .build();
        }
    }

		if (seriesList == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, SeriesInstanceUID is required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}

		List<String> authorizedCollections = null;
		try {
			authorizedCollections = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<Object[]> results = getSeriesQCInfo(seriesList, authorizedCollections);
		
		if (results == null) {
			return Response.status(Status.NO_CONTENT)
					.entity("No results for QC Info of series")
					.type(MediaType.APPLICATION_JSON).build();
		}
		
		return formatResponse(format, results, columns);
	}
}
