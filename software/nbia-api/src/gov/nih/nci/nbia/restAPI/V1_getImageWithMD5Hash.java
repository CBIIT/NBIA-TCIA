//To Test: https://imaging-dev.nci.nih.gov/nbia-api/services/v1/getImage?SeriesInstanceUID=1.3.6.1.4.1.14519.5.2.1.2103.7010.217057652328318927727295709419

package gov.nih.nci.nbia.restAPI;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
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

import gov.nih.nci.nbia.dao.ImageDAO2;
import gov.nih.nci.nbia.dto.MD5DTO;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.FormatOutput;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;


@Path("/v1/getImageWithMD5Hash")
public class V1_getImageWithMD5Hash extends getData {
	//private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");
	private static final Logger downloadLogger = LogManager.getLogger("logger2");
	/**
	 * This method get a set of images in a zip file
	 *
	 * @return Response - StreamingOutput
	 */
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response constructResponse(@QueryParam("SeriesInstanceUID") String seriesInstanceUid) throws IOException {
//		Timestamp btimestamp = new Timestamp(System.currentTimeMillis());
//		System.out.println("Begining of zip streaming API call--" + sdf.format(btimestamp));
		final String sid = seriesInstanceUid;
		if (sid == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, SeriesInstanceUID, is required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}
		String userName=NCIAConfig.getGuestUsername();
		List<SiteData> authorizedSiteDataTemp = AuthorizationUtil.getUserSiteData(userName);
		try {
			if (authorizedSiteDataTemp==null){
			     AuthorizationManager am = new AuthorizationManager(userName);
			     authorizedSiteDataTemp = am.getAuthorizedSites();
			     AuthorizationUtil.setUserSites(userName, authorizedSiteDataTemp);
			}
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		final List<SiteData> authorizedSiteData = authorizedSiteDataTemp;
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("seriesInstanceUID", sid);

		// SecurityContextHolder will return the last logged in user if the user
		// is not logged out.
		// For getting around the problem, the path will be used here to
		// determine if it is anonymousUser
		if (!isUserHasAccess("anonymousUser", paramMap)) {
			return Response.status(Status.BAD_REQUEST)
					.entity("Image with given SeriesInstanceUID," + sid + ", is not in public domain.")
					.type(MediaType.APPLICATION_JSON).build();
		} 
		String zipName = sid + ".zip";
		StreamingOutput stream = new StreamingOutput() {
			public void write(OutputStream output) throws IOException, WebApplicationException {
				// Generate your ZIP and write it to the OutputStream
				ZipOutputStream zip = new ZipOutputStream(new BufferedOutputStream(output));
				InputStream in = null;
				int size = 0;
				int numberOfFiles = 0;
				String collectionName = null;
				
				try {
					int counter = 0;
					ImageDAO2 tDao = (ImageDAO2)SpringApplicationContext.getBean("imageDAO2");
					List<MD5DTO> dtos = tDao.getImageAndMD5Hash(sid, authorizedSiteData);
				
					Map<String,String> fileMD5Map = new HashMap<String,String>();
					
					for (MD5DTO dto : dtos) {
						collectionName = dto.getProject();
						String filename=dto.getFileName();
						//in = new FileInputStream(new File(filename));
						
						File afile = new File(filename);
						in = new FileInputStream(afile);
						size +=  afile.length();
						++numberOfFiles;
						if (in != null) {
							// Add Zip Entry
							String fileNameInZip = String.format("%08d", ++counter)
									+ filename.substring(filename.lastIndexOf("."));
							zip.putNextEntry(new ZipEntry(fileNameInZip));

                            fileMD5Map.put(fileNameInZip, dto.getMD5Hash());
							// Write file into zip
							IOUtils.copy(in, zip);
							zip.closeEntry();
							in.close();
						}
					}
					String[] columns={"Filename","MD5Hash"};
					int i=0;
					List <Object[]>data = new ArrayList<Object[]>();
					for (Map.Entry<String, String> entry : fileMD5Map.entrySet()) {
					    Object[] row = new Object[2];
					    row[0]=entry.getKey();
					    row[1]=entry.getValue();
					    data.add(row);
					    i++;
					}
					String csvString=FormatOutput.toCsv(columns, data);
			        InputStream inputStream = new ByteArrayInputStream(csvString.getBytes(Charset.forName("UTF-8")));
			        zip.putNextEntry(new ZipEntry("md5hashes.csv"));
					IOUtils.copy(inputStream, zip);
					zip.closeEntry();
					in.close();
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
//				recodeDownload(seriesInstanceUid, size, "v1API", userName);
				downloadLogger.log(Level.forName("DOWNLOADLOG", 350),
						"collection="+collectionName + "," +
						"seriesUID="+ seriesInstanceUid + "," +
						"numberOfFiles=" + numberOfFiles + "," +
						"totalSize="+ size + "," +
						"userId="+ userName + "," +
						"downloadType=v1API");					
			}
		};

		return Response.ok(stream, MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-Disposition", "attachment; filename=\"" + zipName + "\"").build();
	}
	private static String digest(File file) {
		String result;
		BufferedInputStream bis = null;
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			bis = new BufferedInputStream( new FileInputStream( file ) );
			byte[] buffer = new byte[8192];
			int n;
			while ( (n=bis.read(buffer)) != -1) messageDigest.update(buffer, 0, n);
			byte[] hashed = messageDigest.digest();
//			BigInteger bi = new BigInteger(1, hashed);
//			result = bi.toString(16);
			result = String.format("%032x", new BigInteger(1, hashed)); 
		}
		catch (Exception ex) { result = ""; }
		finally {
			try { bis.close(); }
			catch (Exception ignore) { }
		}
		return result;
    }
}
