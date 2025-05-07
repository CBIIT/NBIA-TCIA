package gov.nih.nci.nbia.restAPI.v4;

import java.util.*;
import java.text.*;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dto.DOIDTO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;

@Path("/v4/getCollectionOrSeriesForDOI")
public class GetCollectionOrSeriesFromDOI extends getData{

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response  constructResponse(@FormParam("DOI") String doi, @FormParam("CollectionOrSeries") String collectionOrSeries) {
		String user = null;

		List<String> authorizedCollections = null;
		try {
			authorizedCollections = getAuthorizedCollections();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		GeneralSeriesDAO tDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
		List<DOIDTO> dois=tDao.getCollectionOrSeriesForDOI_v4(doi, collectionOrSeries, authorizedCollections);
		return Response.ok(JSONUtil.getJSONforDOI(dois)).type("application/json")
				.build();
	}

	private Date getDate(String date) {
		Date returnValue=null;

		if (date==null) {
			return Calendar.getInstance().getTime();
		}
		DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
		try {
		returnValue=format.parse(date);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String today = format.format(new Date());
		System.out.println("today-"+today);
		return returnValue;
	}

}
