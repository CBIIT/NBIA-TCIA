//To Test: https://imaging-dev.nci.nih.gov/nbia-api/services/v4/getImage?SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.2103.7010.217057652328318927727295709419

package gov.nih.nci.nbia.restAPI.v4;

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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.MultivaluedMap;

import java.util.Set;
import org.apache.commons.io.IOUtils;

import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.excellDao.FileLocDao;


@Path("/v4/getImageOther")
public class V4_getImageOther {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");

	/**
	 * This method get a set of images in a zip file
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUid, @Context UriInfo uriInfo) throws IOException {

    Set<String> allowedParams = Set.of("SeriesInstanceUID");
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
//		Timestamp btimestamp = new Timestamp(System.currentTimeMillis());
//		System.out.println("Begining of zip streaming API call--" + sdf.format(btimestamp));
		String dataSource = NCIAConfig.getOtherDataLocationFile();

		final String sid = seriesInstanceUid;
		if (sid == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, SeriesInstanceUID, is required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}

		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("seriesInstanceUID", sid);

		// SecurityContextHolder will return the last logged in user if the user
		// is not logged out.
		// For getting around the problem, the path will be used here to
		// determine if it is anonymousUser
		// for prototype time being, the check is commented
/*		
		if (!isUserHasAccess("anonymousUser", paramMap)) {
			return Response.status(Status.BAD_REQUEST)
					.entity("Image with given SeriesInstanceUID," + sid + ", is not in public domain.")
					.type(MediaType.APPLICATION_JSON).build();
		}
*/
		String zipName = sid + ".zip";
		StreamingOutput stream = new StreamingOutput() {
			public void write(OutputStream output) throws IOException, WebApplicationException {
				// Generate your ZIP and write it to the OutputStream
				ZipOutputStream zip = new ZipOutputStream(new BufferedOutputStream(output));
				InputStream in = null;

				try {
//					Timestamp qbtimestamp = new Timestamp(System.currentTimeMillis());
//					System.out.println("Begining of querying the file name list--" + sdf.format(qbtimestamp));
					//List<String> fileNames = getImage(sid);
				
					FileLocDao fld = new FileLocDao();
					List<String> fileNames = fld.getDataLocation(sid, dataSource);	

//					Timestamp qetimestamp = new Timestamp(System.currentTimeMillis());
//					System.out.println("Done with querying the file name list and start to zip and stram--"
//							+ sdf.format(qetimestamp));
					int counter = 0;
					for (String filename : fileNames) {
						in = new FileInputStream(new File(filename));

						if (in != null) {
							// Add Zip Entry
							String fileNameInZip = filename.substring(filename.lastIndexOf(File.separator)+1);
//							System.out.println("zipping file: "+fileNameInZip);
							zip.putNextEntry(new ZipEntry(fileNameInZip));

							// Write file into zip
							IOUtils.copy(in, zip);
							zip.closeEntry();
							in.close();
						}
					}

					zip.close();
//					Timestamp zetimestamp = new Timestamp(System.currentTimeMillis());
//					System.out.println("Done with zip and stream--" + sdf.format(zetimestamp));
				} catch (FileNotFoundException fnex) {
					fnex.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					zip.close();
					// Flush output
					if (output != null) {
						output.flush();
						output.close();
					}
					// Close input
					if (in != null)
						in.close();
				}
			}
		};

		return Response.ok(stream, MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-Disposition", "attachment; filename=\"" + zipName + "\"").build();
	}
}
