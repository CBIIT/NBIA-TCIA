//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.dto.CustomSeriesListDTO;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.dao.CustomSeriesListDAO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;

@Path("/createSharedList")
public class CreateSharedList extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(@FormParam("list") List<String> list, @FormParam("name") String name,
			@FormParam("description") String description, @FormParam("url") String url) {
			String user = getUserName();		
			List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
			if (authorizedSiteData==null){
			     AuthorizationManager am = new AuthorizationManager(user);
			     authorizedSiteData = am.getAuthorizedSites();
			     AuthorizationUtil.setUserSites(user, authorizedSiteData);
			}

			List<String> noPermissionList = validate(list, authorizedSiteData);
			if (noPermissionList.size()>0){
	    		return Response.status(400).type("text/plain")
				.entity("User does not have permission for all series in list")
				.build();
			}
			CustomSeriesListDAO customSeriesListDAO = (CustomSeriesListDAO)SpringApplicationContext.getBean("customSeriesListDAO");
			if (customSeriesListDAO.isDuplicateName(name)){
	    		return Response.status(400).type("text/plain")
				.entity("Duplicate list name")
				.build();
			}
			CustomSeriesListDTO  csDTO=new CustomSeriesListDTO();
			csDTO.setSeriesInstanceUIDs(list);
			csDTO.setName(name);
			csDTO.setComment(description);
			csDTO.setHyperlink(url);
			customSeriesListDAO.insert(csDTO, user);

			return Response.ok().type("text/plain")
					.entity("List created")
					.build();
	}
	/**
	 * Determine whether user has permission to see the seriesUids
	 * @param seriesUids
	 * @return the seriesUids that user does not have permission to see
	 */
	public List<String> validate(List<String> seriesUids, List<SiteData> authorizedSites){
		List<String> noPermissionList = new ArrayList<String>();
		    GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
			List<SeriesDTO> seriesDTOsFound = generalSeriesDAO.findSeriesBySeriesInstanceUID(seriesUids, authorizedSites, null);
			//user do not have permission to see any in the list.
			if(seriesDTOsFound.isEmpty()){
				System.out.println("The returned SeriesDTOs is empty. user do not have permission to see any series in the list.");
				return seriesUids;
			}
			//System.out.println("found: " + seriesDTOsFound.size());
			List<String> seriesUidsFound = new ArrayList<String>();
			for(SeriesDTO seriesDTO: seriesDTOsFound){
				String seriesInstanceUid = seriesDTO.getSeriesUID();
				seriesUidsFound.add(seriesInstanceUid);	
			}
			for(String seriesUid : seriesUids){
				if(!seriesUidsFound.contains(seriesUid)){
					noPermissionList.add(seriesUid);
				}
			}
		return noPermissionList;
	}
}
