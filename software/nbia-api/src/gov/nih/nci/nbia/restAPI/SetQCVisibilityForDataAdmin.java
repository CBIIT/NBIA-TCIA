//To Test: 
//curl -X POST -d "project=testPROJ&siteName=site&seriesId=1.1&seriesId=2.2&seriesId=3.3&newQcStatus=1" -H "Authorization:Bearer ec6c2120-63ec-4a49-9643-19a7f47de9fc" -k "http://localhost:8080/nbia-api/services/submitQCVisibility"

package gov.nih.nci.nbia.restAPI;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dao.QcStatusDAO;
import gov.nih.nci.nbia.restUtil.QAUserUtil;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.SpringApplicationContext;

@Path("/submitQCVisibilityForDataAdmin")
public class SetQCVisibilityForDataAdmin extends getData{
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method set 
	 *
	 * @return String - set of species names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("projectSite") String projectSite, 
			@FormParam("seriesId") List<String> seriesIdList,
			@FormParam("newQcStatus") String newQcStatus,
			@FormParam("batch") String batch,
			@FormParam("complete") String complete,
			@FormParam("released") String released,
			@FormParam("comment") String comment,
			@FormParam("site") String site,
			@FormParam("dateReleased") String dateReleased,
			@FormParam("url") String url) {
		
		
		if (seriesIdList.size() < 1) {
			return Response.status(400)
						.entity("The request should include at least one seriesId.").build();
		}
		
	

		try {	
			
			   Authentication authentication = SecurityContextHolder.getContext()
						.getAuthentication();
				String user = (String) authentication.getPrincipal();
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
  			    String status = "Not submitted.";
				String releasedYesNo=null;
				if (released!=null&&released.equalsIgnoreCase("released")) {
					releasedYesNo="Yes";
				}  else {
					releasedYesNo="No";
				}
				QcStatusDAO qDao = (QcStatusDAO)SpringApplicationContext.getBean("qcStatusDAO");
				Date releasedDateValue=getDate(dateReleased);
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
						System.out.println("newQcStatus-"+newQcStatus);
						qDao.updateQcStatus(seriesList, newQcStatus, batch, complete, releasedYesNo, user, comment, site, url, releasedDateValue);
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
	private Date getDate(String date) {
		Date returnValue=null;
		
		if (date==null)
		{
			return null;
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
