package gov.nih.nci.nbia.restAPI;

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
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.*;
import gov.nih.nci.nbia.restUtil.SearchUtil;
import gov.nih.nci.nbia.restUtil.PatientSearchSummary;
import gov.nih.nci.nbia.searchresult.*;
import gov.nih.nci.nbia.dao.*;
import gov.nih.nci.nbia.dto.SeriesDTO;

@Path("/getManifestForSimpleSearch")
public class GetManifestForSimpleSearch extends getData{
	public final static String TEXT_CSV = "text/csv";

	@POST
	@Produces(MediaType.TEXT_PLAIN)

	public Response constructResponse(MultivaluedMap<String, String> inFormParams) {

		try {	

	    SearchUtil util=new SearchUtil();
		PatientSearchSummary  search=util.getPatients(inFormParams);
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
