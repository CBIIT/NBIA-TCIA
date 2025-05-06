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

@Path("/v4/getSeriesMetadata3")
public class V4_getSeriesMetadata3 extends getData {

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
        // StudyDAO studyDAO = (StudyDAO) SpringApplicationContext.getBean("studyDAO");
        // GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");


            // Fetch individual components
            // Object[] patientData = patientDAO.getPatientBySeries(seriesInstanceUID, authorizedCollections).get(0);
            // Object[] studyData = studyDAO.getPatientStudyBySeries(seriesInstanceUID, authorizedCollections).get(0);
            // Object[] seriesData = generalSeriesDAO.getSeriesById(seriesInstanceUID , authorizedCollections).get(0);
            
        System.out.println(seriesInstanceUIDs.get(0));
        results = patientDAO.getCombinedDataBySeries(seriesInstanceUIDs.get(0), authorizedCollections);
            

            // Combine data into a single row
            // Object[] combinedData = combineData(patientData, studyData, seriesData);

        // Final column names and response formatting
        String[] columns = {
            "Patient ID", "Patient Name", "Patient Birth Date", "Patient Sex", "Ethnic Group", "Phantom", "Species Code", "Species Description", 
            "Study Instance UID", "Study Date", "Study Description", "Admitting Diagnosis Description", "Study ID", "Patient Age",
            "Longitudinal Temporal Event Type", "Longitudinal Temporal Offset From Event", 
            "Series Instance UID", "Project", "Modality", "Protocol Name", "Series Date", "Series Description",
            "Body Part Examined", "Series Number", "Annotations Flag", "Manufacturer", "Manufacturer Model Name",
            "Software Versions", "Image Count", "Max Submission Timestamp", "License Name", "License URI", "Collection URI",
            "File Size", "Date Released", "Third Party Analysis" 
        };

    // Format and return the results list as CSV
    return formatResponse("CSV-DOWNLOAD", results, columns);
    }
}
    
    

