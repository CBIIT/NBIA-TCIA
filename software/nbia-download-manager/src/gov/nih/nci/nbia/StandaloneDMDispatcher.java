/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
 * @author Q.Pan
 *
 */
package gov.nih.nci.nbia;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.ProxySelector;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.swing.JOptionPane;
import javax.swing.ProgressMonitor;
import javax.swing.ProgressMonitorInputStream;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.ProxySelectorRoutePlanner;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;

/**
 * @author Q. Pan
 *
 */
public class StandaloneDMDispatcher {
	public static final String launchMsg = "To run TCIA Downloader app, please provide a manifest file as an argument. Download a manifest file from TCIA portal and open the file with TCIA Downloader app.";
	private final static String newVersionMsg = "There is a new version of the TCIA Downloader available.";
	private final static String manifestVersionMsg = "The manifest file version is not suported by this TCIA Downloader.  Please generate a new manifest file compatible with TCIA Downloader version ";
	private static final String supportedVersion = null; // for future when
															// certain version
															// is no longer
															// supported
	private final static String appVersion = "2.0";
	private static final String osParam = "os";
	private static final String installBtnLbl = "Update automatically";
	private static final String downloadBtnLbl = "Update manually";
	private static final String remindMeBtnLbl = "Remind me later";
	protected String serverUrl;
	protected String manifestVersion = null;
	protected static String os = null;
	private String key = null;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		if (args != null && (args.length > 0)) {
			String fileName = args[0];
			StandaloneDMDispatcher sdmp = new StandaloneDMDispatcher();
			sdmp.loadManifestFile(fileName);
			sdmp.launch();
		} else {
			JOptionPane.showMessageDialog(null, launchMsg);
			System.exit(0);
		}
	}

	public StandaloneDMDispatcher() {
		os = System.getProperty("os.name").toLowerCase();
	}

	public void loadManifestFile(String fileName) {
		FileInputStream propFile;
		try {
			propFile = new FileInputStream(fileName);
			Properties p = new Properties(System.getProperties());
			p.load(propFile);
			// set the system properties
			System.setProperties(p);
			System.setProperty("jnlp.localSeriesDownloader.className",
					"gov.nih.nci.nbia.download.LocalSeriesDownloader");
			System.setProperty("jnlp.remoteSeriesDownloader.className",
					"gov.nih.nci.nbia.download.RemoteSeriesDownloader");
			propFile.close();
			this.serverUrl = System.getProperty("downloadServerUrl");
			manifestVersion = System.getProperty("manifestVersion");
			System.out.println("manifest version is " + manifestVersion);
			checkManifestVersion(manifestVersion);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void checkManifestVersion(String manifestVersion) {
		System.out.println("manifest version =" + manifestVersion + ", supported Version=" + supportedVersion
				+ ", app version= " + appVersion);
		if (((manifestVersion == null) && (supportedVersion != null))
				|| ((manifestVersion != null) && (supportedVersion != null)
						&& (Double.valueOf(manifestVersion) < Double.valueOf(supportedVersion)))) {
			Object[] options = { "OK" };
			int n = JOptionPane.showOptionDialog(null, manifestVersionMsg + appVersion + ".",
					"Incompatible Manifest File Version Notification", JOptionPane.OK_OPTION,
					JOptionPane.INFORMATION_MESSAGE, null, options, options[0]);
			System.exit(n);
		}
	}

	private void getNewVersionInfo() {
		List<String> resp = null;
		try {
			String versionServerUrl = serverUrl.substring(0, serverUrl.lastIndexOf('/'))
					.concat("/DownloadServletVersion");
			System.out.println("version server url=" + versionServerUrl);
			resp = connectAndReadFromURL(new URL(versionServerUrl));

			for (String msg : resp) {
				System.out.println("&&&&&&&&resp = " + msg);
			}
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}
		if ((resp != null) && (resp.size() == 3)) {
			key = resp.get(2);
			System.out.println("!!Get the encription key");
		}
		if ((resp != null) && (Double.parseDouble(resp.get(0)) > Double.parseDouble(appVersion))) {
			constructDownloadPanel(resp.get(1));
		}
	}

	public void launch() {
		getNewVersionInfo();

		if ((manifestVersion == null) || (manifestVersion.equals("1.0"))) {
			System.out.println("first generation manifest file");
			StandaloneDMV1 sdm = new StandaloneDMV1();
			sdm.launch();
		} else if (manifestVersion.equals("2.0")) {
			System.out.println("second generation manifest file");
			StandaloneDMV2 sdm = new StandaloneDMV2();
			sdm.setKey(key);
			sdm.launch();
		}
	}

	private void constructDownloadPanel(String downloadUrl) {
		Object[] options = { installBtnLbl, downloadBtnLbl, remindMeBtnLbl };

		int n = JOptionPane.showOptionDialog(null, newVersionMsg, "New Version Notification",
				JOptionPane.YES_NO_CANCEL_OPTION, JOptionPane.INFORMATION_MESSAGE, null, options, options[2]);
		System.out.println("download url: " + downloadUrl);
		String installerPath = null;
		String fileName = downloadUrl.substring(1 + downloadUrl.lastIndexOf('/'), downloadUrl.lastIndexOf('?'));

		System.out.println("!!!!File name =" + fileName);

		if (n == 0) {
			System.out.println("auto update");
			try {
				installerPath = saveFile(new URL(downloadUrl), fileName);
				if (os.contains("windows")) {
					try {
						System.out.println("!!installing msi");
						Runtime rf = Runtime.getRuntime();
						Process pf = rf.exec("msiexec /i \"" + installerPath + "\"");
						System.exit(0);
					} catch (Exception e) {
						// System.out.println(e.toString()); // not necessary
						e.printStackTrace();
					}
				}

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else if (n == 1) {
			System.out.println("download only");
			try {
				installerPath = saveFile(new URL(downloadUrl), fileName);
				JOptionPane.showMessageDialog(null, "The latest installer is downloaded to " + installerPath + ".");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else if (n == 2) {
			System.out.println("remind me later");
		}
	}

	public String saveFile(URL url, String fileAcutal) throws IOException {
		System.out.println("opening connection");
		String home = System.getProperty("user.home");

		String fileName = null;
		if (os.contains("windows")) {

			fileName = home + "\\Downloads\\" + fileAcutal;
		}
		System.out.println("Attempting to read from file in: " + new File(fileName).getCanonicalPath());
		InputStream in = url.openStream();
		FileOutputStream fos = new FileOutputStream(new File(fileName));

		System.out.println("Downloading installer to  " + fileName);

		int length = -1;
		ProgressMonitorInputStream pmis;
		pmis = new ProgressMonitorInputStream(null, "Downloading...", in);
		ProgressMonitor monitor = pmis.getProgressMonitor();
		monitor.setMinimum(0);
		monitor.setMaximum((int) 200000000); // The actual size is much smaller,
												// but we have no way to know
												// the actual size so picked
												// this big number

		byte[] buffer = new byte[1024];// buffer for portion of data from
		// connection

		while ((length = pmis.read(buffer)) > -1) {
			fos.write(buffer, 0, length);
		}
		fos.close();
		in.close();
		pmis.close();
		System.out.println("file was downloaded");
		return fileName;
	}

	private static List<String> connectAndReadFromURL(URL url) {
		List<String> data = null;
		DefaultHttpClient httpClient = null;
		TrustStrategy easyStrategy = new TrustStrategy() {
			@Override
			public boolean isTrusted(X509Certificate[] certificate, String authType) throws CertificateException {
				return true;
			}
		};
		try {
			SSLSocketFactory sslsf = new SSLSocketFactory(easyStrategy, SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
			Scheme httpsScheme = new Scheme("https", 443, sslsf);
			SchemeRegistry schemeRegistry = new SchemeRegistry();
			schemeRegistry.register(httpsScheme);
			schemeRegistry.register(new Scheme("http", 80, PlainSocketFactory.getSocketFactory()));
			ClientConnectionManager ccm = new ThreadSafeClientConnManager(schemeRegistry);

			HttpParams httpParams = new BasicHttpParams();
			HttpConnectionParams.setConnectionTimeout(httpParams, 50000);
			HttpConnectionParams.setSoTimeout(httpParams, new Integer(12000));
			httpClient = new DefaultHttpClient(ccm, httpParams);
			httpClient.setRoutePlanner(new ProxySelectorRoutePlanner(schemeRegistry, ProxySelector.getDefault()));
			// // Additions by lrt for tcia -
			// // attempt to reduce errors going through a Coyote Point
			// Equalizer load balance switch
			httpClient.getParams().setParameter("http.socket.timeout", new Integer(12000));
			httpClient.getParams().setParameter("http.socket.receivebuffer", new Integer(16384));
			httpClient.getParams().setParameter("http.tcp.nodelay", true);
			httpClient.getParams().setParameter("http.connection.stalecheck", false);
			// // end lrt additions

			HttpPost httpPostMethod = new HttpPost(url.toString());

			List<BasicNameValuePair> postParams = new ArrayList<BasicNameValuePair>();
			postParams.add(new BasicNameValuePair(osParam, os));
			UrlEncodedFormEntity query = new UrlEncodedFormEntity(postParams);
			httpPostMethod.setEntity(query);
			HttpResponse response = httpClient.execute(httpPostMethod);
			int responseCode = response.getStatusLine().getStatusCode();
			System.out.println("Dispatcher:Response code for requesting data file: " + responseCode);
			if (responseCode == HttpStatus.SC_OK) {
				InputStream inputStream = response.getEntity().getContent();
				data = IOUtils.readLines(inputStream);
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (KeyManagementException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (KeyStoreException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnrecoverableKeyException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (httpClient != null) {
				httpClient.getConnectionManager().shutdown();
			}
		}
		return data;
	}
}
