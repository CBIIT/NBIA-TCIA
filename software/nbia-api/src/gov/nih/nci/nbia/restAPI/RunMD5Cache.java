package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;

@Path("/v1/runMD5Cache")
public class RunMD5Cache extends getData{
	/**
	 * Clears the resultset cache
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse() {

		try {	

        	GeneralSeriesDAO tDao = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
        	tDao.cacheMD5ForAllCollections();
       
		return Response.ok("cleared").type(MediaType.TEXT_PLAIN)
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	
}
	
