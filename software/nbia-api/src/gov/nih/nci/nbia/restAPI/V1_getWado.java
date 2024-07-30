//To Test: http://localhost:8080/nbia-api/api/v1/getSeries
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&PatientID=1.3.6.1.4.1.9328.50.1.0001&format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?PatientID=1.3.6.1.4.1.9328.50.1.0001&format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?Collection=RIDER Pilot&format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.2&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getSeries?StudyInstanceUID=1.3.6.1.4.1.9328.50.1.3&format=csv

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
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.wadosupport.*;

@Path("/v1/getWado")
public class V1_getWado extends getData {
	private static final Logger log = LogManager.getLogger(V1_getWado.class);
	private static final String[] columns={"SopIUID", "InstanceNumber", "SopClassUID", "NumberOfFrames", "Rows"};
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
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
		}  else {
			contentType="application/dicom";
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
        Authentication authentication = SecurityContextHolder.getContext()
		.getAuthentication();
		String userName="skipauth";
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