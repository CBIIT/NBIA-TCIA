/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.servlet;

import gov.nih.nci.nbia.DownloadProcessor;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.dto.AnnotationDTO;
import gov.nih.nci.nbia.dto.ImageDTO2;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.util.StringEncrypter;
import gov.nih.nci.security.exceptions.CSException;
import gov.nih.nci.security.exceptions.internal.CSInternalLoginException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * @author Q. Pan
 *
 */
public class DownloadServletV3 extends HttpServlet {
	private static final Logger logger = LogManager.getLogger(DownloadServlet.class);
  private static final Logger downloadLogger = LogManager.getLogger("logger2DR");
	private final static int CLIENT_LOGIN_NEEDED = 460;
	private final static int CLIENT_LOGIN_FAILED = 461;
	private final static int CLIENT_NOT_AUTHORIZED = 462;

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// This servlet processes Manifest download related requests only. JNLP
		// download related requests are processed at DownloadServlet
		String numOfS = request.getParameter("numberOfSeries");

		if (numOfS != null) {
			int numberOfSeries = Integer.parseInt(numOfS);
			List<String> seriesList = new ArrayList<String>();

			for (int i = 1; i <= numberOfSeries; ++i) {
				String s = request.getParameter("series" + Integer.toString(i));
				if (s != null)
					seriesList.add(s);
			}

			//authenticate user
			if (numberOfSeries > 0) {
				String userId = request.getParameter("userId");
				String password = request.getHeader("password");

				if ((userId == null) || (password == null)) {
					userId = NCIAConfig.getGuestUsername();
				} 
				else if (!loggedIn(userId, password)) {
					response.sendError(CLIENT_LOGIN_FAILED,
							"Incorrect username and/or password. Please try it again.");
					return;
				}

				downloadManifestFile(seriesList, response, userId);
			}
			else {
				response.sendError(HttpURLConnection.HTTP_BAD_REQUEST,
						"The manifest file should include at least one series instance UID.");
				return;
			}
		} 
		else { // individual download request
			String seriesUid = request.getParameter("seriesUid");
			String userId = request.getParameter("userId");
			String password = request.getHeader("password");
			Boolean includeAnnotation = Boolean.valueOf(request.getParameter("includeAnnotation"));
			Boolean hasAnnotation = Boolean.valueOf(request.getParameter("hasAnnotation"));
			String sopUids = request.getParameter("sopUids");

			if ((userId == null) || (userId.length() < 1)) {
				userId = NCIAConfig.getGuestUsername();
			}

			logger.debug("sopUids:" + sopUids);
			logger.debug("seriesUid: " + seriesUid + " userId: " + userId + " includeAnnotation: " + includeAnnotation
					+ " hasAnnotation: " + hasAnnotation);
			boolean newFileNames=false;
            if (request.getParameter("newFileNames")!=null&&request.getParameter("newFileNames").length()>1) {
            	newFileNames=true;
            }
			processRequest(response, seriesUid, userId, password, includeAnnotation, hasAnnotation, sopUids, newFileNames);
		}
	}

	private boolean loggedIn(String userId, String password) {
		try {
			password = decrypt(password);
			NCIASecurityManager mgr = (NCIASecurityManager) SpringApplicationContext.getBean("nciaSecurityManager");

			if (mgr.login(userId, password)) {
	            if (NCIAConfig.getProductVariation().toUpperCase().equals("TCIA")) {
	            	mgr.syncDBWithLDAP(userId);
					System.out.println("Sync performed");
	            }
				return true;
			} else {
				return false;
			}
		} catch (CSException cse) {
			// cse.printStackTrace();
			return false;
		} catch (CSInternalLoginException e) {
			// TODO Auto-generated catch block
			// e.printStackTrace();
			return false;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}

	protected void processRequest(HttpServletResponse response, String seriesUid, String userId, String password,
			Boolean includeAnnotation, Boolean hasAnnotation, String sopUids, boolean newFileNames) throws IOException {

		DownloadProcessor processor = new DownloadProcessor();
		List<AnnotationDTO> annoResults = new ArrayList<AnnotationDTO>();
		boolean hasAccess = false;

		try {
			password = decrypt(password);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		List<ImageDTO2> imageResults = processor.process(seriesUid, sopUids);
		if ((imageResults == null) || imageResults.isEmpty()) {
			// no data for this series
			logger.debug("no data for series: " + seriesUid);
		} else {
			hasAccess = processor.hasAccess(userId, password, imageResults.get(0).getProject(),
					imageResults.get(0).getSite(), imageResults.get(0).getSsg());
		}

		if (hasAccess) {
			if (includeAnnotation && hasAnnotation) {
				annoResults = processor.process(seriesUid);
			}
			sendResponse(response, imageResults, annoResults, newFileNames);
			// compute the size for this series
			long size = computeContentLength(imageResults, annoResults);
			try {
				processor.recordAppDownload(seriesUid, userId, size, "v3");
				downloadLogger.info(
						"collection="+imageResults.get(0).getProject() + "," +
								"seriesUID="+ seriesUid + "," +
								"numberOfFiles=" + imageResults.size() + "," +
								"totalSize="+ size + "," +
								"userId="+ userId + "," +
								"downloadType=V3");		
			} catch (Exception e) {
				logger.error("Exception recording download " + e.getMessage());
			}
		} else
			sendAccessDenial(response);
	}

	private void sendAccessDenial(HttpServletResponse response) throws IOException {
		response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
	}

	private void sendResponse(HttpServletResponse response, List<ImageDTO2> imageResults,
			List<AnnotationDTO> annoResults, boolean newFileNames) throws IOException {

		TarArchiveOutputStream tos = new TarArchiveOutputStream(response.getOutputStream());

		try {
			long start = System.currentTimeMillis();

			logger.debug("images size: " + imageResults.size() + " anno size: " + annoResults.size());

			sendAnnotationData(annoResults, tos);
			sendImagesData(imageResults, tos, newFileNames);

			logger.debug("total time to send  files are " + (System.currentTimeMillis() - start) / 1000 + " ms.");
		} finally {
			IOUtils.closeQuietly(tos);
		}
	}

	private void sendImagesData(List<ImageDTO2> imageResults, TarArchiveOutputStream tos, boolean newFileNames) throws IOException {
		InputStream dicomIn = null;
		try {
			for (ImageDTO2 imageDto : imageResults) {
				String filePath = imageDto.getFileName();
				String sop = imageDto.getSOPInstanceUID();

				logger.debug("filepath: " + filePath + " filename: " + sop);
				try {
					File dicomFile = new File(filePath);
	                  ArchiveEntry tarArchiveEntry = null;
	                  if (!newFileNames) {
	                     tarArchiveEntry = tos.createArchiveEntry(dicomFile, sop + ".dcm");
	                  } else {
	                	 tarArchiveEntry = tos.createArchiveEntry(dicomFile, imageDto.getNewFilename());
	                  }
					dicomIn = new FileInputStream(dicomFile);
					tos.putArchiveEntry(tarArchiveEntry);
					IOUtils.copy(dicomIn, tos);
					tos.closeArchiveEntry();
				} catch (FileNotFoundException e) {
					e.printStackTrace();
					// just print the exception and continue the loop so rest of
					// images will get download.
				} finally {
					IOUtils.closeQuietly(dicomIn);
					logger.debug("DownloadServlet Image transferred at " + new Date().getTime());
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	private void sendAnnotationData(List<AnnotationDTO> annoResults, TarArchiveOutputStream tos) throws IOException {
		InputStream annoIn = null;
		for (AnnotationDTO a : annoResults) {
			String filePath = a.getFilePath();
			String fileName = a.getFileName();

			try {
				File annotationFile = new File(filePath);
				ArchiveEntry tarArchiveEntry = tos.createArchiveEntry(annotationFile, fileName);
				annoIn = new FileInputStream(annotationFile);
				tos.putArchiveEntry(tarArchiveEntry);
				IOUtils.copy(annoIn, tos);
				tos.closeArchiveEntry();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				// just print the exception and continue the loop so rest of
				// images will get download.
			} finally {
				IOUtils.closeQuietly(annoIn);
				logger.debug("DownloadServlet Annotation transferred at " + new Date().getTime());
			}
		}
	}

	private String decrypt(String password) throws Exception {
		StringEncrypter decrypter = new StringEncrypter();
		if (password.equals("")) {
			return "";
		} else {
			return decrypter.decryptString(password);
		}
	}

	private static long computeContentLength(List<ImageDTO2> imageResults, List<AnnotationDTO> annoResults) {
		long contentSize = 0;
		for (ImageDTO2 imageDto : imageResults) {
			contentSize += imageDto.getDicomSize();
		}
		for (AnnotationDTO annoDto : annoResults) {
			contentSize += annoDto.getFileSize();
		}
		return contentSize;
	}

	private void downloadManifestFile(List<String> seriesList, HttpServletResponse response, String userId) {
		logger.debug("constructing manifest file from the serieList");

		response.setContentType("text/plain");
		response.setHeader("Content-Disposition", "attachment;filename=downloadname.txt");
		try {
			List<String> readLines = null;
			readLines = getManifestRec(seriesList, userId);
			if (readLines == null) {
				if (userId.equals(NCIAConfig.getGuestUsername()) || (userId == null)) {
					response.sendError(CLIENT_LOGIN_NEEDED, "Login needed.");
					return;
				}
				else if ((userId != null)  && !(userId.equals(NCIAConfig.getGuestUsername())) ){
					response.sendError(CLIENT_NOT_AUTHORIZED, "Insufficient privilege.");
					return;
				}
			} else {
				OutputStream os = response.getOutputStream();
				IOUtils.writeLines(readLines, System.getProperty("line.separator"), os);
				os.close();
			}
		} catch (

		IOException e) {
			e.printStackTrace();
		}
	}

	private static String cleanStr(String in) {
		if ((in != null) && (in.length() > 0)) {
			String out = in.replaceAll("[^a-zA-Z0-9 .-/:]", "");
			return out;
		} else
			return null;
	}

	private static List<String> getManifestRec(List<String> seriesUids, String loginName) {
		AuthorizationManager am;
		try {
			am = new AuthorizationManager(loginName);
			NCIASecurityManager mgr = (NCIASecurityManager) SpringApplicationContext.getBean("nciaSecurityManager");



			List<SiteData> authorizedSiteData = am.getAuthorizedSites();
			GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
			List<SeriesDTO> seriesDTOsFound = null;
			if (mgr.hasQaRole(loginName)) {
				seriesDTOsFound = generalSeriesDAO.findSeriesBySeriesInstanceUIDAllVisibilitiesLight(seriesUids,
						authorizedSiteData, null);
			}
			else 
				seriesDTOsFound = generalSeriesDAO.findSeriesBySeriesInstanceUID112Light(seriesUids,
					authorizedSiteData, null);

			if  ((seriesDTOsFound != null) && (seriesDTOsFound.size() < seriesUids.size() )) {
				//Has some unauthorized data
				return null;
			}
			else if (seriesDTOsFound == null)
				return null;
			List<String> seriesDownloadData = new ArrayList<String>();
			for (SeriesDTO series : seriesDTOsFound) {
				String collection = series.getProject();
				String patientId = series.getPatientId();
				String studyInstanceUid = series.getStudyId();
				// String seriesInstanceUid = series.getSeriesUID();
				String seriesInstanceUid = series.getSeriesId();
				String annotation = "No";
				if (series.isAnnotationsFlag()) {
					annotation = "Yes";
				} else {
					annotation = "No";
				}

				Integer numberImages = series.getNumberImages();
				Long imagesSize = series.getTotalSizeForAllImagesInSeries();
				Long annoSize = series.getAnnotationsSize();
				String url = "url";
				String displayName = "displayName";
				String studyDate = series.getStudyDateString();
				String studyDesc = cleanStr(series.getStudyDesc());
				String seriesDesc = cleanStr(series.getDescription());
				String study_id = cleanStr(series.getStudy_id());
				String seriesNumber = series.getSeriesNumber();
				String argument = "" + collection + "|" + patientId + "|" + studyInstanceUid + "|" + seriesInstanceUid
						+ "|" + annotation + "|" + numberImages + "|" + imagesSize + "|" + annoSize + "|" + url + "|"
						+ displayName + "|" + true + "|" + studyDate + "|" + study_id + "|" + studyDesc + "|"
						+ seriesNumber + "|" + seriesDesc;
				seriesDownloadData.add(argument);
			}

			return seriesDownloadData;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
}
