//To Test:  http://localhost:8080/nbia-api/oauth/token

package gov.nih.nci.nbia.restAPI;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;

import gov.nih.nci.nbia.security.AuthenticationWithKeycloak;
import gov.nih.nci.nbia.util.NCIAConfig;


@Path("/oauth/token")
public class KeycloakGetToken extends getData{
	// private static final String column="BodyPartExamined";
	// public final static String TEXT_CSV = "text/csv";
	public static final int HTTP_OK = 200;
	@Context
	private HttpServletRequest httpRequest;

	/**
	 * This method get a set of body part values filtered by query keys
	 *
	 * @return String - set of patient
	 */
	@POST
	@Produces({ MediaType.APPLICATION_JSON })
	public Response constructResponse(@FormParam("username") String username, @FormParam("password") String password,
			@FormParam("client_id") String client_id, @FormParam("client_secret") String client_secret,
			@FormParam("grant_type") String grant_type, @FormParam("refresh_token") String refresh_token) throws Exception {

		if (NCIAConfig.getGuestUsername().equals(username)) {
			password = NCIAConfig.getGuestPassword();
		}
		if (grant_type.equalsIgnoreCase("password")) {
			client_id = NCIAConfig.getKeycloakClientId();
			if (client_secret == null){
				client_secret = "";
			}

			HttpResponse response = AuthenticationWithKeycloak.getInstance().getAccessTokenResp(username, password,
					client_id, client_secret);
			int code = response.getStatusLine().getStatusCode();
			return Response.status(code).entity(EntityUtils.toString(response.getEntity())).build();
		} else if (grant_type.equalsIgnoreCase("refresh_token")) {
			HttpResponse response = AuthenticationWithKeycloak.getInstance().getRefreshTokenResp(username, client_id,
					client_secret, refresh_token);
			int code = response.getStatusLine().getStatusCode();
			return Response.status(code).entity(EntityUtils.toString(response.getEntity())).build();
		} else {
			return Response.status(0, "Wrong grant_type entered. Valid grant_type is password or refresh_token.")
					.build();
		}
	}
}
