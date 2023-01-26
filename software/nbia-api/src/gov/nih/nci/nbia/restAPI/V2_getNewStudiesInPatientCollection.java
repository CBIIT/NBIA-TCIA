package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.ws.rs.core.Response.Status;


@Path("/v2/NewStudiesInPatientCollection")
public class V2_getNewStudiesInPatientCollection extends getData{
	private static final String[] columns={"StudyInstanceUID", "StudyDate", "StudyDescription", "AdmittingDiagnosesDescription", "StudyID", "PatientAge", "PatientID", "PatientName", "PatientBirthDate", "PatientSex", "EthnicGroup", "Collection", "SeriesCount", "LongitudinalTemporalEventType", "LongitudinalTemporalOffsetFromEvent"};
	public final static String TEXT_CSV = "text/csv";
	/**
	 * This method get a set of patient objects filtered by collection
	 * 
	 * @return String - set of patient
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("Collection") String collection, @QueryParam("PatientID") String patientId, @QueryParam("Date") String dateFrom, @QueryParam("format") String format) {
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
		List<Object[]> data = getPatientStudyFromDate(collection, patientId, dateFrom, authorizedCollections);
		return formatResponse(format, data, columns);
	}
}
