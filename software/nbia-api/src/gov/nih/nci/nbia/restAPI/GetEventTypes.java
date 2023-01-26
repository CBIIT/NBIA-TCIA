package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.lookup.*;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dao.StudyDAO;
import gov.nih.nci.nbia.searchresult.SeriesSearchResult;

@Path("/getEventTypes")
public class GetEventTypes extends getData{
	private static final String column="Collection";
	public final static String TEXT_CSV = "text/csv";

	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() {

		try {	


		StudyDAO studyDAO = (StudyDAO)SpringApplicationContext.getBean("studyDAO");

        List<String> events = studyDAO.getEventTypes();


        
		return Response.ok(JSONUtil.getJSONforStringList(events)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}
	
	private static BasketSeriesItemBean convert(SeriesSearchResult seriesDTO){
		BasketSeriesItemBean returnBean = new BasketSeriesItemBean(seriesDTO);

		returnBean.setAnnotationsFlag(seriesDTO.isAnnotated());
		returnBean.setAnnotationsSize(seriesDTO.getAnnotationsSize());
		returnBean.setPatientId(seriesDTO.getPatientId());
		returnBean.setProject(seriesDTO.getProject());
		returnBean.setSeriesId(seriesDTO.getSeriesInstanceUid());
		returnBean.setSeriesPkId(seriesDTO.getId());
		returnBean.setStudyId(seriesDTO.getStudyInstanceUid());
		returnBean.setStudyPkId(seriesDTO.getStudyId());
		returnBean.setTotalImagesInSeries(seriesDTO.getNumberImages());
		returnBean.setTotalSizeForAllImagesInSeries(seriesDTO.getTotalSizeForAllImagesInSeries());
		returnBean.setStudyDate(seriesDTO.getStudyDate());
		returnBean.setStudyDescription(seriesDTO.getStudyDescription());
		returnBean.setSeriesDescription(seriesDTO.getDescription());
		returnBean.setStudy_id(seriesDTO.getStudy_id());
		returnBean.setSeriesDescription(seriesDTO.getDescription());
		returnBean.setSeriesNumber(seriesDTO.getSeriesNumber());
		returnBean.setPatientpk(seriesDTO.getPatientpk());
		return returnBean;
	}
}
