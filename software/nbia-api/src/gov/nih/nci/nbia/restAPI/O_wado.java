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
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;

import gov.nih.nci.nbia.restUtil.OviyamUtil;
import gov.nih.nci.nbia.wadosupport.*;

@Path("/o/wado")
public class O_wado extends getData {
	private static final Logger log = Logger.getLogger(O_wado.class);
	private static final String[] columns={"SopIUID", "InstanceNumber", "SopClassUID", "NumberOfFrames", "Rows"};
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of instances filtered by query keys
	 *
	 * @return String - set of series info
	 */
	@GET
	@Produces({"application/dicom", "image/jpeg"})
	public Response  constructResponse(
			@QueryParam("objectUID") String objectUID,
			@QueryParam("contentType") String contentType,
			@QueryParam("oviyamId") String oviyamId, 
			@QueryParam("wadoUrl") String wadoUrl,
			@QueryParam("rows") String rows,
			@QueryParam("columns") String columns,
			@QueryParam("region") String region,
			@QueryParam("windowCenter") String windowCenter,
			@QueryParam("windowWidth") String windowWidth,
			@QueryParam("imageQuality") String imageQuality,
			@QueryParam("frameNumber") String frameNumber,
			@QueryParam("presentationUID") String presentationUID,
			@QueryParam("presentationSeriesUID") String presentationSeriesUID,
			@QueryParam("transferSyntax") String transferSyntax) {
 //       System.out.println("Oviyam wado called: + objectUID-"+objectUID+" contentType-"+contentType+" oviyamId:"+oviyamId+" wadoUrl");
		String user=null;
		if (oviyamId!=null&&oviyamId.length()>0){
			user=OviyamUtil.getUser(oviyamId, wadoUrl);
		}
		WADOParameters params = new WADOParameters();
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
			//params.setFrameNumber(frameNumber);
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
		WADOSupportDTO wdto = getWadoImage(objectUID, contentType, user, params);
		if (wdto.getErrors()!=null){
			log.error("WADO Error: " + wdto.getErrors());
    		return Response.status(400).type("text/plain")
			.entity(wdto.getErrors())
			.build();
		}
		if (contentType.equals("application/dicom")){
		   return Response.ok(wdto.getImage(), contentType).header("Content-Disposition", "attachment; filename=" + objectUID + ".dcm").build();
		} else
		{
		   return Response.ok(wdto.getImage(), contentType).build();
		}
	}
}