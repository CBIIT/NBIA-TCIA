package gov.nih.nci.nbia.restAPI;

import java.util.Arrays;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.MultivaluedMap;

import java.util.Set;

import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.restSecurity.AuthorizationService;
import gov.nih.nci.nbia.util.SpringApplicationContext;


@Path("/v4/getDeniedSeries")
public class V4_getDeniedSeries extends getData {
	private static final String column="SeriesInstanceUID";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of Manufacturer filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	public Response  constructResponse(@QueryParam("seriesList") List<String> seriesList,
			@QueryParam("userName") String userName, @QueryParam("format") String format, @Context UriInfo uriInfo) {

    Set<String> allowedParams = Set.of("seriesList", "userName", "format");
    MultivaluedMap<String, String> queryParams = uriInfo.getQueryParameters();

    for (String param : queryParams.keySet()) {
        if (!allowedParams.contains(param)) {
            String msg = "Invalid query parameter: '" + param +
                         "'. Allowed parameters are: " + allowedParams;
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(msg)
                           .build();
        }
    }

	
		List<String> authorizedCollections = null;
		List<String> results = null;

		if (seriesList == null || seriesList.isEmpty()) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, seriesList,  a list of SeriesInstanceUID is required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}
		try {
			if (userName == null || "null".equals(userName))
				authorizedCollections = getPublicCollections();
			else authorizedCollections = getAuthorizedCollections(userName);
			
			String [] seriesIds = seriesList.get(0).split(",");
			List<String> list = Arrays.asList(seriesIds);   
			GeneralSeriesDAO gsDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
			results = gsDao.getDeniedSeries(list, authorizedCollections);
			//results = gsDao.getDeniedSeries(seriesList, authorizedCollections);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR)
					.entity("Server was not able to process your request due to exception: "+ e.getMessage()).build();
		}
		if (results == null) {
			return Response.status(Status.NO_CONTENT)
					.entity("No series denied.").build();
		}
		else return formatResponse(format, results, column);
	}
}
