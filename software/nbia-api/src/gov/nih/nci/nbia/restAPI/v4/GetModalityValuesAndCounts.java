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

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;

import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;

@Path("/v4/getModalityValuesAndCounts")
public class GetModalityValuesAndCounts extends getData{
  private static final String[] columns={"Modality", "Count", "Authorized"};
  public final static String TEXT_CSV = "text/csv";

	@GET
  @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response constructResponse(@QueryParam("Collection") String collection,
			@QueryParam("BodyPartExamined") String bodyPart, @Context UriInfo uriInfo) throws Exception{

    Set<String> allowedParams = Set.of("Collection", "BodyPartExamined");
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

    String format = "JSON";
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
		criteria.setObjectType("MODALITY");
		criteria.setAuth(auth);
		criteria.setBodyPart(bodyPart);
		criteria.setCollection(collection);
		List<Object[]> values = valueAndCountDAO.getValuesAndCounts_v4(criteria);

    return formatResponse(format, values, columns);
	}
}
