package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import java.util.ArrayList;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.dao.PatientDAO;

@Path("/v4/getSeriesMetadata")
public class V4_getSeriesMetadata extends getData {

    public final static String TEXT_CSV = "text/csv";

    @POST
	  @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
    public Response constructResponse(
            @FormParam("list") List<String> seriesInstanceUIDs, @FormParam("format") String format) {

        if (seriesInstanceUIDs == null || seriesInstanceUIDs.isEmpty()) {
            return Response.status(Status.BAD_REQUEST)
                    .entity("A form parameter, list, containing at least one SeriesInstanceUID is required.")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }

        List<String> authorizedCollections = new ArrayList<>();
        String userName = getUserName();
        List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
        if (authorizedSiteData == null) {
            AuthorizationManager am = new AuthorizationManager(userName);
            authorizedSiteData = am.getAuthorizedSites();
            AuthorizationUtil.setUserSites(userName, authorizedSiteData);
        }
        for (SiteData siteData : authorizedSiteData) {
            String protectionElement = "'" + siteData.getCollection() + "//" + siteData.getSiteName() + "'";
            authorizedCollections.add(protectionElement);
        }

        List<Object[]> results = new ArrayList<>();
        PatientDAO patientDAO = (PatientDAO) SpringApplicationContext.getBean("patientDAO");
        for(String uid : seriesInstanceUIDs) {
            System.out.println("Processing SeriesInstanceUID: " + uid);
            results.addAll(patientDAO.getCombinedDataBySeries_v4(uid, authorizedCollections));
        }

        // Use the columns defined in getSeriesMetadata3
        String[] columns = {
            "PatientID", "PatientName",  "PatientSex", "EthnicGroup", "Phantom", 
            "SpeciesCode", "SpeciesDescription", "StudyInstanceUID", "StudyDate", "StudyDesc", 
            "AdmittingDiagnosisDescription", "StudyID", "PatientAge", "LongitudinalTemporalEventType", 
            "LongitudinalTemporalOffsetFromEvent", "SeriesInstanceUID", "Collection", "Site", "Modality", 
            "ProtocolName", "SeriesDate", "SeriesDescription", "BodyPartExamined", "SeriesNumber", 
            "AnnotationsFlag", "Manufacturer", "ManufacturerModelName", 
            "PixelSpacing(mm)-Row","SliceThickness(mm)",
            "SoftwareVersions", "ImageCount", "MaxSubmissionTimestamp", "LicenseName", "LicenseURI", "DataDescriptionURI", 
            "FileSize", "ReleasedStatus", "DateReleased", "ThirdPartyAnalysis", "Authorized"
        };

        if (format == null || format.equalsIgnoreCase("CSV")) {
          format = "CSV-DOWNLOAD";
        }
        return formatResponse(format, results, columns);
    }
}
