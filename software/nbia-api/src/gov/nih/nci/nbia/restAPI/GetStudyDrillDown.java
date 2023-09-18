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
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.StudyDAO;

@Path("/getStudyDrillDown")
public class GetStudyDrillDown extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("list") List<String> list) {
		String user = getUserName();

		List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(user);
		if (authorizedSiteData==null){
		     AuthorizationManager am = new AuthorizationManager(user);
		     authorizedSiteData = am.getAuthorizedSites();
		     AuthorizationUtil.setUserSites(user, authorizedSiteData);
		}
		List<String> seriesSecurityGroups = new ArrayList<String>();
		StudyDAO studyDAO = (StudyDAO)SpringApplicationContext.getBean("studyDAO");
		List<Integer> input = new ArrayList<Integer>();
		for (String item:list){
			input.add(Integer.valueOf(item));
		}
 		List<StudyDTO> studies = studyDAO.findStudiesBySeriesId(input);


		return Response.ok(JSONUtil.getJSONforStudies(studies)).type("application/json")
				.build();
	}
}
