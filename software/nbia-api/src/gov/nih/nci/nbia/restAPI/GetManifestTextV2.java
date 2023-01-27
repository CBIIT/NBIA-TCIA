package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.restUtil.ManifestMaker;

@Path("/getManifestTextV2")
public class GetManifestTextV2 extends getData {
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)


	public Response constructResponse(@FormParam("list") List<String> list, 
			@FormParam("includeAnnotation") String includeAnnotation) {

		try {

			long currentTimeMillis = System.currentTimeMillis();
			String manifestFileName = "manifest-" + currentTimeMillis + ".tcia";
			String manifest=ManifestMaker.getManifextFromSeriesIds(list, includeAnnotation, manifestFileName);
			return Response.ok(manifest).type("application/x-nbia-manifest-file").build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500).entity("Server was not able to process your request").build();
	}
}
