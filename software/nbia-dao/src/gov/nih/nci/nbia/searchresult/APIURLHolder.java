package gov.nih.nci.nbia.searchresult;
import java.util.*;
import gov.nih.nci.nbia.util.NCIAConfig;
public class APIURLHolder {
	private static String url;
	private static String wadoUrl;
	private static Map<String, String> userMap=new HashMap<String, String>();
	// the api calls are just to localhost now
	public static String getUrl()
	{
		System.out.println("The url-http://localhost:"+NCIAConfig.getTomcatPort());
		return "http://localhost:"+NCIAConfig.getTomcatPort();
	}
	public static String getExternalUrl()
	{
		return url;
	}
	public static String addUser(String user)
	{
		if (user==null) return "null user";
		try {
		for(Map.Entry<String, String> entry : userMap.entrySet()){
		    //System.out.printf("Key : %s and Value: %s %n", entry.getKey(), entry.getValue());
		    if (entry.getValue().equals(user)){
		    	return entry.getKey();
		    }
		}
		} catch (Exception e)
		{

		}
		UUID userKey = UUID.randomUUID();
		userMap.put(userKey.toString(), user);
		return userKey.toString();

	}
	public static String getUser(String key){
		return userMap.get(key);
	}
	public static void setUrl(String urlIn){
		url=urlIn;
		wadoUrl=urlIn+"/ncia/wado";
	}
	public static String getWadoUrl()
	{
		return wadoUrl;
		//return "http://localhost:45210/ncia/wado";
	}
    public static void main(String[] args)
    {
    	setUrl("http://localhost:8080/nbia/home.jsf");
    }
}
