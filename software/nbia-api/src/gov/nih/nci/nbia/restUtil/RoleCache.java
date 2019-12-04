package gov.nih.nci.nbia.restUtil;





import gov.nih.nci.nbia.util.SiteData;

import java.util.*;
public class RoleCache {
	

    private static Map<String, RoleUtil> userRoles = new HashMap<String, RoleUtil>();

	public static List<String> getRoles(String user){
		long now = System.currentTimeMillis();
		RoleUtil util = userRoles.get(user);
		if (util==null)
		{
			return null;
		}
		else
		{
			if (now < util.getCreated())
			{
				return util.getRoles();
			}
			else
			{
				return null;
			}
		}
	}
	public static void setRoles(String user, List<String> roles){
		long now = System.currentTimeMillis() + 600000L;
		RoleUtil util = new RoleUtil();
        util.setCreated(now);
        util.setRoles(roles);
        userRoles.put(user, util);
	}
	
}
