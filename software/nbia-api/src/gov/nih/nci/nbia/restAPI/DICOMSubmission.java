package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.QAUserUtil;

import java.text.SimpleDateFormat;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.nbia.dao.ValueAndCountDAOImpl;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;
import gov.nih.nci.nbia.dto.SpeciesDTO;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import org.springframework.core.NestedRuntimeException;

@Path("/submitDICOM")
public class DICOMSubmission extends getData{
	private static final String column="Species";
	public final static String TEXT_CSV = "text/csv";
	/**
	 * This method get a set of all species names
	 *
	 * @return String - set of species names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("project") String project, 
			@FormParam("siteName") String siteName,
			@FormParam("siteID") String siteID,
			@FormParam("batch") String batch, 
			@FormParam("uri") String file,
			@FormParam("thirdPartyAnalysis") String thirdPartyAnalysis, 
			@FormParam("descriptionURI") String descriptionURI,
			@FormParam("posdaTransferId") String fileId, 
			@FormParam("overwrite") String overwrite) {

		if (!allowToGoOn(project, siteName)) {
			return Response.status(403)
					.entity("Need to create collection and site (protection element) first using UAT.").build();
		}

		
		try {			
//			   Authentication authentication = SecurityContextHolder.getContext()
//						.getAuthentication();
//				String user = (String) authentication.getPrincipal();
	 		String user = getUserName();
	 		
                if (!QAUserUtil.isUserQA(user)) {
                	System.out.println("Not QA User!!!!");
				    NCIASecurityManager sm = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
				   if (!sm.hasQaRole(user)) {
				  	  return Response.status(401)
							.entity("Insufficiant Privileges").build();
				   } else {
					   QAUserUtil.setUserQA(user);
				   }
                }
                
                String status = FileSubmitter.submit(file, project, siteName, siteID, batch, thirdPartyAnalysis, descriptionURI, fileId, overwrite);
                if (status.equals("ok")) {
				   return Response.ok("ok").type("application/text")
						.build();
                } else {
 				   return Response.status(400)
 							.entity(status).build();
                }
	       } catch (NestedRuntimeException e) {
				e.printStackTrace();
				return Response.status(500)
						.entity(e.getMostSpecificCause().getMessage()).build();
	        } catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					return Response.status(500)
							.entity(e.getMessage()).build();
			}

	}
	
	private boolean allowToGoOn(String project, String site) {
		if (NCIAConfig.getCtpBlockCreationNewProjectSite().trim().equals("true")) {
			TrialDataProvenanceDAO tDao = (TrialDataProvenanceDAO) SpringApplicationContext
					.getBean("trialDataProvenanceDAO");
			try {
			if (tDao.hasExistingProjSite(project, site)) 
				return true;
			else return false;
			}
			catch (DataAccessException ex) {
				ex.printStackTrace();
				return false;
			}
		}
		else return true;
	}
}
