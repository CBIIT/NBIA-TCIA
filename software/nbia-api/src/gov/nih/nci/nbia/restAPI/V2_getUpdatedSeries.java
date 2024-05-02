package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


@Path("/v2/getUpdatedSeries")
public class V2_getUpdatedSeries extends getData {
	private static final String[] columns={"SeriesInstanceUID", "StudyInstanceUID", "Modality", "ProtocolName", "SeriesDate", "SeriesDescription", "BodyPartExamined", "SeriesNumber", "AnnotationsFlag", "Collection", "PatientID", "Manufacturer", "ManufacturerModelName", "SoftwareVersions", "ImageCount", "DateReleased};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("fromDate") String fromDate, @QueryParam("format") String format)   {
		List<String> authorizedCollections = null;
		try {
			authorizedCollections = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<Object[]> data = getSeries(fromDate, authorizedCollections);
		return formatResponse(format, data, columns);
	}
}
