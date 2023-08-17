package gov.nih.nci.nbia.restUtil;

import gov.nih.nci.nbia.util.SiteData;
import java.util.*;

public class AuthorizationUtil {

    private static Map<String, SiteUtil> userSites = new HashMap<String, SiteUtil>();

	public static List<SiteData> getUserSiteData(String user){
		long now = System.currentTimeMillis();
		SiteUtil util = userSites.get(user);
		if (util == null){
			System.out.println("No user sites for "+user);
			return null;
		} else {
			if (now < util.getCreated()) {
				System.out.println("User sites cache hit "+user);
				return util.getAuthorizedSites();
			} else {
				System.out.println("User sites expired for "+user);
				return null;
			}
		}
	}

	public static void setUserSites(String user, List<SiteData> authorizedSites){
		long now = System.currentTimeMillis() + 600000L;
		System.out.println("Setting user sites for "+user+" to expire at "+new Date(now));
		SiteUtil util = new SiteUtil();
        util.setCreated(now);
        util.setAuthorizedSites(authorizedSites);
        userSites.put(user, util);
	}
}
