package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.dao.PatientDAO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;

@Path("/getSeriesMetadata3")
public class GetSeriesMetadata3 extends getData {

    public final static String TEXT_CSV = "text/csv";

    @POST
    @Produces(TEXT_CSV)
    public Response constructResponse(@FormParam("list") List<String> seriesInstanceUIDs) {

        System.out.println("Series Instance UID List: " + seriesInstanceUIDs);
        List<Object[]> results = new ArrayList<>();  // Ensure this is a List of Object arrays
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

        // Fetch data using DAOs for Patient, Study, and Series
        PatientDAO patientDAO = (PatientDAO) SpringApplicationContext.getBean("patientDAO");
        StudyDAO studyDAO = (StudyDAO) SpringApplicationContext.getBean("studyDAO");
        GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");

        if (seriesInstanceUIDs != null && !seriesInstanceUIDs.isEmpty()) {
            String[] uidArray = seriesInstanceUIDs.get(0).split(",");
            seriesInstanceUIDs = new ArrayList<>(List.of(uidArray));
        }

        for (String seriesInstanceUID : seriesInstanceUIDs) {
            // Fetch individual components
            Object[] patientData = patientDAO.getPatientBySeries(seriesInstanceUID, authorizedCollections).get(0);
            Object[] studyData = studyDAO.getPatientStudyBySeries(seriesInstanceUID, authorizedCollections).get(0);
            Object[] seriesData = generalSeriesDAO.getSeriesById(seriesInstanceUID , authorizedCollections).get(0);

            // Combine data into a single row
            Object[] combinedData = combineData(patientData, studyData, seriesData);
            results.add(combinedData);
        }

        // Final column names and response formatting
        String[] columns = {
            "Patient ID", "Patient Sex", "Phantom", "Species Code", "Species Description", "Ethnic Group",
            "Study Instance UID", "Study Date", "Study Description", "Series Count",
            "Longitudinal Temporal Event Type", "Longitudinal Temporal Offset From Event", "Patient Age",
            "Series Instance UID", "Modality", "Protocol Name", "Series Date", "Series Description",
            "Body Part Examined", "Series Number", "Collection", "Manufacturer", "Manufacturer Model Name",
            "Software Versions", "Image Count", "Date Released", "License Name", "License URI", "Collection URI",
            "File Size", "Third Party Analysis" 
        };

    // Format and return the results list as CSV
    return formatResponse("CSV-DOWNLOAD", results, columns);
}


    // Helper method to combine patient, study, and series data
    private Object[] combineData(Object[] patientData, Object[] studyData, Object[] seriesData) {
        // Example of combining data into a unified structure (add null checks and proper indexing based on actual DAO responses)
        Object[] combined = new Object[31]; // Define size based on total columns

        // Add patient data
        combined[0] = patientData[0];  // Patient ID
        combined[1] = patientData[3];  // Patient Sex
        combined[2] = patientData[6];  // Phantom
        combined[3] = patientData[7];  // Species Code
        combined[4] = patientData[8];  // Species Description
        combined[5] = patientData[4];  // Ethnic Group

        // Add study data
        combined[6] = studyData[1];  // Study Instance UID
        combined[7] = studyData[3];  // Study Date
        combined[8] = studyData[2];  // Study Description
        combined[9] = studyData[12];  // Series Count
        combined[10] = studyData[13];  // Longitudinal Temporal Event Type
        combined[11] = studyData[14];  // Longitudinal Temporal Offset From Event
        combined[12] = studyData[5];  // Patient Age

        // Add series data
        combined[13] = seriesData[0];  // Series Instance UID
        combined[14] = seriesData[2];  // Modality
        combined[15] = seriesData[3];  // Protocol Name
        combined[16] = seriesData[4];  // Series Date
        combined[17] = seriesData[5];  // Series Description
        combined[18] = seriesData[6];  // Body Part Examined
        combined[19] = seriesData[7];  // Series Number
        combined[20] = seriesData[9];  // Collection
        combined[21] = seriesData[11];  // Manufacturer
        combined[22] = seriesData[12];  // Manufacturer Model Name
        combined[23] = seriesData[13]; // Software Versions
        combined[24] = seriesData[14]; // Image Count
        combined[25] = seriesData[15]; // Date Released
        combined[26] = seriesData[16]; // License Name
        combined[27] = seriesData[17]; // License URI
        combined[28] = seriesData[18]; // Collection URI
        combined[29] = seriesData[19]; // File Size
        combined[30] = seriesData[23]; // Third Party Analysis

        return combined;
    }
}
