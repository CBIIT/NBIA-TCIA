package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.util.NCIAConfig;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v1/getKeycloakParams")
public class V1_getKeycloakParams extends getData{
	private static final String[] columns={"paramName","paramValue"};
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a list of configure parameters
	 * 
	 * @return String - list of configure parameters
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("format") String format) {

		List<Object []> data = new ArrayList<Object[]>();
		Object [] authenticationConfigObjs = {"authenticationConfig", NCIAConfig.getAuthenticationConfig()};
        data.add(authenticationConfigObjs);				
		Object [] userNameObjs = {"guestUsername", NCIAConfig.getGuestUsername()};
        data.add(userNameObjs);
        Object [] passwordObjs = {"guestPassword", NCIAConfig.getGuestPassword()};
        data.add(passwordObjs);
        Object [] keycloakTokenUrlObjs = {"keycloakTokenUrl", NCIAConfig.getKeycloakTokenUrl()};
        data.add(keycloakTokenUrlObjs);
        Object [] KeycloakClientIdObjs = {"KeycloakClientId", NCIAConfig.getKeycloakClientId()};
        data.add(KeycloakClientIdObjs);

		return formatResponse(format, data, columns);
	}	
}