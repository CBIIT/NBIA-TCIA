//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dao.StudyDAO;
import org.springframework.dao.DataAccessException;
@Path("/getSeriesMetadata2")
public class GetSeriesMetadata2 extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@Context private HttpServletRequest httpRequest;
	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(TEXT_CSV)

	public Response constructResponse(@FormParam("list") List<String> list) {

		
		System.out.println("List-"+list);

		   Authentication authentication = SecurityContextHolder.getContext()
					.getAuthentication();
			List<String> authorizedCollections = null;
			try {
				authorizedCollections = getAuthorizedCollections();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		List<Object[]> results = null;
     System.out.println("seriesIDS-"+list);
		StudyDAO studyDAO = (StudyDAO)SpringApplicationContext.getBean("studyDAO");
		try {
			results = studyDAO.getSeriesMetadata(list, authorizedCollections);
		}
		catch (Exception ex) {
			ex.printStackTrace();
			return Response.status(500)
					.entity("Server was not able to process your request due to exception").build();
		}
		String[] columns={"Subject ID","Study UID","Study Date","Study Description","Series ID","Series Description","Number of images","File Size (Bytes)", "Collection Name", "Modality", "Manufacturer"};
		return formatResponse("CSV-DOWNLOAD", results, columns);
	}
}
