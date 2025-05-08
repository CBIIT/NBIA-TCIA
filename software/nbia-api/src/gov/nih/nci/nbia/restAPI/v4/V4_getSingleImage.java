package gov.nih.nci.nbia.restAPI.v4;

import gov.nih.nci.nbia.wadosupport.WADOSupportDTO;

import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.MultivaluedMap;

import java.util.Set;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/v4/getSingleImage")
public class V4_getSingleImage extends getData {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");
	private static final Logger downloadLogger = LogManager.getLogger("logger2API");
	/**
	 * This method get a set of images in a zip file
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces("application/dicom")
	public Response constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUid, 
			@QueryParam("SOPInstanceUID") String sOPInstanceUID, @Context UriInfo uriInfo) throws IOException {

    Set<String> allowedParams = Set.of("SeriesInstanceUID", "SOPInstanceUID");
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

		final String sid = seriesInstanceUid;
		if (seriesInstanceUid == null||sOPInstanceUID == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, SeriesInstanceUID and SOPInstanceUID, are required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}
//		Authentication authentication = SecurityContextHolder.getContext()
//					.getAuthentication();
//		String user =  (String)authentication.getPrincipal();
		String user = getUserName(); 
				WADOSupportDTO wdto = getWadoImage(seriesInstanceUid, sOPInstanceUID, user);
		String collectionName = wdto.getCollection();

		int size = wdto.getImage().length;
		recodeDownload(seriesInstanceUid, size, "v4API", user);
		downloadLogger.info(
				"collection="+collectionName + "," +
				"seriesUID="+ seriesInstanceUid + "," +
				"numberOfFiles=1" +  "," +
				"totalSize="+ size + "," +
				"userId="+ user + "," +
				"downloadType=v4API");		
		return Response.ok(wdto.getImage(), "application/dicom").header("Content-Disposition", "attachment; filename=" + sOPInstanceUID + ".dcm").build();
	}
}
