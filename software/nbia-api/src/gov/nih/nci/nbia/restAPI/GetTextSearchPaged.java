//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.Path;
//import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
//import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
//import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.factories.ApplicationFactory;
//import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResultImpl;
import gov.nih.nci.nbia.textsupport.SolrAllDocumentMetaData;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.PatientSearchSummary;
import gov.nih.nci.nbia.restUtil.PatientSummaryFactory;
import gov.nih.nci.nbia.restUtil.ResultSetSorter;
import gov.nih.nci.nbia.restUtil.TextSummaryFactory;
import gov.nih.nci.nbia.restUtil.TextResultSetSorter;
import gov.nih.nci.nbia.restUtil.TextSearchSummary;
import gov.nih.nci.nbia.restUtil.TextResultSetCache;

//import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Path("/getTextSearchPaged")
public class GetTextSearchPaged extends getData{
//	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("textValue") String textValue,  @FormParam("start") String startString, @FormParam("size") String sizeString,
			@FormParam("sortField") String sortField, @FormParam("sortDirection") String sortDirection) {

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
		List <DynamicSearchCriteria> criteria=new ArrayList<DynamicSearchCriteria>();
//		int i=0;
		String queryKey=userName+"textValue"+textValue;
		TextResultSetCache cache = new TextResultSetCache();
		int start = Integer.parseInt(startString);
		int size = Integer.parseInt(sizeString);
		String sort = sortField+"-"+sortDirection;
		TextSearchSummary  textSearchSummary=cache.getPatientSearchSummary(queryKey);
		List<PatientTextSearchResult> textPatients;
		TextSearchSummary  returnValue=null;
		
		if (textSearchSummary==null) {
				QueryHandler qh = (QueryHandler) SpringApplicationContext.getBean("queryHandler");
				System.out.println("Searching Solr for" + textValue);
				List<SolrAllDocumentMetaData> results = qh.searchSolr(textValue);
				StringBuffer patientIDs = new StringBuffer();
				Map<String, SolrAllDocumentMetaData> patientMap = new HashMap<String, SolrAllDocumentMetaData>();
				for (SolrAllDocumentMetaData result : results) {
					patientIDs.append(result.getPatientId() + ",");
					patientMap.put(result.getPatientId(), result);
				}
				if (patientIDs.toString().length() < 2)
					patientIDs.append("zzz33333###"); // no patients found
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
				List<PatientSearchResult> patients = qh.getPatients();
				textPatients = new ArrayList<PatientTextSearchResult>();
				for (PatientSearchResult patient : patients) {
					PatientTextSearchResult textResult = new PatientTextSearchResultImpl(patient);
					SolrAllDocumentMetaData solrResult = patientMap.get(textResult.getSubjectId());
					if (solrResult == null) {
						System.out.println("******* can't find id in patient map " + textResult.getSubjectId());
					} else {
						textResult.setHit(solrResult.getFoundValue());
						textPatients.add(textResult);
					}
				} 
				textPatients=new TextResultSetSorter().sort2(textPatients, sortField, sortDirection);
	            TextSearchSummary cacheValue =TextSummaryFactory.getNewPatientSearchSummary(textPatients, sort);
	            //System.out.println("Size is "+SizeOf.getObjectSize(cacheValue));
	            cache.putPatientPatientSearchSummary(queryKey, cacheValue);
	            returnValue = TextSummaryFactory.getReturnValue(cacheValue, start, size);
			} else {
				System.out.println("Found in cache");
				System.out.println("Sort-"+sort);
				System.out.println("GetSort-"+textSearchSummary.getSort());
				if (!textSearchSummary.getSort().equalsIgnoreCase(sort)) {
					System.out.println("Doing sort");
					textPatients=new TextResultSetSorter().sort2(textSearchSummary.getResultSet(), sortField, sortDirection);
					returnValue = TextSummaryFactory.getReturnValue(TextSummaryFactory.getNewPatientSearchSummary(textPatients, sort), start, size);
				} else {
					returnValue = TextSummaryFactory.getReturnValue(textSearchSummary, start, size);
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
