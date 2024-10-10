package gov.nih.nci.nbia.cli.oauthClient;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
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

public class OAuthUtils {
	public Logger logger;

	public OAuthUtils(Logger logger) {
		this.logger = logger;
	}

	public OAuth2Details createOAuthDetails(Properties config) {
		OAuth2Details oauthDetails = new OAuth2Details();
		oauthDetails.setAccessToken((String) config.get(OAuthConstants.ACCESS_TOKEN));
		oauthDetails.setRefreshToken((String) config.get(OAuthConstants.REFRESH_TOKEN));
		oauthDetails.setGrantType((String) config.get(OAuthConstants.GRANT_TYPE));
		oauthDetails.setClientId((String) config.get(OAuthConstants.CLIENT_ID));
		oauthDetails.setClientSecret((String) config.get(OAuthConstants.CLIENT_SECRET));
		oauthDetails.setScope((String) config.get(OAuthConstants.SCOPE));
		oauthDetails.setAuthenticationServerUrl((String) config.get(OAuthConstants.AUTHENTICATION_SERVER_URL));
		oauthDetails.setUsername((String) config.get(OAuthConstants.USERNAME));
		oauthDetails.setPassword((String) config.get(OAuthConstants.PASSWORD));
		oauthDetails.setResourceServerUrl((String) config.get(OAuthConstants.RESOURCE_SERVER_URL));

		if (!isValid(oauthDetails.getResourceServerUrl())) {
//			System.out.println("Resource server url is null. Will assume request is for generating Access token");
			oauthDetails.setAccessTokenRequest(true);
		}

		return oauthDetails;
	}

	public Properties getClientConfigProps(String path) {
		InputStream is = OAuthUtils.class.getClassLoader().getResourceAsStream(path);
		Properties config = new Properties();
		try {
			config.load(is);
		} catch (IOException e) {
			logger.severe("Could not load oAuth properties from " + path);
			e.printStackTrace();
			return null;
		}
		return config;
	}

	public Map<String, String> getAccessToken(OAuth2Details oauthDetails) {
		HttpPost post = new HttpPost(oauthDetails.getAuthenticationServerUrl());
		String clientId = oauthDetails.getClientId();
		String clientSecret = oauthDetails.getClientSecret();
		String scope = oauthDetails.getScope();
		Map<String, String> map = null;

		List<BasicNameValuePair> parametersBody = new ArrayList<BasicNameValuePair>();
		parametersBody.add(new BasicNameValuePair("grant_type", "password"));
		parametersBody.add(new BasicNameValuePair(OAuthConstants.USERNAME, oauthDetails.getUsername()));
		parametersBody.add(new BasicNameValuePair(OAuthConstants.PASSWORD, oauthDetails.getPassword()));

		parametersBody.add(new BasicNameValuePair(OAuthConstants.CLIENT_ID, clientId));

		parametersBody.add(new BasicNameValuePair(OAuthConstants.CLIENT_SECRET, clientSecret));

		if (isValid(scope)) {
			parametersBody.add(new BasicNameValuePair(OAuthConstants.SCOPE, scope));
		}

		DefaultHttpClient client = new DefaultHttpClient();
		HttpResponse response = null;

		try {
			post.addHeader("content-type", "application/x-www-form-urlencoded");
			StringEntity params = new StringEntity(
					"username=" + oauthDetails.getUsername() + "&password=" + oauthDetails.getPassword()
							+ "&client_id=nbiaRestAPIClient&client_secret=ItsBetweenUAndMe&grant_type=password");
			post.setEntity(params);

			response = client.execute(post);
			int code = response.getStatusLine().getStatusCode();
//			logger.fine("HTTP response code is " + code);			
			if (code == OAuthConstants.HTTP_UNAUTHORIZED) {
				logger.fine("Authorization server expects Basic authentication. ");
				// Add Basic Authorization header
				post.addHeader(OAuthConstants.AUTHORIZATION,
						getBasicAuthorizationHeader(oauthDetails.getClientId(), oauthDetails.getClientSecret()));
				logger.fine(
						"It is possible login timeout. Will try to renew access token.Retry with client credentials");
				post.releaseConnection();
				response = client.execute(post);
				code = response.getStatusLine().getStatusCode();
				if (code == 401 || code == 403) {
					logger.severe("Could not authenticate using client credentials.");
					throw new RuntimeException(
							"Could not retrieve access token for client: " + oauthDetails.getClientId());

				}

			}
			map = handleResponse(response);
//			accessToken = map.get(OAuthConstants.ACCESS_TOKEN);
//System.out.println("!!!!access token=" + accessToken);			
//System.out.println("!!!!Refresh token="+			map.get(OAuthConstants.REFRESH_TOKEN));
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

//		return accessToken;
		return map;
	}

	public String refreshAccessToken(OAuth2Details oauthDetails, String refreshToken) {
		Map<String, String> map = null;
		String newAccessToken = null;
		HttpPost post = new HttpPost(oauthDetails.getAuthenticationServerUrl());
		if (!isValid(refreshToken)) {
			throw new RuntimeException("Please provide valid refresh token in config file");
		}

		List<BasicNameValuePair> parametersBody = new ArrayList<BasicNameValuePair>();
		parametersBody.add(new BasicNameValuePair("grant_type", OAuthConstants.REFRESH_TOKEN));
		parametersBody.add(new BasicNameValuePair(OAuthConstants.REFRESH_TOKEN, refreshToken));

		parametersBody.add(new BasicNameValuePair(OAuthConstants.CLIENT_ID, oauthDetails.getClientId()));

		parametersBody.add(new BasicNameValuePair(OAuthConstants.CLIENT_SECRET, oauthDetails.getClientSecret()));

		DefaultHttpClient client = new DefaultHttpClient();
		HttpResponse response = null;
		try {
			post.setEntity(new UrlEncodedFormEntity(parametersBody));

			response = client.execute(post);
			int code = response.getStatusLine().getStatusCode();

			map = handleResponse(response);
			newAccessToken = map.get(OAuthConstants.ACCESS_TOKEN);

		} catch (ClientProtocolException e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}

		return newAccessToken;
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
			throw new RuntimeException(response.getStatusLine() +"\nCannot handle " + contentType
					+ " content type. Supported content types include JSON, XML and URLEncoded");
		}

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
//			System.out.println(String.format("  %s = %s", entry.getKey(),
//					entry.getValue()));
//		}
		return oauthLoginResponse;
	}

	public  Map handleURLEncodedResponse(HttpResponse response) {
		Map<String, Charset> map = Charset.availableCharsets();
		Map<String, String> oauthResponse = new HashMap<String, String>();
		Set<Map.Entry<String, Charset>> set = map.entrySet();
		Charset charset = null;
		HttpEntity entity = response.getEntity();

//		System.out.println();
//		System.out.println("********** Response Received **********");

		for (Map.Entry<String, Charset> entry : set) {
//			System.out.println(String.format("  %s = %s", entry.getKey(),
//					entry.getValue()));
			if (entry.getKey().equalsIgnoreCase(HTTP.UTF_8)) {
				charset = entry.getValue();
			}
		}

		try {
			List<NameValuePair> list = URLEncodedUtils.parse(EntityUtils.toString(entity), Charset.forName(HTTP.UTF_8));
			for (NameValuePair pair : list) {
				logger.fine(String.format("  %s = %s", pair.getName(), pair.getValue()));
				oauthResponse.put(pair.getName(), pair.getValue());
			}

		} catch (IOException e) {
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

			logger.fine("********** Response Receieved **********");
			parseXMLDoc(null, doc, oauthResponse);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Exception occurred while parsing XML response");
		}
		return oauthResponse;
	}

	public  void parseXMLDoc(Element element, Document doc, Map<String, String> oauthResponse) {
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
					logger.fine(childElement.getTagName() + " : " + childElement.getTextContent());
					oauthResponse.put(childElement.getTagName(), childElement.getTextContent());
					parseXMLDoc(childElement, null, oauthResponse);
				}

			}
		}
	}

	public String getAuthorizationHeaderForAccessToken(String accessToken) {
		return OAuthConstants.BEARER + " " + accessToken;
	}

	public  String getBasicAuthorizationHeader(String username, String password) {
		return OAuthConstants.BASIC + " " + encodeCredentials(username, password);
	}

	public String encodeCredentials(String username, String password) {
		String cred = username + ":" + password;
		String encodedValue = null;
		byte[] encodedBytes = Base64.encodeBase64(cred.getBytes());
		encodedValue = new String(encodedBytes);
		logger.fine("encodedBytes " + new String(encodedBytes));

		byte[] decodedBytes = Base64.decodeBase64(encodedBytes);
		logger.fine("decodedBytes " + new String(decodedBytes));

		return encodedValue;

	}

	public boolean isValidInput(OAuth2Details input) {
		if (input == null) {
			logger.info("Try to validate input but got null input value");
			return false;
		}

		String grantType = input.getGrantType();

		if (!isValid(grantType)) {
			logger.severe("Invalid grant_type.");
			return false;
		}

		if (!isValid(input.getAuthenticationServerUrl())) {
			logger.severe("Invalid value for authentication server url");
			return false;
		}

		if (grantType.equals(OAuthConstants.GRANT_TYPE_PASSWORD)) {
			if (!isValid(input.getUsername()) || !isValid(input.getPassword())) {
				logger.severe("Invalid username and password for password grant_type");
				return false;
			}
		}

		if (grantType.equals(OAuthConstants.GRANT_TYPE_CLIENT_CREDENTIALS)) {
			if (!isValid(input.getClientId()) || !isValid(input.getClientSecret())) {
				logger.severe("Invalid client_id and client_secret for client_credentials grant_type");
				return false;
			}
		}

		logger.fine("Validated Input:"+ input);
		return true;

	}

	public static boolean isValid(String str) {
		return (str != null && str.trim().length() > 0);
	}

}
