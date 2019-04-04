//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;
import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.querystorage.QueryStorageManager;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.PatientResultSetCache;
import gov.nih.nci.nbia.restUtil.ResultSetSorter;
import gov.nih.nci.nbia.restUtil.PatientSearchSummary;
import gov.nih.nci.nbia.restUtil.PatientSummaryFactory;


import java.text.SimpleDateFormat;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Path("/getSimpleSearchWithModalityAndBodyPartPaged")
public class GetSimpleSearchWithModalityAndBodyPartPaged extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) {

		try {	
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		String userName = (String) authentication.getPrincipal();
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
		String queryKey=userName;
        System.out.println(inFormParams.get("criteriaType"+i).get(0));
		while (inFormParams.get("criteriaType"+i)!=null)
		{
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("CollectionCriteria")){
				if (query.getCollectionCriteria()==null){
				   CollectionCriteria criteria=new CollectionCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="CollectionCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getCollectionCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
					queryKey+="CollectionCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("SpeciesCriteria")){
				if (query.getSpeciesCriteria()==null){
					SpeciesCriteria criteria=new SpeciesCriteria();
				   criteria.setSpeciesValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="SpeciesCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getSpeciesCriteria().setSpeciesValue(inFormParams.get("value"+i).get(0));
					queryKey+="SpeciesCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ImageModalityCriteria")){
				if (query.getImageModalityCriteria()==null){
					ImageModalityCriteria criteria=new ImageModalityCriteria();
				   criteria.setImageModalityValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="ImageModalityCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getImageModalityCriteria().setImageModalityValue(inFormParams.get("value"+i).get(0));
					queryKey+="ImageModalityCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("AnatomicalSiteCriteria")){
				if (query.getAnatomicalSiteCriteria()==null){
					AnatomicalSiteCriteria criteria=new AnatomicalSiteCriteria();
				   criteria.setAnatomicalSiteValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="AnatomicalSiteCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getAnatomicalSiteCriteria().setAnatomicalSiteValue(inFormParams.get("value"+i).get(0));
					queryKey+="AnatomicalSiteCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ManufacturerCriteria")){
				if (query.getManufacturerCriteria()==null){
					ManufacturerCriteria criteria=new ManufacturerCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="ManufacturerCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getManufacturerCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
					queryKey+="ManufacturerCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ModelCriteria")){
				if (query.getModelCriteria()==null){
					ModelCriteria criteria=new ModelCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="ModelCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getModelCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
					queryKey+="ModelCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("SoftwareVersionCriteria")){
				if (query.getSoftwareVersionCriteria()==null){
					SoftwareVersionCriteria criteria=new SoftwareVersionCriteria();
				   criteria.setSoftwareVersionValue((inFormParams.get("value"+i).get(0)));
				   query.setCriteria(criteria);
				   queryKey+="SoftwareVersionCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getSoftwareVersionCriteria().setSoftwareVersionValue(inFormParams.get("value"+i).get(0));
					queryKey+="SoftwareVersionCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("DateRangeCriteria")){
				DateRangeCriteria criteria=new DateRangeCriteria();
				SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			    criteria.setFromDate(formatter.parse(inFormParams.get("fromDate"+i).get(0)));
			    criteria.setToDate(formatter.parse(inFormParams.get("toDate"+i).get(0)));
				query.setCriteria(criteria);
				queryKey+="DateRangeCriteria"+inFormParams.get("fromDate"+i).get(0)+inFormParams.get("toDate"+i).get(0);
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("PatientCriteria")){
				if (query.getPatientCriteria()==null){
					PatientCriteria criteria=new PatientCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="PatientCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getPatientCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
					queryKey+="PatientCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("MinNumberOfStudiesCriteria")){
				MinNumberOfStudiesCriteria criteria=new MinNumberOfStudiesCriteria();
			    criteria.setMinNumberOfStudiesValue(new Integer(inFormParams.get("value"+i).get(0)));
				query.setCriteria(criteria);
				queryKey+="MinNumberOfStudiesCriteria"+inFormParams.get("value"+i).get(0);
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ModalityAndedSearchCriteria")){
				ModalityAndedSearchCriteria criteria=new ModalityAndedSearchCriteria();
			    criteria.setModalityAndedSearchValue(inFormParams.get("value"+i).get(0));
				query.setCriteria(criteria);
				queryKey+="ModalityAndedSearchCriteria"+inFormParams.get("value"+i).get(0);
			}
			i++;
		}
		String sortField=inFormParams.get("sortField").get(0);
		String sortDirection=inFormParams.get("sortDirection").get(0);
		String startString=inFormParams.get("start").get(0);
		String sizeString=inFormParams.get("size").get(0);
		int start = Integer.parseInt(startString);
		int size = Integer.parseInt(sizeString);
		String sort = sortField+"-"+sortDirection;
		List<PatientSearchResultWithModilityAndBodyPart> patients = null;
		PatientResultSetCache cache = new PatientResultSetCache();
		PatientSearchSummary  patientSearchSummary=cache.getPatientSearchSummary(queryKey);
		PatientSearchSummary  returnValue=null;
		if (patientSearchSummary==null) {
            PatientSearcher patientSearcher = new PatientSearcher();
            patients = patientSearcher.searchForPatientsExtended(query);
            if (inFormParams.get("tool")!=null&&!inFormParams.get("tool").get(0).equalsIgnoreCase("portal"))
            {
               query.setUserID(userName);
               query.setExecuteTime(Calendar.getInstance().getTime());

               QueryStorageManager qManager = (QueryStorageManager)SpringApplicationContext.getBean("queryStorageManager");

               qManager.addQueryToHistory(query, inFormParams.get("tool").get(0));
            }
            if (patients==null) {
            	System.out.println("no patients found");
            	patients = new ArrayList<PatientSearchResultWithModilityAndBodyPart>();
            }
            patients=new ResultSetSorter().sort2(patients, sortField, sortDirection);
            PatientSearchSummary cacheValue = PatientSummaryFactory.getNewPatientSearchSummary(patients, sort, true, null, null, null);
            //System.out.println("Size is "+SizeOf.getObjectSize(cacheValue));
            cache.putPatientPatientSearchSummary(queryKey, cacheValue);
            returnValue = PatientSummaryFactory.getReturnValue(cacheValue, start, size);
		}  else {
			System.out.println("Found in cache");
			System.out.println("Sort-"+sort);
			System.out.println("GetSort-"+patientSearchSummary.getSort());
			if (!patientSearchSummary.getSort().equalsIgnoreCase(sort)) {
				System.out.println("Doing sort");
				patients=new ResultSetSorter().sort2(patientSearchSummary.getResultSet(), sortField, sortDirection);
				returnValue = PatientSummaryFactory.getReturnValue(PatientSummaryFactory.getNewPatientSearchSummary(patients, sort, false, 
						patientSearchSummary.getBodyParts(), patientSearchSummary.getModalities(), patientSearchSummary.getCollections()), start, size);
			} else {
				returnValue = PatientSummaryFactory.getReturnValue(patientSearchSummary, start, size);
			}
		}

		
		return Response.ok(JSONUtil.getJSONforPatientSearchSummary(returnValue)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
}
