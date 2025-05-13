package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Context;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.Set;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.StudyDAO;

@Path("/v4/getStudyDrillDown")
public class GetStudyDrillDown extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("list") List<String> list, @Context HttpServletRequest request) {

    Set<String> allowedParams = Set.of("list");

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

		StudyDAO studyDAO = (StudyDAO)SpringApplicationContext.getBean("studyDAO");
		List<Integer> input = new ArrayList<Integer>();
		for (String item:list){
			input.add(Integer.valueOf(item));
		}
 		List<StudyDTO> studies = studyDAO.findStudiesBySeriesId_v4(input);


		return Response.ok(JSONUtil.getJSONforStudies(studies)).type("application/json")
				.build();
	}
}
