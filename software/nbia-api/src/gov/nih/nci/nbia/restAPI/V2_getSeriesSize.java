package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.ws.rs.core.Response.Status;


@Path("/v2/getSeriesSize")
public class V2_getSeriesSize extends getData{
	private static final String[] columns={"TotalSizeInBytes", "ObjectCount"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUID, 
			@QueryParam("format") String format)  {
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
		List<Object[]> data = getSeriesSize(seriesInstanceUID, authorizedCollections);
		return formatResponse(format, data, columns);
	}
}
