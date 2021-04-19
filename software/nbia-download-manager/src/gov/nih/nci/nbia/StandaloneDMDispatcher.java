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

import java.awt.Dimension;
import java.awt.Font;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.ProxySelector;
import java.net.Socket;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URI;
import java.util.Iterator;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLHandshakeException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.swing.JEditorPane;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPasswordField;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ProgressMonitor;
import javax.swing.ProgressMonitorInputStream;
import javax.swing.event.HyperlinkEvent;
import javax.swing.event.HyperlinkListener;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NoHttpResponseException;
import org.apache.http.client.HttpRequestRetryHandler;
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
import org.apache.http.protocol.ExecutionContext;
import org.apache.http.protocol.HttpContext;

import gov.nih.nci.nbia.cli.DataRetrieverCLI;
import gov.nih.nci.nbia.util.BrowserLauncher;
import gov.nih.nci.nbia.util.DownloaderProperties;

//import java.io.Console;
//import java.io.Reader;
//import java.util.Scanner;

/**
 * @author Q. Pan
 *
 */
public class StandaloneDMDispatcher {
	public static final String launchMsg = "NBIA Data Retriever requires a manifest file to run. Create a manifest file in the data portal first and then click the manifest file to open it in the NBIA Data Retriever.<br/>To learn how to create a manifest file, watch this ";
	private final static String newVersionMsg = "A newer version of this app is available.";
	private final static String manifestVersionMsg = "The manifest file version is not suported by this version of app.  Please generate a new manifest file compatible with this version of app.";
	private final static String manifestVersionNewMsg = "The version of manifest file is higher than this app version.  Please upgrade your app.";
	private static final String supportedVersion = null; // for future when
															// certain version
															// is no longer
															// supported
//	private final static String appVersion = "3.2";
	private static String appVersion = null;
	private static final String osParam = "os";
	private static final String installBtnLbl = "Update automatically";
	private static final String downloadBtnLbl = "Update manually";
	private static final String remindMeBtnLbl = "Remind me later";
	public static final String youTubeLink = "https://youtu.be/NO48XtdHTic";
	protected String serverUrl;
	protected String manifestVersion = null;
	protected static String os = null;
	private String key = null;
	private boolean nogo = false;
	private List seriesList = null;
	private boolean majorityPublic = true;
	private double serverVersion = 0.0;
	
	

	/**
	 * @param args
	 */
	public static void main(String[] args) {
//		Console console = System.console();
//		if(console == null) {
//			System.out.println("Console is not available to current JVM process");
//			return;
//		} 
		os = System.getProperty("os.name").toLowerCase();
		
		if (args != null && (args.length > 0)) {
			if (isGUIApp(args)) {
//				console.printf("GUI Application");
				String fileName = args[0];
				StandaloneDMDispatcher sdmp = new StandaloneDMDispatcher();
				sdmp.loadManifestFile(fileName);
//				sdmp.getUserAgreementTxt();
				sdmp.launch();
			}
			else if (os.toLowerCase().contains("linux"))
			{ // command line interface
//				console.printf("CLI Application");
				String fileName = null;
				String userName = null;
				String passWord = null;
				String downloadDir = null; // The directory that the user want to put the downloaded data

				DataRetrieverCLI dr = new DataRetrieverCLI();

				if (args != null && (args.length > 0)) {
					for (int i = 0; i < args.length; ++i) {
						if (args[i].equals("-c") || args[i].equals("-C") || args[i].equals("--cli") || args[i].equals("--CLI"))
							fileName = args[i + 1];
						if (args[i].equals("-u") || args[i].equals("-U"))
							userName = args[i + 1];
						if (args[i].equals("-p") || args[i].equals("-P"))
							passWord = args[i + 1];
						if (args[i].equals("-d") || args[i].equals("-D")) {
							downloadDir = args[i + 1];
						}
						if (args[i].equals("-l") || args[i].equals("-L")) {
//							if (args.length == (i + 1))
//								dr.logger
							if (dr.getLoginCredential(args[i + 1])) {
								userName = System.getProperty("userName");
								passWord = System.getProperty("passWord");
							}
						}
						if (args[i].equals("-v") || args[i].equals("-V") || args[i].equals("--verbose")
								|| args[i].equals("--VERBOSE")) {
							dr.verbose = true;
						}
						if (args[i].equals("-q") || args[i].equals("-Q") || args[i].equals("--quiet")
								|| args[i].equals("--QUIET")) {
							dr.quiet = true;

						}
						if (args[i].equals("-f") || args[i].equals("-F") || args[i].equals("--force")
								|| args[i].equals("--FORCE")) {
							dr.force = true;
						}
					}
					dr.configLogger(downloadDir);

					dr.logger.info("Using manifiest file: " + fileName);
					dr.logger.info(
							"Running with option: quiet = " + dr.quiet + "; verbose = " + dr.verbose + "; force = " + dr.force);
					if (fileName == null) {
						dr.logger.severe(
								"This program expect a manifest file. Please provide a manifest file name with the option --cli. For example --cli <manifest file name>.");
					}

					dr.performDownload(downloadDir, fileName, userName, passWord);
				}
			}
			else System.out.println("NBIA Data Retriever is only supporting Linux operating system currently.");
		} else {			
		    // for copying style
		    JLabel label = new JLabel();
		    Font font = label.getFont();
		    // create some css from the label's font
		    StringBuffer style = new StringBuffer("font-family:" + font.getFamily() + ";");
		    style.append("font-weight:" + (font.isBold() ? "bold" : "normal") + ";");
		    style.append("font-size:" + font.getSize() + "pt;");
			
		    // html content
		    JEditorPane ep = new JEditorPane("text/html", "<html><body style=\"" + style + "\">" //
		            +launchMsg + "<a href=\"" + youTubeLink + "\">video tutorial</a>." //
		            + "</body></html>");

		    // handle link events
		    ep.addHyperlinkListener(new HyperlinkListener()
		    {
		        @Override
		        public void hyperlinkUpdate(HyperlinkEvent e)
		        {
		            if (e.getEventType().equals(HyperlinkEvent.EventType.ACTIVATED))
		            	BrowserLauncher.openUrl(e.getURL().toString());
		        }
		    });
		    ep.setEditable(false);
		    ep.setBackground(label.getBackground());

		    // show
		    JOptionPane.showMessageDialog(null, ep);
		}
	}
	
	private static boolean isGUIApp(String[] args) {
		for (int i = 0; i < args.length; ++i) {
			if (args[i].equals("-c") || args[i].equals("-C") || args[i].equals("--cli") || args[i].equals("--CLI")) {
				return  false;
			}
		}
		
		return true;
	}

	public StandaloneDMDispatcher() {
		os = System.getProperty("os.name").toLowerCase();
		appVersion = DownloaderProperties.getAppVersion();
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
			if (manifestVersion.startsWith("3.")) {
				seriesList = getSeriesList(fileName);
			}

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			String note ="Error in loading manifest file--FileNotFoundException:\n";
			printStackTraceToDialog(note, e);
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			String note ="Error in loading manifest file--IOException:\n";
			printStackTraceToDialog(note, e);
			e.printStackTrace();
		}
	}

	private void checkManifestVersion(String manifestVersion) {
		if ((manifestVersion != null) && (Double.valueOf(manifestVersion) > Double.valueOf(appVersion))) {
			Object[] options = { "OK" };
			int n = JOptionPane.showOptionDialog(null, manifestVersionNewMsg,
					"Incompatible Manifest File Version Notification", JOptionPane.OK_OPTION,
					JOptionPane.INFORMATION_MESSAGE, null, options, options[0]);
		}

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
			String linuxOs = getLinuxPlatform();
			if (linuxOs.equals("other")) {
				JOptionPane.showMessageDialog(null,
						"This app has not been tested on the OS platform of your system.  Only Windows/MacOS/CentOS/Red Hat/Ubuntu are supported currently.");
//				return;
				//check the os properties of installed software to determined the installer type  	
				os = DownloaderProperties.getInstallerType();
			}
			else os = linuxOs;
		}
		
		try {
			String versionServerUrl = serverUrl.substring(0, serverUrl.lastIndexOf('/'))
					.concat("/DownloadServletVersion");
			resp = connectAndReadFromURL(new URL(versionServerUrl));
		} catch (MalformedURLException e1) {
			JOptionPane.showMessageDialog(null, "Connection error 8: " + e1.getMessage());
			e1.printStackTrace();
		}
		if ((resp != null) && (resp.size() >= 3)) {
			key = resp.get(2);
			serverVersion = Double.parseDouble(resp.get(0));
		}
		
		
		if ((resp != null) && (resp.size() >= 6)) {
			System.setProperty("help.desk.url", resp.get(4));
			System.setProperty("online.help.url", resp.get(5));
		}		

		if ((resp != null) && (Double.parseDouble(resp.get(0)) > Double.parseDouble(appVersion))) {
			if (resp.size() >= 4) {
				constructDownloadPanel(resp.get(1), resp.get(3));
			} else
				constructDownloadPanel(resp.get(1));
		}
	}

	public void launch() {
		getNewVersionInfo();

		if (nogo == true)
			return;

		if ((manifestVersion == null) || (manifestVersion.equals("1.0"))) {
			StandaloneDMV1 sdm = new StandaloneDMV1();
			sdm.launch();
		} else if (manifestVersion.equals("2.0")) {
			StandaloneDMV2 sdm = new StandaloneDMV2();
			sdm.setKey(key);
			sdm.launch();
		} 
//		else if (manifestVersion.startsWith("3.")) {
//			StandaloneDMV3 sdm = new StandaloneDMV3();
//			sdm.setKey(key);
//			sdm.launch(seriesList);
//		}
		//For upcoming release, if the server is not updated to version 4
		else if ((manifestVersion.startsWith("3.")) && (serverVersion < 4.0)) {
			StandaloneDMV3 sdm = new StandaloneDMV3();
			sdm.setKey(key);
			sdm.launch(seriesList);
		}
		else if (manifestVersion.startsWith("3.")) {
		if (1 == showUserAgreementTxt(getUserAgreementTxt()))
			System.exit(0);
		StandaloneDMV4 sdm = new StandaloneDMV4();
		sdm.setKey(key);
		sdm.launch(seriesList);
		
	}
		else {
			JOptionPane.showMessageDialog(null, "The version of manifest file, " + manifestVersion
					+ ", might be incompatible with this version of app. Please upgrade your app.");
			return;
		}

	}

	private void constructDownloadPanel(String downloadUrl) {
		Object[] options = { installBtnLbl, downloadBtnLbl, remindMeBtnLbl };
		constructDownloadPanelWithOption(downloadUrl, options);
	}

	private void constructDownloadPanel(String downloadUrl, String forceUpgrade) {
		if (forceUpgrade.equalsIgnoreCase("true") || forceUpgrade.equalsIgnoreCase("yes")) {
			Object[] options = { installBtnLbl, downloadBtnLbl };
			constructDownloadPanelWithOption(downloadUrl, options);
		} else {
			constructDownloadPanel(downloadUrl);
		}
	}

	private void constructDownloadPanelWithOption(String downloadUrl, Object[] options) {
		String nVMsg = newVersionMsg;
		if (os.equalsIgnoreCase("CentOS") || os.equalsIgnoreCase("Ubuntu")) {
			nVMsg = nVMsg + "\nIf choosing Update automatically, you need to enter a sudo password later.";
		}
		
		if (os.startsWith("mac")) {
			JOptionPane.showMessageDialog(null, "New version is available on App Store. Please upgrade.");
			if (options.length ==2) { // forced upgrade needed
				System.exit(1);
			}
			else {
				nogo = false;
				return;
			}
		}

		int n = JOptionPane.showOptionDialog(null, nVMsg, "New Version Notification", JOptionPane.YES_NO_CANCEL_OPTION,
				JOptionPane.INFORMATION_MESSAGE, null, options, options[0]);

		if (n == 0) {
			saveAndInstall(downloadUrl);
			nogo = true;
		} else if (n == 1) {
			try {
				saveFile(downloadUrl);
				nogo = true;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else if (n == 2) {
			nogo = false;
		}
	}

	String getInstallerName(String downloadUrl) {
		int lastIndex = downloadUrl.length();
		if (downloadUrl.contains("?"))
			lastIndex = downloadUrl.lastIndexOf('?');
		String fileName = downloadUrl.substring(1 + downloadUrl.lastIndexOf('/'), lastIndex);
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

		Thread t = new Thread(new Runnable() {
			public void run() {
				downloadInstaller(dlUrl);
				install(dlUrl);
				// System.exit(0);;
			}
		});
		t.start();
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
					"Downloading new version of installer for NBIA Data Retriever...", in);

			ProgressMonitor monitor = pmis.getProgressMonitor();
			monitor.setMillisToPopup(0);
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
			pmis.close();
			fos.flush();
			fos.close();
			in.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void install(String downloadUrl) {
		Double vNum = 0.0;
		if (appVersion != null) {
			vNum = Double.parseDouble(appVersion);
		}
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
			JLabel pwLabel = new JLabel("Sudo Password");
			JTextField password = new JPasswordField();
			Object[] objs = { pwLabel, password };
			int result = JOptionPane.showConfirmDialog(null, objs, "Please enter a sudo password",
					JOptionPane.OK_CANCEL_OPTION);
			String pas = null;
			if (result == JOptionPane.OK_OPTION) {
				pas = password.getText();
			}

			if (pas != null) {
				if (os.equals("CentOS")) {
					// sudo yum install TCIADownloader-1.0-1.x86_64.rpm
					try {
						String upgradCmd="/usr/bin/sudo -S yum -q -y remove TCIADownloader.x86_64;/usr/bin/sudo -S yum -y -q install ";
						if (vNum>=3.2)
							upgradCmd="/usr/bin/sudo -S yum -q -y remove NBIADataRetriever.x86_64;/usr/bin/sudo -S yum -y -q install ";
							
						String[] cmd = { "/bin/bash", "-c", upgradCmd + installerPath };

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

						JOptionPane.showMessageDialog(null,
								"Installation of new version of NBIA Data Retriever is completed " + status + ".");
					} catch (IOException | InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				} else if (os.equals("Ubuntu")) {
					// sudo dpkg -i tciadownloader_1.0-2_amd64.deb
					String upgradCmd="/usr/bin/sudo -S dpkg -i ";
					if (vNum>=3.2)
						upgradCmd="/usr/bin/sudo -S dpkg -r nbia-data-retriever; /usr/bin/sudo -S dpkg -i ";
					try {
						String[] cmd = { "/bin/bash", "-c", upgradCmd + installerPath };

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

						JOptionPane.showMessageDialog(null,
								"Installation of new version of NBIA Data Retriever is completed " + status + ".");
					} catch (IOException | InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}
	}

	private static List<String> connectAndReadFromURL(URL url) {
		String note1 = "Check local machine's configuration before making connection: "+ ":\n" + getProxyInfo() +"\n"; 
		StringBuffer sb = new StringBuffer();
		//printStackTraceToDialog(note1, null);
		List<String> data = null;
		DefaultHttpClient httpClient = null;
		TrustStrategy easyStrategy = new TrustStrategy() {
			@Override
			public boolean isTrusted(X509Certificate[] certificate, String authType) throws CertificateException {
				return true;
			}
		};
		long start = System.currentTimeMillis();
		try {
			SSLSocketFactory sslsf = new SSLSocketFactory(easyStrategy, SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
			Scheme httpsScheme = new Scheme("https", 443, sslsf);
			SchemeRegistry schemeRegistry = new SchemeRegistry();
			schemeRegistry.register(httpsScheme);
			schemeRegistry.register(new Scheme("http", 80, PlainSocketFactory.getSocketFactory()));
			ClientConnectionManager ccm = new ThreadSafeClientConnManager(schemeRegistry);

			HttpParams httpParams = new BasicHttpParams();
			HttpConnectionParams.setConnectionTimeout(httpParams, 500000);
			HttpConnectionParams.setSoTimeout(httpParams, new Integer(720000));
			httpClient = new DefaultHttpClient(ccm, httpParams);
			httpClient.setRoutePlanner(new ProxySelectorRoutePlanner(schemeRegistry, ProxySelector.getDefault()));
			// // Additions by lrt for tcia -
			// // attempt to reduce errors going through a Coyote Point
			// Equalizer load balance switch
			httpClient.getParams().setParameter("http.socket.timeout", new Integer(120000));
			httpClient.getParams().setParameter("http.socket.receivebuffer", new Integer(16384));
			httpClient.getParams().setParameter("http.tcp.nodelay", true);
			httpClient.getParams().setParameter("http.connection.stalecheck", false);
			// // end lrt additions

			HttpPost httpPostMethod = new HttpPost(url.toString());

			List<BasicNameValuePair> postParams = new ArrayList<BasicNameValuePair>();
			postParams.add(new BasicNameValuePair(osParam, os));
			
			HttpRequestRetryHandler myRetryHandler = new HttpRequestRetryHandler() {
				@Override
				public boolean retryRequest(IOException exception,
						int executionCount, HttpContext context) {
				
					if (executionCount >= 5) {
						// Do not retry if over max retry count
						sb.append("Reached max retry 5 attempts using Request handler.\n");
						return false;
					}
					if (exception instanceof NoHttpResponseException) {
						// Retry on when server dropped connection
						sb.append("NoHttpResponseException:\n");
						return true;
					}
					if (exception instanceof SSLHandshakeException) {
						// Do not retry on SSL handshake exception
						sb.append("SSLHandshakeException:\n");
						return false;
					}
					if (exception instanceof java.net.SocketTimeoutException) {
						// Retry on socket timeout exception
						sb.append("java.net.SocketTimeoutException" + " Request Handler attempt ").append(executionCount).append(" times for SocketTimeOutException \n");
						return true;
					}
					if (exception instanceof java.net.SocketException) {
						// Retry on socket timeout exception
						sb.append("java.net.SocketException " +" Request Handler attempt ").append(executionCount) .append(" time for SocketException \n");
						return true;
					}
					HttpRequest request = (HttpRequest) context.getAttribute(ExecutionContext.HTTP_REQUEST);
					boolean idempotent = !(request instanceof HttpEntityEnclosingRequest);
					if (idempotent) {
						// Retry if the request is considered idempotent
						return true;
					}
					return false;
				}
			};
			httpClient.setHttpRequestRetryHandler(myRetryHandler);
			UrlEncodedFormEntity query = new UrlEncodedFormEntity(postParams);
			httpPostMethod.setEntity(query);		
			start = System.currentTimeMillis();	        
			HttpResponse response = httpClient.execute(httpPostMethod);
			int responseCode = response.getStatusLine().getStatusCode();
	
			if (responseCode == HttpStatus.SC_OK) {
				InputStream inputStream = response.getEntity().getContent();
				data = IOUtils.readLines(inputStream);
			}
			else {
				JOptionPane.showMessageDialog(null, "Incorrect response from server: " + responseCode);
			}

		} catch (java.net.ConnectException e) {
			String note = sb + note1 + "Connection error 1 while connecting to "+ url.toString() + ":\n Stack trace is below: \n";// + getProxyInfo(); 
			//+ checkListeningPort("127.0.0.1", 8888);
			printStackTraceToDialog(note, e);
			//JOptionPane.showMessageDialog(null, "Connection error 1: " + e.getMessage());
			e.printStackTrace();
		} catch (MalformedURLException e) {
			String note = sb + "Connection error 2 while connecting to "+ url.toString() + ":\n";
			printStackTraceToDialog(note, e);
			//JOptionPane.showMessageDialog(null, "Connection error 2: " + e.getMessage());
			e.printStackTrace();
		} catch (IOException e) {
			long duration = System.currentTimeMillis() - start;
			String note = sb + "Connection error 3 while connecting to "+ url.toString() + ":\nThe time used:" + duration + "millis\nStack trace is below: \n"; 
			printStackTraceToDialog(note, e);
			//JOptionPane.showMessageDialog(null, "Connection error 3: " + e.getMessage());
			e.printStackTrace();
		} catch (KeyManagementException e) {
			String note = sb + "Connection error 4 while connecting to "+ url.toString() + ":\n";
			printStackTraceToDialog(note, e);
			//JOptionPane.showMessageDialog(null, "Connection error 4: " + e.getMessage());
			e.printStackTrace();
		} catch (NoSuchAlgorithmException e) {
			String note = sb + "Connection error 5 while connecting to "+ url.toString() + ":\n";
			printStackTraceToDialog(note, e);
			//JOptionPane.showMessageDialog(null, "Connection error 5: " + e.getMessage());
			e.printStackTrace();
		} catch (KeyStoreException e) {
			String note = sb + "Connection error 6 while connecting to "+ url.toString() + ":\n";
			printStackTraceToDialog(note, e);
			//JOptionPane.showMessageDialog(null, "Connection error 6: " + e.getMessage());
			e.printStackTrace();
		} catch (UnrecoverableKeyException e) {
			String note = sb + "Connection error 7 while connecting to "+ url.toString() + ":\n";
			printStackTraceToDialog(note, e);
			//JOptionPane.showMessageDialog(null, "Connection error 7: " + e.getMessage());
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
					} else if (line.contains("CentOS") || line.contains("Red Hat")) {
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

	private List<String> getSeriesList(String fileName) {
		BufferedReader reader = null;
		List<String> seriesList = new ArrayList<String>();
		try {
			// open file
			reader = new BufferedReader(new FileReader(fileName));

			// read first line
			String line = reader.readLine();

			// go through the entire file line for line
			while (line != null) {
				if (line.equalsIgnoreCase("ListOfSeriesToDownload="))
					break;
				line = reader.readLine();
			}
			String data;
			while ((data = reader.readLine()) != null) { // read and store only
															// line
				seriesList.add(data.replaceFirst(",", ""));
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				// always close file readers!
				reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return seriesList;
	}
	
	static void printStackTraceToDialog(String note, Exception e) {
		StringBuilder sb = new StringBuilder(note);
	    if (e != null) {		
	    		sb.append(e.getMessage());
	    		sb.append("\n");
 
	        for (StackTraceElement ste : e.getStackTrace()) {
	            sb.append(ste.toString());
	            sb.append("\n");
	        }
        }
        JTextArea jta = new JTextArea(sb.toString());
        JScrollPane jsp = new JScrollPane(jta){
            @Override
            public Dimension getPreferredSize() {
                return new Dimension(480, 320);
            }
        };
        JOptionPane.showMessageDialog(
                null, jsp, "Error", JOptionPane.ERROR_MESSAGE);
	}
	
	static String getProxyInfo() {
		StringBuffer sb = new StringBuffer("Get proxy info: ");
	      try {
	         System.setProperty("java.net.useSystemProxies", "true");
	         List<Proxy> l = ProxySelector.getDefault().select(
	            new URI("https://www.google.com/"));
	         
	         for (Iterator<Proxy> iter = l.iterator(); iter.hasNext();) {
	            Proxy proxy = iter.next();
	            sb.append("proxy type : " + proxy.type() +"\n");
	            InetSocketAddress addr = (InetSocketAddress) proxy.address();
	            
	            if (addr == null) {
	            		sb.append("No Proxy\n");
	            } else {
	            		sb.append("proxy hostname : " + addr.getHostName()+"\n");
	            		sb.append("proxy port : " + addr.getPort()+"\n");
	            } 
	         }
	      } catch (Exception e) {
	         e.printStackTrace();
	         sb.append(e.getMessage());
	      }
	      return sb.toString();
	   }	
	
	static String checkListeningPort(String host, int port) {	
		Socket s = null;
	    try
	    {
	        s = new Socket(host, port);
	        return host+":"+port +"is listening;\n";
	    }
	    catch (Exception e)
	    {
	    		return "checking listening port for "+host+":"+port + " result false for reason "+e.getMessage();
	    }
	    finally
	    {
	        if(s != null)
	            try {s.close();}
	            catch(Exception e){}
	    }
	
	}
	
	private String getUserAgreementTxt() {
		String text = null;
		try {
			String pubApiUrl = serverUrl.replaceFirst("nbia-download/servlet/DownloadServlet",
					"nbia-api/services/v1/getUserAgreementTxt");
			URL urlForGetRequest = new URL(pubApiUrl);

			HttpURLConnection connection = (HttpURLConnection) urlForGetRequest.openConnection();
			connection.setRequestMethod("GET");

			int responseCode = connection.getResponseCode();

			if (responseCode != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
			}

			InputStream input = connection.getInputStream();

			text = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))
					.lines().collect(Collectors.joining("\n"));
			connection.disconnect();
			input.close();
			if (text != null && !text.isEmpty()) {
				System.setProperty("data.usage.agreement.text",
						text);
			}

		} catch (Exception e) {
		}

		return text;
	}
	
	private int showUserAgreementTxt(String text) {
		int n = 0;

		if (text != null && !text.isEmpty()) {
			Object[] options = { "Agree", "Disagree" };
			JTextArea textArea = new JTextArea(text);
			JScrollPane scrollPane = new JScrollPane(textArea);
			textArea.setLineWrap(true);
			textArea.setWrapStyleWord(true);
			scrollPane.setPreferredSize(new Dimension(500, 500));

			n = JOptionPane.showOptionDialog(null, scrollPane, "Data Usage Policy", JOptionPane.YES_NO_OPTION,
					JOptionPane.INFORMATION_MESSAGE, null, options, options[0]);
			if (n == JOptionPane.CLOSED_OPTION) {
				n = 1;
			}
		}

		return n;
	}
}
