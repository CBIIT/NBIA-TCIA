package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.qctool.*;

@Path("/getVisibilities")
public class GetVisibilites extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() {
	       List<String>visibilities=null;
		visibilities=VisibilityStatus.getVisibilities();
		return Response.ok(JSONUtil.getJSONforStringList(visibilities)).type("application/json")
		.build();
	}
}
