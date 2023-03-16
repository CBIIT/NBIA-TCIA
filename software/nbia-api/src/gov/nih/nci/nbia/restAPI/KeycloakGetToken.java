//To Test: http://localhost:8080/nbia-api/oauth/token

package gov.nih.nci.nbia.restAPI;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.http.HttpResponse;

import gov.nih.nci.nbia.restSecurity.AuthenticationWithKeycloak;


@Path("/oauth/token")
public class token extends getData{
	//private static final String column="BodyPartExamined";
	//public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of body part values filtered by query keys
	 *
	 * @return String - set of patient
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON})

	public Response  constructResponse(@FormParam("username") String username, 
			@FormParam("password") String password,
			@FormParam("client_id") String client_id, 
			@FormParam("client_secret") String client_secret,
			@FormParam("grant_type") String grant_type,
			@FormParam("refresh_token") String refresh_token) {
		
		if (grant_type.equalsIgnoreCase("password")) {
		String resp = AuthenticationWithKeycloak.getInstance().getAccessToken(username, password, client_id, client_secret);
		return Response.ok(resp).type("application/json").build();
		}
		else if (grant_type.equalsIgnoreCase("refresh_token")) {
			String resp = AuthenticationWithKeycloak.getInstance().getRefreshToken(client_id, client_secret, refresh_token);
			return Response.ok(resp).type("application/json").build();
		}
		else {
			return Response.status(0, "Wrong grant_type entered. Valid grant_type is password or refresh_token.").build();
		}
	}
}
