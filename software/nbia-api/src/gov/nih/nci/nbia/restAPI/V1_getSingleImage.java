//To Test: https://imaging-dev.nci.nih.gov/nbia-api/services/v1/getImage?SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.2103.7010.217057652328318927727295709419

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.wadosupport.WADOSupportDTO;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import javax.ws.rs.core.Response.Status;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.apache.commons.io.IOUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@Path("/v1/getSingleImage")
public class V1_getSingleImage extends getData {
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
		//Authentication authentication = SecurityContextHolder.getContext()
		//			.getAuthentication();
		String user =  NCIAConfig.getGuestUsername();

		WADOSupportDTO wdto = getWadoImage(seriesInstanceUid, sOPInstanceUID, user);
		int size = wdto.getImage().length;
		String collectionName = wdto.getCollection();

		downloadLogger.log(Level.forName("DOWNLOADLOG", 350),
				"collection="+collectionName + "," +
				"seriesUID="+ seriesInstanceUid + "," +
				"numberOfFiles=1" +  "," +
				"totalSize="+ size + "," +
				"userId="+ user + "," +
				"downloadType=v1API");			
		recodeDownload(seriesInstanceUid, size, "v1API", user);
		return Response.ok(wdto.getImage(), "application/dicom").header("Content-Disposition", "attachment; filename=" + sOPInstanceUID + ".dcm").build();
	}
}
