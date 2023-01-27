package gov.nih.nci.nbia.restAPI;

import java.util.*;
import java.text.*;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.deletion.DeletionDisplayObject;
import gov.nih.nci.nbia.deletion.ImageDeletionService;
import gov.nih.nci.nbia.restUtil.RoleCache;
@Path("/getSeriesForDeletion")
public class GetSeriesForDeletion extends getData{

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() {
		String user = null;

		try {	
//			   Authentication authentication = SecurityContextHolder.getContext()
//						.getAuthentication();
//				user = (String) authentication.getPrincipal();
			user = getUserName(); 

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

			ImageDeletionService imageDeletionService = (ImageDeletionService)SpringApplicationContext.getBean("imageDeletionService");
			List<DeletionDisplayObject> displayObject = imageDeletionService.getDeletionDisplayObject();
		
		return Response.ok(JSONUtil.getJSONforDeletionDisplayObject(displayObject)).type("application/json")
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
