/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */
package gov.nih.nci.nbia.servlet;

import gov.nih.nci.nbia.util.NCIAConfig;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

/**
 * @author Q. Pan
 *
 */
public class DownloadServletVersion extends HttpServlet {
	private static String osParam = "os";
	private static String appVersionParam = "appVersion";
	private static String winUrl = NCIAConfig.getWinInstallerLink();
	private static String macUrl = NCIAConfig.getMacInstallerLink();
	private static String centOsUrl = NCIAConfig.getCentOSInstallerLink();
	private static String ubuntuUrl = NCIAConfig.getUbuntuInstallerLink();
	private static String helpDeskLink = NCIAConfig.getDownloaderAppHelpDeskLink().trim();
	private static String wikiLink = NCIAConfig.getDownloaderAppOnlineHelpUrl().trim();

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String os = request.getParameter(osParam);
		String urlForDownload = null;
		if (os.startsWith("windows")) {
			urlForDownload = winUrl;
		} else if (os.startsWith("mac")) {
			urlForDownload = macUrl;
		} else if (os.equals("CentOS")) {
			urlForDownload = centOsUrl;
		} else if (os.equals("Ubuntu")) {
			urlForDownload = ubuntuUrl;
		}
		
		String appVersion = request.getParameter(appVersionParam);

		String forcedGrade = null;
		try {
			forcedGrade = NCIAConfig.getDownloaderAppForcedUpgrade();
		}
		catch (RuntimeException ex) {
			forcedGrade = "false";
			//ex.printStackTrace();
		}

		String minimumVersion = null;
		try {
			minimumVersion = NCIAConfig.getNoUpgradeMinimumVersion();
		}
		catch (RuntimeException ex) {
			//ex.printStackTrace();
		}	

		if (minimumVersion != null) {
			if (appVersion == null) {
				forcedGrade = "true";
			} 
			else if (new Float(minimumVersion).floatValue() > new Float(appVersion).floatValue()) 
				forcedGrade = "true";
		}
			
		response.setStatus(HttpServletResponse.SC_OK);

		List<String> readLines = new ArrayList<String>();
		readLines.add(NCIAConfig.getLatestDownloaderVersion());
		readLines.add(urlForDownload);
		readLines.add(NCIAConfig.getEncryptionKey());
		readLines.add(forcedGrade);
		readLines.add(helpDeskLink);
		readLines.add(wikiLink);
		OutputStream outStream = response.getOutputStream();
		IOUtils.writeLines(readLines, System.getProperty("line.separator"), outStream);
		outStream.close();
	}
}