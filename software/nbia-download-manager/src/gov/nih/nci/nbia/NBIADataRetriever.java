package gov.nih.nci.nbia;

import javax.net.ssl.HttpsURLConnection;
import javax.swing.JDialog;
import javax.swing.JEditorPane;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import com.apple.eawt.AppEvent;
import com.apple.eawt.Application;

import java.io.BufferedReader;
import java.io.DataOutputStream;

import gov.nih.nci.nbia.util.BrowserLauncher;

import java.awt.Font;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import javax.swing.SwingUtilities;
import javax.swing.event.HyperlinkEvent;
import javax.swing.event.HyperlinkListener;

import org.apache.commons.io.IOUtils;
import java.net.*;
import java.nio.charset.StandardCharsets;

/**
 * @author Q. Pan
 *
 */
//Below code is for 3.45
//public class NBIADataRetriever extends StandaloneDMDispatcher {
//	static boolean clickedOnFile = false;
//
//	public static void main(String[] args) {
//		SwingUtilities.invokeLater(() -> {
//			StandaloneDMDispatcher app = new StandaloneDMDispatcher();
//			
//			Application.getApplication().setOpenFileHandler((AppEvent.OpenFilesEvent ofe) -> {
//				clickedOnFile = true;
//				List<File> files = ofe.getFiles();
//				if (files != null && files.size() > 0) {
//					try {
//						app.loadManifestFile(files.get(0).getAbsolutePath());
//						app.launch();
////						if (jop.isVisible()) {
////							jop.setVisible(false);
////						}							
//					} catch (Exception e) {
//						StandaloneDMDispatcher.printStackTraceToDialog("NBIADataRetriever-line 43:\n", e);
////						JOptionPane.showMessageDialog(null, StandaloneDMDispatcher.launchMsg);
////						e.printStackTrace();
//					}
//				} else {
//					JOptionPane.showMessageDialog(null,
//							"It should never reach here! Mac OS is not sending the correct signal.");
//				}
//			});
//			try {
//				JOptionPane.showMessageDialog(null,
//						"Reading your manifest file...");
//				Thread.sleep(6000);
//			} catch (InterruptedException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			if (args.length > 0) {
//				File f = new File(args[0]);
//
//				if (f.exists() && f.isFile()) {
//					app.loadManifestFile(args[0]);
//					app.launch();
//				}
//			} else if (!clickedOnFile) {
//				reportNoManifastFile("");
//			}
//		});
//	}
//
//	static void reportNoManifastFile(String place) {
//		JLabel label = new JLabel();
//		Font font = label.getFont();
//		// create some css from the label's font
//		StringBuffer style = new StringBuffer("font-family:" + font.getFamily() + ";");
//		style.append("font-weight:" + (font.isBold() ? "bold" : "normal") + ";");
//		style.append("font-size:" + font.getSize() + "pt;");
//
//		// html content
//		JEditorPane ep = new JEditorPane("text/html", "<html><body style=\"" + style + "\">" //
//				+ place + StandaloneDMDispatcher.launchMsg + "<a href=\"" + StandaloneDMDispatcher.youTubeLink
//				+ "\">video tutorial</a>." //
//				+ "</body></html>");
//
//		// handle link events
//		ep.addHyperlinkListener(new HyperlinkListener() {
//			@Override
//			public void hyperlinkUpdate(HyperlinkEvent e) {
//				if (e.getEventType().equals(HyperlinkEvent.EventType.ACTIVATED))
//					BrowserLauncher.openUrl(e.getURL().toString());
//			}
//		});
//		ep.setEditable(false);
//		ep.setBackground(label.getBackground());
//
//		// show
//		JOptionPane.showMessageDialog(null, ep);
//	}
//Below code belongs to 3.44 
public class NBIADataRetriever extends StandaloneDMDispatcher {
	private static List<File> files = null;
	static {
		Application.getApplication().setOpenFileHandler((AppEvent.OpenFilesEvent ofe) -> {
			files = ofe.getFiles();
		});
	};

	private static boolean hasFile = false;

	public static void main(String[] args) {
		Runnable r = new Runnable() {
			public void run() {

				try {
					if ((args != null) && (args.length > 0)) {
						hasFile = true;
						fromCommandLine(args);
					} else {
						if ((files != null) && (files.size() > 0)) {
							hasFile = true;
							if (files.get(0).getAbsolutePath().endsWith("testEnvConfig.tcia")) {
								if (!testConnection()) {
									JOptionPane.showMessageDialog(null,
											"Connection test failed. Please check your communication settings");
								}
								else {
									JOptionPane.showMessageDialog(null,
											"Connection test passed.");
								}
							} else {

								startAfterGetFiles(files);
							}
						}
					}
				} catch (Exception e) {
					StandaloneDMDispatcher.printStackTraceToDialog("Inside runnable:", e);
				} finally {
					if (!hasFile) {
						reportNoManifastFile("");
					}
				}
			}
		};
		SwingUtilities.invokeLater(r);
	}

	static void startAfterGetFiles(List<File> files) {
		StandaloneDMDispatcher app = new StandaloneDMDispatcher();
		try {
			app.loadManifestFile(files.get(0).getAbsolutePath());
			app.launch();
		} catch (Exception e) {
			String note = "Exception from clicking the manifest\n";
			app.printStackTraceToDialog(note, e);
		}
	}

	static void fromCommandLine(String[] args) {
		StandaloneDMDispatcher app = new StandaloneDMDispatcher();
		try {
			File f = new File(args[0]);

			if (f.exists() && f.isFile() && f.canRead()) {
				app.loadManifestFile(args[0]);
				app.launch();
			}
		} catch (Exception e) {
			String note = "Exception from getting manifest file from command line\n";
			app.printStackTraceToDialog(note, e);
		}
	}

	static void reportNoManifastFile(String place) {
		JLabel label = new JLabel();
		Font font = label.getFont();
		// create some css from the label's font
		StringBuffer style = new StringBuffer("font-family:" + font.getFamily() + ";");
		style.append("font-weight:" + (font.isBold() ? "bold" : "normal") + ";");
		style.append("font-size:" + font.getSize() + "pt;");

		// html content
		JEditorPane ep = new JEditorPane("text/html", "<html><body style=\"" + style + "\">" //
				+ place + StandaloneDMDispatcher.launchMsg + "<a href=\"" + StandaloneDMDispatcher.youTubeLink
				+ "\">video tutorial</a>." //
				+ "</body></html>");

		// handle link events
		ep.addHyperlinkListener(new HyperlinkListener() {
			@Override
			public void hyperlinkUpdate(HyperlinkEvent e) {
				if (e.getEventType().equals(HyperlinkEvent.EventType.ACTIVATED))
					BrowserLauncher.openUrl(e.getURL().toString());
			}
		});
		ep.setEditable(false);
		ep.setBackground(label.getBackground());

		// show
		JOptionPane.showMessageDialog(null, ep);
	}

	static boolean testConnection() {
		URL url = null;
		int connectionTimeout = 0;
		int readTimeout = 0;
		int statusCode = 0;
		// String urlString = "http://www.google.com/humans.txt";
		String urlString = "https://selfsolve.apple.com/wcResults.do";
		String urlParameters = "sn=C02G8416DRJM&cn=&locale=&caller=&num=12345";
		final String USER_AGENT = "Mozilla/5.0";

		try {
			url = new URL(urlString);
		} catch (MalformedURLException e1) {
			// TODO Auto-generated catch block
			printStackTraceToDialog("MalformedURLException: url is " + urlString + ". Strack trace is below\n", e1);
			e1.printStackTrace();
		}
		HttpURLConnection http = null;
		try {
			http = (HttpURLConnection) url.openConnection();
			http.setRequestMethod("POST");
			http.setDoOutput(true);
			http.setRequestProperty("User-Agent", USER_AGENT);
			http.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
			http.setUseCaches(false);
			connectionTimeout = http.getConnectTimeout();
			readTimeout = http.getReadTimeout();
		} catch (IOException e2) {
			// TODO Auto-generated catch block
			printStackTraceToDialog("IOExceptio on openConnection(): url is " + urlString + "\nconnectionTimeout="
					+ connectionTimeout + ";readTimeout=" + readTimeout + "\nStrack trace is below\n", e2);
			e2.printStackTrace();
		}
		DataOutputStream wr;
		try {
			wr = new DataOutputStream(http.getOutputStream());
			wr.writeBytes(urlParameters);
			wr.flush();
			wr.close();
		} catch (IOException e3) {
			printStackTraceToDialog(
					"IOExceptio on sending out request: url is " + urlString + "\nconnectionTimeout="
							+ connectionTimeout + ";readTimeout=" + readTimeout + "\n" + " Strack trace is below\n",
					e3);
			// TODO Auto-generated catch block
			e3.printStackTrace();
		}
		try {
			statusCode = http.getResponseCode();
			// printStackTraceToDialog("Succeed on get response from url is "+urlString +
			// "\nconnectionTimeout="+connectionTimeout + ";readTimeout=" +readTimeout
			// + "\nstatus code ="+ statusCode +" Response=\n" + http.getResponseMessage(),
			// null);
			if (statusCode == HttpsURLConnection.HTTP_OK) {
				// BufferedReader in = new BufferedReader(
				// new InputStreamReader(http.getInputStream()));
				// String inputLine;
				// StringBuffer response = new StringBuffer();
				//
				// while ((inputLine = in.readLine()) != null) {
				// response.append(inputLine);
				// }
				// in.close();
				//
				// printStackTraceToDialog("Succeed on get response from url is "+urlString +
				// "\nconnectionTimeout="+connectionTimeout + ";readTimeout=" +readTimeout
				// + "\nstatus code ="+ statusCode +" Response=\n" + response.toString(), null);
				return true;
			}
		} catch (IOException e4) {
			// TODO Auto-generated catch block
			printStackTraceToDialog("IOExceptio on get response: url is " + urlString + "\nconnectionTimeout="
					+ connectionTimeout + ";readTimeout=" + readTimeout + "\nstatus code =" + statusCode
					+ " Strack trace is below\n", e4);
			e4.printStackTrace();
		}
		if (http != null) {
			http.disconnect();
		}
		return false;
	}
}
