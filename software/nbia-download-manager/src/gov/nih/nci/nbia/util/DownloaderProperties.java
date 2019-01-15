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
		if (System.getProperty("online.help.url") == null)
			return NBIA_PROPERTIES.getProperty("online_help_url");
		else return System.getProperty("online.help.url");
	}
	
	public static String getHelpDeskUrl() {
		if (System.getProperty("help.desk.url") == null)
			return NBIA_PROPERTIES.getProperty("help_desk_url");
		else return System.getProperty("help.desk.url");
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
	
	public static String getInstallerType() {
		return NBIA_PROPERTIES.getProperty("linux_installer_type");
	}

}
