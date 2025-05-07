package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;

import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.dto.TimePointDTO;

import gov.nih.nci.nbia.security.UnauthorizedException;

@Path("/v4/getMinMaxTimepoints")
public class GetMinMaxTimepoints extends getData{


	@Context private HttpServletRequest httpRequest;

	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() throws Exception {

		StudyDAO studyDAO = (StudyDAO)SpringApplicationContext.getBean("studyDAO");
		TimePointDTO values=studyDAO.getMinMaxTimepoints_v4();
		return Response.ok(JSONUtil.getJSONforTimepoint(values)).type("application/json")
				.build();
	}
}
