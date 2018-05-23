package gov.nih.nci.nbia.util;

import java.util.Properties;

public class DownloaderProperties {

	private static Properties NBIA_PROPERTIES = null;

	static {
		try {
			NBIA_PROPERTIES = PropertyLoader.loadProperties("config.properties");
		} catch (Exception e) {
			/*
			 * Create EMPTY properties to avoid null pointer exceptions
			 */
			if (NBIA_PROPERTIES == null) {
				NBIA_PROPERTIES = new Properties();
			}
		}
	}

	public DownloaderProperties() {
		super();
		// TODO Auto-generated constructor stub
	}

	public static String getOnlineHelpUrl() {
		return NBIA_PROPERTIES.getProperty("online_help_url");
	}

	public static String getHelpDeskUrl() {
		return NBIA_PROPERTIES.getProperty("help_desk_url");
	}

	public static String getBuildTime() {
		return NBIA_PROPERTIES.getProperty("time_stamp");
	}

	public static String getAppVersion() {
		return NBIA_PROPERTIES.getProperty("app_version");
	}

	public static boolean getMajorityPublic() {
		return Boolean.parseBoolean(NBIA_PROPERTIES.getProperty("majority_public"));
	}

}
