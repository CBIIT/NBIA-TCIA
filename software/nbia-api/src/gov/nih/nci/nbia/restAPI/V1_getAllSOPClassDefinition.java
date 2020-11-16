//To Test: https://imaging-dev.nci.nih.gov/nbia-api/services/v1/getImage?SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.2103.7010.217057652328318927727295709419

package gov.nih.nci.nbia.restAPI;

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


@Path("/v1/getAllSOPClassDefinition")
public class V1_getAllSOPClassDefinition extends getData {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");

	/**
	 * This method get a set of images in a zip file
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUid) throws IOException {
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
   	 	InputStream input = classLoader.getResourceAsStream("UIDNames.properties");


		StreamingOutput output = new StreamingOutput() {
		@Override
		    public void write(OutputStream out) throws IOException, WebApplicationException {  
		        int length;
		        byte[] buffer = new byte[1024];
		        while((length = input.read(buffer)) != -1) {
		            out.write(buffer, 0, length);
		        }
		        out.flush();
		        input.close();
		    }   
		};

		return Response.ok(output, MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-Disposition", "attachment; filename=\"" + "UIDNames.properties" + "\"").build();
	}
}
