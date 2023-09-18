package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.CollectionSiteUtil;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.dao.CollectionDescDAO;
import gov.nih.nci.nbia.dto.CollectionDescDTO;

@Path("/getCollectionDescriptions")
public class GetCollectionDescriptions extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse( @QueryParam("collectionName") String collectionName) throws Exception {

 		String userName = getUserName(); 
 		AuthorizationManager am = new AuthorizationManager(userName);
 		List<String> authorizedCollection = am.getAuthorizedCollections();

		if (collectionName==null || collectionName.equals("")){

			CollectionDescDAO collectionDescDAO = (CollectionDescDAO)SpringApplicationContext.getBean("collectionDescDAO");
			List<CollectionDescDTO> values = collectionDescDAO.findCollectionDescs(authorizedCollection);
			return Response.ok(JSONUtil.getJSONforCollectionDecs(values)).type("application/json")
					.build();
	    } else {
	    	List<CollectionDescDTO> values = new ArrayList<CollectionDescDTO>();
	    	CollectionDescDAO collectionDescDAO = (CollectionDescDAO)SpringApplicationContext.getBean("collectionDescDAO");
		    CollectionDescDTO value = collectionDescDAO.findCollectionDescByCollectionName(collectionName, authorizedCollection);
		    if (value!=null){
		    	values.add(value);
		    }
		  return Response.ok(JSONUtil.getJSONforCollectionDecs(values)).type("application/json")
				.build();
	    }
	}
}
