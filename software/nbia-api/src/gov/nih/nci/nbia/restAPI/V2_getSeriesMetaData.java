package gov.nih.nci.nbia.restAPI;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.ws.rs.core.Response.Status;


@Path("/v2/getSeriesMetaData")
public class V2_getSeriesMetaData extends getData {
	private static final String[] columns={"Series UID","Collection","3rd Party Analysis","Data Description URI","Subject ID",
			"Study UID","Study Description","Study Date", "Series Description","Manufacturer","Modality","SOP Class UID",
			"Number of Images","File Size", "File Location", "Series Number", "License Name", "License URL", "Annotation Size",
      "Date Released", "Series Date", "Protocol Name", "Body Part Examined", 
      "Annotations Flag", "Manufacturer Model Name",
        "Software Versions", "TimeStamp"};

	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUID, 
			@QueryParam("format") String format) {
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

		Object[] result = getSeriesMetaData(false, seriesInstanceUID, authorizedCollections);
		if (result == null) {
			return Response.status(Status.NO_CONTENT)
					.entity("No access for metadata of series:"+ seriesInstanceUID)
					.type(MediaType.APPLICATION_JSON).build();
		}
		
		if (result[6] != null) {
			//replace the "," character in the Study Description field 
			// temp fix, will not need it when the client is getting data in json format
			//result[6] = (Object)(result[6].toString().replaceAll(",", " "));
			result[6] = (Object)(result[6].toString().replaceAll("[^a-zA-Z0-9 .-]", ""));
		}		
		
		if (result[8] != null) {
			//replace the "," character in the Series Description field 
			// temp fix, will not need it when the client is getting data in json format
			//result[8] = (Object)(result[8].toString().replaceAll(",", " "));
			result[8] = (Object)(result[8].toString().replaceAll("[^a-zA-Z0-9 .-]", ""));
		}
		
		if (result[9] != null) {
			//replace the "," character in the manufacture field 
			// temp fix, will not need it when the client is getting data in json format
			result[9] = (Object)(result[9].toString().replaceAll(",", " "));
		}
		List<Object[]> data = new ArrayList<Object[]>();
		data.add(result);
		
		return formatResponse(format, data, columns);
	}
}
