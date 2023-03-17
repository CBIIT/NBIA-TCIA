package gov.nih.nci.nbia.restAPI;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.apache.log4j.Logger;

import com.sun.research.ws.wadl.Application;

import gov.nih.nci.nbia.security.AuthenticationWithKeycloak;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.wadosupport.*;

@Path("/getThumbnail")
public class GetThumbnail extends getData {
	private static final Logger log = Logger.getLogger(GetThumbnail.class);
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of instances filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@POST
	@Produces({"application/dicom", "image/jpeg"})
	public Response  constructResponse(@FormParam("seriesUID") String seriesUID,
			@FormParam("objectUID") String objectUID) {


//        Authentication authentication = SecurityContextHolder.getContext()
//		.getAuthentication();
//		String userName=null;
//		if (authentication==null){
//			userName =  NCIAConfig.getGuestUsername();
//		} else {
//           userName = (String) authentication.getPrincipal();
//	    }
//		if (userName==null){
//			userName =  NCIAConfig.getGuestUsername();
//		}
//        System.out.println("series"+seriesUID);
        
		String userName	= getUserName(); 

		WADOSupportDTO wdto = getThumbnail(objectUID, seriesUID, userName);
		if (wdto.getErrors()!=null){
			log.error("WADO Error: " + wdto.getErrors());
    		return Response.status(400).type("text/plain")
			.entity(wdto.getErrors())
			.build();
		}
		
		return Response.ok(wdto.getImage(), "image/jpeg").build();
	}
}