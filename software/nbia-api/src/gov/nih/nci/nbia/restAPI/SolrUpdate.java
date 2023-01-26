//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.textsupport.PatientUpdater;

@Path("/solrUpdate")
public class SolrUpdate extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(@FormParam("action") String action) {

		try {	
			    System.out.println("Running Solr Update from API");
			    PatientUpdater updater=new PatientUpdater();
	        	updater.runUpdates();
	    		return Response.ok().type("text/plain")
	    				.entity("Job Complete")
	    				.build();
	        }
	        catch(Exception ex) {
	        	ex.printStackTrace();
	    		return Response.status(500)
	    				.entity("Server was not able to process your request").build();
	        }
	}
	
}
