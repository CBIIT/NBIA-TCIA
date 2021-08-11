//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?Collection=IDRI
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?format=csv
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?Collection=IDRI&format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?Collection=IDRI&format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?Collection=IDRI&format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getPatient?Collection=IDRI&format=csv

package gov.nih.nci.nbia.restAPI;

import java.util.List;

import org.springframework.dao.DataAccessException;

import javax.ws.rs.core.Response.Status;

import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.dao.PatientDAO;
import gov.nih.nci.nbia.restUtil.FormatOutput;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import io.swagger.annotations.*;

@Path("/v1/NewPatientsInCollection")
public class V1_getNewPatientsInCollection extends getData{
	private static final String[] columns={"PatientId", "PatientName", "PatientBirthDate", "PatientSex", "EthnicGroup", "Collection","Phantom","SpeciesCode","SpeciesDescription"};
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of patient objects filtered by collection
	 * 
	 * @return String - set of patient
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})
	@ApiOperation(value = "Get the new patients in a collection",
	  notes = "This method returns patients that have been added since a specific date")
  @ApiResponses(value = {
          @ApiResponse(code = 200, message = "Returned patient objects"),
          @ApiResponse(code = 400, message = "Required parameters not supplied."),
          @ApiResponse(code = 500, message = "An unexpected error has occurred. The error has been logged.") })
	
	public Response  constructResponse(	@ApiParam(name =  "collection", 
			   value = "The collection to get new patients from", example = "4D-Lung", required = true) 
			@QueryParam("Collection") String collection, 
			@ApiParam(name =  "Date", 
			   value = "The date to get new patients from", example = "2010/08/16", required = true) 
			@QueryParam("Date") String dateFrom,
			@ApiParam(name =  "format", 
			   value = "Desired format (CSV, HTML, XML, and JSON)", example = "CSV", required = false) 
			@QueryParam("format") String format) {
		List<String> authorizedCollections = null;
		if (collection == null||dateFrom == null) {
			return Response.status(Status.BAD_REQUEST)
					.entity("A parameter, Collection and Date are required for this API call.")
					.type(MediaType.APPLICATION_JSON).build();
		}
		try {
			authorizedCollections = getPublicCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<Object[]> data = getPatientByCollection(collection, dateFrom, authorizedCollections);
		return formatResponse(format, data, columns);
	}
}
