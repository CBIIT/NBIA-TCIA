//To Test: http://localhost:8080/nbia-api/logout
package gov.nih.nci.nbia.restAPI;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Response;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import gov.nih.nci.nbia.util.NCIAConfig;

@Path("/logout")
public class KeycloakLogout extends getData{

	@Context private HttpServletRequest httpRequest;
  private Client httpClient = ClientBuilder.newClient();
	private static final String KEYCLOAK_TOKEN_URL = NCIAConfig.getKeycloakTokenUrl();
	private static final String KEYCLOAK_LOGOUT_URL = KEYCLOAK_TOKEN_URL.substring(0, KEYCLOAK_TOKEN_URL.lastIndexOf("/")).concat("/logout");
    
	@POST
	@Produces({MediaType.APPLICATION_JSON})
//    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response logout() throws URISyntaxException, UnsupportedEncodingException {
    System.out.println("we got here......");

	String token = httpRequest.getHeader("Authorization");

		String authHeader = null;
        if (token != null) {
        	if (token.equals("Bearer undefined"))
        		return Response.status(0, "No valid token.").build();
        	else {
        		token = token.replaceFirst("Bearer ", "");
        	}
        } else {
            //no account to logout
        	//return Response.status(Response.Status.BAD_REQUEST).build();
        	return Response.status(0, "No valid token.").build();
        }

        // Construct the Keycloak logout URL with the id_token_hint and post_logout_redirect_uri parameters
        String logoutUrl = KEYCLOAK_LOGOUT_URL + "?token=" + encodeParameter(token);


        // Extract any additional data needed for the POST request to Keycloak (if any)
        String additionalData = extractAdditionalData();


        // Make a POST request to the Keycloak logout endpoint
        Response keycloakResponse = httpClient.target(logoutUrl)
                .request()
                .header("Authorization", authHeader)
                .header("Connection", "close")
                .post(Entity.entity(additionalData, MediaType.APPLICATION_JSON));


        // Extract the response from the Keycloak endpoint and return it
        return Response.status(keycloakResponse.getStatus())
                .entity(keycloakResponse.readEntity(String.class))
                .build();


    }

    // Method to extract any additional data needed for the Keycloak POST request
    private String extractAdditionalData() {
        // Example: Extracting form parameters from the initial request
        // Modify this part according to your actual data requirements
        Form form = new Form();
        for (Map.Entry<String, String[]> entry : httpRequest.getParameterMap().entrySet()) {
            form.param(entry.getKey(), entry.getValue()[0]);
        }
        return form.asMap().toString(); // Convert form data to string (you may need to adjust this)
    }

    private String encodeParameter(String value) throws UnsupportedEncodingException {
        if (value != null) {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
        }
        return "";
    }	
}
