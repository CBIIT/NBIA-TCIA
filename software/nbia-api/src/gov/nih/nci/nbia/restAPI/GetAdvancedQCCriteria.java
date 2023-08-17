package gov.nih.nci.nbia.restAPI;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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
import gov.nih.nci.nbia.util.CollectionSiteUtil;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;

@Path("/getAdvancedQCCriteria")
public class GetAdvancedQCCriteria extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	* This method get a set of all collection names
	*
	* @return String - set of collection names
	*/
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() {

		try {
			//			   Authentication authentication = SecurityContextHolder.getContext()
			//						.getAuthentication();
			//				String user = (String) authentication.getPrincipal();
			long startTime = System.currentTimeMillis();
			System.out.println("Begin /getAdvancedQCCriteria/ :" + startTime);

			String user = getUserName(); 
			System.out.println("Get Username took "+(System.currentTimeMillis()-startTime));
			startTime = System.currentTimeMillis();

			List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
			System.out.println("Get authorized sites took "+(System.currentTimeMillis()-startTime));
			startTime = System.currentTimeMillis();
			if (authorizedSiteData==null){
				AuthorizationManager am;
				if(user == null){
					am = new AuthorizationManager();
				} else {
					am = new AuthorizationManager(user);
				}
				System.out.println("AuthorizationManager took "+(System.currentTimeMillis()-startTime));
				startTime = System.currentTimeMillis();
				authorizedSiteData = am.getAuthorizedSites();
				System.out.println("Get authorized sites took "+(System.currentTimeMillis()-startTime));
				startTime = System.currentTimeMillis();
				AuthorizationUtil.setUserSites(user, authorizedSiteData);
				System.out.println("Set authorized sites took "+(System.currentTimeMillis()-startTime));
				startTime = System.currentTimeMillis();
			}
			AuthorizationCriteria auth = new AuthorizationCriteria();
			System.out.println("Get authorized sites took "+(System.currentTimeMillis()-startTime));
			startTime = System.currentTimeMillis();
			auth.setSeriesSecurityGroups(new ArrayList<String>());
			auth.setSites(authorizedSiteData);
			System.out.println("Set authorized sites took "+(System.currentTimeMillis()-startTime));
			startTime = System.currentTimeMillis();

			List<PopupCriteriaSelectorDTO> dtos=JSONDeserializer.getPopUpCriteriaFromJson();
			System.out.println("Get popup criteria took "+(System.currentTimeMillis()-startTime));
			startTime = System.currentTimeMillis();

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
					System.out.println("Get modalities took "+(System.currentTimeMillis()-startTime));
					startTime = System.currentTimeMillis();
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
					System.out.println("Get manufactures took "+(System.currentTimeMillis()-startTime));
					startTime = System.currentTimeMillis();
				}
				if (dto.getParentMenuName().equalsIgnoreCase("QC Status")) {
					List<String> statuses = new ArrayList<String>();
					for (PopupCriteriaObjects object:dto.getCriteriaObjects()) {
						object.getConfiguration().setDynamicQueryCriteriaListData(VisibilityStatus.getVisibilities());
					}
					System.out.println("Get QC status took "+(System.currentTimeMillis()-startTime));
					startTime = System.currentTimeMillis();
				}
				if (dto.getParentMenuName().equalsIgnoreCase("Collection")) {
					List <String>collectionSites=new ArrayList<String>();
					if (authorizedSiteData!=null) {
						collectionSites=CollectionSiteUtil.getUserSiteData(authorizedSiteData);
					}
					for (PopupCriteriaObjects object:dto.getCriteriaObjects()) {
						object.getConfiguration().setDynamicQueryCriteriaListData(collectionSites);
					}
					System.out.println("Get Collection took "+(System.currentTimeMillis()-startTime));
					startTime = System.currentTimeMillis();
				}
			}
			return Response.ok(JSONUtil.getJSONforPopupCriteriaSelector(dtos)).type("application/json").build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500).entity("Server was not able to process your request").build();
	}
}
