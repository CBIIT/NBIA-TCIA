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

import gov.nih.nci.nbia.util.NCIAConfig;


@Path("/v1/getUserAgreementTxt")
public class V1_getUserAgreementTxt {

	/**
	 * This method get the text of the User Agreement
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response constructResponse() throws IOException {
		String dataSource = NCIAConfig.getUserAgreementFileLocation();
		
		if (dataSource == null || dataSource.isEmpty())
			return Response.status(Status.NOT_FOUND)
					.entity("No user agreement file found.")
					.type(MediaType.APPLICATION_OCTET_STREAM).build();

//		System.out.println("agreement file name="+dataSource);
   	 	InputStream input = new FileInputStream(dataSource);
   	 	File file = new File(dataSource);

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
				.header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"").build();
	}		
}
