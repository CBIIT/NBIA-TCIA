//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.net.InetAddress;

@Path("/hostName")
public class GetHostName extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse() throws Exception {
		String hostname;
		InetAddress ip;
		ip = InetAddress.getLocalHost();
		hostname = ip.getHostName();
		if (hostname!=null&&hostname.indexOf(".")>1) {
		    hostname=hostname.substring(0, hostname.indexOf("."));
		}

		return Response.ok(hostname).type("application/text")
				.build();
	}
}
