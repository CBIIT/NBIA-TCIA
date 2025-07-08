package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MultivaluedMap;

import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.SearchUtil;
import gov.nih.nci.nbia.restUtil.PatientSearchSummary;
import gov.nih.nci.nbia.searchresult.*;
import gov.nih.nci.nbia.dao.*;
import gov.nih.nci.nbia.dto.SeriesDTO;

@Path("/v4/getRestrictionsForSimpleSearch")
public class GetRestrictionsForSimpleSearch extends getData{
	public final static String TEXT_CSV = "text/csv";

	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) throws Exception {

	  SearchUtil util=new SearchUtil();
	  PatientSearchSummary  search= null;

	  String user = getUserName();
	  search=util.getPatients_v4(inFormParams, user, true);

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
		System.out.println("searching for series commercial restrictions"+seriesList.size());
		List<SeriesDTO> seriesDTOs=generalSeriesDAO.findSeriesBySeriesPkId(seriesList);
		for (SeriesDTO seriesDTO:seriesDTOs) {
			if (seriesDTO.isCommercialRestrictions()) {
				return Response.ok("yes").type("application/text").build();
			}
		}
		System.out.println("searching for series commercial restrictions done");
		return Response.ok("no").type("application/x-nbia-manifest-file").build();
	}
}
