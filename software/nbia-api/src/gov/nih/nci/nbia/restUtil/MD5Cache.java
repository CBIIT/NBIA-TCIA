package gov.nih.nci.nbia.restUtil;

import java.util.*;
public class MD5Cache {
	

    private static Map<String, MD5Util> md5Values = new HashMap<String, MD5Util>();

	public static String getMD5ForCollection(String collection){
		long now = System.currentTimeMillis();
		MD5Util util = md5Values.get(collection);
		if (util==null)
		{
			return null;
		}
		else
		{
			if (now < util.getCreated())
			{
				return util.getMD5();
			}
			else
			{
				return null;
			}
		}
	}
	public static void setMD5(String collection, String MD5){
		long now = System.currentTimeMillis() + 6000000L;
		MD5Util util = new MD5Util();
        util.setCreated(now);
        util.setMD5(MD5);
        md5Values.put(collection, util);
	}
	
}
