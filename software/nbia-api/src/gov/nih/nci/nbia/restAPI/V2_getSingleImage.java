package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.wadosupport.WADOSupportDTO;

import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/v2/getSingleImage")
public class V2_getSingleImage extends getData {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");
	private static final Logger downloadLogger = LogManager.getLogger("logger2");
	/**
	 * This method get a set of images in a zip file
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces("application/dicom")
	public Response constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUid, 
			@QueryParam("SOPInstanceUID") String sOPInstanceUID) throws IOException {

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
		recodeDownload(seriesInstanceUid, size, "v2API", user);
		downloadLogger.log(Level.forName("DOWNLOADLOG", 350),
				"collection="+collectionName + "," +
				"seriesUID="+ seriesInstanceUid + "," +
				"numberOfFiles=1" +  "," +
				"totalSize="+ size + "," +
				"userId="+ user + "," +
				"downloadType=v2API");		
		return Response.ok(wdto.getImage(), "application/dicom").header("Content-Disposition", "attachment; filename=" + sOPInstanceUID + ".dcm").build();
	}
}
