/**
 *
 */
package gov.nih.nci.nbia.restSecurity;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
//import java.nio.charset.Charset;
import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
import java.util.Map;
//import java.util.Set;

import java.net.URL;
import java.net.HttpURLConnection;

//import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
//import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
//import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
//import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import gov.nih.nci.nbia.util.NCIAConfig;

/**
 * @author panq
 *
 */

public class AuthenticationWithKeycloak {
	public static final String ACCESS_TOKEN = "access_token";
	public static final String CLIENT_ID = "client_id";
	public static final String CLIENT_SECRET = "client_secret";
	public static final String REFRESH_TOKEN = "refresh_token";
	public static final String USERNAME = "username";
	public static final String PASSWORD = "password";
	public static final String AUTHENTICATION_SERVER_URL = "authentication_server_url";

	public static final String GRANT_TYPE = "grant_type";
	public static final String GRANT_TYPE_PASSWORD = "password";
	public static final String AUTHORIZATION = "Authorization";
	public static final String BEARER = "Bearer";
	public static final String JSON_CONTENT = "application/json";
	public static final String URL_ENCODED_CONTENT = "application/x-www-form-urlencoded";

	public static final int HTTP_OK = 200;
	public static final int HTTP_FORBIDDEN = 403;
	public static final int HTTP_UNAUTHORIZED = 401;

//	static String uName = "admin";
//	static String pWord = "admin";
//	static String clientId = "nbiaRestAPIClient";
//	static String clientSecret = "oj1fWZcVnAk3CR31uEF8jmdNtl9ydiAb";
	static String tokenUrl; //= "http://localhost:8180/realms/NBIAKeycloak/protocol/openid-connect/token";
	static String userInfoUrl; //= "http://localhost:8180/realms/NBIAKeycloak/protocol/openid-connect/userinfo";
	
	 // Lazy  declaration and initialisation
    private static AuthenticationWithKeycloak instance;
 
    // Private constructor of Class 2
    private AuthenticationWithKeycloak() {
    	tokenUrl = NCIAConfig.getKeycloakTokenUrl();
    			//"http://localhost:8180/realms/NBIAKeycloak/protocol/openid-connect/token";
    	userInfoUrl = NCIAConfig.getKeycloakUserInfoUrl();
    	//"http://localhost:8180/realms/NBIAKeycloak/protocol/openid-connect/userinfo";    	
    }
 
    public static AuthenticationWithKeycloak getInstance()
    {
 
        // Condition check
        // When instance is null
        // a new object of Singleton class is created
        if (instance == null) {
            instance = new AuthenticationWithKeycloak();
        }
 
        return instance;
    }
	
	public String getTokenUrl() {
		return tokenUrl;
	}

	public void setTokenUrl(String tokenUrl) {
		AuthenticationWithKeycloak.tokenUrl = tokenUrl;
	}

	public String getUserInfoUrl() {
		return userInfoUrl;
	}

	public void setUserInfoUrl(String userInfoUrl) {
		AuthenticationWithKeycloak.userInfoUrl = userInfoUrl;
	}



//	public AuthenticationServiceWithKeycloak(String uName, String pWord) {
//		super();
//		this.uName = uName;
//		this.pWord = pWord;
//	}

	public static void main(String[] args) throws Exception {
		AuthenticationWithKeycloak aswk = new AuthenticationWithKeycloak();
		
		String clientId = "nbiaRestAPIClient";
		String clientSecret = "oj1fWZcVnAk3CR31uEF8jmdNtl9ydiAb";		
		try {
			String uName = args[0];
			String pWord = args[1];
			aswk.getAccessToken(uName, pWord, clientId, clientSecret);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

//	public AuthenticationWithKeycloak() {
//	}

//	public static Map<String, String> getAccessToken(String uName, String pWord) {
//		HttpPost post = new HttpPost(tokenUrl);
//		Map<String, String> map = null;
//		ArrayList<NameValuePair> parameters;
//
//		parameters = new ArrayList<NameValuePair>();
//		parameters.add(new BasicNameValuePair("grant_type", GRANT_TYPE_PASSWORD));
//		parameters.add(new BasicNameValuePair("client_id", clientId));
//		parameters.add(new BasicNameValuePair("username", uName));
//		parameters.add(new BasicNameValuePair("password", pWord));
//		parameters.add(new BasicNameValuePair("client_secret", clientSecret));
//
//		DefaultHttpClient client = new DefaultHttpClient();
//		HttpResponse response = null;
//
//		try {
//			post.addHeader("content-type", URL_ENCODED_CONTENT);
//			post.setEntity(new UrlEncodedFormEntity(parameters, "UTF-8"));
//			response = client.execute(post);
//			int code = response.getStatusLine().getStatusCode();
//
//			if (code != HTTP_OK) {
//				System.out.println("Could not authenticate using client credentials");
//				throw new RuntimeException("Could not retrieve access token for client: " + clientId);
//			}
//			map = handleResponse(response);
//		} catch (ClientProtocolException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
////		return accessToken;
//		System.out.println(map.get(ACCESS_TOKEN));
//		getUserName(map.get(ACCESS_TOKEN));
//		return map;
//	}
//	
	public String getAccessToken(String uName, String pWord, String clientId, String clientSecret) {
		System.out.println("tokenUrl="+tokenUrl);
		System.out.println("getAccessToken/clientSecret="+clientSecret);
		System.out.println("grant_type="+GRANT_TYPE_PASSWORD);
		System.out.println("client_id="+clientId);
		System.out.println("username="+uName);
		System.out.println("password="+pWord);
		System.out.println("client_secret="+clientSecret);
		
		HttpPost post = new HttpPost(tokenUrl);
		Map<String, String> map = null;
		ArrayList<NameValuePair> parameters;

		parameters = new ArrayList<NameValuePair>();
		parameters.add(new BasicNameValuePair("grant_type", GRANT_TYPE_PASSWORD));
		parameters.add(new BasicNameValuePair("client_id", clientId));
		parameters.add(new BasicNameValuePair("username", uName));
		parameters.add(new BasicNameValuePair("password", pWord));
		parameters.add(new BasicNameValuePair("client_secret", clientSecret));
		parameters.add(new BasicNameValuePair("scope", "openid"));

		DefaultHttpClient client = new DefaultHttpClient();
		HttpResponse response = null;

		try {
			post.addHeader("content-type", URL_ENCODED_CONTENT);
			post.setEntity(new UrlEncodedFormEntity(parameters, "UTF-8"));
			response = client.execute(post);
			int code = response.getStatusLine().getStatusCode();

			if (code != HTTP_OK) {
				System.out.println("Could not authenticate using client credentials");
				throw new RuntimeException("Could not retrieve access token for client: " + clientId);
			}
			else {
				String json = EntityUtils.toString(response.getEntity());
				System.out.println("@@@@@@@@@@@@@@token = "+json);
				return json;
			}
		//	map = handleResponse(response);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

//		return accessToken;
//		System.out.println(map.get(ACCESS_TOKEN));
//		getUserName(map.get(ACCESS_TOKEN));
//		return map;
		return null;
	}
	
	// get a refresh token (and another access token)
	public String getRefreshToken(String clientId, String clientSecret, String refreshToken) {
		HttpPost post = new HttpPost(tokenUrl);
		Map<String, String> map = null;
		ArrayList<NameValuePair> parameters;

		parameters = new ArrayList<NameValuePair>();
		parameters.add(new BasicNameValuePair("grant_type", REFRESH_TOKEN));
		parameters.add(new BasicNameValuePair("client_id", clientId));
		parameters.add(new BasicNameValuePair("client_secret", clientSecret));
		parameters.add(new BasicNameValuePair("refresh_token", refreshToken));

		DefaultHttpClient client = new DefaultHttpClient();
		HttpResponse response = null;

		try {
			post.addHeader("content-type", URL_ENCODED_CONTENT);
			post.setEntity(new UrlEncodedFormEntity(parameters, "UTF-8"));
			response = client.execute(post);
			int code = response.getStatusLine().getStatusCode();

			if (code != HTTP_OK) {
				System.out.println("Could not authenticate using client credentials");
				throw new RuntimeException("Could not retrieve access token for client: " + clientId);
			}
			else {
				String json = EntityUtils.toString(response.getEntity());
				System.out.println("@@@@@@@@@@@@@@token = "+json);
				return json;
			}
		//	map = handleResponse(response);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

//		return accessToken;
//		System.out.println(map.get(ACCESS_TOKEN));
//		getUserName(map.get(ACCESS_TOKEN));
//		return map;
		return null;
	}	
	

//	static public Map handleResponse(HttpResponse response) {
//		String contentType = JSON_CONTENT;
//		if (response.getEntity().getContentType() != null) {
//			contentType = response.getEntity().getContentType().getValue();
//		}
//		if (contentType.contains(JSON_CONTENT)) {
//			return handleJsonResponse(response);
//		} else if (contentType.contains(URL_ENCODED_CONTENT)) {
//			return handleURLEncodedResponse(response);
//
//		} else {
//			// Unsupported Content type
//			throw new RuntimeException("Cannot handle " + contentType
//					+ " content type. Supported content types include JSON, XML and URLEncoded");
//		}
//
//	}

//	public static String getToken(String uName, String pWord) {
//		HttpPost post = new HttpPost(tokenUrl);
//		DefaultHttpClient client = new DefaultHttpClient();
//		HttpResponse response = null;
//		Map<String, String> map = null;
//
//		try {
//			post.addHeader("content-type", URL_ENCODED_CONTENT);
//			StringEntity params = new StringEntity("username=" + uName + "&password=" + pWord + "&client_id=" + clientId
//					+ "&client_secret=" + clientSecret + "&grant_type=" + GRANT_TYPE_PASSWORD);
//			post.setEntity(params);
//
//			response = client.execute(post);
//			int code = response.getStatusLine().getStatusCode();
//
//			if (code != HTTP_OK) {
//				System.out.println("Could not authenticate using client credentials");
//				throw new RuntimeException("Could not retrieve access token for client: " + clientId);
//			}
//			map = handleResponse(response);
//		} catch (ClientProtocolException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//		System.out.println(map.get(ACCESS_TOKEN));
//		return map.get(ACCESS_TOKEN);
//	}

//	static Map handleURLEncodedResponse(HttpResponse response) {
//		Map<String, Charset> map = Charset.availableCharsets();
//		Map<String, String> oauthResponse = new HashMap<String, String>();
//		Set<Map.Entry<String, Charset>> set = map.entrySet();
//		Charset charset = null;
//		HttpEntity entity = response.getEntity();
//
//		System.out.println();
//		System.out.println("********** Response Received **********");
//
//		for (Map.Entry<String, Charset> entry : set) {
//			System.out.println(String.format("  %s = %s", entry.getKey(), entry.getValue()));
//			if (entry.getKey().equalsIgnoreCase(HTTP.UTF_8)) {
//				charset = entry.getValue();
//			}
//		}
//
//		try {
//			List<NameValuePair> list = URLEncodedUtils.parse(EntityUtils.toString(entity), Charset.forName(HTTP.UTF_8));
//			for (NameValuePair pair : list) {
////				logger.fine(String.format("  %s = %s", pair.getName(), pair.getValue()));
//				oauthResponse.put(pair.getName(), pair.getValue());
//			}
//
//		} catch (IOException e) {
//			e.printStackTrace();
//			throw new RuntimeException("Could not parse URLEncoded Response");
//		}
//
//		return oauthResponse;
//	}
//
//	static public Map handleJsonResponse(HttpResponse response) {
//		Map<String, String> oauthLoginResponse = null;
//		String contentType = response.getEntity().getContentType().getValue();
//
//		System.out.println();
//		System.out.println("********** " + contentType + " Response Received **********");
//
//		try {
//			oauthLoginResponse = (Map<String, String>) new JSONParser()
//					.parse(EntityUtils.toString(response.getEntity()));
//		} catch (ParseException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			throw new RuntimeException();
//		} catch (org.json.simple.parser.ParseException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			throw new RuntimeException();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			throw new RuntimeException();
//		} catch (RuntimeException e) {
//			System.out.println("Could not parse JSON response");
//			throw e;
//		}
////		System.out.println();
////		System.out.println("********** Response Received **********");
////		for (Map.Entry<String, String> entry : oauthLoginResponse.entrySet()) {
////			System.out.println(String.format("  %s = %s", entry.getKey(),
////					entry.getValue()));
////		}
//		return oauthLoginResponse;
//	}

	public String getUserName(String aToken) {
		int code = 0;
		String userName = null;
		try {

			// Sending get request
			URL url = new URL(userInfoUrl);
			System.out.println("userInfoUrl="+userInfoUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();

			conn.setRequestProperty("Authorization", "Bearer " + aToken);
			System.out.println("aToken="+aToken);
			// e.g. bearer token=
			// eyJhbGciOiXXXzUxMiJ9.eyJzdWIiOiPyc2hhcm1hQHBsdW1zbGljZS5jb206OjE6OjkwIiwiZXhwIjoxNTM3MzQyNTIxLCJpYXQiOjE1MzY3Mzc3MjF9.O33zP2l_0eDNfcqSQz29jUGJC-_THYsXllrmkFnk85dNRbAw66dyEKBP5dVcFUuNTA8zhA83kk3Y41_qZYx43T

			conn.setRequestProperty("Content-Type", "application/json");
			conn.setRequestMethod("GET");

			code = conn.getResponseCode();
			if (code != 200) {
				if (code == 401 || code == 403) {
					// Access token is invalid or expired.Regenerate the access token
					System.out.println("Access token is invalid or expired. Regenerating access token please");
					throw new RuntimeException("Invalid or expired token. HTTP error code: " + code);
				} else
					throw new RuntimeException("Failed : HTTP error code : " + code);
			} else if (code == 200) {
				BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
				String output;

				StringBuffer response = new StringBuffer();
				while ((output = in.readLine()) != null) {
					response.append(output);
				}

				in.close();
				// printing result from response
//	        System.out.println("Response:-" + response.toString());	
				JSONParser parser = new JSONParser();
				JSONObject jsonObject = (JSONObject) parser.parse(response.toString());

				userName = (String) jsonObject.get("preferred_username");
				System.out.println("userName:-" + userName);
				return userName;
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
}
