package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.FormParam;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import gov.nih.nci.nbia.dao.CustomSeriesListDAO;
import gov.nih.nci.nbia.dto.CustomSeriesListDTO;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.JSONUtil;

@Path("/getSharedList")
public class GetSharedList extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("nameValue") String nameValue) {

		try {	
		CustomSeriesListDAO customSeriesListDAO = (CustomSeriesListDAO)SpringApplicationContext.getBean("customSeriesListDAO");
		CustomSeriesListDTO tdto = customSeriesListDAO.findCustomSeriesListByName(nameValue);	
		return Response.ok(JSONUtil.getJSONforShareList(tdto)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
}