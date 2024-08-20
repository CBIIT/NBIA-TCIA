//To Test: https://imaging-dev.nci.nih.gov/nbia-api/services/v1/getImage?SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.2103.7010.217057652328318927727295709419
package gov.nih.nci.nbia.restAPI;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.io.ByteArrayInputStream;
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

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import gov.nih.nci.nbia.dao.AnnotationDAO;
import gov.nih.nci.nbia.dao.DownloadDataDAO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.dao.ImageDAO2;
import gov.nih.nci.nbia.exception.DataAccessException;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;


@Path("/v1/getDCMImage")
public class V1_getDCMImage extends getData {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");
	private static final Logger downloadLogger = LogManager.getLogger("logger2");

	/**
	 * This method get a set of images in a zip file
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUid, @QueryParam("IncludeAnnotation") String includeAnnotation,
			@QueryParam("MD5Verification") String md5Verify) throws IOException {
//		Timestamp btimestamp = new Timestamp(System.currentTimeMillis());
//		System.out.println("Begining of zip streaming API call--" + sdf.format(btimestamp));
		downloadLogger.info("TEST API log called.");		
		System.out.println("!!!!!log test");		
		final String sid = seriesInstanceUid;
		String userName = NCIAConfig.getGuestUsername();

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
		
		if (!isUserHasAccess("anonymousUser", paramMap)) {
			return Response.status(Status.BAD_REQUEST)
					.entity("Image with given SeriesInstanceUID," + sid + ", is not in public domain.")
					.type(MediaType.APPLICATION_JSON).build();
		}
					
		String zipName = sid + ".zip";
		boolean accessStatus = true; 
		StreamingOutput stream = new StreamingOutput() {
			public void write(OutputStream output) throws IOException, WebApplicationException {
				// Generate your ZIP and write it to the OutputStream
				ZipOutputStream zip = new ZipOutputStream(new BufferedOutputStream(output));
				InputStream in = null;				
				boolean addChecksum = false;
				long size = 0;
				int numberOfFiles = 0;
				String collectionName = null;

				if (md5Verify != null && md5Verify.equalsIgnoreCase("true")) {
					addChecksum = true;
				}

				try {
//					Timestamp qbtimestamp = new Timestamp(System.currentTimeMillis());
//					System.out.println("Begining of querying the file name list--" + sdf.format(qbtimestamp));
					List<String []> fileNames = getDCMImageNames(sid);

//					Timestamp qetimestamp = new Timestamp(System.currentTimeMillis());
//					System.out.println("Done with querying the file name list and start to zip and stram--"
//							+ sdf.format(qetimestamp));
					//int counter = 0;
					//String directoryInZip = "patient/strudy/series/";
					StringBuffer sb= new StringBuffer();
					if (addChecksum) {
						sb.append("Filename,MD5Hash\n");
					}

					for (String [] filename : fileNames) {
						collectionName = filename[4];
System.out.println("get collection name="+ collectionName);						
						if (addChecksum) {
							int pos = filename[1].indexOf("^");
							sb.append(filename[1].substring(pos+1) + "," +filename[2] + "\n");
						}
						in = new FileInputStream(new File(filename[0]));

						if (in != null) {
							// Add Zip Entry
							//String fileNameInZip = String.format("%08d", ++counter)
							//		+ filename.substring(filename.lastIndexOf("."));
							String fileNameInZip = filename[1].substring(filename[1].lastIndexOf(File.separator)+1);

							//zip.putNextEntry(new ZipEntry(directoryInZip + fileNameInZip));
							zip.putNextEntry(new ZipEntry(fileNameInZip));
							// Write file into zip
							IOUtils.copy(in, zip);
							zip.closeEntry();
							in.close();
							size += Long.parseLong(filename[3]);
							++numberOfFiles;
						}
					}
					
					
					if (addChecksum) {
						InputStream inputStream = new ByteArrayInputStream(sb.toString().getBytes(Charset.forName("UTF-8")));
				        zip.putNextEntry(new ZipEntry("md5hashes.csv"));
						IOUtils.copy(inputStream, zip);
						zip.closeEntry();
					}
					
					if (includeAnnotation != null && includeAnnotation.equalsIgnoreCase("true")) {
						List <String []> annNames = getAnnotations(sid);
						for (String [] aName : annNames) {
							in = new FileInputStream(new File(aName[0]));
							if (in != null) {
								// Add Zip Entry
								String fileNameInZip = aName[0].substring(aName[0].lastIndexOf(File.separator)+1);
								System.out.println("expected file annotation name in zipping file: "+fileNameInZip);
								//zip.putNextEntry(new ZipEntry(directoryInZip + fileNameInZip));
								zip.putNextEntry(new ZipEntry(fileNameInZip));
								// Write file into zip
								IOUtils.copy(in, zip);
								zip.closeEntry();
								in.close();
								size += Long.parseLong(aName[1]);
								++numberOfFiles;
							}
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
				downloadLogger.info(
								"collection="+collectionName + "," +
								"seriesUID="+ seriesInstanceUid + "," +
								"numberOfFiles=" + numberOfFiles + "," +
								"totalSize="+ size + "," +
								"userId="+ userName + "," +
								"downloadType=CLI/v1API");		
				recodeDownload(seriesInstanceUid, size, "CLI/v1API", userName);
			}
		};

		return Response.ok(stream, MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-Disposition", "attachment; filename=\"" + zipName + "\"").build();
	}
	
	protected List<String []> getDCMImageNames(String seriesInstanceUid) {
		List<String []> results = null;

		ImageDAO2 tDao = (ImageDAO2)SpringApplicationContext.getBean("imageDAO2");
		
		try {
			results = tDao.getImageNamesBySeriesUid(seriesInstanceUid);
		}
		catch (DataAccessException ex) {
			ex.printStackTrace();
		}  
		return (List<String []>) results;
	}
	
	protected List<String []> getAnnotations(String seriesInstanceUid) {
		List<String []> results = null;
		
		try {
			AnnotationDAO aDao = (AnnotationDAO)SpringApplicationContext.getBean("annotationDao2");
			results = aDao.getAnnotationFileNamesBySeriesUid(seriesInstanceUid);
		}
		catch (DataAccessException ex) {
			ex.printStackTrace();
		}
		return results;
	}	
	
//	private void recodeDownload (String seriesInstanceUid, long size) {
//		try {
//			String userName = NCIAConfig.getGuestUsername();
//			DownloadDataDAO downloadDAO = (DownloadDataDAO) SpringApplicationContext.getBean("downloadDataDAO");					
//			downloadDAO.record(seriesInstanceUid, userName, "CLI/API", size);
//		} catch (DataAccessException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//	}
}
