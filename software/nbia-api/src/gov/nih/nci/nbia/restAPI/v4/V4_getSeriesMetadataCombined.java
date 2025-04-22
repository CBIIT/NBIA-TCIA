package gov.nih.nci.nbia.restAPI;

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
import gov.nih.nci.nbia.security.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.dao.PatientDAO;

@Path("/v4/getSeriesMetadataCombined")
public class V4_getSeriesMetadataCombined extends getData {

    public final static String TEXT_CSV = "text/csv";

    // This endpoint combines the functionality of:
    // getSeriesMetadata2: Uses StudyDAO to process a list of SeriesInstanceUIDs.
    // getSeriesMetadata3: Uses PatientDAO to process a list of SeriesInstanceUIDs.

    @POST
    @Produces(TEXT_CSV)
    public Response constructResponse(
            @FormParam("list") List<String> seriesInstanceUIDs,
            @FormParam("type") String type) {

        if (seriesInstanceUIDs == null || seriesInstanceUIDs.isEmpty()) {
            return Response.status(Status.BAD_REQUEST)
                    .entity("A form parameter, list, containing at least one SeriesInstanceUID is required.")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }

        if (type == null || type.isEmpty()) {
            type = (seriesInstanceUIDs.size() > 1) ? "study" : "combined";
        }

        List<String> authorizedCollections = new ArrayList<String>();
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
        String[] columns = null;

        try {
            if ("study".equalsIgnoreCase(type)) {
                // original getSeriesMetadata2 functionality
                StudyDAO studyDAO = (StudyDAO) SpringApplicationContext.getBean("studyDAO");
                results = studyDAO.getSeriesMetadata(seriesInstanceUIDs, authorizedCollections);
                columns = new String[]{
                    "Subject ID", "Study UID", "Study Description", "Study Date", "Series ID", 
                    "Series Description", "Number of images", "File Size (Bytes)", "Collection Name", 
                    "Modality", "Manufacturer", "3rd Party Analysis", "Data Description URI", "Series Number", 
                    "License Name", "License URL", "Date Released", "Series Date", "Protocol Name", 
                    "Body Part Examined", "Annotations Flag", "Manufacturer Model Name", "Software Versions", 
                    "TimeStamp"
                };
            } else if ("combined".equalsIgnoreCase(type)) {
                // original getSeriesMetadata3 functionality
                PatientDAO patientDAO = (PatientDAO) SpringApplicationContext.getBean("patientDAO");
                for (String uid : seriesInstanceUIDs) {
                    System.out.println("Processing SeriesInstanceUID: " + uid);
                    results.addAll(patientDAO.getCombinedDataBySeries(uid, authorizedCollections));
                }
                columns = new String[]{
                    "Patient ID", "Patient Name", "Patient Birth Date", "Patient Sex", "Ethnic Group", "Phantom", 
                    "Species Code", "Species Description", "Study Instance UID", "Study Date", "Study Description", 
                    "Admitting Diagnosis Description", "Study ID", "Patient Age", "Longitudinal Temporal Event Type", 
                    "Longitudinal Temporal Offset From Event", "Series Instance UID", "Project", "Modality", 
                    "Protocol Name", "Series Date", "Series Description", "Body Part Examined", "Series Number", 
                    "Annotations Flag", "Manufacturer", "Manufacturer Model Name", "Software Versions", 
                    "Image Count", "Max Submission Timestamp", "License Name", "License URI", "Collection URI", 
                    "File Size", "Date Released", "Third Party Analysis"
                };
            } else {
                return Response.status(Status.BAD_REQUEST)
                        .entity("Invalid type parameter. Acceptable values are study or combined.")
                        .type(MediaType.APPLICATION_JSON)
                        .build();
            }
            return formatResponse("CSV-DOWNLOAD", results, columns);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Status.INTERNAL_SERVER_ERROR)
                    .entity("Error processing request: " + e.getMessage())
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }
}