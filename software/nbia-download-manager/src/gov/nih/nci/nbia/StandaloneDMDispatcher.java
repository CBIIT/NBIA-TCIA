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

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
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
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
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
		if (!(os.contains("windows") || os.startsWith("mac"))) {
			this.os = getLinuxPlatform();
			if (this.os.equals("other")) {
				JOptionPane.showMessageDialog(null,
						"New version of TCIA Downloader is released but the OS platform of your system is not supported currently.");
				return;
			}
		}
		try {
			String versionServerUrl = serverUrl.substring(0, serverUrl.lastIndexOf('/'))
					.concat("/DownloadServletVersion");
			resp = connectAndReadFromURL(new URL(versionServerUrl));
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}
		if ((resp != null) && (resp.size() == 3)) {
			key = resp.get(2);
		}
		if ((resp != null) && (Double.parseDouble(resp.get(0)) > Double.parseDouble(appVersion))) {
			constructDownloadPanel(resp.get(1));
		}
	}

	public void launch() {
		getNewVersionInfo();

		if ((manifestVersion == null) || (manifestVersion.equals("1.0"))) {
			StandaloneDMV1 sdm = new StandaloneDMV1();
			sdm.launch();
		} else if (manifestVersion.equals("2.0")) {
			StandaloneDMV2 sdm = new StandaloneDMV2();
			sdm.setKey(key);
			sdm.launch();
		}
	}

	private void constructDownloadPanel(String downloadUrl) {
		Object[] options = { installBtnLbl, downloadBtnLbl, remindMeBtnLbl };
		String nVMsg = newVersionMsg;
		if (os.equalsIgnoreCase("CentOS") || os.equalsIgnoreCase("Ubuntu")) {
			nVMsg = nVMsg + "\nIf choosing Update automatically, you need to enter a sudo password later.";
		}

		int n = JOptionPane.showOptionDialog(null, nVMsg, "New Version Notification", JOptionPane.YES_NO_CANCEL_OPTION,
				JOptionPane.INFORMATION_MESSAGE, null, options, options[2]);

		if (n == 0) {
			saveAndInstall(downloadUrl);
			System.exit(0);
		} else if (n == 1) {

			try {
				saveFile(downloadUrl);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else if (n == 2) {
		}
	}

	String getInstallerName(String downloadUrl) {
		String fileName = downloadUrl.substring(1 + downloadUrl.lastIndexOf('/'), downloadUrl.lastIndexOf('?'));
		String home = System.getProperty("user.home");

		if (os.contains("windows")) {

			fileName = home + "\\Downloads\\" + fileName;
		} else {
			fileName = home + "/Downloads/" + fileName;
		}

		return fileName;
	}

	private void saveAndInstall(String downloadUrl) {
		final String dlUrl = downloadUrl;
		Thread t = new Thread() {
			public void run() {
				downloadInstaller(dlUrl);
				install(dlUrl);
			}
		};
		t.start();
		try {
			t.join();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void saveFile(String downloadUrl) throws IOException {
		final String dlUrl = downloadUrl;
		Thread t = new Thread() {
			public void run() {
				downloadInstaller(dlUrl);
				JOptionPane.showMessageDialog(null,
						"The latest installer is downloaded to " + getInstallerName(dlUrl) + ".");
			}
		};
		t.start();
		
	}

	private void downloadInstaller(String downloadUrl) {
		String fileName = getInstallerName(downloadUrl);
		InputStream in;

		// Create a trust manager that does not validate certificate chains
		TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
			public java.security.cert.X509Certificate[] getAcceptedIssuers() {
				return null;
			}

			public void checkClientTrusted(X509Certificate[] certs, String authType) {
				// here is the place to check client certs and throw an
				// exception if certs are wrong. When there is nothing all certs
				// accepted.
			}

			public void checkServerTrusted(X509Certificate[] certs, String authType) {
				// here is the place to check server certs and throw an
				// exception if certs are wrong. When there is nothing all certs
				// accepted.
			}
		} };
		// Install the all-trusting trust manager
		try {
			final SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

			// Create all-trusting host name verifier
			HostnameVerifier allHostsValid = new HostnameVerifier() {
				public boolean verify(String hostname, SSLSession session) {
					// Here is the palce to check host name against to
					// certificate owner
					return true;
				}
			};
			// Install the all-trusting host verifier
			HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
		} catch (KeyManagementException | NoSuchAlgorithmException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} finally {
		}

		try {
			URL url = new URL(downloadUrl);
			in = url.openStream();
			FileOutputStream fos = new FileOutputStream(new File(fileName));

			int length = -1;
			ProgressMonitorInputStream pmis;
			pmis = new ProgressMonitorInputStream(null,
					"Downloading new version of installer for TCIA Downloader App...", in);

			ProgressMonitor monitor = pmis.getProgressMonitor();
			monitor.setMinimum(0);
			monitor.setMaximum((int) 200000000); // The actual size is much
													// smaller,
													// but we have no way to
													// know
													// the actual size so picked
													// this big number

			byte[] buffer = new byte[1024];// buffer for portion of data from
			// connection

			while ((length = pmis.read(buffer)) > 0) {
				fos.write(buffer, 0, length);
			}
			fos.close();
			in.close();
			pmis.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void install(String downloadUrl) {
		String installerPath = getInstallerName(downloadUrl);
		if (os.contains("windows")) {
			try {
				Runtime.getRuntime().exec("msiexec /i \"" + installerPath + "\"");
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else if (os.startsWith("mac")) {
			try {
				Runtime.getRuntime().exec(new String[] { "/usr/bin/open", installerPath });
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			String pas = JOptionPane.showInputDialog("Please enter a sudo password for installing the new version:");
			if (pas != null) {
				if (os.equals("CentOS")) {
					// sudo yum install TCIADownloader-1.0-1.x86_64.rpm
					try {
						String[] cmd = { "/bin/bash", "-c",
								"/usr/bin/sudo -S yum -q -y remove TCIADownloader.x86_64;/usr/bin/sudo -S yum -y -q install "
										+ installerPath };

						Process pb = Runtime.getRuntime().exec(cmd);
						BufferedWriter writer = null;
						writer = new BufferedWriter(new OutputStreamWriter(pb.getOutputStream()));
						writer.write(pas);
						writer.write('\n');
						writer.flush();

						String status = null;

						if (pb.waitFor() == 0) {
							status = "successfully";
						} else {
							status = "unsuccessfully";
						}

						int n = JOptionPane.showConfirmDialog(null,
								"Installation of new version of TCIA Downloader is completed " + status
										+ ".");
						if (n == 0) {
							System.exit(0);
						}
					} catch (IOException | InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				} else if (os.equals("Ubuntu")) {
					// sudo dpkg -i tciadownloader_1.0-2_amd64.deb
					try {
						String[] cmd = { "/bin/bash", "-c", "/usr/bin/sudo -S dpkg -i " + installerPath };

						Process pb = Runtime.getRuntime().exec(cmd);
						BufferedWriter writer = null;
						writer = new BufferedWriter(new OutputStreamWriter(pb.getOutputStream()));
						writer.write(pas);
						writer.write('\n');
						writer.flush();

						String status = null;

						if (pb.waitFor() == 0) {
							status = "successfully";
						} else {
							status = "unsuccessfully";
						}

						int n = JOptionPane.showConfirmDialog(null,
								"Installation of new version of TCIA Downloader is completed " + status
										+ ".");
						if (n == 0) {
							System.exit(0);
						}
					} catch (IOException | InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}
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
			// System.out.println("Dispatcher:Response code for requesting data
			// file: " + responseCode);
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

	private String getLinuxPlatform() {
		String linuxOS = "other";
		if (os.contains("nux")) {
			String[] cmd = { "/bin/sh", "-c", "cat /etc/*-release" };
			try {
				Process p = Runtime.getRuntime().exec(cmd);
				BufferedReader bri = new BufferedReader(new InputStreamReader(p.getInputStream()));
				String line = "";
				while ((line = bri.readLine()) != null) {
					if (line.contains("Ubuntu")) {
						linuxOS = "Ubuntu";
						break;
					} else if (line.contains("CentOS")) {
						linuxOS = "CentOS";
						break;
					}
				}
				bri.close();
				return linuxOS;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return linuxOS;
	}
}
