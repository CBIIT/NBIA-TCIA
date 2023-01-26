package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.csmDao.UserDao;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/getUserListForPG")
public class V3_getUserListForPG extends getData{
	public final static String TEXT_CSV = "text/csv";
	private static final String column ="UserName";

	/**
	 * This method get a list of login names associated with the given protection group
	 *
	 * @return String - list of user login names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response constructResponse(@QueryParam("PGName") String pgName, @QueryParam("format") String format) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		UserDao dao = (UserDao) SpringApplicationContext.getBean("userDao");
		List<String> userNames= dao.getAllUsersFromPG(pgName);

		return formatResponse(format, userNames, column);
	}
}
