//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.*;
import java.util.ArrayList;
import java.util.Date;
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

import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.QcSearchResultDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.QcStatusDAO;
import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.restUtil.QAUserUtil;
import gov.nih.nci.nbia.restUtil.RoleCache;
@Path("/getQCSearchForDeletion")
public class GetQCSearchforDeletion extends getData{


	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("collectionSite") String collectionSite,
			                          @FormParam("released") String released,
			                          @FormParam("batch") String batch,
			                          @FormParam("confirmedComplete") String confirmedComplete,
			                          @FormParam("subjectIds") List<String> subjectIds,
			                          @FormParam("fromDate") String fromDate,
			                          @FormParam("toDate") String toDate) {
		String user = null;

		try {	
			   Authentication authentication = SecurityContextHolder.getContext()
						.getAuthentication();
				user = (String) authentication.getPrincipal();
				List<String> roles=RoleCache.getRoles(user);
             if (roles==null) {
             	roles=new ArrayList<String>();
             	System.out.println("geting roles for user");
				    NCIASecurityManager sm = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
				    roles.addAll(sm.getRoles(user));
				    RoleCache.setRoles(user, roles);
             }
			if (!roles.contains("NCIA.DELETE_ADMIN")) {
				  	  return Response.status(401)
							.entity("Insufficiant Privileges").build();
			   }
        String[] additionalQcFlagList = new String[3];
        additionalQcFlagList[0] = batch;
        additionalQcFlagList[1] = null;
        additionalQcFlagList[2] = released;
        String [] qcStatus = {"To Be Deleted"};
        Date fromDateValue=null;
        Date toDateValue=null;
        System.out.println("fromDate-"+fromDate);
        if ((fromDate!=null&&!fromDate.equals(""))||(toDate!=null&&!toDate.equals(""))) {
        	System.out.println("passed fromDate-"+fromDate);
        	if ((fromDate!=null&&!fromDate.equals(""))){
        		System.out.println("passed 2 fromDate-"+fromDate);
        		fromDateValue=getDate(fromDate);
        	} else {
        		fromDateValue=getDate("01-01-1980");
        	}
        	System.out.println("toDate-"+toDate);
        	if ((toDate!=null&&!toDate.equals(""))){
        		toDateValue=getDate(toDate);
        	} else {
        		toDateValue=getDate(null);
        	}
        }
        QcStatusDAO qcStatusDAO = (QcStatusDAO)SpringApplicationContext.getBean("qcStatusDAO");
        List<String> collectionSites=new <String> ArrayList();
        if (collectionSite==null||collectionSite.equals("")) {
        	return Response.status(500)
					.entity("collectionSite is required").build();
        } else {
        	collectionSites.add(collectionSite);
        }
        String[] subjectIdArray=null;
        if (subjectIds!=null) {
        	subjectIdArray=subjectIds.toArray(new String[0]);
        }
        String maxRows=NCIAConfig.getQctoolSearchResultsMaxNumberOfRows();
        List<QcSearchResultDTO> qsrDTOList = qcStatusDAO.findSeries(qcStatus, collectionSites, additionalQcFlagList, subjectIdArray, fromDateValue, toDateValue,  Integer.valueOf(maxRows));
         
		for (QcSearchResultDTO dto:qsrDTOList){
				System.out.println("===== In QcToolSearchBean:submit() - adding user to QC DTO ---");
				dto.setUser(user);
			}


		
		return Response.ok(JSONUtil.getJSONforQCList(qsrDTOList)).type("application/json")
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
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String today = format.format(new Date());
		System.out.println("today-"+today);
		return returnValue;
	}
	
}
