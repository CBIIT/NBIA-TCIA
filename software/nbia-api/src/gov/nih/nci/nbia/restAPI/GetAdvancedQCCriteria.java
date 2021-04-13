//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;
import gov.nih.nci.nbia.qctool.VisibilityStatus;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONDeserializer;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.PopupCriteriaObjects;
import gov.nih.nci.nbia.restUtil.PopupCriteriaSelectorDTO;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;
@Path("/getAdvancedQCCriteria")
public class GetAdvancedQCCriteria extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() {

		try {			    	
			   Authentication authentication = SecurityContextHolder.getContext()
						.getAuthentication();
				String user = (String) authentication.getPrincipal();
				List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
				if (authorizedSiteData==null){
				     AuthorizationManager am = new AuthorizationManager(user);
				     authorizedSiteData = am.getAuthorizedSites();
				     AuthorizationUtil.setUserSites(user, authorizedSiteData);
				}
				AuthorizationCriteria auth = new AuthorizationCriteria();
				auth.setSeriesSecurityGroups(new ArrayList<String>());
				auth.setSites(authorizedSiteData);
		
			    List<PopupCriteriaSelectorDTO> dtos=JSONDeserializer.getPopUpCriteriaFromJson();
			
			    for (PopupCriteriaSelectorDTO dto:dtos) {
			    	if (dto.getParentMenuName().equalsIgnoreCase("Modality")) {
						ValueAndCountDAO valueAndCountDAO = (ValueAndCountDAO)SpringApplicationContext.getBean("ValueAndCountDAO");
						ValuesAndCountsCriteria criteria=new ValuesAndCountsCriteria();
						criteria.setObjectType("MODALITY");
						criteria.setAuth(auth);
						List<ValuesAndCountsDTO> values = valueAndCountDAO.getValuesAndCounts(criteria);
						List<String> modalities = new ArrayList<String>();
						for (ValuesAndCountsDTO value:values) {
							modalities.add(value.getCriteria());
						}
						for (PopupCriteriaObjects object:dto.getCriteriaObjects()) {
							object.getConfiguration().setDynamicQueryCriteriaListData(modalities);
						}
			    	}
			    	if (dto.getParentMenuName().equalsIgnoreCase("Manufacturer")) {
						ValueAndCountDAO valueAndCountDAO = (ValueAndCountDAO)SpringApplicationContext.getBean("ValueAndCountDAO");
						ValuesAndCountsCriteria criteria=new ValuesAndCountsCriteria();
						criteria.setObjectType("MANUFACTURER");
						criteria.setAuth(auth);
						List<ValuesAndCountsDTO> values = valueAndCountDAO.getValuesAndCounts(criteria);
						List<String> manufactures = new ArrayList<String>();
						for (ValuesAndCountsDTO value:values) {
							manufactures.add(value.getCriteria());
						}
						for (PopupCriteriaObjects object:dto.getCriteriaObjects()) {
							object.getConfiguration().setDynamicQueryCriteriaListData(manufactures);
						}
			    	}			    	if (dto.getParentMenuName().equalsIgnoreCase("QC Status")) {
						List<String> statuses = new ArrayList<String>();
						for (PopupCriteriaObjects object:dto.getCriteriaObjects()) {
							object.getConfiguration().setDynamicQueryCriteriaListData(VisibilityStatus.getVisibilities());
						}
			    	}
			    	if (dto.getParentMenuName().equalsIgnoreCase("Collection")) {
						List <String>collectionSites=new ArrayList<String>();
						if (authorizedSiteData!=null) {
							for (SiteData siteData:authorizedSiteData) {
								collectionSites.add(siteData.getCollectionSite());
							}
						}
						for (PopupCriteriaObjects object:dto.getCriteriaObjects()) {
							object.getConfiguration().setDynamicQueryCriteriaListData(collectionSites);
						}
			    	}
				}				return Response.ok(JSONUtil.getJSONforPopupCriteriaSelector(dtos)).type("application/json")
						.build();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				return Response.status(500)
						.entity("Server was not able to process your request").build();
	}
}
