package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
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

@Path("/getSpeciesValuesAndCounts")
public class GetSpeciesValuesAndCounts extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all species names
	 *
	 * @return String - set of species names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() {

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
		criteria.setObjectType("SPECIES");
		criteria.setAuth(auth);
		List<ValuesAndCountsDTO> values = valueAndCountDAO.getValuesAndCounts(criteria);
		return Response.ok(JSONUtil.getJSONforCollectionCounts(values)).type("application/json").build();
	}
}
