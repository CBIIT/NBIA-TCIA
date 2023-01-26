package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.Date;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.QAUserUtil;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import gov.nih.nci.nbia.dao.QcStatusDAO;
import gov.nih.nci.nbia.security.NCIASecurityManager;

@Path("/submitSiteForSeries")
public class SetSiteForSeries extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method set 
	 *
	 * @return String - set of species names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("seriesId") List<String> seriesIdList,
			@FormParam("site") String site) {
		


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
    			System.out.println("++++++++++++++++++++++Site-"+site);
    			for (String series:seriesIdList) {
    				System.out.println("series-"+series);
    			}
				QcStatusDAO qDao = (QcStatusDAO)SpringApplicationContext.getBean("qcStatusDAO");
				qDao.setSiteForSeries(seriesIdList, site);
			    return Response.ok("ok").type("application/text")
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
