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
	private static String winUrl = NCIAConfig.getWinInstallerLink();
	private static String macUrl = NCIAConfig.getMacInstallerLink();
	private static String centOsUrl = NCIAConfig.getCentOSInstallerLink();
	private static String ubuntuUrl = NCIAConfig.getUbuntuInstallerLink();

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String os = request.getParameter(osParam);
		System.out.println("!!!os version is " + os);

		String urlForDownload = null;
		if (os.startsWith("windows")) {
			urlForDownload = winUrl;
			System.out.println("windows installer url=" + winUrl);
		} else if (os.equals("Mac")) {
			urlForDownload = macUrl;
		} else if (os.equals("CentOS")) {
			urlForDownload = centOsUrl;
		} else if (os.equals("Ubuntu")) {
			urlForDownload = ubuntuUrl;
		}

		response.setStatus(HttpServletResponse.SC_OK);

		List<String> readLines = new ArrayList<String>();
		readLines.add(NCIAConfig.getLatestDownloaderVersion());
		readLines.add(urlForDownload);
		readLines.add(NCIAConfig.getEncryptionKey());
		OutputStream outStream = response.getOutputStream();
		IOUtils.writeLines(readLines, System.getProperty("line.separator"), outStream);
		outStream.close();
	}
}