package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.MultivaluedMap;

import java.util.Set;

import gov.nih.nci.nbia.util.CollectionSiteUtil;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.dao.CollectionDescDAO;
import gov.nih.nci.nbia.dto.CollectionDescDTO;

@Path("/v4/getCollectionDescriptions")
public class GetCollectionDescriptions extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse( @QueryParam("collectionName") String collectionName, @Context UriInfo uriInfo) throws Exception {

    Set<String> allowedParams = Set.of("collectionName");
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

		List<String> authCol = null;

		try {
			//userName = getUserName();
			authCol = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (collectionName==null || collectionName.equals("")){

			CollectionDescDAO collectionDescDAO = (CollectionDescDAO)SpringApplicationContext.getBean("collectionDescDAO");
			List<CollectionDescDTO> values = collectionDescDAO.findCollectionDescs(authCol);
			return Response.ok(JSONUtil.getJSONforCollectionDecs_v4(values)).type("application/json")
					.build();
	    } else {
	    	List<CollectionDescDTO> values = new ArrayList<CollectionDescDTO>();
	    	CollectionDescDAO collectionDescDAO = (CollectionDescDAO)SpringApplicationContext.getBean("collectionDescDAO");
		    CollectionDescDTO value = collectionDescDAO.findCollectionDescByCollectionName(collectionName, authCol);
		    if (value!=null){
		    	values.add(value);
		    }
		  return Response.ok(JSONUtil.getJSONforCollectionDecs_v4(values)).type("application/json")
				.build();
	    }
	}
}
