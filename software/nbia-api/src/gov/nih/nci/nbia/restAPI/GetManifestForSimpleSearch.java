//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.querystorage.QueryStorageManager;
import gov.nih.nci.nbia.dynamicsearch.DynamicSearchCriteria;
import gov.nih.nci.nbia.dynamicsearch.Operator;
import gov.nih.nci.nbia.dynamicsearch.QueryHandler;
import gov.nih.nci.nbia.lookup.StudyNumberMap;
import gov.nih.nci.nbia.search.PatientSearcher;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.*;
import gov.nih.nci.nbia.restUtil.PatientResultSetCache;
import gov.nih.nci.nbia.restUtil.ResultSetSorter;
import gov.nih.nci.nbia.restUtil.SearchUtil;
import gov.nih.nci.nbia.restUtil.PatientSearchSummary;
import gov.nih.nci.nbia.restUtil.PatientSummaryFactory;
import gov.nih.nci.nbia.searchresult.*;
import gov.nih.nci.nbia.dao.*;
import gov.nih.nci.nbia.dto.SeriesDTO;

import java.text.SimpleDateFormat;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Path("/getManifestForSimpleSearch")
public class GetManifestForSimpleSearch extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";


	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) {

		try {	

	    SearchUtil util=new SearchUtil();
		System.out.println("searching for patients");
		PatientSearchSummary  search=util.getPatients(inFormParams);
		System.out.println("patients found");
		long currentTimeMillis = System.currentTimeMillis();
		String manifestFileName = "manifest-" + currentTimeMillis + ".tcia";
		List<String> list=new ArrayList<String>();
		
		List<PatientSearchResultWithModilityAndBodyPart> patients = search.getResultSet();
		List<Integer> seriesList = new ArrayList<Integer>();
		GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
		for (PatientSearchResultWithModilityAndBodyPart patient:patients) {
			StudyIdentifiers[] studies=patient.getStudyIdentifiers();
			for (StudyIdentifiers study:studies) {
				if (study.getSeriesIdentifiers()!=null) {
					seriesList.addAll(Arrays.asList(study.getSeriesIdentifiers()));
				}
			}
		}
		System.out.println("searching for series"+seriesList.size());
		List<SeriesDTO> seriesDTOs=generalSeriesDAO.findSeriesBySeriesPkId(seriesList);

		for (SeriesDTO seriesDTO:seriesDTOs) {
			list.add(seriesDTO.getSeriesUID());
		}
		System.out.println("searching for series done");
		String manifest=ManifestMaker.getManifextFromSeriesIds(list, "false", manifestFileName);
		return Response.ok(manifest).type("application/x-nbia-manifest-file").build();

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	

}
