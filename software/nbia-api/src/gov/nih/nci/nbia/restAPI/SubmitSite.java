//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dao.SiteDAO;
import gov.nih.nci.nbia.dto.SiteDTO;
import gov.nih.nci.nbia.dto.LicenseDTO;
import gov.nih.nci.nbia.restUtil.RoleCache;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import io.swagger.annotations.*;
@Path("/submitSite")
public class SubmitSite extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public Response constructResponse(
	        @FormParam("collectionName") String collectionName,
			@FormParam("siteName") String siteName,
	        @FormParam("licenseName") String licenseName) {
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
		SiteDAO siteDAO = (SiteDAO)SpringApplicationContext.getBean("siteDAO");
		SiteDTO siteDTO=new SiteDTO();
		siteDTO.setCollectionName(collectionName);
		siteDTO.setSiteName(siteName);
		LicenseDTO licenseDTO=new LicenseDTO();
		licenseDTO.setLongName(licenseName);
		siteDTO.setLicenseDTO(licenseDTO);
		siteDAO.update(siteDTO);
		return Response.ok().type("text/plain")
				.entity("Site updated")
				.build();
	}
}
