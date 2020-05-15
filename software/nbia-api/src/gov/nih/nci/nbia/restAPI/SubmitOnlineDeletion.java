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
import gov.nih.nci.nbia.executors.AsynchonousServices;
import gov.nih.nci.nbia.executors.ImageDeletionMessage;
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
@Path("/submitOnlineDeletion")
public class SubmitOnlineDeletion extends getData{


	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("deletion") String deletion) {
		String user = null;
        String email = null;
		try {	
			   Authentication authentication = SecurityContextHolder.getContext()
						.getAuthentication();
				user = (String) authentication.getPrincipal();
				NCIASecurityManager sm = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
				email = sm.getUserEmail(user);

				List<String> roles=RoleCache.getRoles(user);
             if (roles==null) {
             	roles=new ArrayList<String>();
             	System.out.println("geting roles for user");
				    
				    roles.addAll(sm.getRoles(user));
				    RoleCache.setRoles(user, roles);
             }
			if (!roles.contains("NCIA.DELETE_ADMIN")) {
				  	  return Response.status(401)
							.entity("Insufficiant Privileges").build();
			   }

			ImageDeletionMessage izm = new ImageDeletionMessage();
			izm.setEmailAddress(email);
			izm.setUserName(user);
			AsynchonousServices.performImageDeletion(izm);
 		    return Response.ok("ok").type("application/text")
					.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	

	
}
