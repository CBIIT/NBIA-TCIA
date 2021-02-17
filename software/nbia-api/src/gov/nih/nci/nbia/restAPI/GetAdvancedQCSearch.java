//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.*;
import java.text.*;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.dto.AdvancedCriteriaDTO;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONDeserializer;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.QcSearchResultDTO;
import gov.nih.nci.nbia.dto.QcSearchResultDTOLight;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.QcStatusDAO;
import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.restUtil.QAUserUtil;
import gov.nih.nci.nbia.restUtil.RoleCache;
@Path("/getAdvancedQCSearch")
public class GetAdvancedQCSearch extends getData{


	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) {
		String user = null;

		try {	
			/*  Authentication authentication = SecurityContextHolder.getContext()
						.getAuthentication();
				user = (String) authentication.getPrincipal();
                if (!QAUserUtil.isUserQA(user)) {
                	System.out.println("Not QA User!!!!");
				    NCIASecurityManager sm = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
				   if (!sm.hasQaRole(user)) {
				  	  return Response.status(401)
							.entity("Insufficiant Privileges").build();
				   } else {
					   QAUserUtil.setUserQA(user);
				   }
                }  */
 
        QcStatusDAO qcStatusDAO = (QcStatusDAO)SpringApplicationContext.getBean("qcStatusDAO");

        int i=0;
        Map<String, QCSearchCriteria> advancedCriteria = new HashMap<String, QCSearchCriteria>();
        System.out.println(inFormParams.get("criteriaType"+i));
        System.out.println(inFormParams.get("inputType"+i));
		while (inFormParams.get("criteriaType"+i)!=null)
		{
			String criteriaType = inFormParams.get("criteriaType"+i).get(0);
			if (inFormParams.get("inputType"+i).get(0).equalsIgnoreCase("list")){
				if (advancedCriteria.get(criteriaType)==null){
				   ListCriteria criteria=new ListCriteria();
				   criteria.setListValue(inFormParams.get("value"+i).get(0));
				   criteria.setBooleanOperator(inFormParams.get("boolean"+i).get(0));
				   criteria.setQueryField(criteriaType);
				   advancedCriteria.put(criteriaType,criteria);
				} else {
					ListCriteria criteria=(ListCriteria)advancedCriteria.get(criteriaType);
					criteria.setListValue(inFormParams.get("value"+i).get(0));
					criteria.setBooleanOperator(inFormParams.get("boolean"+i).get(0));
					criteria.setQueryField(criteriaType);
				}
			}
			if (inFormParams.get("inputType"+i).get(0).equalsIgnoreCase("contains")){
				   TextCriteria criteria=new TextCriteria();
				   criteria.setQueryValue(inFormParams.get("value"+i).get(0));
				   criteria.setBooleanOperator(inFormParams.get("boolean"+i).get(0));
				   criteria.setQueryField(criteriaType);
				   criteria.setQueryType("contains");
				   advancedCriteria.put(criteriaType,criteria);
			}
			if (inFormParams.get("inputType"+i).get(0).equalsIgnoreCase("startsWith")){
					TextCriteria criteria=new TextCriteria();
					criteria.setQueryValue(inFormParams.get("value"+i).get(0));
					criteria.setBooleanOperator(inFormParams.get("boolean"+i).get(0));
					criteria.setQueryField(criteriaType);
					criteria.setQueryType("startsWith");
					advancedCriteria.put(criteriaType,criteria);
			}
			if (inFormParams.get("inputType"+i).get(0).equalsIgnoreCase("dateRange")){
				if (advancedCriteria.get(criteriaType)==null){
					DateRangeCriteriaForQCSearch criteria=new DateRangeCriteriaForQCSearch();
			        criteria.addDate(getDate(inFormParams.get("value"+i).get(0)));
				    criteria.setBooleanOperator(inFormParams.get("boolean"+i).get(0));
				    criteria.setQueryField(criteriaType);
				    advancedCriteria.put(criteriaType,criteria);
				} else {
					DateRangeCriteriaForQCSearch criteria=(DateRangeCriteriaForQCSearch)advancedCriteria.get(criteriaType);
					criteria.addDate(getDate(inFormParams.get("value"+i).get(0)));
				}
			}
			if (inFormParams.get("inputType"+i).get(0).equalsIgnoreCase("dateFrom")){
				DateFromCriteriaForQCSearch criteria=new DateFromCriteriaForQCSearch();
			    criteria.setFromDate(getDate(inFormParams.get("value"+i).get(0)));
				criteria.setBooleanOperator(inFormParams.get("boolean"+i).get(0));
				criteria.setQueryField(criteriaType);
				advancedCriteria.put(criteriaType,criteria);
			}
			if (inFormParams.get("inputType"+i).get(0).equalsIgnoreCase("dateTo")){
				DateToCriteriaForQCSearch criteria=new DateToCriteriaForQCSearch();
			    criteria.setToDate(getDate(inFormParams.get("value"+i).get(0)));
				criteria.setBooleanOperator(inFormParams.get("boolean"+i).get(0));
				criteria.setQueryField(criteriaType);
				advancedCriteria.put(criteriaType,criteria);
			}
			i++;
		}
        String maxRows=NCIAConfig.getQctoolSearchResultsMaxNumberOfRows();
        Map<String, AdvancedCriteriaDTO> criteriaList=JSONDeserializer.getAdvancedCriteriaFromJson();
        List<QcSearchResultDTO> qsrDTOList = qcStatusDAO.findSeries(advancedCriteria, criteriaList, Integer.valueOf(maxRows));
        List<QcSearchResultDTOLight> qsrDTOListLight=new ArrayList<QcSearchResultDTOLight>();
		for (QcSearchResultDTO dto:qsrDTOList){
			QcSearchResultDTOLight dtol=new QcSearchResultDTOLight(dto);
			qsrDTOListLight.add(dtol);			
		}
		return Response.ok(JSONUtil.getJSONforQCListLight(qsrDTOListLight)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	
	private Date getDate(String date) {
		Date returnValue=null;
		
		if (date==null)
		{
			return Calendar.getInstance().getTime();
		}
		DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
		try {
		returnValue=format.parse(date);
		} catch (Exception e) {
			format = new SimpleDateFormat("MM/dd/yyyy");
			try {
				returnValue=format.parse(date);
				} catch (Exception e2) {
					e2.printStackTrace();
				}
		}
		return returnValue;
	}
	
}
