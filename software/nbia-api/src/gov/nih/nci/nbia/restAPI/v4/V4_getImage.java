//To Test: https://imaging-dev.nci.nih.gov/nbia-api/v4/getImage?SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.2103.7010.217057652328318927727295709419

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

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.dao.ImageDAO2;
import gov.nih.nci.nbia.dto.ImageDTO2;
import gov.nih.nci.nbia.util.SpringApplicationContext;


@Path("/v4/getImage")
public class V4_getImage extends getData {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");
	private static final Logger downloadLogger = LogManager.getLogger("logger2API");
	/**
	 * This method get a set of images in a zip file
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUid,
			@QueryParam("NewFileNames") String newFileNames, @Context UriInfo uriInfo) throws IOException {

    Set<String> allowedParams = Set.of("SeriesInstanceUID", "NewFileNames");
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
		final String sid = seriesInstanceUid;
		String userName = getUserName();
		if (sid == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, SeriesInstanceUID, is required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}

		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("seriesInstanceUID", sid);

		//SecurityContextHolder will be used to get the user name later.
		if (!isUserHasAccess(userName, paramMap)) {
			return Response.status(Status.BAD_REQUEST)
					.entity("The user has not been granted the access to image with given SeriesInstanceUID," + sid + ". Please contact System Admin to resolve this issue.")
					.type(MediaType.APPLICATION_JSON).build();
		}

		String zipName = sid + ".zip";
		StreamingOutput stream = null;
		ImageDAO2 tDao = (ImageDAO2)SpringApplicationContext.getBean("imageDAO2");
		String fileContents=tDao.getLicenseContent(sid);
		GeneralSeriesDAO gsDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
		String collectionName =  gsDao.getCollectionNameForSeriesInstanceUid(sid);
		System.out.println("get collection name="+ collectionName);	
		
		if (newFileNames==null||!(newFileNames.equalsIgnoreCase("yes"))) {
		    stream = new StreamingOutput() {
			public void write(OutputStream output) throws IOException, WebApplicationException {
				// Generate your ZIP and write it to the OutputStream
				ZipOutputStream zip = new ZipOutputStream(new BufferedOutputStream(output));
				InputStream in = null;
				long size = 0;
				int numberOfFiles = 0;						
				try {
//					Timestamp qbtimestamp = new Timestamp(System.currentTimeMillis());
//					System.out.println("Begining of querying the file name list--" + sdf.format(qbtimestamp));
					List<String> fileNames = getImage(sid);
//					Timestamp qetimestamp = new Timestamp(System.currentTimeMillis());
//					System.out.println("Done with querying the file name list and start to zip and stram--"
//							+ sdf.format(qetimestamp));
					int counter = 0;
					zip.putNextEntry(new ZipEntry("LICENSE"));
					IOUtils.copy(IOUtils.toInputStream(fileContents), zip);
					zip.closeEntry();
					for (String filename : fileNames) {
						File afile = new File(filename);
						in = new FileInputStream(afile);
						size +=  afile.length();

						if (in != null) {
							// Add Zip Entry
							String fileNameInZip = String.format("%08d", ++counter)
									+ filename.substring(filename.lastIndexOf("."));
							zip.putNextEntry(new ZipEntry(fileNameInZip));

							// Write file into zip
							IOUtils.copy(in, zip);
							zip.closeEntry();
							in.close();
						}
						numberOfFiles = counter;
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
					if (size > 0) {
						recodeDownload(seriesInstanceUid, size, "v4API", userName);
						downloadLogger.info(
								"collection="+collectionName + "," +
								"seriesUID="+ seriesInstanceUid + "," +
								"numberOfFiles=" + numberOfFiles + "," +
								"totalSize="+ size + "," +
								"userId="+ userName + "," +
								"downloadType=v4API");												
						System.out.println("size=" + size +"; recording");
					}
					else {
						System.out.println("size <= 0; not recording");
					}	
				}
				recodeDownload(seriesInstanceUid, size, "v4API", userName);	
			}
		}; } else {
		    stream = new StreamingOutput() {
			public void write(OutputStream output) throws IOException, WebApplicationException {
				// Generate your ZIP and write it to the OutputStream
				ZipOutputStream zip = new ZipOutputStream(new BufferedOutputStream(output));
				InputStream in = null;
				long size = 0;
				int numberOfFiles = 0;						
				zip.putNextEntry(new ZipEntry("LICENSE"));
				IOUtils.copy(IOUtils.toInputStream(fileContents), zip);
				zip.closeEntry();
				try {
					ImageDAO2 imageDAO = (ImageDAO2) SpringApplicationContext.getBean("imageDAO2");
					List<ImageDTO2> imageResults = imageDAO.findImagesBySeriesUid(seriesInstanceUid);
					for (ImageDTO2 imageResult : imageResults) {
						File afile = new File(imageResult.getFileName());
						in = new FileInputStream(afile);
						size +=  afile.length();
						
						if (in != null) {
							// Add Zip Entry
							String newFileName=imageResult.getNewFilename();
							int pos = newFileName.indexOf("^");
							newFileName=newFileName.substring(pos+1);
							zip.putNextEntry(new ZipEntry(newFileName));

							// Write file into zip
							IOUtils.copy(in, zip);
							zip.closeEntry();
							in.close();
							++numberOfFiles;
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

					if (size > 0) {
						recodeDownload(seriesInstanceUid, size, "v4API", userName);
						System.out.println("size=" + size +"; recording");
						downloadLogger.info(
								"collection="+collectionName + "," +
								"seriesUID="+ seriesInstanceUid + "," +
								"numberOfFiles=" + numberOfFiles + "," +
								"totalSize="+ size + "," +
								"userId="+ userName + "," +
								"downloadType=v4API");												
					}
					else {
						System.out.println("size <= 0; not recording");
					}	
				}
				recodeDownload(seriesInstanceUid, size, "v4API", userName);	
			}
		};
		}
	

		return Response.ok(stream, MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-Disposition", "attachment; filename=\"" + zipName + "\"").build();
	}
}
