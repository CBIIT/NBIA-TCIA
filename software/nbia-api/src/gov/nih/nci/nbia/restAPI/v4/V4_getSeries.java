//To Test: http://localhost:8080/nbia-api/v4/getSeries
//To Test: http://localhost:8080/nbia-api/v4/getSeries?format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?format=csv
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=csv
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=csv
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=csv
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=csv
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=csv
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?Collection=RIDER Pilot&format=csv
//To Test: http://localhost:8080/nbia-api/v4/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/v4/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/v4/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/v4/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.3&format=csv

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


@Path("/v4/getSeries")
public class V4_getSeries extends getData {
	private static final String[] columns={"SeriesInstanceUID", "StudyInstanceUID", "Modality", "ProtocolName", "SeriesDate", "SeriesDescription", "BodyPartExamined", "SeriesNumber", "AnnotationsFlag", "Collection", "PatientID", "Manufacturer", "ManufacturerModelName", "SoftwareVersions", "ImageCount", "TimeStamp"
			, "LicenseName"
			, "LicenseURI"
			, "DataDescriptionURI"
			, "FileSize"
      , "DateReleased"
      , "StudyDesc"
      , "StudyDate"
      , "ThirdPartyAnalysis"
      , "Authorized"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("Collection") String collection, @QueryParam("format") String format,
			@QueryParam("PatientID") String patientId, @QueryParam("StudyInstanceUID") String studyInstanceUid,
			@QueryParam("Modality") String modality, @QueryParam("BodyPartExamined") String bodyPartExamined,
			@QueryParam("ManufacturerModelName") String manufacturerModelName, @QueryParam("Manufacturer") String manufacturer,
			@QueryParam("SeriesInstanceUID") String seriesInstanceUID, @Context UriInfo uriInfo)  {

    Set<String> allowedParams = Set.of("Collection", "format", "PatientID", "StudyInstanceUID", "Modality", "BodyPartExamined", "ManufacturerModelName", "Manufacturer", "SeriesInstanceUID");
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


    //long startTime = System.currentTimeMillis();
      //
		//String userName = null;
		List<String> authCol = null;

		try {
			//userName = getUserName();
			authCol = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<Object[]> data = getSeries(collection, patientId, studyInstanceUid, authCol,
				modality, bodyPartExamined, manufacturerModelName, manufacturer, seriesInstanceUID);

    //long endTime = System.currentTimeMillis();
    //System.out.println("Query execution time: " + (endTime - startTime) + " ms");
    
		return formatResponse(format, data, columns);
	}
}
