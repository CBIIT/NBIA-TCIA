//To Test: http://localhost:8080/nbia-api/v2/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/v2/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/v2/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/v2/getCollectionValues?format=csv

package gov.nih.nci.nbia.restAPI.v4;

import java.util.ArrayList;
import java.util.List;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;


@Path("/v4/getCollectionValues")
public class V4_getCollectionValues extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response  constructResponse(@QueryParam("format") String format) {
		String userName = getUserName(); 

		Set<String> authorizedCollectionsUnique = new LinkedHashSet<String>();
    List<String> authorizedCollections = null;


		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
		if (authorizedSiteData==null){
			try {
			     AuthorizationManager am = new AuthorizationManager(userName);
			     authorizedSiteData = am.getAuthorizedSites();
			     AuthorizationUtil.setUserSites(userName, authorizedSiteData);
				} catch (Exception e) {
					e.printStackTrace();
					return formatResponse(format, authorizedCollections, column);
				}
		}
		AuthorizationCriteria auth = new AuthorizationCriteria();
		auth.setSeriesSecurityGroups(new ArrayList<String>());
		auth.setSites(authorizedSiteData);
		List<String> seriesSecurityGroups = new ArrayList<String>();
		ValueAndCountDAO valueAndCountDAO = (ValueAndCountDAO)SpringApplicationContext.getBean("ValueAndCountDAO");
		ValuesAndCountsCriteria criteria=new ValuesAndCountsCriteria();
		criteria.setObjectType("COLLECTION");
		criteria.setAuth(auth);
		List<Object[]> values = valueAndCountDAO.getValuesAndCounts_v4(criteria);
		for(Object[] vdto:values) {
			authorizedCollectionsUnique.add((String) vdto[0]);
		}

    authorizedCollections = new ArrayList<>(authorizedCollectionsUnique);
		return formatResponse(format, authorizedCollections, column);
	}
}
