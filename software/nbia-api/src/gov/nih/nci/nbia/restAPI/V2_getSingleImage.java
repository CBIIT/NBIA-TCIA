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

import org.apache.commons.io.IOUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@Path("/v2/getSingleImage")
public class V2_getSingleImage extends getData {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");

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
		Authentication authentication = SecurityContextHolder.getContext()
					.getAuthentication();
		String user =  (String)authentication.getPrincipal();

		WADOSupportDTO wdto = getWadoImage(seriesInstanceUid, sOPInstanceUID, user);
		return Response.ok(wdto.getImage(), "application/dicom").header("Content-Disposition", "attachment; filename=" + sOPInstanceUID + ".dcm").build();
	}
}
