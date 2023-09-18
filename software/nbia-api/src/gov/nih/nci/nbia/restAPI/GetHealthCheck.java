package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.util.SpringApplicationContext;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.core.Response;


@Path("/up")
public class GetHealthCheck {

	@GET
	public Response  constructResponse() {
		return Response.ok("up").build();
	}
}
