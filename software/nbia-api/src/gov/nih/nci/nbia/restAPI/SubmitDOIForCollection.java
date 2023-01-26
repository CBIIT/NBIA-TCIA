package gov.nih.nci.nbia.restAPI;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.restUtil.RoleCache;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.SpringApplicationContext;

@Path("/submitDOIForCollection")
public class SubmitDOIForCollection extends getData{
	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(@FormParam("collection") String collection,
			@FormParam("doi") String doi) {

		try {	
			   String returnValue = "0";
//			   Authentication authentication = SecurityContextHolder.getContext()
//						.getAuthentication();
//				String user = (String) authentication.getPrincipal();
			   String user = getUserName();			   
				List<String> roles=RoleCache.getRoles(user);
                if (roles==null) {
                	roles=new ArrayList<String>();
   
				    NCIASecurityManager sm = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
				    roles.addAll(sm.getRoles(user));
				    RoleCache.setRoles(user, roles);
                }
                boolean hasRole=false;
                for (String role:roles) {
                	if(role.equalsIgnoreCase("NCIA.MANAGE_COLLECTION_DESCRIPTION")) {
                		hasRole=true;
                	}
                }
                if (!hasRole) {
					return Response.status(401)
							.entity("Insufficiant Privileges").build();
                } 
                GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
                int numberUpdated=generalSeriesDAO.updateDOIForSeries(collection, doi);
                returnValue = Integer.toString(numberUpdated); 
		return Response.ok().type("text/plain")
				.entity(returnValue)
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}

}
