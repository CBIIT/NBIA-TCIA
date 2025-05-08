package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Context;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.Set;

import gov.nih.nci.nbia.restUtil.ManifestMaker;

@Path("/v4/getManifestText")
public class GetManifestText extends getData {
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)


	public Response constructResponse(@FormParam("list") List<String> list, 
			@FormParam("includeAnnotation") String includeAnnotation, @Context HttpServletRequest request) {

      Set<String> allowedParams = Set.of("list", "includeAnnotation");

      Enumeration<String> paramNames = request.getParameterNames();
      while (paramNames.hasMoreElements()) {
          String param = paramNames.nextElement();
          if (!allowedParams.contains(param)) {
              String msg = "Invalid form parameter: '" + param +
                           "'. Allowed parameters are: " + allowedParams;
              return Response.status(Response.Status.BAD_REQUEST)
                             .entity(msg)
                             .build();
          }
      }

			long currentTimeMillis = System.currentTimeMillis();
			String manifestFileName = "manifest-" + currentTimeMillis + ".tcia";
			String manifest=ManifestMaker.getManifextFromSeriesIds(list, includeAnnotation, manifestFileName);
			return Response.ok(manifest).type("application/x-nbia-manifest-file").build();
	}
}
