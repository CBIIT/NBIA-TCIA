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

import gov.nih.nci.nbia.restSecurity.AuthenticationWithKeycloak;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.wadosupport.*;

@Path("/getWado")
public class GetWado extends getData {
	private static final Logger log = Logger.getLogger(GetWado.class);
	public final static String TEXT_CSV = "text/csv";
	/**
	 * This method get a set of instances filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@POST
	@Produces({"application/dicom", "image/jpeg"})
	public Response  constructResponse(@FormParam("requestType") String requestType,
			@FormParam("studyUID") String studyUID, 
			@FormParam("seriesUID") String seriesUID,
			@FormParam("objectUID") String objectUID,
			@FormParam("contentType") String contentType,
			@FormParam("charset") String charset,
			@FormParam("anonymize") String anonymize,
			@FormParam("annotation") String annotation,
			@FormParam("rows") String rows,
			@FormParam("columns") String columns,
			@FormParam("region") String region,
			@FormParam("windowCenter") String windowCenter,
			@FormParam("windowWidth") String windowWidth,
			@FormParam("imageQuality") String imageQuality,
			@FormParam("frameNumber") String frameNumber,
			@FormParam("presentationUID") String presentationUID,
			@FormParam("presentationSeriesUID") String presentationSeriesUID,
			@FormParam("transferSyntax") String transferSyntax) {
		List<String> authorizedCollections = null;
 
        WADOParameters params = new WADOParameters();
		if (requestType!=null&&requestType.length()>0)
		{
			params.setRequestType(requestType);
		}
		if (studyUID!=null&&studyUID.length()>0)
		{
			params.setStudyUID(studyUID);
		}
		if (seriesUID!=null&&seriesUID.length()>0)
		{
			params.setSeriesUID(seriesUID);
		}
		if (objectUID!=null&&objectUID.length()>0)
		{
			params.setObjectUID(objectUID);
		}
		if (contentType!=null&&contentType.length()>0)
		{
			params.setContentType(contentType);
		}
		if (charset!=null&&charset.length()>0)
		{
			params.setCharset(charset);
		}
		if (anonymize!=null&&anonymize.length()>0)
		{
			params.setAnonymize(anonymize);
		}
		if (annotation!=null&&annotation.length()>0)
		{
			params.setAnnotation(annotation);
		}
		if (rows!=null&&rows.length()>0)
		{
			params.setRows(rows);
		}
		if (columns!=null&&columns.length()>0)
		{
			params.setColumns(columns);
		}
		
		if (region!=null&&region.length()>0)
		{
			params.setRegion(region);
		}
		if (windowCenter!=null&&windowCenter.length()>0)
		{
			params.setWindowCenter(windowCenter);
		}
		if (windowWidth!=null&&windowWidth.length()>0)
		{
			params.setWindowWidth(windowWidth);
		}
		if (imageQuality!=null&&imageQuality.length()>0)
		{
			params.setImageQuality(imageQuality);
		}
		if (frameNumber!=null&&frameNumber.length()>0)
		{
			params.setFrameNumber(frameNumber);
		}
		if (presentationUID!=null&&presentationUID.length()>0)
		{
			params.setPresentationUID(presentationUID);
		}
		if (presentationSeriesUID!=null&&presentationSeriesUID.length()>0)
		{
			params.setPresentationSeriesUID(presentationSeriesUID);
		}
		if (transferSyntax!=null&&transferSyntax.length()>0)
		{
			params.setTransferSyntax(transferSyntax);
		}
        log.info("WADO called with " + params.toString());
        String errors=params.validate();
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
        
		String userName = getUserName();
   
        if (errors!=null)
        {
        	log.error("WADO Error: " + errors);
    		return Response.status(400)
			.entity(errors).type("text/plain")
			.build();	
        }
		WADOSupportDTO wdto = getWadoImage(params, userName);
		if (wdto.getErrors()!=null){
			log.error("WADO Error: " + wdto.getErrors());
    		return Response.status(400).type("text/plain")
			.entity(wdto.getErrors())
			.build();
		}
		
		return Response.ok(wdto.getImage(), contentType).build();
	}
}