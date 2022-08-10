//To Test: curl -H "Authorization:Bearer <access token>"  -d "<series instance uid>" -d "seriesId=<series instance uid>" "http://localhost:8080/nbia-api/services/v2/getSeriesQCInfo"

package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

@Path("/v2/getSeriesQCInfo")
public class V2_getSeriesQCInfo extends getData {
	private static final String[] columns={"SeriesInstanceUID", "Visibility", "ReleaseStatus", "ReleaseDate", "ImagineCount", "Doi",  "LicenseName"};
	public final static String TEXT_CSV = "text/csv"; 

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of series info filtered by series instance UID
	 *
	 * @return List<String> - set of series info
	 */
	@POST
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@FormParam("seriesId") List<String> seriesList, @FormParam("format") String format)  {
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