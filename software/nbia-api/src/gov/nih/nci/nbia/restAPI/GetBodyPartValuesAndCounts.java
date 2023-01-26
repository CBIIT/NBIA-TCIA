//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;

@Path("/getBodyPartValuesAndCounts")
public class GetBodyPartValuesAndCounts extends getData{

	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@QueryParam("Collection") String collection, 
			@QueryParam("Modality") String modality) {

		try {	
//			   Authentication authentication = SecurityContextHolder.getContext()
//						.getAuthentication();
//				String user = (String) authentication.getPrincipal();
	 		String user = getUserName(); 
	 		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
				if (authorizedSiteData==null){
				     AuthorizationManager am = new AuthorizationManager(user);
				     authorizedSiteData = am.getAuthorizedSites();
				     AuthorizationUtil.setUserSites(user, authorizedSiteData);
				}
				AuthorizationCriteria auth = new AuthorizationCriteria();
				auth.setSeriesSecurityGroups(new ArrayList<String>());
				auth.setSites(authorizedSiteData);
				List<String> seriesSecurityGroups = new ArrayList<String>();
				ValueAndCountDAO valueAndCountDAO = (ValueAndCountDAO)SpringApplicationContext.getBean("ValueAndCountDAO");
				ValuesAndCountsCriteria criteria=new ValuesAndCountsCriteria();
				criteria.setObjectType("BODYPART");
				criteria.setAuth(auth);
				criteria.setModality(modality);
				criteria.setCollection(collection);
				List<ValuesAndCountsDTO> values = valueAndCountDAO.getValuesAndCounts(criteria);
				return Response.ok(JSONUtil.getJSONforCollectionCounts(values)).type("application/json")
						.build();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				return Response.status(500)
						.entity("Server was not able to process your request").build();
	}
}
