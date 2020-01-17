//To Test: 
//curl -X POST -d "project=testPROJ&siteName=site&seriesId=1.1&seriesId=2.2&seriesId=3.3&newQcStatus=1" -H "Authorization:Bearer ec6c2120-63ec-4a49-9643-19a7f47de9fc" -k "http://localhost:8080/nbia-api/services/submitQCVisibility"

package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

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

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.qctool.VisibilityStatus;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.RoleCache;

import java.text.SimpleDateFormat;
import gov.nih.nci.nbia.dao.QcStatusDAO;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import gov.nih.nci.nbia.security.NCIASecurityManager;

@Path("/submitDeleteVisibility")
public class SetDeleteVisibility extends getData{
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method set 
	 *
	 * @return String - set of species names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("seriesId") List<String> seriesIdList,
			@FormParam("comment") String comment) {
		
		
		if (seriesIdList.size() < 1) {
			return Response.status(400)
						.entity("The request should include at least one seriesId.").build();
		}
		
			

		try {	
			   Authentication authentication = SecurityContextHolder.getContext()
						.getAuthentication();
				String user = (String) authentication.getPrincipal();
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
				
				String status = "Not submitted.";
				
				QcStatusDAO qDao = (QcStatusDAO)SpringApplicationContext.getBean("qcStatusDAO");
				try {
					List<Map<String,String>>results = qDao.findExistingStatus(null, null, seriesIdList);
					if ((results != null) && (results.size() != seriesIdList.size())) {
						status = "Some or all series need to be submitted into database first";
						Response.status(412).entity(status).build();
					}
					else {
						List<String> seriesList = new ArrayList<String>();
						List<String> statusList = new ArrayList<String>();
						for (Map<String,String> result:results) {
							seriesList.add(result.get("id"));
							statusList.add(result.get("oldStatus"));
						}
						qDao.updateQcStatus(seriesList, statusList, "4", null, null, user, comment);
						status = "ok";
					}
				}
				catch (DataAccessException ex) {
					ex.printStackTrace();
				}
		
                if (status.equals("ok")) {
				   return Response.ok("ok").type("application/text")
						.build();
                } else {
 				   return Response.status(400)
 							.entity(status).build();
                }

		    } catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
			}
				return Response.status(500)
						.entity("Server was not able to process your request").build();
	}
}
