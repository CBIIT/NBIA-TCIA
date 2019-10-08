//To Test: http://localhost:8080/nbia-auth/services/v3/createUser?loginName=authTest&email=test@mail.nih.gov&active=true

package gov.nih.nci.nbia.restAPI;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import gov.nih.nci.nbia.dao.TrialDataProvenanceDAO;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/createCollectionSite")
public class V3_createCollectionSite extends HibernateDaoSupport {
	@Context
	private HttpServletRequest httpRequest;

	/**
	 * This method create a new project/site
	 *
	 * @return String - the status of operation
	 */
	@POST
	@Produces({ MediaType.APPLICATION_JSON })

	public Response constructResponse(@QueryParam("collection") String collection, @QueryParam("site") String site) {
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
