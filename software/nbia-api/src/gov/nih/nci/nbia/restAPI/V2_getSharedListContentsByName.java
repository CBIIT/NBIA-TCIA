package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.ws.rs.core.Response.Status;


@Path("/v2/getContentsByName")
public class V2_getSharedListContentsByName extends getData {
	private static final String[] columns={"SeriesInstanceUID", "StudyInstanceUID", "Modality", "ProtocolName", "SeriesDate", "SeriesDescription", "BodyPartExamined", "SeriesNumber", "AnnotationsFlag", "Collection", "PatientID", "Manufacturer", "ManufacturerModelName", "SoftwareVersions", "ImageCount"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("name") String name) {
		List<String> authorizedCollections = null;
		if (name == null) {
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
		if (name == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, name is required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}
		List<Object[]> data = getSharedListContents(name, authorizedCollections);
		return formatResponse("json", data, columns);
	}
}