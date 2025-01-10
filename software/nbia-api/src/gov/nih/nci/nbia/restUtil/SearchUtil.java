package gov.nih.nci.nbia.restUtil;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.MultivaluedMap;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.factories.ApplicationFactory;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.querystorage.QueryStorageManager;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.textsupport.SolrAllDocumentMetaData;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.ncia.criteria.AnatomicalSiteCriteria;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;
import gov.nih.nci.ncia.criteria.CollectionCriteria;
import gov.nih.nci.ncia.criteria.DataLicenseCriteria;
import gov.nih.nci.ncia.criteria.DateRangeCriteria;
//import gov.nih.nci.ncia.criteria.PatientAgeRangeCriteria;
import gov.nih.nci.ncia.criteria.ImageModalityCriteria;
import gov.nih.nci.ncia.criteria.ManufacturerCriteria;
import gov.nih.nci.ncia.criteria.MinNumberOfStudiesCriteria;
import gov.nih.nci.ncia.criteria.ModalityAndedSearchCriteria;
import gov.nih.nci.ncia.criteria.ModelCriteria;
import gov.nih.nci.ncia.criteria.PatientCriteria;
import gov.nih.nci.ncia.criteria.PatientSexCriteria;
import gov.nih.nci.ncia.criteria.StudyCriteria;
import gov.nih.nci.ncia.criteria.SeriesCriteria;
import gov.nih.nci.ncia.criteria.PhantomCriteria;
import gov.nih.nci.ncia.criteria.SoftwareVersionCriteria;
import gov.nih.nci.ncia.criteria.SpeciesCriteria;
import gov.nih.nci.ncia.criteria.ThirdPartyAnalysisCriteria;
import gov.nih.nci.ncia.criteria.TimePointCriteria;

public class SearchUtil {
	private Map<String, SolrAllDocumentMetaData> patientMap=null;
	public PatientSearchSummary getPatients(MultivaluedMap<String, String> inFormParams, String user, boolean useKeycloak) throws Exception{
		String userName = user;
		if (!useKeycloak) {
			Authentication authentication = SecurityContextHolder.getContext()
					.getAuthentication();
			userName = (String) authentication.getPrincipal();			
		}
//		Authentication authentication = SecurityContextHolder.getContext()
//				.getAuthentication();
//		String userName = (String) authentication.getPrincipal();
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
        ImageModalityCriteria modalityCriteria=null;
        String errorMessage=" ";
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

			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("PatientSexCriteria")){
				if (query.getPatientSexCriteria()==null){
					PatientSexCriteria criteria=new PatientSexCriteria();
				   criteria.setPatientSexValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="PatientSexCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getPatientSexCriteria().setPatientSexValue(inFormParams.get("value"+i).get(0));
					queryKey+="PatientSexCriteria"+inFormParams.get("value"+i).get(0);
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
//			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("PatientAgeRangeCriteria")){
//				PatientAgeRangeCriteria criteria=new PatientAgeRangeCriteria();
//			    criteria.setFrom(inFormParams.get("from"+i).get(0));
//			    criteria.setTo(inFormParams.get("to"+i).get(0));
//				query.setCriteria(criteria);
//				queryKey+="PatientAgeRangeCriteria"+inFormParams.get("from"+i).get(0)+inFormParams.get("to"+i).get(0);
//			}
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
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("StudyCriteria")){
				if (query.getStudyCriteria()==null){
					StudyCriteria criteria=new StudyCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="StudyCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getStudyCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
					queryKey+="StudyCriteria"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("SeriesCriteria")){
				if (query.getSeriesCriteria()==null){
					SeriesCriteria criteria=new SeriesCriteria();
				   criteria.setCollectionValue(inFormParams.get("value"+i).get(0));
				   query.setCriteria(criteria);
				   queryKey+="SeriesCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getSeriesCriteria().setCollectionValue(inFormParams.get("value"+i).get(0));
					queryKey+="SeriesCriteria"+inFormParams.get("value"+i).get(0);
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
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("PhantomCriteria")){
				if (query.getPhantomCriteria() == null){
					PhantomCriteria criteria=new PhantomCriteria();
					criteria.setQcSubjectOption(inFormParams.get("value"+i).get(0));
					query.setCriteria(criteria);
					queryKey+="PhantomCriteria"+inFormParams.get("value"+i).get(0);
				} else {
					query.getPhantomCriteria().setQcSubjectOption(inFormParams.get("value"+i).get(0));
					queryKey+="PhantomCriteria"+inFormParams.get("value"+i).get(0);
				}
			}		
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ThirdPartyAnalysis")){
				if (query.getThirdPartyAnalysisCriteria() == null){
					ThirdPartyAnalysisCriteria criteria=new ThirdPartyAnalysisCriteria();
					criteria.setThirdPartyValue(inFormParams.get("value"+i).get(0));
					query.setCriteria(criteria);
					queryKey+="ThirdPartyAnalysis"+inFormParams.get("value"+i).get(0);
				} else {
					query.getThirdPartyAnalysisCriteria().setThirdPartyValue(inFormParams.get("value"+i).get(0));
					queryKey+="ThirdPartyAnalysis"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("ExcludeCommercialCriteria")){
				if (query.getDataLicenseCriteria() == null){
					DataLicenseCriteria criteria=new DataLicenseCriteria();
					criteria.setExcludeCommercial(inFormParams.get("value"+i).get(0));
					query.setCriteria(criteria);
					queryKey+="ExcludeCommercial"+inFormParams.get("value"+i).get(0);
				} else {
					query.getDataLicenseCriteria().setExcludeCommercial(inFormParams.get("value"+i).get(0));
					queryKey+="ExcludeCommercial"+inFormParams.get("value"+i).get(0);
				}
			}
			if (inFormParams.get("criteriaType"+i).get(0).equalsIgnoreCase("TimePointCriteria")){
				TimePointCriteria criteria=new TimePointCriteria();
				String fromDay="";
				String toDay="";
				String event="";
				if (inFormParams.get("fromDay"+i)!=null&&inFormParams.get("fromDay"+i).get(0)!=null&inFormParams.get("fromDay"+i).get(0).length()>0) {
			        criteria.setFromDay(Integer.parseInt(inFormParams.get("fromDay"+i).get(0)));
			        fromDay=inFormParams.get("fromDay"+i).get(0);
				}
				if (inFormParams.get("toDay"+i)!=null&&inFormParams.get("toDay"+i).get(0)!=null&inFormParams.get("toDay"+i).get(0).length()>0) {
			        criteria.setToDay(Integer.parseInt(inFormParams.get("toDay"+i).get(0)));
			        toDay=inFormParams.get("toDay"+i).get(0);
				}
				if (inFormParams.get("eventType"+i)!=null) {
			       criteria.setEventType(inFormParams.get("eventType"+i).get(0));
			       event=inFormParams.get("eventType"+i).get(0);
				}
				query.setCriteria(criteria);
				if (criteria.getEventType()==null) {
					errorMessage=" time points must include event type";
					throw new Exception();
				}
				if (criteria.getFromDay()==null&&criteria.getToDay()==null) {
					errorMessage=" time points must include at least a from day or to day";
					throw new Exception();
				}
				queryKey+="TimePointCriteria"+fromDay+toDay+event;
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
		PatientResultSetCache cache = PatientResultSetCache.getInstance();
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
            	patients = new ArrayList<PatientSearchResultWithModilityAndBodyPart>();
            }
            patients=new ResultSetSorter().sort2(patients, sortField, sortDirection);
            PatientSearchSummary cacheValue = PatientSummaryFactory.getNewPatientSearchSummary(patients, sort, true, null, null, null, null, query);
            cache.putPatientPatientSearchSummary(queryKey, cacheValue);
            returnValue = PatientSummaryFactory.getReturnValue(cacheValue, start, size);
		}  else {
			if (!patientSearchSummary.getSort().equalsIgnoreCase(sort)) {
				patients=new ResultSetSorter().sort2(patientSearchSummary.getResultSet(), sortField, sortDirection);
				returnValue = PatientSummaryFactory.getReturnValue(PatientSummaryFactory.getNewPatientSearchSummary(patients, sort, false, 
						patientSearchSummary.getBodyParts(), patientSearchSummary.getModalities(), patientSearchSummary.getCollections(), patientSearchSummary.getSpecies(), 
						null),
						start, size);
			} else {
				returnValue = PatientSummaryFactory.getReturnValue(patientSearchSummary, start, size);
			}
		}
	    return returnValue;
	}

	public List<PatientSearchResult> getPatients(String textValue) throws Exception{
		
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
		List <DynamicSearchCriteria> criteria=new ArrayList<DynamicSearchCriteria>();
//		int i=0;
		QueryHandler qh = (QueryHandler)SpringApplicationContext.getBean("queryHandler");
		List<SolrAllDocumentMetaData> results = qh.searchSolr(textValue);
		StringBuffer patientIDs = new StringBuffer();
		patientMap=new HashMap<String, SolrAllDocumentMetaData>();
		for (SolrAllDocumentMetaData result : results)
		{
			patientIDs.append(result.getPatientId()+",");
			patientMap.put(result.getPatientId(), result);
		}
		if (patientIDs.toString().length()<2) patientIDs.append("zzz33333###"); // no patients found
		DynamicSearchCriteria dsc = new DynamicSearchCriteria();
		dsc.setField("patientId");
		dsc.setDataGroup("Patient");
		Operator op = new Operator();
		op.setValue("contains");
		dsc.setOperator(op);
		dsc.setValue(patientIDs.toString());

		criteria.clear();
		criteria.add(dsc);


			qh.setStudyNumberMap(ApplicationFactory.getInstance().getStudyNumberMap());
			qh.setQueryCriteria(criteria, "AND", authorizedSiteData, seriesSecurityGroups);
			qh.query();
			return qh.getPatients();

	}
	
	public List<PatientSearchResult> getPatients(String textValue, String user, boolean useKeycloak) throws Exception{
		String userName = user;
		if (!useKeycloak) {
			Authentication authentication = SecurityContextHolder.getContext()
					.getAuthentication();
			userName = (String) authentication.getPrincipal();			
		} 

		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(userName);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(userName, authorizedSiteData);
		}
		List<String> seriesSecurityGroups = new ArrayList<String>();
		List <DynamicSearchCriteria> criteria=new ArrayList<DynamicSearchCriteria>();
//		int i=0;
		QueryHandler qh = (QueryHandler)SpringApplicationContext.getBean("queryHandler");
		List<SolrAllDocumentMetaData> results = qh.searchSolr(textValue);
		StringBuffer patientIDs = new StringBuffer();
		patientMap=new HashMap<String, SolrAllDocumentMetaData>();
		for (SolrAllDocumentMetaData result : results)
		{
			patientIDs.append(result.getPatientId()+",");
			patientMap.put(result.getPatientId(), result);
		}
		if (patientIDs.toString().length()<2) patientIDs.append("zzz33333###"); // no patients found
		DynamicSearchCriteria dsc = new DynamicSearchCriteria();
		dsc.setField("patientId");
		dsc.setDataGroup("Patient");
		Operator op = new Operator();
		op.setValue("contains");
		dsc.setOperator(op);
		dsc.setValue(patientIDs.toString());

		criteria.clear();
		criteria.add(dsc);


			qh.setStudyNumberMap(ApplicationFactory.getInstance().getStudyNumberMap());
			qh.setQueryCriteria(criteria, "AND", authorizedSiteData, seriesSecurityGroups);
			qh.query();
			return qh.getPatients();

	}
		
	
	public List<PatientSearchResult> getPatients(String textValue, String userName) throws Exception{
		
//		Authentication authentication = SecurityContextHolder.getContext()
//				.getAuthentication();
//		String userName = (String) authentication.getPrincipal();
		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(userName);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(userName, authorizedSiteData);
		}
		List<String> seriesSecurityGroups = new ArrayList<String>();
		List <DynamicSearchCriteria> criteria=new ArrayList<DynamicSearchCriteria>();
//		int i=0;
		QueryHandler qh = (QueryHandler)SpringApplicationContext.getBean("queryHandler");
		List<SolrAllDocumentMetaData> results = qh.searchSolr(textValue);
		StringBuffer patientIDs = new StringBuffer();
		patientMap=new HashMap<String, SolrAllDocumentMetaData>();
		for (SolrAllDocumentMetaData result : results)
		{
			patientIDs.append(result.getPatientId()+",");
			patientMap.put(result.getPatientId(), result);
		}
		if (patientIDs.toString().length()<2) patientIDs.append("zzz33333###"); // no patients found
		DynamicSearchCriteria dsc = new DynamicSearchCriteria();
		dsc.setField("patientId");
		dsc.setDataGroup("Patient");
		Operator op = new Operator();
		op.setValue("contains");
		dsc.setOperator(op);
		dsc.setValue(patientIDs.toString());

		criteria.clear();
		criteria.add(dsc);


			qh.setStudyNumberMap(ApplicationFactory.getInstance().getStudyNumberMap());
			qh.setQueryCriteria(criteria, "AND", authorizedSiteData, seriesSecurityGroups);
			qh.query();
			return qh.getPatients();

	}
	

	public Map<String, SolrAllDocumentMetaData> getPatientMap() {
		return patientMap;
	}

	public void setPatientMap(Map<String, SolrAllDocumentMetaData> patientMap) {
		this.patientMap = patientMap;
	}

}
