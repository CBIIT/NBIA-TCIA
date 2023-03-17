package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;


import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.QAUserUtil;
import gov.nih.nci.nbia.restUtil.RoleCache;
import gov.nih.nci.nbia.security.AuthenticationWithKeycloak;
import gov.nih.nci.nbia.util.CollectionSiteUtil;
import java.text.SimpleDateFormat;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.nbia.dao.ValueAndCountDAOImpl;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;
import gov.nih.nci.nbia.dto.SpeciesDTO;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.core.NestedRuntimeException;

@Path("/getCollectionSite")
public class GetCollectionSite extends getData{
	private static final String column="Species";
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all roles
	 *
	 * @return String - set of roles
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() {

		
		try {			
//			Authentication authentication = SecurityContextHolder.getContext()
//					.getAuthentication();
//			String userName = (String) authentication.getPrincipal();
	 		String userName = getUserName(); 
			
			List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
			if (authorizedSiteData==null){
			     AuthorizationManager am = new AuthorizationManager(userName);
			     authorizedSiteData = am.getAuthorizedSites();
			     AuthorizationUtil.setUserSites(userName, authorizedSiteData);
			}
			List <String>collectionSites=null;
			if (authorizedSiteData!=null) {
				collectionSites=CollectionSiteUtil.getUserSiteData(authorizedSiteData);
			}

        		return Response.ok(JSONUtil.getJSONforStringList(collectionSites)).type("application/json")
        				.build();
        		} catch (Exception e) {
        			// TODO Auto-generated catch block
        			e.printStackTrace();
        		}
        		return Response.status(500)
        				.entity("Server was not able to process your request").build();

	}

}
