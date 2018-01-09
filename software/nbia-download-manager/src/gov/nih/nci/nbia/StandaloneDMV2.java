/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
 *
 */
package gov.nih.nci.nbia;

import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

//import javax.servlet.http.HttpServletResponse;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import javax.swing.border.EmptyBorder;

import gov.nih.nci.nbia.download.SeriesData;
import gov.nih.nci.nbia.ui.DownloadManagerFrame;
import gov.nih.nci.nbia.util.JnlpArgumentsParser;
import gov.nih.nci.nbia.util.StringEncrypter;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
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

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.http.Header;
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
public class StandaloneDMV2 extends StandaloneDM {
	private final static String serverVersionMsg = "The Download server version is not compatible with this TCIA Downloader.  Please check if downloadServerUrl is pointing to the correct server.";
	private String basketId;
	private String fileLoc;
	private String ManifestVersion = null;
	private String key = null;

	/**
	 * @param args
	 */

	public StandaloneDMV2() {
		super();
		this.basketId = System.getProperty("databasketId");
		this.fileLoc = System.getProperty("tempLoc");
		this.ManifestVersion = System.getProperty("manifestVersion");
	}

	void checkCompatibility() {
		if (serverUrl.endsWith("DownloadServlet")) {
			this.serverUrl = serverUrl.concat("V2");
		}

		if (!serverUrl.endsWith("DownloadServletV2")) {
			Object[] options = { "OK" };

			int n = JOptionPane.showOptionDialog(frame, serverVersionMsg, "Incompatible Server Notification",
					JOptionPane.OK_OPTION, JOptionPane.INFORMATION_MESSAGE, null, options, options[0]);
			System.exit(n);
		}
	}

	private String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	protected List<SeriesData> getSeriesInfo(String userId, String password) {
		List<String> seriesInfo = null;
		try {
			seriesInfo = connectAndReadFromURL(new URL(serverUrl), fileLoc + basketId, userId, password);
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}

		String[] strResult = new String[seriesInfo.size()];
		seriesInfo.toArray(strResult);
		return JnlpArgumentsParser.parse(strResult);
	}

	public void launch() {
		checkCompatibility();
		if (basketId.endsWith("-x")) {
			constructLoginWin();
		} else {
			List<SeriesData> seriesData = getSeriesInfo(null, null);
			DownloadManagerFrame manager = new DownloadManagerFrame("", "", includeAnnotation, seriesData, serverUrl,
					noOfRetry);
			manager.setTitle(winTitle);
			manager.setDefaultDownloadDir(System.getProperty("user.home") + File.separator + "Desktop");
			manager.setVisible(true);
		}
	}

	void submitUserCredential(String userId, String password) {
		List<String> seriesInfo = null;
		String encryptedPassword = null;
		try {
			encryptedPassword = this.encrypt(password, getKey());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			seriesInfo = connectAndReadFromURL(new URL(serverUrl),
					fileLoc + basketId.substring(0, basketId.length() - 2), userId, encryptedPassword);
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}
		if (seriesInfo == null) {
			statusLbl.setText("Invalid User name and/or password.  Please try it again.");
			statusLbl.setForeground(Color.red);
			return;
		} else {
			try {
				String[] strResult = new String[seriesInfo.size()];
				seriesInfo.toArray(strResult);

				List<SeriesData> seriesData = JnlpArgumentsParser.parse(strResult);

				DownloadManagerFrame manager = new DownloadManagerFrame(userId, encryptedPassword, includeAnnotation,
						seriesData, serverUrl, noOfRetry);
				manager.setTitle(winTitle);
				manager.setDefaultDownloadDir(System.getProperty("user.home") + File.separator + "Desktop");
				manager.setVisible(true);
				frame.setVisible(false);
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}

	private static List<String> connectAndReadFromURL(URL url, String fileName, String userId, String passWd) {
		List<String> data = null;
		DefaultHttpClient httpClient = null;
		TrustStrategy easyStrategy = new TrustStrategy() {
			@Override
			public boolean isTrusted(X509Certificate[] certificate, String authType) throws CertificateException {
				return true;
			}
		};
		try {
			// SSLContext sslContext = SSLContext.getInstance("SSL");
			// set up a TrustManager that trusts everything
			// sslContext.init(null, new TrustManager[] { new
			// EasyX509TrustManager(null)}, null);

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
			postParams.add(new BasicNameValuePair("serverManifestLoc", fileName));
			if (userId != null && passWd != null) {
				postParams.add(new BasicNameValuePair("userId", userId));
				httpPostMethod.addHeader("password", passWd);
			}

			UrlEncodedFormEntity query = new UrlEncodedFormEntity(postParams);
			httpPostMethod.setEntity(query);
			HttpResponse response = httpClient.execute(httpPostMethod);
			int responseCode = response.getStatusLine().getStatusCode();
			// System.out.println("!!!!!Response code for requesting datda file:
			// " + responseCode);

			if (responseCode != HttpURLConnection.HTTP_OK) {
				return null;
			} else {
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
