package gov.nih.nci.nbia.restAPI.v4;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Context;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.Set;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.ManifestMaker;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;


@Path("/v4/getManifestForCollection")
public class GetManifestForCollection extends getData {
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(@FormParam("collection") String collection, @FormParam("visibility") String visibility, @FormParam("includeAnnotation") String includeAnnotation, @Context HttpServletRequest request) {

    Set<String> allowedParams = Set.of("collection", "visibility", "includeAnnotation");

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

		if (includeAnnotation == null || includeAnnotation.length() < 1) {
			includeAnnotation = "true";
		}

		if (visibility == null || visibility.length() < 1) {
			visibility = "1";
		} else if (visibility.equals("13")) {
			// 13 is "select all" or regardless the visibility
			visibility = "";
		}

		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm");
		LocalDateTime now = LocalDateTime.now();
		String manifestFileName = collection + "-" + dtf.format(now) + ".tcia";

		List<String> seriesList = null;

		GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
		List<String> seriesListOut = generalSeriesDAO.findSeriesByCollectionAndVisibility_v4(collection, visibility);
		String manifest = ManifestMaker.getManifextFromSeriesIds(seriesListOut, includeAnnotation,
				manifestFileName);
		return Response.ok(manifest).type("application/x-nbia-manifest-file").build();
	}

}
