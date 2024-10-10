package gov.nih.nci.nbia.cli;
/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

import java.io.BufferedInputStream;

/**
 * @author Q.Pan
 *
 */

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringReader;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Scanner;
import java.util.Set;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.util.logging.ConsoleHandler;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Level;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.swing.JOptionPane;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.compress.utils.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import org.json.simple.parser.JSONParser;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import gov.nih.nci.nbia.cli.oauthClient.OAuth2Details;
import gov.nih.nci.nbia.cli.oauthClient.OAuthConstants;
import gov.nih.nci.nbia.cli.oauthClient.OAuthUtils;
import gov.nih.nci.nbia.download.LocalSeriesDownloader;
import gov.nih.nci.nbia.ui.DownloadsTableModel;
import gov.nih.nci.nbia.util.MD5Validator;

/**
 * @author Q. Pan
 *
 */
public class DataRetrieverCLI {
	private String serverUrl;
	private String pubApiUrl;
	private String bothApiUrl;
	protected String manifestVersion = null;
	protected String os = null;
	protected String includeAnnotation = null;

	private List<String> seriesList = null;
	private String dataType = null;
	private String rootDir = null; // directory with manifest file name

	static Map<String, String> sopClassNameMap = new HashMap<String, String>();
	//private String license_text = "<html><head><title>License Information</title></head><body><br/><p>The {0} collection is distributed under the {1} (<a href={2}>{2}</a>). </p><p>By downloading the data, you agree to abide by terms of this license.</p></body></html>";
	private String license_text = "License\n\nThe {0} collection is distributed under the {1} ({2}). \nBy downloading the data, you agree to abide by terms of this license.\n";
	public String directoryType = "Descriptive";
	private String refreshToken = null;
	public boolean verbose = false;
	public boolean quiet = false;
	public boolean force = false;
	public boolean md5Verify = false;
		
	public final java.util.logging.Logger logger = Logger.getGlobal();
	private String setProperty;
	private String duaText = null;
	public boolean skipLicense = false;
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String fileName = null;
		String userName = null;
		String passWord = null;
		String downloadDir = null; // The directory that the user want to put the downloaded data
//		BasicConfigurator.configure();
		DataRetrieverCLI dr = new DataRetrieverCLI();
		dr.skipLicense = false;

		if (args != null && (args.length > 0)) {
			for (int i = 0; i < args.length; ++i) {
				if (args[i].equals("-c") || args[i].equals("-C") || args[i].equals("--cli") || args[i].equals("--CLI"))
					fileName = args[i + 1];
				if (args[i].toLowerCase().equals("--agree-to-license")) 
					dr.skipLicense = true;
				if (args[i].equals("-u") || args[i].equals("-U"))
					userName = args[i + 1];
				if (args[i].equals("-p") || args[i].equals("-P"))
					passWord = args[i + 1];
				if (args[i].equals("-d") || args[i].equals("-D")) {
					downloadDir = args[i + 1];
				}
				if (args[i].equals("-l") || args[i].equals("-L")) {
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
				if (args[i].equals("-m") || args[i].equals("-M") || args[i].equals("--md5")
						|| args[i].equals("--MD5")) {
					dr.md5Verify = true;
				}
				if (args[i].equalsIgnoreCase("--dd") || args[i].equalsIgnoreCase("-dd")) {
					dr.directoryType = "Descriptive";
				}				
				if (args[i].equalsIgnoreCase("--cd") || args[i].equalsIgnoreCase("-cd")) {
					dr.directoryType = "Classic";
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
		} else {
			System.out.println("Please provide a manifest file name");

		}

	}

	public DataRetrieverCLI() {
//		os = System.getProperty("os.name").toLowerCase();
		// appVersion = DownloaderProperties.getAppVersion();
		org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.OFF);
	}

	public void configLogger(String downloadHome) {
		Handler consoleHandler = null;
		Handler fileHandler = null;

        if (downloadHome == null)
        	downloadHome = System.getProperty("user.home")+ File.separator+ "Downloads" + File.separator;
        else if (!(downloadHome.endsWith(File.separator)))
        	downloadHome = downloadHome + File.separator;
        
        File directory = new File(downloadHome);
        if (! directory.exists()){
            directory.mkdirs();
        }
        		
 //       System.out.println("home path="+ downloadHome);
		
		
		setProperty = System.setProperty("java.util.logging.SimpleFormatter.format",
				"%1$tY-%1$tm-%1$td %1$tH:%1$tM:%1$tS: %4$s: %5$s%n%6$s%n");

		try {
			logger.setLevel(Level.ALL);
			// Creating consoleHandler and fileHandler
			consoleHandler = new ConsoleHandler();

			String fileName = downloadHome + "NBIADataRetrieverCLI-" + new SimpleDateFormat("yyyymmddhhmmss'.log'").format(new Date()); 
			fileHandler = new FileHandler(fileName);

			// Assigning handlers to LOGGER object

			SimpleFormatter formatter = new SimpleFormatter();
			fileHandler.setFormatter(formatter);

			fileHandler.setLevel(Level.INFO);
			// Setting levels to handlers and LOGGER
			if (quiet) {
				consoleHandler.setLevel(Level.SEVERE);
			} else {
				consoleHandler.setLevel(Level.INFO);
			}

			if (verbose) {
				consoleHandler.setLevel(Level.FINE);
				fileHandler.setLevel(Level.FINE);
			}
			
			logger.addHandler(consoleHandler);
			logger.addHandler(fileHandler);
			logger.setUseParentHandlers(false);
			
			if (!quiet) {
				System.out.println("The download log can be found at "+ fileName);
			}			

		} catch (IOException exception) {
			logger.severe("Error occur in FileHandler:"+ exception);
		}
	}

	private boolean validateAccess(List<String> seriesList, String userName) {
		List<String> seriesInfo = new ArrayList();
		int index = 0;
		int count = 0;
		int maxInGroup = 15;

		int seriesSize = seriesList.size();

		do {
			List<String> seriesSubgroup = null;
			++count;
			int last = (maxInGroup * count) >= seriesSize ? seriesSize : (maxInGroup * count);

			seriesSubgroup = seriesList.subList(index, last);

			index = maxInGroup * count;
			try {
				List<String> nextGroup = getDeniedList(seriesSubgroup, userName);
				if (nextGroup != null) {
					seriesInfo.addAll(nextGroup);
				}
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		} while (index < seriesSize);
		
		if (!seriesInfo.isEmpty()) {
			if (this.verbose) {
				for (String id : seriesInfo) {
					logger.info("Not authorized to download series: " + id);
				}
			}
			if (seriesInfo.size() == seriesList.size()) {
				logger.severe(
						"You do not have access to all series in the manifest file.  Please contact the helpdesk for the access permission.");
				System.exit(2);
			} else if (!this.force) {
				logger.severe(
						"You do not have access to some series in the manifest file.  Please contact the helpdesk for the access permission.");
				logger.severe(
						"If you wish to download those series you have access, please add -f option to command line.");
				System.exit(2);
			} else if (this.force)
				return false;
		}

		return true;
	}

	private List<String> getDeniedList(List<String> seriesList, String userName) {
		try {
			URL urlForGetRequest;
			StringBuffer url = new StringBuffer(
					pubApiUrl + "getDeniedSeries?userName=" + userName + "&format=csv&seriesList=");

			for (String id : seriesList) {
				url = url.append(id);
				url.append(",");
			}
			String urlStr = url.toString();
			//System.out.println("url="+urlStr.substring(0, urlStr.length() - 1));			
			urlForGetRequest = new URL(urlStr.substring(0, urlStr.length() - 1));
			HttpURLConnection connection = (HttpURLConnection) urlForGetRequest.openConnection();
			connection.setRequestMethod("GET");
			connection.setRequestProperty("Accept", "text/csv");

			int code = connection.getResponseCode();
			logger.fine("connecting server: " + connection.getURL().toString());
			if (code == 204) {
				return null;
			} else if (code != 200) {
				throw new RuntimeException("Failed to validate the access permission: HTTP Error code : " + code);
			}

			InputStreamReader in = new InputStreamReader(connection.getInputStream());
			BufferedReader br = new BufferedReader(in);
			List<String> deniedList = new ArrayList();
			String output;
			boolean firstLine = true;
			while ((output = br.readLine()) != null) {
				if (firstLine)
					firstLine = false;
				else {
				logger.info("denied access:" + output);
				deniedList.add(output);
				}
			}
			connection.disconnect();
			if (deniedList.size() >= 1) {
				return deniedList;
			}

		} catch (Exception e) {
			logger.severe("Failed to verify the access permission: " + e);
		}
		return null;
	}

	public boolean getLoginCredential(String filePath) {
		FileInputStream loginFile;
		try {
			loginFile = new FileInputStream(filePath);
			Properties p = new Properties(System.getProperties());
			p.load(loginFile);
			// set the system properties
			System.setProperties(p);
			loginFile.close();
			return true;

		} catch (FileNotFoundException e) {
			logger.severe("Error in loading login file: " + filePath + "--FileNotFoundException:\n");
			e.printStackTrace();
			System.exit(1);
		} catch (IOException e) {
			logger.severe("Error in loading login file: " + filePath + " --IOException:\n");
			e.printStackTrace();
			System.exit(1);
		}
		return false;
	}

	public void performDownload(String downloadDir, String fileName, String userName, String passWord) {
		String accessToken = null;
		boolean hasPermission = false;

		if ((fileName != null) && fileName.endsWith(".tcia")) {
//			DataRetriever cmdDR = new DataRetriever();
			loadManifestFile(fileName);

			if (!skipLicense) {
				String text = getUserAgreementTxt();			
				if (text != null && !text.isEmpty()) {
					retrieveUsersAns(text);
				}
			}
			
			
			if (dataType.equals("DICOM")) {
				if (userName == null || passWord == null) {
					logger.info("As user name and/or password are not provided, only public data is downloaded.");
				} else
					accessToken = getAccessToken(userName, passWord);
				
				if (downloadDir == null)
					downloadDir = System.getenv("PWD");

				List <String> existSeriesList = scanDataDir(downloadDir, fileName);
				if (existSeriesList != null) {
					seriesList.removeAll(existSeriesList);
				}
				
				if (seriesList.size() == 0) {
					System.out.println("All series are downloaded");	
					System.exit(0);
				}
				else
					hasPermission = validateAccess(seriesList, userName);
			} else {
				hasPermission = true; // not checking permission for none DICOM data at this point
			}

			if (hasPermission || force) {
				loadSOPClassDefinition();
				if (downloadDir == null)
					downloadDir = System.getenv("PWD");
				rootDir = downloadDir + File.separator
						+ fileName.substring(fileName.lastIndexOf(File.separator) + 1, fileName.indexOf("."));
				logger.info("Downloaded files will be put to " + rootDir);
				downloadData(directoryType, accessToken);
			}

//			//test
//			OAuthUtils oauthUtil = new OAuthUtils();
////			Properties config = OAuthUtils.getClientConfigProps(OAuthConstants.CONFIG_FILE_PATH);
//			Properties config = oauthUtil.getClientConfigProps(OAuthConstants.CONFIG_FILE_PATH);
//
//			// Generate the OAuthDetails bean from the config properties file
//			OAuth2Details oauthDetails = oauthUtil.createOAuthDetails(config);
//			oauthDetails.setAuthenticationServerUrl(serverUrl.replaceFirst("nbia-download/servlet/DownloadServlet", "nbia-api/oauth/token"));
//			System.out.println("get renewed access token ="+ oauthUtil.refreshAccessToken(oauthDetails,  refreshToken));
//			System.out.println("get renewed access token =" + renewAccessToken());
//			//test

		} else
			logger.severe("Not finding a manifest file which has extension \".tcia\"");
	}

	public void loadManifestFile(String fileName) {
		FileInputStream propFile;
		try {
			propFile = new FileInputStream(fileName);
			Properties p = new Properties(System.getProperties());
			p.load(propFile);
			// set the system properties
			System.setProperties(p);
			propFile.close();
			this.serverUrl = System.getProperty("downloadServerUrl");
			manifestVersion = System.getProperty("manifestVersion");
			includeAnnotation = System.getProperty("includeAnnotation");
			dataType = System.getProperty("dataType");
			if (dataType == null)
				dataType = "DICOM";
			logger.info("The type of data downloading is " + dataType);
			// checkManifestVersion(manifestVersion);
			if (manifestVersion.startsWith("3.")) {
				seriesList = getSeriesList(fileName);
			}
			pubApiUrl = serverUrl.replaceFirst("nbia-download/servlet/DownloadServlet", "nbia-api/services/v1/");
			bothApiUrl = serverUrl.replaceFirst("nbia-download/servlet/DownloadServlet", "nbia-api/services/v2/");

		} catch (FileNotFoundException e) {
			String note = "Error in loading manifest file--FileNotFoundException:\n";
			logger.severe(note);
			e.printStackTrace();
		} catch (IOException e) {
			String note = "Error in loading manifest file--IOException:\n";
			logger.severe(note);
			e.printStackTrace();
		}
	}

	void downloadData(String directoryType, String accessToken) {
		for (String seriesUid : seriesList) {

			logger.info("Downloading series: " + (String) seriesUid + " ... ");
			String filePath = null;
			if (dataType.equalsIgnoreCase("DICOM")) {
				try {
					String[] metaData = getMetaData(seriesUid, accessToken);
					if (metaData != null) {
						filePath = constrcutFilePath(metaData, directoryType);
						createLicenseFile(rootDir, metaData[1], metaData[16], metaData[17]);
						downloadSingleSeries(seriesUid, filePath, accessToken);
						writeToMetaData(metaData, filePath);
					}
					else {
						logger.info("Not able to get metadata for series: " + seriesUid + ".  Move on to the next series");
					}
				} catch (RuntimeException re) {
					if ((accessToken != null) && (re.getMessage().startsWith("Invalid or expired token"))) {
						accessToken = renewAccessToken();
						String[] metaData = getMetaData(seriesUid, accessToken);
						filePath = constrcutFilePath(metaData, directoryType);
						createLicenseFile(rootDir, metaData[1], metaData[16], metaData[17]);
						int status = downloadSingleSeries(seriesUid, filePath, accessToken);
						writeToMetaData(metaData, filePath);

						if (status != 200) {
							// it is not a issue of accessToken
							logger.info("Error in downloading series: " + seriesUid + ". Receiveing status code " + status);
						}
					} else
						logger.info(
								"Error in downloading series: " + seriesUid + ". Error message is: " + re.getMessage());
				}
			} else
				downloadSingleSeries(seriesUid, seriesUid, null);
			logger.info("Complete series " + seriesUid);
		}
		logger.info("Download complete.");
	}

	private String getAccessToken(String userName, String passWord) {
		logger.fine("Getting Access token");
		OAuthUtils oauthUtil = new OAuthUtils(logger);
		Properties config = oauthUtil.getClientConfigProps(OAuthConstants.CONFIG_FILE_PATH);

		// Generate the OAuthDetails bean from the config properties file
		OAuth2Details oauthDetails = oauthUtil.createOAuthDetails(config);
		oauthDetails.setUsername(userName);
		oauthDetails.setPassword(passWord);
		oauthDetails.setAuthenticationServerUrl(
				serverUrl.replaceFirst("nbia-download/servlet/DownloadServlet", "nbia-api/oauth/token"));

		String accessToken = null;

		if (oauthDetails.isAccessTokenRequest()) {
			// Generate new Access token
//			accessToken = OAuthUtils.getAccessToken(oauthDetails);
//


			Map<String, String> map = oauthUtil.getAccessToken(oauthDetails);
			refreshToken = map.get(OAuthConstants.REFRESH_TOKEN);


			accessToken = map.get(OAuthConstants.ACCESS_TOKEN);
//			System.out.println("accessToken=" + accessToken);
			if (OAuthUtils.isValid(accessToken)) {
				logger.fine(
						"Successfully generated Access token for client_credentials grant_type: " + accessToken);
			} else {
				logger.fine("Could not generate Access token for client_credentials grant_type="
						+ oauthDetails.getGrantType() + " server url=" + oauthDetails.getAuthenticationServerUrl()
						+ " client_id=" + oauthDetails.getClientId() + " client-secret="
						+ oauthDetails.getClientSecret());
			}
		}
		return accessToken;
	}

	private String renewAccessToken() {
		String newToken = null;
		OAuthUtils oauthUtil = new OAuthUtils(logger);
		Properties config = oauthUtil.getClientConfigProps(OAuthConstants.CONFIG_FILE_PATH);

		// Generate the OAuthDetails bean from the config properties file
		OAuth2Details oauthDetails = oauthUtil.createOAuthDetails(config);
		oauthDetails.setAuthenticationServerUrl(
				serverUrl.replaceFirst("nbia-download/servlet/DownloadServlet", "nbia-api/oauth/token/"));
		newToken = oauthUtil.refreshAccessToken(oauthDetails, refreshToken);
		logger.fine("get renewed access token =" + newToken);
		return newToken;
	}


	int downloadSingleSeries(String seriesUid, String filePath, String accessToken) {
		URL urlForGetRequest;
		String url = null;
		int code = 0;
		try {
			if (accessToken != null) {
				url = bothApiUrl + "getDCMImage?SeriesInstanceUID=" + seriesUid + "&IncludeAnnotation="
						+ includeAnnotation + "&MD5Verification="+ md5Verify;
			} else {
				if (dataType != null && dataType.equalsIgnoreCase("other")) {
					url = pubApiUrl + "getImageOther?SeriesInstanceUID=" + seriesUid;
				} else
					url = pubApiUrl + "getDCMImage?SeriesInstanceUID=" + seriesUid + "&IncludeAnnotation="
							+ includeAnnotation + "&MD5Verification="+ md5Verify;
			}

			urlForGetRequest = new URL(url);

			HttpURLConnection connection = (HttpURLConnection) urlForGetRequest.openConnection();
			connection.setRequestMethod("GET");
			if (accessToken != null) {
				String authString = "Bearer " + accessToken;
				connection.setRequestProperty("Authorization", authString);
			}
			// conection.setRequestProperty("SeriesInstanceUID", seriesUid);

			logger.fine("downloading url=" + connection.getURL().toString());

			code = connection.getResponseCode();
			logger.fine("status= " + code);
			// System.out.println("url=" + connection.getURL().toString());
			if (code != 200) {
				if (code == 401 || code == 403) {
					// Access token is invalid or expired.Regenerate the access token
					logger.fine("Access token is invalid or expired. Regenerating access token....");
					throw new RuntimeException(
							"Invalid or expired token. HTTP error code: " + connection.getResponseCode());
				} else
					throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
			} else if (code == 200) {
				InputStream is = connection.getInputStream();
				BufferedInputStream bis = new BufferedInputStream(is);
				ZipInputStream zis = new ZipInputStream(bis);

				unzip(zis, filePath);
				is.close();
				bis.close();
				if (md5Verify) {
					String validateResult = MD5Validator.verifyCheckSum(rootDir + filePath);
					if (validateResult.length()==0) {
						logger.info("MD5 hashs of all DICOM files for series " + seriesUid + " match with the records in database");
					}
					else logger.severe(validateResult);
				}
			}

		} catch (IOException e) {

			e.printStackTrace();
		}
		return code;
	}

	String[] getMetaData(String seriesUid, String accessToken) {
		URL urlForGetRequest;
		String url = null;
		String[] metaData = null;
		try {

			if (accessToken == null)
				url = pubApiUrl + "getSeriesMetaData";
			else
				url = bothApiUrl + "getSeriesMetaData";

			urlForGetRequest = new URL(url + "?SeriesInstanceUID=" + seriesUid + "&format=csv");

			HttpURLConnection connection = (HttpURLConnection) urlForGetRequest.openConnection();
			connection.setRequestMethod("GET");
			connection.setRequestProperty("Accept", "text/csv");
			if (accessToken != null) {
				String authString = "Bearer " + accessToken;
				connection.setRequestProperty("Authorization", authString);
			}
			int code = connection.getResponseCode();
			logger.fine("Get metadata... url=" + connection.getURL().toString());
			if (code != 200) {
				connection.disconnect();
				if (code == 401 || code == 403) {
					// Access token is invalid or expired.Regenerate the access token
					logger.fine("Access token is invalid or expired. Regenerating access token....");
					throw new RuntimeException(
							"Invalid or expired token. HTTP error code: " + connection.getResponseCode());
				}
				else if(code == 204) {
					logger.info("The metadata for series "+ seriesUid +" cannot be accessed.");
					return null;
				}
				else {
					throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
				}
			}
			

			BufferedReader br = new BufferedReader(new InputStreamReader((connection.getInputStream())));
			String output = br.readLine(); // header
			output = br.readLine(); // data

			if (output != null) {
    				List<String> metaDataList = new ArrayList<>();
    				Pattern pattern = Pattern.compile("\"([^\"]*)\"|(?<=,|^)([^,]*)(?=,|$)");
    				Matcher matcher = pattern.matcher(output);
    				
    				while (matcher.find()) {
    				    if (matcher.group(1) != null) {
    				        metaDataList.add(matcher.group(1));
    				    } else {
    				        metaDataList.add(matcher.group(2));
    				    }
    				}
    				
    				// Convert the List to a String array
    				metaData = metaDataList.toArray(new String[0]);

				//metaData = output.split(",");
			} else
				logger.severe(
						"Error in getting map for SOPClassName. Ask Admin to check if the server has the property file in place.");

			connection.disconnect();

		} catch (MalformedURLException e) {

			e.printStackTrace();

		} catch (IOException e) {
			e.printStackTrace();
		}

		return metaData;
	}

	private void writeToMetaData(String[] metaData, String filePath) {
		String fileName = rootDir + File.separator + "metadata.csv";

		String totalFileSize;
		filePath = "." + filePath;

		if (includeAnnotation.equalsIgnoreCase("true")) {
			long total = Long.valueOf(metaData[13]) + Long.valueOf(metaData[18]);
			totalFileSize = bytesIntoHumanReadable(new Long(total));
		} else
			totalFileSize = bytesIntoHumanReadable(Long.valueOf(metaData[13]));

		String newLine = metaData[0] + "," + metaData[1] + "," + metaData[2] + "," + metaData[3] + "," + metaData[4]
				+ "," + metaData[5] + "," + metaData[6] + "," + metaData[7] + "," + metaData[8] + "," + metaData[9]
				+ "," + metaData[10] + "," + sopClassNameMap.get(metaData[11]) + "," + metaData[11] + "," + metaData[12]
				+ "," + totalFileSize + "," + filePath + ","
				+ (LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

		File file = new File(fileName);
		if (!file.exists()) {
			try (PrintWriter output = new PrintWriter(new FileWriter(fileName, true))) {
				String header = "Series UID" + "," + "Collection" + "," + "3rd Party Analysis" + ","
						+ "Data Description URI" + "," + "Subject ID" + "," + "Study UID" + "," + "Study Description"
						+ "," + "Study Date" + "," + "Series Description" + "," + "Manufacturer" + "," + "Modality"
						+ "," + "SOP Class Name" + "," + "SOP Class UID" + "," + "Number of Images" + "," + "File Size"
						+ "," + "File Location" + "," + "Download Timestamp";
				output.printf("%s\r\n", header);
				output.printf("%s\r\n", newLine);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		else {
			try (PrintWriter output = new PrintWriter(new FileWriter(fileName, true))) {
				output.printf("%s\r\n", newLine);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	private void createLicenseFile(String rootDir, String collection, String licenseName, String licenseUrl) {

		if (!licenseName.equals("null")) {
			String fileName = rootDir + File.separator + collection + File.separator + "LICENSE";

			File file = new File(fileName);
			if (!file.exists()) {
				BufferedWriter writer;
				try {
					file.getParentFile().mkdirs();
					if (!file.exists()) {
						file.createNewFile();
					}

					writer = new BufferedWriter(new FileWriter(file, true));
					String content = new MessageFormat(license_text)
							.format(new String[] { collection, licenseName, licenseUrl });
					writer.append(content);
//			        String duaText = System.getProperty("data.usage.agreement.text");
			        if (duaText != null && !duaText.isEmpty() && !duaText.equalsIgnoreCase("null")) {
			        	writer.append("\n_____________________________\n\n");
			        	writer.append(duaText);
			        }
					writer.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}

	private void loadSOPClassDefinition() {
		URL urlForGetRequest;
		String url = null;
		try {
			if (dataType != null && dataType.equalsIgnoreCase("other")) {
				return;
			} else // url = "http://localhost:8080/nbia-api/services/v1/getAllSOPClassDefinition";
				url = pubApiUrl + "getAllSOPClassDefinition";

			urlForGetRequest = new URL(url);

			HttpURLConnection connection = (HttpURLConnection) urlForGetRequest.openConnection();
			connection.setRequestMethod("GET");
			// connection.setRequestProperty("Accept", "text/csv");

			logger.fine("url for loading SOP class definition =" + connection.getURL().toString());
			if (connection.getResponseCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
			}

//			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			InputStream input = connection.getInputStream();
			Properties properties = new Properties();

			try {
				properties.load(input);
				for (final String name : properties.stringPropertyNames()) {
					sopClassNameMap.put(name, properties.getProperty(name));
					// System.out.println("sopclass name=" + name + " sop class id = " +
					// properties.getProperty(name));
				}
			} catch (FileNotFoundException fe) {
				// TODO Auto-generated catch block
				System.out.println("!!!!!!!!!!Cannot get SOP class name properties");
				fe.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			connection.disconnect();

		} catch (MalformedURLException e) {

			e.printStackTrace();

		} catch (IOException e) {

			e.printStackTrace();

		}

	}

	private String constrcutFilePath(String[] metaData, String directoryType) {	
		String filePath = null;
		if (metaData == null) {
			return null;
		}

		if (directoryType.equalsIgnoreCase("Classic")) {
			filePath = File.separator + metaData[1] + File.separator + metaData[4] + File.separator + metaData[5]
					+ File.separator + metaData[0];
		} else if (directoryType.equalsIgnoreCase("Descriptive")) {
			filePath = File.separator + metaData[1] + File.separator + metaData[4] + File.separator
					+ getPartOfName(metaData[7]) + getPartOfName(metaData[14]) + getDescPartOfName(metaData[6])
					+ metaData[5].substring(metaData[5].length() - 5) + File.separator + getPartOfName(metaData[15])
					+ getDescPartOfName(metaData[8]) + metaData[0].substring(metaData[0].length() - 5);
		}

		return filePath;
	}

	private String bytesIntoHumanReadable(Long metaData) {
//		long kilobyte = 1024;
//		long megabyte = kilobyte * 1024;
//		long gigabyte = megabyte * 1024;
//		long terabyte = gigabyte * 1024;
        long kilobyte = 1000;
        long megabyte = kilobyte * 1000;
        long gigabyte = megabyte * 1000;
        long terabyte = gigabyte * 1000;		

		if ((metaData >= 0) && (metaData < kilobyte)) {
			return metaData + " B";

		} else if ((metaData >= kilobyte) && (metaData < megabyte)) {
			return String.format("%.2f", ((double) metaData / kilobyte)) + " KB";

		} else if ((metaData >= megabyte) && (metaData < gigabyte)) {
			return String.format("%.2f", ((double) metaData / megabyte)) + " MB";

		} else if ((metaData >= gigabyte) && (metaData < terabyte)) {
			return String.format("%.2f", ((double) metaData / gigabyte)) + " GB";

		} else if (metaData >= terabyte) {
			return String.format("%.2f", ((double) metaData / terabyte)) + " TB";

		} else {
			return metaData + " Bytes";
		}
	}

	private String getDescPartOfName(String str) {
		if ((str != null) && (str.length() >= 1)) {
			str = str.replace('/', '-');
			if (str.equals("null") || str.equals("-"))
				return "";
			// Is it possible that the description will start with "/" which will be turned
			// into "-"? It is legal but not recommanded.
			// Need to see the real cases to decide it we can remove or replace the first
			// "/" in the descrition. So comment out the next two lines.
//			else if (str.startsWith("-"))
//				return str.substring(1, Math.min(str.length(), 54)) + "-";
			else
				return str.substring(0, Math.min(str.length(), 53)) + "-";
		} else
			return "";
	}

	private String getPartOfName(String str) {
		if ((str != null) && (str.length() >= 1)) {
			if (str.equals("null"))
				return "";
			else
				return str + "-";
		} else
			return "";
	}

	private void unzip(ZipInputStream zis, String subRoot) {
		try {
			ZipEntry entry;

			while ((entry = zis.getNextEntry()) != null) {
				if (entry.isDirectory()) {
					continue;
				}
				// System.out.print("entry.getName()=" + entry.getName());
				final File curfile = new File(rootDir + File.separator + subRoot, entry.getName());
				final File parent = curfile.getParentFile();
				// System.out.println("parent dir:" + parent.getAbsolutePath() + " file name:" +
				// entry.getName());
				if (!parent.exists()) {
					parent.mkdirs();
				}
				IOUtils.copy(zis, new FileOutputStream(curfile));
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public String getAccessToken(OAuth2Details oauthDetails) {
		HttpPost post = new HttpPost(oauthDetails.getAuthenticationServerUrl());
		String clientId = oauthDetails.getClientId();
		String clientSecret = oauthDetails.getClientSecret();
		String scope = oauthDetails.getScope();
		logger.fine("Getting access token: grant-type=" + oauthDetails.getGrantType());
		logger.fine("AuthenticationServerUrl=" + oauthDetails.getAuthenticationServerUrl());

		List<BasicNameValuePair> parametersBody = new ArrayList<BasicNameValuePair>();
		parametersBody.add(new BasicNameValuePair("grant_type", "password"));
		parametersBody.add(new BasicNameValuePair(OAuthConstants.USERNAME, oauthDetails.getUsername()));
		parametersBody.add(new BasicNameValuePair(OAuthConstants.PASSWORD, oauthDetails.getPassword()));

		parametersBody.add(new BasicNameValuePair(OAuthConstants.CLIENT_ID, clientId));

		parametersBody.add(new BasicNameValuePair(OAuthConstants.CLIENT_SECRET, clientSecret));

		DefaultHttpClient client = new DefaultHttpClient();
		HttpResponse response = null;
		String accessToken = null;
		try {
			// added -- panq
			// post.addHeader("content-type", "application/json");
			post.addHeader("content-type", "application/x-www-form-urlencoded");
			StringEntity params = new StringEntity("username=" + "panq" + "&password=" + "Nbia123$"
					+ "&client_id=nbiaRestAPIClient&client_secret=ItsBetweenUAndMe&grant_type=password");
			post.setEntity(params);
			// post.setEntity(new UrlEncodedFormEntity(parametersBody, HTTP.UTF_8));
			// post.setParams(params);

			response = client.execute(post);
			int code = response.getStatusLine().getStatusCode();
			if (code == OAuthConstants.HTTP_UNAUTHORIZED) {
				logger.fine("Authorization server expects Basic authentication");
				// Add Basic Authorization header
				post.addHeader(OAuthConstants.AUTHORIZATION,
						getBasicAuthorizationHeader(oauthDetails.getClientId(), oauthDetails.getClientSecret()));
				logger.fine("Retry with client credentials");
				post.releaseConnection();
				response = client.execute(post);
				code = response.getStatusLine().getStatusCode();
				if (code == 401 || code == 403) {
					logger.fine("Could not authenticate using client credentials. In process of renew token");
					throw new RuntimeException(
							"Could not retrieve access token for client: " + oauthDetails.getClientId());

				}

			}
			Map<String, String> map = handleResponse(response);
			accessToken = map.get(OAuthConstants.ACCESS_TOKEN);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return accessToken;
	}

	public String getBasicAuthorizationHeader(String username, String password) {
		return OAuthConstants.BASIC + " " + encodeCredentials(username, password);
	}

	public Map handleJsonResponse(HttpResponse response) {
		Map<String, String> oauthLoginResponse = null;
		String contentType = response.getEntity().getContentType().getValue();
		try {
			oauthLoginResponse = (Map<String, String>) new JSONParser()
					.parse(EntityUtils.toString(response.getEntity()));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException();
		} catch (org.json.simple.parser.ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException();
		} catch (RuntimeException e) {
			System.out.println("Could not parse JSON response");
			throw e;
		}
//		System.out.println();
//		System.out.println("********** Response Received **********");
//		for (Map.Entry<String, String> entry : oauthLoginResponse.entrySet()) {
//			System.out.println(String.format("  %s = %s", entry.getKey(), entry.getValue()));
//		}
		return oauthLoginResponse;
	}

	public Map handleResponse(HttpResponse response) {
		String contentType = OAuthConstants.JSON_CONTENT;
		if (response.getEntity().getContentType() != null) {
			contentType = response.getEntity().getContentType().getValue();
		}
		if (contentType.contains(OAuthConstants.JSON_CONTENT)) {
			return handleJsonResponse(response);
		} else if (contentType.contains(OAuthConstants.URL_ENCODED_CONTENT)) {
			return handleURLEncodedResponse(response);
		} else if (contentType.contains(OAuthConstants.XML_CONTENT)) {
			return handleXMLResponse(response);
		} else {
			// Unsupported Content type
			throw new RuntimeException("Cannot handle " + contentType
					+ " content type. Supported content types include JSON, XML and URLEncoded");
		}

	}

	public Map handleURLEncodedResponse(HttpResponse response) {
		Map<String, Charset> map = Charset.availableCharsets();
		Map<String, String> oauthResponse = new HashMap<String, String>();
		Set<Map.Entry<String, Charset>> set = map.entrySet();
		Charset charset = null;
		HttpEntity entity = response.getEntity();

//		System.out.println();
//		System.out.println("********** Response Received **********");

		for (Map.Entry<String, Charset> entry : set) {
//			System.out.println(String.format("  %s = %s", entry.getKey(), entry.getValue()));
			if (entry.getKey().equalsIgnoreCase(HTTP.UTF_8)) {
				charset = entry.getValue();
			}
		}

		try {
			List<NameValuePair> list = URLEncodedUtils.parse(EntityUtils.toString(entity), Charset.forName(HTTP.UTF_8));
			for (NameValuePair pair : list) {
				System.out.println(String.format("  %s = %s", pair.getName(), pair.getValue()));
				oauthResponse.put(pair.getName(), pair.getValue());
			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException("Could not parse URLEncoded Response");
		}

		return oauthResponse;
	}

	public Map handleXMLResponse(HttpResponse response) {
		Map<String, String> oauthResponse = new HashMap<String, String>();
		try {

			String xmlString = EntityUtils.toString(response.getEntity());
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = factory.newDocumentBuilder();
			InputSource inStream = new InputSource();
			inStream.setCharacterStream(new StringReader(xmlString));
			Document doc = db.parse(inStream);

			System.out.println("********** Response Receieved **********");
			parseXMLDoc(null, doc, oauthResponse);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Exception occurred while parsing XML response");
		}
		return oauthResponse;
	}

	public void parseXMLDoc(Element element, Document doc, Map<String, String> oauthResponse) {
		NodeList child = null;
		if (element == null) {
			child = doc.getChildNodes();

		} else {
			child = element.getChildNodes();
		}
		for (int j = 0; j < child.getLength(); j++) {
			if (child.item(j).getNodeType() == org.w3c.dom.Node.ELEMENT_NODE) {
				org.w3c.dom.Element childElement = (org.w3c.dom.Element) child.item(j);
				if (childElement.hasChildNodes()) {
					System.out.println(childElement.getTagName() + " : " + childElement.getTextContent());
					oauthResponse.put(childElement.getTagName(), childElement.getTextContent());
					parseXMLDoc(childElement, null, oauthResponse);
				}

			}
		}
	}

	public String encodeCredentials(String username, String password) {
		String cred = username + ":" + password;
		String encodedValue = null;
		byte[] encodedBytes = Base64.encodeBase64(cred.getBytes());
		encodedValue = new String(encodedBytes);
		System.out.println("encodedBytes " + new String(encodedBytes));

		byte[] decodedBytes = Base64.decodeBase64(encodedBytes);
		System.out.println("decodedBytes " + new String(decodedBytes));

		return encodedValue;

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
	
	private String getUserAgreementTxt() {
		try {
			String pubApiUrl = serverUrl.replaceFirst("nbia-download/servlet/DownloadServlet",
					"nbia-api/services/v1/getUserAgreementTxt");
			URL urlForGetRequest = new URL(pubApiUrl);
//			System.out.println("url=" + pubApiUrl);

			HttpURLConnection connection = (HttpURLConnection) urlForGetRequest.openConnection();
			connection.setRequestMethod("GET");

			int responseCode = connection.getResponseCode();

			if (responseCode != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
			}

			InputStream input = connection.getInputStream();

			duaText = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))
					.lines().collect(Collectors.joining("\n"));

			connection.disconnect();
			input.close();
//			if (text != null && !text.isEmpty()) {
//				System.setProperty("data.usage.agreement.text",
//						text);
//			}

		} catch (Exception e) {
		}

		return duaText;
	}
	
	private void retrieveUsersAns(String text) {
//		System.out.println("Please read the Data Usage Agreement below:");
		System.out.println(text);
		Scanner kbd = new Scanner(System.in);
		System.out.println("Do you agree with the Data Usage Agreement? (Y/N)");
		boolean bk = false;
		while (bk == false) {
			String answer = kbd.nextLine();
			switch (answer) {
			case "Y":
			case "y": bk = true;
				break;
			case "N":
			case "n":
				System.exit(0);
				break;

			default:
				System.out.println("Invalid answer. Enter Y for yes or N for no: ");
				break;
			}
		}
	}
	
	public List<String> scanDataDir(String filePath, String manifestFileName) {
		String line = "";
		String splitBy = ",";
		int seriesUidColumnNum = 0;
		int onlyHeaderSize = 243;
		ArrayList<String> existSeriesList = null;
		String prompt = "Some of this data has already been downloaded. Do you want to download only the missing data or all of the data?\n"
		+"Note that selecting \"Download all\" will clean up the existing download folder to get rid of possible obsolete data. Please backup the files\n" +
		"you want to keep. ";
	//		String fileName = System.getProperty("user.home") + File.separator + "Desktop" + File.separator
		//				+ System.getProperty("databasketId").replace(".tcia", "") + File.separator + "metadata.csv";
//		String fileName = filePath + File.separator
//						+ System.getProperty("databasketId").replace(".tcia", "") + File.separator + "metadata.csv";
		String fileName = filePath + File.separator
				+ (new File(manifestFileName)).getName().replace(".tcia", "") + File.separator + "metadata.csv";

		File f = new File(fileName);
		if (f.exists() && !f.isDirectory()) {
			String answer = null;

			if (f.length() > onlyHeaderSize) {
				System.out.println(prompt);
				Scanner kbd = new Scanner(System.in);
				System.out.println("Do you want to download all or download only missing series?\nEnter A for downloading all, M for downloading missing series. E for exiting the program:");
				boolean bk = false;

				while (bk == false) {
					answer = kbd.nextLine();
					switch (answer) {
					case "A":
					case "a": bk = true;
						break;
					case "M":
					case "m": bk = true;
						break;
					case "E":
					case "e":
						System.exit(0);
					default:
						System.out.println("Invalid answer. Enter A for downloading all series or M for downloading missing series: ");
						break;
					}
				}				

			} else
				return null;

			if (answer.equalsIgnoreCase("A")) {
				//clean directory
				String dir = filePath+ File.separator + System.getProperty("databasketId").replace(".tcia", "");
				//File directory = new File(dir);
				File directoryToBeDeleted = new File(dir);			
				deleteDirectory(directoryToBeDeleted);
				//renameDirectory(dir);
				
				return null;
			}
			else {
				// get the series list
				existSeriesList = new ArrayList<String>();
				try {
					// parsing a CSV file into BufferedReader class constructor
					BufferedReader br = new BufferedReader(new FileReader(fileName));
					
					int lc = 0;
					while ((line = br.readLine()) != null) // returns a Boolean value
					{
						if (lc == 0) {
							++lc;
						} else {
							String[] seriesInfo = line.split(splitBy); // use comma as separator
							//System.out.println("series instance uid =" + seriesInfo[seriesUidColumnNum]);
							existSeriesList.add(seriesInfo[seriesUidColumnNum]);
							++lc;
						}
					}
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}

				return existSeriesList;
			}
		} else
			return null;
	}
	
	boolean deleteDirectory(File directoryToBeDeleted) {
		//File directoryToBeDeleted = new File(dir);
		    File[] allContents = directoryToBeDeleted.listFiles();
	    if (allContents != null) {
	        for (File file : allContents) {
	            deleteDirectory(file);
	        }
	    }
	    return directoryToBeDeleted.delete();
	}	
}
