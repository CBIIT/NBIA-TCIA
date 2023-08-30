package gov.nih.nci.nbia.restAPI;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.FormParam;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResultImpl;
import gov.nih.nci.nbia.textsupport.SolrAllDocumentMetaData;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.SearchUtil;

@Path("/getTextSearch")
public class GetTextSearch extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("textValue") String textValue) throws Exception {

		String userName = getUserName(); 
        SearchUtil util=new SearchUtil();
        List<PatientSearchResult> patients=util.getPatients(textValue,userName);
		List<PatientSearchResult> textPatients = new ArrayList<PatientSearchResult>();
		for (PatientSearchResult patient:patients)
		{
			PatientTextSearchResult textResult=new PatientTextSearchResultImpl(patient);
			SolrAllDocumentMetaData solrResult =  util.getPatientMap().get(textResult.getSubjectId());
			if (solrResult==null)
			{
				System.out.println("******* can't find id in patient map " + textResult.getSubjectId());
			} else
			{
				textResult.setHit(solrResult.getFoundValue());
			    textPatients.add(textResult);
			}
		}
		return Response.ok(JSONUtil.getJSONforPatients(textPatients)).type("application/json")
				.build();
	}
}
