/**
 *
 */
package gov.nih.nci.nbia.security;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Map;
import java.net.URL;
import java.net.HttpURLConnection;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.security.UnauthorizedException;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.SpringApplicationContext;

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

	static String tokenUrl; //= "http://localhost:8180/realms/NBIAKeycloak/protocol/openid-connect/KeycloakGetToken";
	static String userInfoUrl; //= "http://localhost:8180/realms/NBIAKeycloak/protocol/openid-connect/userinfo";
	
	 // Lazy  declaration and initialisation
    private static AuthenticationWithKeycloak instance;
 
    // Private constructor of Class 2
    private AuthenticationWithKeycloak() {
    	tokenUrl = NCIAConfig.getKeycloakTokenUrl();
    	userInfoUrl = NCIAConfig.getKeycloakUserInfoUrl();  	
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


	public String getAccessToken(String uName, String pWord, String clientId, String clientSecret) {
//		System.out.println("tokenUrl="+tokenUrl);
//		System.out.println("getAccessToken/clientSecret="+clientSecret);
//		System.out.println("grant_type="+GRANT_TYPE_PASSWORD);
//		System.out.println("client_id="+clientId);
//		System.out.println("username="+uName);
//		System.out.println("password="+pWord);
//		System.out.println("client_secret="+clientSecret);
		
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
				return EntityUtils.toString(response.getEntity());
				//throw new RuntimeException("Could not authenticate using client credentials.Could not retrieve access KeycloakGetToken for client: " + clientId);
			}
			else {
				String json = EntityUtils.toString(response.getEntity());
//				System.out.println("@@@@@@@@@@@@@@KeycloakGetToken = "+json);
				return json;
			}
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}
	
	public HttpResponse getAccessTokenResp(String uName, String pWord, String clientId, String clientSecret) {
//		System.out.println("tokenUrl="+tokenUrl);
//		System.out.println("getAccessToken/clientSecret="+clientSecret);
//		System.out.println("grant_type="+GRANT_TYPE_PASSWORD);
//		System.out.println("client_id="+clientId);
//		System.out.println("username="+uName);
//		System.out.println("password="+pWord);
//		System.out.println("client_secret="+clientSecret);
		
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

	    NCIASecurityManager mgr = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
	    if (NCIAConfig.getProductVariation().toUpperCase().equals("TCIA")) {
	    	try{
	        	mgr.syncDBWithLDAP(uName);
				System.out.println("Sync performed");
	    	} catch(Exception e){
	    		System.out.println("Sync failed");
	    		e.printStackTrace();
	    	}
	    }
		try {
			post.addHeader("content-type", URL_ENCODED_CONTENT);
			post.setEntity(new UrlEncodedFormEntity(parameters, "UTF-8"));
			response = client.execute(post);
			return response;
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}
	

	public boolean authenticateUser(String uName, String pWord, String clientId, String clientSecret) {
//		System.out.println("tokenUrl="+tokenUrl);
//		System.out.println("getAccessToken/clientSecret="+clientSecret);
//		System.out.println("grant_type="+GRANT_TYPE_PASSWORD);
//		System.out.println("client_id="+clientId);
//		System.out.println("username="+uName);
//		System.out.println("password="+pWord);
//		System.out.println("client_secret="+clientSecret);
		
		HttpPost post = new HttpPost(tokenUrl);
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
				return false;
				//throw new RuntimeException("Could not authenticate using client credentials.Could not retrieve access KeycloakGetToken for client: " + clientId);
			}
			else {
				return true;
			}
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return false;
	}	
	
	// get a refresh KeycloakGetToken (and another access KeycloakGetToken)
	public String getRefreshToken(String username, String clientId, String clientSecret, String refreshToken) {
		HttpPost post = new HttpPost(tokenUrl);
		ArrayList<NameValuePair> parameters;

		parameters = new ArrayList<NameValuePair>();
		parameters.add(new BasicNameValuePair("grant_type", REFRESH_TOKEN));
		parameters.add(new BasicNameValuePair("username", username));
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
				return EntityUtils.toString(response.getEntity());
				//throw new RuntimeException("Could not retrieve access KeycloakGetToken for client: " + clientId);
			}
			else {
				String json = EntityUtils.toString(response.getEntity());
//				System.out.println("@@@@@@@@@@@@@@KeycloakGetToken = "+json);
				return json;
			}
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}
	
	public HttpResponse getRefreshTokenResp(String username, String clientId, String clientSecret, String refreshToken) {
		HttpPost post = new HttpPost(tokenUrl);
		ArrayList<NameValuePair> parameters;

		parameters = new ArrayList<NameValuePair>();
		parameters.add(new BasicNameValuePair("grant_type", REFRESH_TOKEN));
		parameters.add(new BasicNameValuePair("username", username));
		parameters.add(new BasicNameValuePair("client_id", clientId));
		parameters.add(new BasicNameValuePair("client_secret", clientSecret));
		parameters.add(new BasicNameValuePair("refresh_token", refreshToken));

		DefaultHttpClient client = new DefaultHttpClient();
		HttpResponse response = null;

		try {
			post.addHeader("content-type", URL_ENCODED_CONTENT);
			post.setEntity(new UrlEncodedFormEntity(parameters, "UTF-8"));
			response = client.execute(post);
			
			return response;
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}		
	
	public String getUserName(String aToken) {
		int code = 0;
		String userName = null;
		try {
			// Sending get request
			URL url = new URL(userInfoUrl);
			// System.out.println("userInfoUrl="+userInfoUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();

			conn.setRequestProperty("Authorization", "Bearer " + aToken);
			// System.out.println("aToken="+aToken);

			conn.setRequestProperty("Content-Type", "application/json");
			conn.setRequestMethod("GET");

			code = conn.getResponseCode();
			if (code != 200) {
				if (code == 401 || code == 403) {
					// Access KeycloakGetToken is invalid or expired.Regenerate the access KeycloakGetToken
					// System.out.println("Access KeycloakGetToken is invalid or expired. Regenerating access KeycloakGetToken please");
					// throw new RuntimeException("Invalid or expired KeycloakGetToken. HTTP error code: " + code);
					throw new UnauthorizedException();
				} else {
					throw new RuntimeException("Failed : HTTP error code : " + code);
				}
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
				// System.out.println("userName from keycloak: " + userName);
				return userName;
			}
		} catch (IOException ex) {
			ex.printStackTrace();
			throw new RuntimeException("Problem connecting with Keycloak server.");
		} catch (ParseException ex) {
			ex.printStackTrace();
			throw new RuntimeException("Problem parsing response from Keycloak server.");
		}

		System.out.println("Username is null");
		return null;
	}
}
