package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/createCollectionSite")
public class V3_createCollectionSite extends getData {

	/**
	 * This method create a new project/site
	 *
	 * @return String - the status of operation
	 */
	@POST
	@Produces({ MediaType.APPLICATION_JSON })

	public Response constructResponse(@QueryParam("collection") String collection, @QueryParam("site") String site) {
		if (!hasAdminRole()) {
			return Response.status(401, "Not authorized to use this API.").build();
		}
		TrialDataProvenanceDAO tDao = (TrialDataProvenanceDAO) SpringApplicationContext
				.getBean("trialDataProvenanceDAO");
		StringBuffer errorMsg = new StringBuffer();
		if (collection == null || site == null) {
			return Response.notAcceptable(null).build();
		} else {
			try {
				tDao.setProjSiteValues(collection, site);
			} catch (Exception e) {
				errorMsg.append("Exception in creating project and site: " + e);
				e.printStackTrace();
			}
		}
		return Response.ok("[\"status\", \"Submited the project/site creation request.\"]").type("application/json")
				.build();
	}
}
