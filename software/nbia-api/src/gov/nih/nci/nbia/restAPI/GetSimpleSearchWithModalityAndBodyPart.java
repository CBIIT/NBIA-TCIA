package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;

import java.text.SimpleDateFormat;

@Path("/getSimpleSearchWithModalityAndBodyPart")
public class GetSimpleSearchWithModalityAndBodyPart extends getData{
	public final static String TEXT_CSV = "text/csv";
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) {

		try {	
//		Authentication authentication = SecurityContextHolder.getContext()
//				.getAuthentication();
//		String userName = (String) authentication.getPrincipal();
			String userName = getUserName(); 

		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(userName);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(userName, authorizedSiteData);
		}
		List<String> seriesSecurityGroups = new ArrayList<String>();
		int i=0;
		DICOMQuery query=new DICOMQuery();
		AuthorizationCriteria auth = new AuthorizationCriteria();
		auth.setSeriesSecurityGroups(seriesSecurityGroups);
		auth.setSites(authorizedSiteData);
		query.setCriteria(auth);
        System.out.println(inFormParams.get("criteriaType"+i).get(0));
		while (inFormParams.get("criteriaType"+i)!=null)
		{
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("CollectionCriteria")){
				if (query.getCollectionCriteria()==null){
				   CollectionCriteria criteria=new CollectionCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				} else {
					query.getCollectionCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ImageModalityCriteria")){
				if (query.getImageModalityCriteria()==null){
					ImageModalityCriteria criteria=new ImageModalityCriteria();
				   criteria.setImageModalityValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				} else {
					query.getImageModalityCriteria().setImageModalityValue(inFormParams.get("value"+i).get(0));
				}
			}
			
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("AnatomicalSiteCriteria")){
				if (query.getAnatomicalSiteCriteria()==null){
					AnatomicalSiteCriteria criteria=new AnatomicalSiteCriteria();
				   criteria.setAnatomicalSiteValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				} else {
					query.getAnatomicalSiteCriteria().setAnatomicalSiteValue(inFormParams.get("value"+i).get(0));
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ManufacturerCriteria")){
				if (query.getManufacturerCriteria()==null){
					ManufacturerCriteria criteria=new ManufacturerCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				} else {
					query.getManufacturerCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ModelCriteria")){
				if (query.getModelCriteria()==null){
					ModelCriteria criteria=new ModelCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				} else {
					query.getModelCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("SoftwareVersionCriteria")){
				if (query.getSoftwareVersionCriteria()==null){
					SoftwareVersionCriteria criteria=new SoftwareVersionCriteria();
				   criteria.setSoftwareVersionValue((inFormParams.get("value"+i).get(0)));
				   query.setCriteria(criteria);
				} else {
					query.getSoftwareVersionCriteria().setSoftwareVersionValue(inFormParams.get("value"+i).get(0));
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("DateRangeCriteria")){
				DateRangeCriteria criteria=new DateRangeCriteria();
				SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			    criteria.setFromDate(formatter.parse(inFormParams.get("fromDate"+i).get(0)));
			    criteria.setToDate(formatter.parse(inFormParams.get("toDate"+i).get(0)));
				query.setCriteria(criteria);
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("PatientCriteria")){
				if (query.getPatientCriteria()==null){
					PatientCriteria criteria=new PatientCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				} else {
					query.getPatientCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("MinNumberOfStudiesCriteria")){
				MinNumberOfStudiesCriteria criteria=new MinNumberOfStudiesCriteria();
			    criteria.setMinNumberOfStudiesValue(new Integer(inFormParams.get("value"+i).get(0)));
				query.setCriteria(criteria);
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ModalityAndedSearchCriteria")){
				ModalityAndedSearchCriteria criteria=new ModalityAndedSearchCriteria();
			    criteria.setModalityAndedSearchValue(inFormParams.get("value"+i).get(0));
				query.setCriteria(criteria);
			}
			i++;
		}
        PatientSearcher patientSearcher = new PatientSearcher();
        List<PatientSearchResultWithModilityAndBodyPart> patients = patientSearcher.searchForPatientsExtended(query);
		
		return Response.ok(JSONUtil.getJSONforPatientsWithModalityAndBodyPart(patients)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
}
