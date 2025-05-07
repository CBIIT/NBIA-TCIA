package gov.nih.nci.nbia.restAPI.v4;

import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.ncia.criteria.*;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.JSONUtil;

import gov.nih.nci.nbia.dao.ValueAndCountDAO;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;
import gov.nih.nci.nbia.dto.SpeciesDTO;

@Path("/v4/getSpeciesTax")
public class GetSpeciesTax extends getData{
	public final static String TEXT_CSV = "text/csv";
	/**
	 * This method get a set of all species names
	 *
	 * @return String - set of species names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() throws Exception{


		ValueAndCountDAO valueAndCountDAO = (ValueAndCountDAO)SpringApplicationContext.getBean("ValueAndCountDAO");
		List<SpeciesDTO> values = valueAndCountDAO.speciesTax_v4();
		return Response.ok(JSONUtil.getJSONforSpecies(values)).type("application/json")
				.build();
	}
}
