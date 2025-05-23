package gov.nih.nci.nbia.restAPI.v4;

import java.util.*;
import java.text.*;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.security.AuthenticationWithKeycloak;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.DOIDTO;
import gov.nih.nci.nbia.dto.QcSearchResultDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.deletion.DeletionDisplayObject;
import gov.nih.nci.nbia.deletion.ImageDeletionService;
import gov.nih.nci.nbia.restUtil.QAUserUtil;
import gov.nih.nci.nbia.restUtil.MD5Cache;
import io.swagger.annotations.*;
@Path("/v4/getMD5Hierarchy")
public class GetMD5Heirarchy extends getData{


	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@ApiOperation(value = "Get the new patients in a collection",
	  notes = "This method returns a MD5 hash of the DICOM objects in a hierarchy, only one object level can be specified")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Returns the hash of the full heirarchy of DICOM objects requested"),
        @ApiResponse(code = 500, message = "An unexpected error has occurred. The error has been logged.") })
	public Response  constructResponse(@ApiParam(name =  "SeriesInstanceUID", 
			   value = "The series when selecting a series level hash from", example = "1.3.6.1.4.1.14519.5.2.1.1610.1214.245363808374225692018717388133", required = false) 
			@FormParam("SeriesInstanceUID") String seriesInstanceUID, 
			@ApiParam(name =  "StudyInstanceUID", 
			   value = "The study when selecting a study level hash from", example = "1.3.6.1.4.1.14519.5.2.1.1610.1214.245363808374225692018717388133", required = false) 
			@FormParam("StudyInstanceUID") String studyInstanceUID,
			@ApiParam(name =  "PatientID", 
			   value = "The patient when selecting a patient level hash from", example = "subject01", required = false) 
			@FormParam("PatientID") String patientID,
			@ApiParam(name =  "Collection", 
			   value = "The series when selecting a study level hash from", example = "4D-Lung", required = false) 
			@FormParam("Collection") String collection, @Context HttpServletRequest request) {

    Set<String> allowedParams = Set.of("SeriesInstanceUID", "StudyInstanceUID", "PatientID", "Collection");

    Enumeration<String> paramNames = request.getParameterNames();
    while (paramNames.hasMoreElements()) {
        String param = paramNames.nextElement();
        if (!allowedParams.contains(param)) {
            String msg = "Invalid form parameter: '" + param +
                         "'. Allowed parameters are: " + allowedParams;
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(msg)
                           .build();
        }
    }

		String md5 = "";
		String user = getUserName();

		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(user);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(user, authorizedSiteData);
		}

        synchronized (this) {
			if (seriesInstanceUID != null && seriesInstanceUID.length() > 0) {
				GeneralSeriesDAO tDao = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
				md5 = tDao.getMD5ForSeries(seriesInstanceUID);
			}
			if (studyInstanceUID != null && studyInstanceUID.length() > 0) {
				GeneralSeriesDAO tDao = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
				md5 = tDao.getMD5ForStudy(studyInstanceUID, authorizedSiteData);
			}
			if (patientID != null && patientID.length() > 0) {
				GeneralSeriesDAO tDao = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
				md5 = tDao.getMD5ForPatientId(patientID, collection, authorizedSiteData);
			}
			if ((collection != null && collection.length() > 0) && !(patientID != null && patientID.length() > 0)) {
				md5 = MD5Cache.getMD5ForCollection(collection);
				if (md5 == null) {
					GeneralSeriesDAO tDao = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
					md5 = tDao.getMD5ForCollection(collection, authorizedSiteData);
					MD5Cache.setMD5(collection, md5);
				}
			}
		}
		return Response.ok().type("text/plain")
				.entity(md5)
				.build();
	}
}
