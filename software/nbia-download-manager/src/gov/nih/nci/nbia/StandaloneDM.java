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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
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

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.http.HttpResponse;
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
public class StandaloneDM {
	private final String winTitle = "TCIA Downloader";
	public static final String launchMsg = "To run TCIA Downloader app, please provide a manifest file as an argument. Download a manifest file from TCIA portal and open the file with TCIA Downloader app.";
	JFrame frame;
	private static final String SubmitBtnLbl = "Submit";
	private JLabel statusLbl;
	private JTextField userNameFld;
	private JPasswordField passwdFld;
	private String serverUrl;
	private String basketId;
	private boolean includeAnnotation;
	private Integer noOfRetry;
	private String fileLoc;
	private String userId = null;
	private String password = null;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		if (args != null && (args.length > 0)) {
			String fileName = args[0];			
			StandaloneDM sdm = new StandaloneDM();
			sdm.loadManifestFile(fileName);
			sdm.launch();
		} else {
			JOptionPane.showMessageDialog(null, launchMsg);
			System.exit(0);
		}
	}
	
	public StandaloneDM() {
		this.userId = null;
		this.password = null;
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
			this.basketId = System.getProperty("databasketId");
			this.includeAnnotation = Boolean.valueOf((System.getProperty("includeAnnotation")));
			this.noOfRetry = NumberUtils.toInt(System.getProperty("noOfrRetry"));
			this.fileLoc = System.getProperty("tempLoc");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}	

	public void launch() {
		if (basketId.endsWith("-x")) {
			frame = new JFrame("Standalone Download Manager");
			frame.setBounds(100, 100, 640, 320);
			frame.setContentPane(constructLoginPanel());// frame.setSize(800,
														// 480);
	        frame.setTitle(winTitle);
			frame.setVisible(true);
			frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		} else {
			List<String> seriesInfo = null;
			try {
				seriesInfo = connectAndReadFromURL(new URL(serverUrl), fileLoc + basketId);
			} catch (MalformedURLException e1) {
				e1.printStackTrace();
			}

			String[] strResult = new String[seriesInfo.size()];
			seriesInfo.toArray(strResult);
			List<SeriesData> seriesData = JnlpArgumentsParser.parse(strResult);
			DownloadManagerFrame manager = new DownloadManagerFrame("", "", includeAnnotation, seriesData, serverUrl,
					noOfRetry);
			manager.setTitle(winTitle);
			manager.setDefaultDownloadDir(System.getProperty("user.home") + File.separator +"Desktop");
			manager.setVisible(true);
		}
	}

	private JPanel constructLoginPanel() {
		JPanel contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		contentPane.setLayout(null);

		JLabel lblNewLabel_2 = new JLabel();
		lblNewLabel_2.setBounds(20, 11, 100, 100);
		contentPane.add(lblNewLabel_2);
		ImageIcon iconLogo = new ImageIcon("Images/global.logo");
		lblNewLabel_2.setIcon(iconLogo);
		statusLbl = new JLabel("<html>Some or all of the images you are about to download are from<br>private collection(s). Please log in first.</html>");
		contentPane.add(statusLbl);
		statusLbl.setBounds(110, 11, 500, 42);
		JLabel lblNewLabel = new JLabel("User Name");
		contentPane.add(lblNewLabel);
		lblNewLabel.setBounds(110, 79, 77, 31);

		userNameFld = new JTextField();
		contentPane.add(userNameFld);
		userNameFld.setBounds(187, 75, 333, 36);
		userNameFld.setColumns(10);

		JButton submitBtn = new JButton(SubmitBtnLbl);
		submitBtn.addActionListener(new BtnListener());
		contentPane.add(submitBtn);
		submitBtn.setBounds(249, 200, 139, 36);

		passwdFld = new JPasswordField();
		contentPane.add(passwdFld);
		passwdFld.setBounds(187, 129, 333, 36);
		
		userNameFld.addActionListener(new ActionListener() {
	        @Override
	        public void actionPerformed(ActionEvent e) {
	        	passwdFld.requestFocus();
	        }
	    });	
		
		passwdFld.addActionListener(new ActionListener() {
	        @Override
	        public void actionPerformed(ActionEvent e) {
	        	submitUserCredential();
	        }
	    });

		JLabel lblNewLabel_1 = new JLabel("Password");
		contentPane.add(lblNewLabel_1);
		lblNewLabel_1.setBounds(110, 129, 77, 36);

		return contentPane;
	}
	
	private void submitUserCredential() {
		userId = userNameFld.getText();
		password = passwdFld.getText();
		List<String> seriesInfo = null;

		if ((userId.length() < 1) || (password.length() < 1)) {
			statusLbl.setText("Please enter a valid user name and password.");
			statusLbl.setForeground(Color.red);
		} else {
			try {
				seriesInfo = connectAndReadFromURL(new URL(serverUrl),
						fileLoc + basketId.substring(0, basketId.length() - 2));
			} catch (MalformedURLException e1) {
				e1.printStackTrace();
			}
			try {
				int lastRecInx = seriesInfo.size() - 1;
				String[] strResult = new String[seriesInfo.size()];
				String key = seriesInfo.get(lastRecInx);
				String encryptedPassword = this.encrypt(password, key);
				if (loggedIn(userId, encryptedPassword, seriesInfo.get(lastRecInx - 2),
						seriesInfo.get(lastRecInx - 1))) {
					seriesInfo.remove(lastRecInx);
					seriesInfo.remove(lastRecInx - 1);
					seriesInfo.remove(lastRecInx - 2);
					seriesInfo.toArray(strResult);

					List<SeriesData> seriesData = JnlpArgumentsParser.parse(strResult);

					DownloadManagerFrame manager = new DownloadManagerFrame(userId, encryptedPassword,
							includeAnnotation, seriesData, serverUrl, noOfRetry);
					manager.setTitle(winTitle);
					manager.setDefaultDownloadDir(System.getProperty("user.home") + File.separator +"Desktop");
					manager.setVisible(true);
					frame.setVisible(false);
				} else {
					statusLbl.setText("Invalid User name and/or password.  Please try it again.");
					statusLbl.setForeground(Color.red);
				}

			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}
	
	private String encrypt(String password, String key) throws Exception {
		StringEncrypter encrypter = new StringEncrypter();
		return encrypter.encryptString(password, key);
	}

	private boolean loggedIn(String uid, String pwd, String ruid, String rpwd) {
		if (uid.equals(ruid) && pwd.equals(rpwd)) {
			return true;
		} else
			return false;
	}
	
	private class BtnListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			if (e.getActionCommand().equals(SubmitBtnLbl)) {
				submitUserCredential();
			}
		}
	}

	private static List<String> connectAndReadFromURL(URL url, String fileName) {
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
			postParams.add(new BasicNameValuePair("serverjnlpfileloc", fileName));
			UrlEncodedFormEntity query = new UrlEncodedFormEntity(postParams);
			httpPostMethod.setEntity(query);
			HttpResponse response = httpClient.execute(httpPostMethod);
			int responseCode = response.getStatusLine().getStatusCode();
			System.out.println("Response code for requesting datda file: " + responseCode);
			InputStream inputStream = response.getEntity().getContent();
			data = IOUtils.readLines(inputStream);
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
