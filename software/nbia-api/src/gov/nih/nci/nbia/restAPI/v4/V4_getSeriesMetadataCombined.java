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

@Path("/v4/getSeriesMetadataCombined")
public class V4_getSeriesMetadataCombined extends getData {

    public final static String TEXT_CSV = "text/csv";

    @POST
    @Produces(TEXT_CSV)
    public Response constructResponse(
            @FormParam("list") List<String> seriesInstanceUIDs) {

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
            results.addAll(patientDAO.getCombinedDataBySeries(uid, authorizedCollections));
        }

        // Use the columns defined in getSeriesMetadata3
        String[] columns = {
            "Patient ID", "Patient Name", "Patient Birth Date", "Patient Sex", "Ethnic Group", "Phantom", 
            "Species Code", "Species Description", "Study Instance UID", "Study Date", "Study Description", 
            "Admitting Diagnosis Description", "Study ID", "Patient Age", "Longitudinal Temporal Event Type", 
            "Longitudinal Temporal Offset From Event", "Series Instance UID", "Project", "Modality", 
            "Protocol Name", "Series Date", "Series Description", "Body Part Examined", "Series Number", 
            "Annotations Flag", "Manufacturer", "Manufacturer Model Name", "Software Versions", 
            "Image Count", "Max Submission Timestamp", "License Name", "License URI", "Collection URI", 
            "File Size", "Date Released", "Third Party Analysis"
        };

        return formatResponse("CSV-DOWNLOAD", results, columns);
    }
}
