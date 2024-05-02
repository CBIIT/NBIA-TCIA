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

@Path("/getSeriesMetadata2")
public class GetSeriesMetadata2 extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(TEXT_CSV)

	public Response constructResponse(@FormParam("list") List<String> list) {

		System.out.println("List-"+list);
		List<Object[]> results = null;
		List<String> authorizedCollections = new ArrayList<String>();
		String userName = getUserName();
		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(userName);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(userName, authorizedSiteData);
		}
		for (SiteData siteData:authorizedSiteData) {
			String protectionElement="'"+siteData.getCollection()+"//"+siteData.getSiteName()+"'";
			authorizedCollections.add(protectionElement);
		}
		StudyDAO studyDAO = (StudyDAO)SpringApplicationContext.getBean("studyDAO");
		results = studyDAO.getSeriesMetadata(list, authorizedCollections);
		String[] columns={"Subject ID","Study UID","Study Description","Study Date","Series ID","Series Description",
				"Number of images","File Size (Bytes)", "Collection Name", "Modality", "Manufacturer", "3rd Party Analysis",
				"Data Description URI", "Series Number", "License Name", "License URL", "Date Released"};

		return formatResponse("CSV-DOWNLOAD", results, columns);
	}
}
