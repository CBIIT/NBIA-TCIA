package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.dao.LicenseDAO;
import gov.nih.nci.nbia.dto.LicenseDTO;

@Path("/getLicenses")
public class GetLicense extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse() throws Exception {
        LicenseDAO licenseDAO = (LicenseDAO)SpringApplicationContext.getBean("licenseDAO");
		List<LicenseDTO> values = licenseDAO.findLicenses();
		return Response.ok(JSONUtil.getJSONforLicense(values)).type("application/json")
				.build();
	}
}
