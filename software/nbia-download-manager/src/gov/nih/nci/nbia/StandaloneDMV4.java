/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */
package gov.nih.nci.nbia;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.ImageIcon;
import javax.swing.JButton;
//import javax.swing.JEditorPane;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JProgressBar;
import javax.swing.JTextField;
import javax.swing.UIManager;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.EtchedBorder;
import javax.swing.border.TitledBorder;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;

import gov.nih.nci.nbia.download.SeriesData;
import gov.nih.nci.nbia.ui.DownloadManagerFrame;
import gov.nih.nci.nbia.util.BrowserLauncher;
import gov.nih.nci.nbia.util.DownloaderProperties;
import gov.nih.nci.nbia.util.JnlpArgumentsParser;

import java.io.File;
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
import java.util.List;
import java.util.Set;

import org.apache.commons.io.IOUtils;
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
public class StandaloneDMV4 extends StandaloneDM {
	private final static String serverVersionMsg = "The Download server version is not compatible with this app.  Please check if downloadServerUrl is pointing to the correct server.";
	private static final String GuestBtnLbl = "Guest Login";
	private final static int CLIENT_LOGIN_NEEDED = 460;
	private final static int CLIENT_LOGIN_FAILED = 461;
	private final static int CLIENT_NOT_AUTHORIZED = 462;
	private String key = null;
	private List<String> seriesList = null;
	private int returnStatus;
	JProgressBar progressBar;

	/**
	 * @param args
	 */

	public StandaloneDMV4() {
		super();
	}

	void checkCompatibility() {
		if (serverUrl.endsWith("DownloadServlet")) {
			this.serverUrl = serverUrl.concat("V4");
		} 

		if (!serverUrl.endsWith("DownloadServletV4"))  {
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

	protected List<SeriesData> getSeriesInfo(String userId, String password, List seriesList) {
		List<String> seriesInfo = null;
		try {
			seriesInfo = connectAndReadFromURL(new URL(serverUrl), seriesList, userId, password);
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}
//System.out.println("@@@@@@@@@@ v4/login info returned sereis size ="+ seriesInfo);	
		if (seriesInfo != null) {
			String[] strResult = new String[seriesInfo.size()];
			seriesInfo.toArray(strResult);
			return JnlpArgumentsParser.parse(strResult);
		} else
			return null;
	}
		

	protected List<String> getSeriesInfo(List seriesList) {
		int maxInGroup = 5000;
//		int maxInGroup = 10;
		int index = 0;
		int count = 0;
		List<String> seriesInfo = null;
		int seriesSize = seriesList.size();
		
		do {
			List<String> seriesSubgroup = null;
			++count;
			int last = (maxInGroup * count) >= seriesSize ? seriesSize : (maxInGroup * count);

			seriesSubgroup = seriesList.subList(index, last);

			index = maxInGroup * count;
			try {
				if (count == 1) {
					seriesInfo = connectAndReadFromURL(new URL(serverUrl), seriesSubgroup, null, null);
				} 
				else if (count > 1) {
					List<String> nextGroup = null;
					nextGroup = connectAndReadFromURL(new URL(serverUrl), seriesSubgroup, null, null);
					if (nextGroup != null)
						seriesInfo.addAll(nextGroup);
				}
				if (seriesInfo == null) {
					return null;
				}
				else if (seriesInfo.size() != last) {
					return null;
				}

			} catch (MalformedURLException e1) {
				e1.printStackTrace();
			}
		} while (index < seriesSize);
							
		return seriesInfo;
	}
	
	protected List<String> getSeriesInfo(List seriesList, String username, String password) {
//		int maxInGroup = 5000;
//		int maxInGroup = 10;
		int maxInGroup = 2000;
		int index = 0;
		int count = 0;
		List<String> seriesInfo = null;
		int seriesSize = seriesList.size();
		
		do {
			List<String> seriesSubgroup = null;
			++count;
			int last = (maxInGroup * count) >= seriesSize ? seriesSize : (maxInGroup * count);
			seriesSubgroup = seriesList.subList(index, last);
			index = maxInGroup * count;
			try {
				if (count == 1) {
					seriesInfo = connectAndReadFromURL(new URL(serverUrl), seriesSubgroup, username, password);
				} 
				else if (count > 1) {
					List<String> nextGroup = null;
					nextGroup = connectAndReadFromURL(new URL(serverUrl), seriesSubgroup, username, password);
					if (nextGroup != null)
						seriesInfo.addAll(nextGroup);
					else return null;
				}
				if (seriesInfo == null) {
					return null;
				}
				else if (seriesInfo.size() != last) {
					return null;
				}

			} catch (MalformedURLException e1) {
				e1.printStackTrace();
			}
		} while (index < seriesSize);
						
		return seriesInfo;
	}	

	public void launch(List<String> seriesList) {
		checkCompatibility();
		if ((seriesList == null) || (seriesList.size() <= 0)) {
			JOptionPane.showMessageDialog(null,
					"This version of Download App requires to have at least one series instance UID in manifest file.");
			System.exit(0);
		} else {
			this.seriesList = seriesList;
			
			JFrame f; 
			String os = System.getProperty("os.name").toLowerCase();			
			if (os.startsWith("mac")) {
				f = showProgressForMac("Loading your data");
				SwingUtilities.invokeLater(new Runnable() {
				    public void run() {
				    	createMainWin();
					f.setVisible(false);
					f.dispose();
				    }
				});
			} 
			else {
				f = showProgress("Loading your data");
				createMainWin();
				f.setVisible(false);
				f.dispose();
			}
		}
	}
	
	void createMainWin() {
		if (DownloaderProperties.getMajorityPublic()) {
			List<String> seriesInfo = getSeriesInfo(seriesList);
			if (seriesInfo != null) {
				constructDownloadManager(seriesInfo, null, null);
			} else if (returnStatus == CLIENT_LOGIN_NEEDED) {
				constructLoginWin();
			}
		} else {
			constructLoginWin();
		}
	}
	

	JFrame showProgress(String message) {
		JFrame f = new JFrame("Info");
		f = new JFrame("Info");
		f.setUndecorated(true);

		JPanel p = new JPanel();
		Border margin = new EmptyBorder(30, 20, 20, 20);
		p.setBorder(new TitledBorder(
				new TitledBorder(margin, "", TitledBorder.LEADING, TitledBorder.TOP, null, new Color(0, 0, 0)), message,
				TitledBorder.LEADING, TitledBorder.TOP, null, null));
		p.setLayout(new BorderLayout(30, 30));
		JProgressBar progressBar = new JProgressBar();
		progressBar.setIndeterminate(true);
		p.add(progressBar, BorderLayout.CENTER);

		f.getContentPane().add(p);
		f.setSize(360, 80);
		f.setLocationRelativeTo(null);
		f.setVisible(true);
		return f;
	}
	
	JFrame showProgressForMac(String message) {
		JFrame f = new JFrame("Info");
		f.setUndecorated(true);

		JPanel p = new JPanel();
		p.setLayout(new BorderLayout());
		JLabel waitInfo = new JLabel("Loading your data...");
		waitInfo.setForeground(new Color(105, 105, 105));
		waitInfo.setFont(new Font("Tahoma", Font.BOLD, 13));
		waitInfo.setHorizontalAlignment(JLabel.CENTER);
		waitInfo.setVerticalAlignment(JLabel.CENTER);
		p.add(waitInfo,BorderLayout.CENTER);
		f.getContentPane().add(p);
		f.setSize(360, 40);
		f.setLocationRelativeTo(null);
		f.setVisible(true);
		return f;
	}	

	void submitUserCredential(String userId, String password) {
		List<String> seriesInfo = null;
		String encryptedPassword = null;

		try {
			if (password != null)
				encryptedPassword = this.encrypt(password, getKey());
			else
				encryptedPassword = null;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		seriesInfo = getSeriesInfo(seriesList, userId, encryptedPassword);
//		try {
//			seriesInfo = connectAndReadFromURL(new URL(serverUrl), seriesList, userId, encryptedPassword);
//		} catch (MalformedURLException e1) {
//			e1.printStackTrace();
//		}
		if (seriesInfo == null && returnStatus == CLIENT_LOGIN_FAILED) {
			setStatus(statusLbl, "Invalid User name and/or password.  Please try it again.", Color.red);
			return;
		} else if (seriesInfo == null && returnStatus == CLIENT_NOT_AUTHORIZED) {
			setStatus(statusLbl, "Contact the help desk to request permission to access all of the images.",
					Color.red);
			//helpDeskLabel2.setVisible(true);
			return;
		} else if (seriesInfo != null) {
			constructDownloadManager(seriesInfo, userId, encryptedPassword);
		}
	}

	private void constructDownloadManager(List<String> seriesInfo, String userId, String password) {
		try {
			String[] strResult = new String[seriesInfo.size()];
			seriesInfo.toArray(strResult);

			List<SeriesData> seriesData = JnlpArgumentsParser.parse(strResult);
			try {
				UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
			} catch (Exception ex) {
				ex.printStackTrace();
			}

			DownloadManagerFrame manager = new DownloadManagerFrame(true, userId, password, includeAnnotation,
					seriesData, serverUrl, noOfRetry);
			manager.setTitle(winTitle);
			
			String os = System.getProperty("os.name").toLowerCase();			
			if (os.startsWith("mac")) {
				//manager.setDefaultDownloadDir("Please select a directory for downloading images.");
			}
			else manager.setDefaultDownloadDir(System.getProperty("user.home") + File.separator + "Desktop");
			manager.setVisible(true);

			if (frame != null)
				frame.setVisible(false);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	private List<String> connectAndReadFromURL(URL url, List<String> seriesList, String userId, String passWd) {
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
			// HttpConnectionParams.setConnectionTimeout(httpParams, 50000);
			// HttpConnectionParams.setSoTimeout(httpParams, new
			// Integer(12000));
			HttpConnectionParams.setConnectionTimeout(httpParams, 500000);
			HttpConnectionParams.setSoTimeout(httpParams, new Integer(720000));
			httpClient = new DefaultHttpClient(ccm, httpParams);
			httpClient.setRoutePlanner(new ProxySelectorRoutePlanner(schemeRegistry, ProxySelector.getDefault()));
			// // Additions by lrt for tcia -
			// // attempt to reduce errors going through a Coyote Point
			// Equalizer load balance switch
			// httpClient.getParams().setParameter("http.socket.timeout", new
			// Integer(12000));
			//httpClient.getParams().setParameter("http.socket.timeout", new Integer(120000));
			httpClient.getParams().setParameter("http.socket.timeout", new Integer(720000));
			httpClient.getParams().setParameter("http.socket.receivebuffer", new Integer(16384));
			httpClient.getParams().setParameter("http.tcp.nodelay", true);
			httpClient.getParams().setParameter("http.connection.stalecheck", false);
			// // end lrt additions

			HttpPost httpPostMethod = new HttpPost(url.toString());

			List<BasicNameValuePair> postParams = new ArrayList<BasicNameValuePair>();

			if (userId != null && passWd != null) {
				postParams.add(new BasicNameValuePair("userId", userId));
				httpPostMethod.addHeader("password", passWd);
			}
			postParams.add(new BasicNameValuePair("numberOfSeries", Integer.toString(seriesList.size())));
			int i = 0;
			for (String s : seriesList) {
				postParams.add(new BasicNameValuePair("series" + Integer.toString(++i), s));
			}

			UrlEncodedFormEntity query = new UrlEncodedFormEntity(postParams);
			httpPostMethod.setEntity(query);
			HttpResponse response = httpClient.execute(httpPostMethod);
			int responseCode = response.getStatusLine().getStatusCode();

			if (responseCode != HttpURLConnection.HTTP_OK) {
				returnStatus = responseCode;
//				System.out.println("error message="+StringUtils.substringBetween(EntityUtils.toString(response.getEntity()), "Insufficient privilege for ", "</h1>"));
//				
//				JEditorPane ed1 = new JEditorPane("text/html", EntityUtils.toString(response.getEntity()));
//				JFrame jf = new JFrame();
//				jf.add(ed1);
//				jf.setVisible(true);
//				jf.setSize(600,600);
//				jf.setDefaultCloseOperation(jf.EXIT_ON_CLOSE);
//System.out.println("error message="+(new BasicResponseHandler()).handleResponse(response));
//				BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
//				String body = "";
//				while ((body = rd.readLine()) != null) 
//				{
//				    System.out.println("HttpResponse body ="+body);
//				}


//System.out.println("!! error reason="+ EntityUtils.toString(response.getEntity()));	
////System.out.println("!! error contest="+ IOUtils.readLines(response.getEntity().getContent()).get(0));
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

	public void constructLoginWin() {
		try {
			UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		frame = new JFrame("Standalone Download Manager");
		frame.setResizable(false);

		if (true) {
			frame.setBounds(100, 100, 910, 528);
			frame.setContentPane(createloginPanelV2());
		} else {
			frame.setBounds(100, 100, 928, 690);
			frame.setContentPane(constructLoginPanel());
		}
		frame.setTitle(winTitle);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}

	public static void setDefaultSize(int size) {
		Set<Object> keySet = UIManager.getLookAndFeelDefaults().keySet();
		Object[] keys = keySet.toArray(new Object[keySet.size()]);

		for (Object key : keys) {
			if (key != null && key.toString().toLowerCase().contains("font")) {
				Font font = UIManager.getDefaults().getFont(key);
				if (font != null) {
					font = font.deriveFont((float) size);
					UIManager.put(key, font);
				}
			}
		}
	}

	private JPanel constructLoginPanel() {
		JPanel contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(36, 36, 36, 36));
		contentPane.setLayout(null);

		JPanel guestPanel = new JPanel();
		guestPanel.setBounds(38, 40, 825, 140);
		guestPanel.setBorder(new TitledBorder(new EtchedBorder(EtchedBorder.RAISED, new Color(153, 180, 209), null),
				"  For Guest  ", TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 120, 215)));
		contentPane.add(guestPanel);
		guestPanel.setLayout(null);

		JButton guestBtn = new JButton(GuestBtnLbl);
		guestBtn.setBounds(606, 50, 140, 36);
		guestBtn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				submitRequest(null, null);
			}
		});
		guestPanel.add(guestBtn);

		JLabel guestLbl = new JLabel("Log in as a guest to download public data only");
		guestLbl.setBounds(70, 50, 460, 42);
		guestPanel.add(guestLbl);

		JPanel loginUserPanel = new JPanel();
		loginUserPanel.setBounds(40, 258, 825, 306);
		contentPane.add(loginUserPanel);
		loginUserPanel
				.setBorder(new TitledBorder(new EtchedBorder(EtchedBorder.LOWERED, new Color(153, 180, 209), null),
						"  Login to Download Authorized Data  ", TitledBorder.CENTER, TitledBorder.TOP, null,
						new Color(0, 120, 215)));
		loginUserPanel.setLayout(null);

		JLabel lblNewLabel_1 = new JLabel("User Name");
		lblNewLabel_1.setBounds(70, 80, 118, 36);
		loginUserPanel.add(lblNewLabel_1);

		JButton submitBtn = new JButton(SubmitBtnLbl);
		submitBtn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				userId = userNameFld.getText();
				password = passwdFld.getText();
				if ((userId.length() < 1) || (password.length() < 1)) {
					statusLbl.setText("Please enter a valid user name and password.");
					statusLbl.setForeground(Color.red);
				} else {
					submitRequest(userId, password);
				}
			}
		});
		submitBtn.setBounds(606, 238, 140, 36);
		loginUserPanel.add(submitBtn);

		userNameFld = new JTextField();
		userNameFld.setBounds(200, 80, 333, 36);
		loginUserPanel.add(userNameFld);
		userNameFld.setColumns(10);

		JLabel lblPassword = new JLabel("Password");
		lblPassword.setBounds(70, 156, 118, 36);
		loginUserPanel.add(lblPassword);

		passwdFld = new JPasswordField();
		passwdFld.setBounds(200, 156, 333, 36);
		loginUserPanel.add(passwdFld);

		statusLbl = new JLabel("");
		statusLbl.setBounds(70, 226, 463, 36);
		loginUserPanel.add(statusLbl);

		JLabel lblOr = new JLabel("--- OR ---");
		lblOr.setBounds(419, 212, 81, 26);
		contentPane.add(lblOr);

		JLabel versionLabel = new JLabel("Release " + DownloaderProperties.getAppVersion() + " Build \""
				+ DownloaderProperties.getBuildTime() + "\"");
		versionLabel.setHorizontalAlignment(SwingConstants.CENTER);
		versionLabel.setForeground(new Color(70, 130, 180));
		versionLabel.setBounds(315, 584, 260, 20);
		contentPane.add(versionLabel);

		userNameFld.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				passwdFld.requestFocus();
			}
		});

		userNameFld.addFocusListener(new FocusListener() {

			@Override
			public void focusGained(FocusEvent e) {
				statusLbl.setText("");
			}

			@Override
			public void focusLost(FocusEvent e) {
			}
		});

		passwdFld.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				userId = userNameFld.getText();
				password = passwdFld.getText();
				if ((userId.length() < 1) || (password.length() < 1)) {
					statusLbl.setText("Please enter a valid user name and password.");
					statusLbl.setForeground(Color.red);
				} else
					submitRequest(userId, password);
			}
		});

		passwdFld.addFocusListener(new FocusListener() {

			@Override
			public void focusGained(FocusEvent e) {
				statusLbl.setText("");
			}

			@Override
			public void focusLost(FocusEvent e) {
			}
		});

		return contentPane;
	}

	/**
	 * Create the panel.
	 */
	private JPanel createloginPanelV2() {
		JPanel contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(36, 36, 36, 36));
		contentPane.setLayout(null);

		JPanel loginUserPanel = new JPanel();
		loginUserPanel.setBounds(40, 91, 825, 306);
		contentPane.add(loginUserPanel);
		loginUserPanel
				.setBorder(new TitledBorder(new EtchedBorder(EtchedBorder.LOWERED, new Color(153, 180, 209), null), "",
						TitledBorder.CENTER, TitledBorder.TOP, null, new Color(0, 120, 215)));
		loginUserPanel.setLayout(null);

		JLabel lblNewLabel_1 = new JLabel("User Name");
		lblNewLabel_1.setBounds(70, 80, 118, 36);
		loginUserPanel.add(lblNewLabel_1);

		JButton submitBtn = new JButton(SubmitBtnLbl);
		submitBtn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				userId = userNameFld.getText();
				password = passwdFld.getText();
				if ((userId.length() < 1) || (password.length() < 1)) {
					setStatus(statusLbl, "Please enter a valid user name and password.", Color.red);
				} else {
					setStatus(statusLbl, "Checking your access permission...", Color.blue);
					SwingUtilities.invokeLater(new Runnable() {
						@Override
						public void run() {
							submitRequest(userId, password);
						}
					});
				}
			}
		});
		submitBtn.setBounds(606, 238, 140, 36);
		loginUserPanel.add(submitBtn);

		userNameFld = new JTextField();
		userNameFld.setBounds(200, 80, 333, 36);
		loginUserPanel.add(userNameFld);
		userNameFld.setColumns(10);

		JLabel lblPassword = new JLabel("Password");
		lblPassword.setBounds(70, 156, 118, 36);
		loginUserPanel.add(lblPassword);

		passwdFld = new JPasswordField();
		passwdFld.setBounds(200, 156, 333, 36);
		loginUserPanel.add(passwdFld);

		statusLbl = new JLabel("");
		statusLbl.setBounds(70, 226, 524, 36);
		statusLbl.setFont(new Font("SansSerif", Font.PLAIN, 13));
		statusLbl.setVerticalAlignment(SwingConstants.BOTTOM);
		loginUserPanel.add(statusLbl);

		JLabel versionLabel = new JLabel("Release " + DownloaderProperties.getAppVersion() + " Build \""
				+ DownloaderProperties.getBuildTime() + "\"");
		versionLabel.setHorizontalAlignment(SwingConstants.CENTER);
		versionLabel.setForeground(new Color(70, 130, 180));
		versionLabel.setBounds(318, 427, 266, 20);
		contentPane.add(versionLabel);

		JLabel infoLbl = new JLabel(
				"This download contains restricted data. Log in or contact the help desk for access.");
		infoLbl.setForeground(new Color(105, 105, 105));
		infoLbl.setFont(new Font("SansSerif", Font.BOLD, 13));
		infoLbl.setBounds(40, 34, 796, 42);
		contentPane.add(infoLbl);
		
		JLabel helpDeskLbl;

		helpDeskLbl = new JLabel();
		ImageIcon image = new ImageIcon(this.getClass().getClassLoader().getResource("info.png"));
		helpDeskLbl = new JLabel(image);		
		helpDeskLbl.setToolTipText("Click to get phone number/email address of the Help Desk.");
		helpDeskLbl.setBounds(826, 20, 36, 36);
		contentPane.add(helpDeskLbl);

		helpDeskLbl.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseClicked(MouseEvent e) {
				BrowserLauncher.openUrlForHelpDesk();
			}

		});

		userNameFld.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				passwdFld.requestFocus();
			}
		});

		userNameFld.addFocusListener(new FocusListener() {

			@Override
			public void focusGained(FocusEvent e) {
				statusLbl.setText("");
			}

			@Override
			public void focusLost(FocusEvent e) {
			}
		});

		passwdFld.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				userId = userNameFld.getText();
				password = passwdFld.getText();
				if ((userId.length() < 1) || (password.length() < 1)) {
					setStatus(statusLbl, "Please enter a valid user name and password.", Color.red);
				} else {
					setStatus(statusLbl, "Checking your access permission...", Color.blue);
					SwingUtilities.invokeLater(new Runnable() {
						@Override
						public void run() {
							submitRequest(userId, password);
						}
					});
				}
			}
		});

		passwdFld.addFocusListener(new FocusListener() {

			@Override
			public void focusGained(FocusEvent e) {
				statusLbl.setText("");
			}

			@Override
			public void focusLost(FocusEvent e) {
			}
		});

		return contentPane;
	}

	private void setStatus(JLabel statusLbl, String msg, Color c) {
		statusLbl.setText(msg);
		statusLbl.setForeground(c);
	}

	private void submitRequest(String userId, String password) {
		Cursor waitCursor = new Cursor(Cursor.WAIT_CURSOR);
		Cursor defaultCursor = new Cursor(Cursor.DEFAULT_CURSOR);
		frame.setCursor(waitCursor);
		submitUserCredential(userId, password);
		frame.setCursor(defaultCursor);
	}
}