package gov.nih.nci.nbia.restUtil;





import gov.nih.nci.nbia.util.SiteData;

import java.util.*;
public class QAUserUtil {
	

    private static Map<String, String> userQA = new HashMap<String, String>();

	public static boolean isUserQA(String user){
		String returnValue = userQA.get(user);
		if (returnValue==null)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	public static void setUserQA(String user){
		userQA.put(user, "YES");
	}
	
}
