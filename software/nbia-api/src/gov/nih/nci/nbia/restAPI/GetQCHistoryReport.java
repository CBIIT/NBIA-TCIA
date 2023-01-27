package gov.nih.nci.nbia.restAPI;

import java.util.List;

import javax.ws.rs.Path;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import gov.nih.nci.nbia.dao.QcStatusDAO;
import gov.nih.nci.nbia.dto.QcStatusHistoryDTO;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.restUtil.JSONUtil;
import gov.nih.nci.nbia.restUtil.QAUserUtil;

@Path("/getQCHistoryReport")
public class GetQCHistoryReport extends getData{
	public final static String TEXT_CSV = "text/csv";

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)

	public Response constructResponse(@FormParam("seriesId") List<String> seriesList) {

		try {	
//			Authentication authentication = SecurityContextHolder.getContext()
//					.getAuthentication();
//			String user = (String) authentication.getPrincipal();
			String user = getUserName(); 

            if (!QAUserUtil.isUserQA(user)) {
            	System.out.println("Not QA User!!!!");
			    NCIASecurityManager sm = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
			   if (!sm.hasQaRole(user)) {
			  	  return Response.status(401)
						.entity("Insufficiant Privileges").build();
			   } else {
				   QAUserUtil.setUserQA(user);
			   }
            }
            
        	QcStatusDAO qcStatusDAO = (QcStatusDAO)SpringApplicationContext.getBean("qcStatusDAO");
        	List<QcStatusHistoryDTO> qshDTOList =qcStatusDAO.findQcStatusHistoryInfo(seriesList);
        	for (QcStatusHistoryDTO dto:qshDTOList){
        		if (dto.getNewStatus()==null) {
        			dto.setNewStatus(dto.getOldStatus());
        		}
        	}
		return Response.ok(JSONUtil.getJSONforQcStatusHistory(qshDTOList)).type("application/json")
				.build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500)
				.entity("Server was not able to process your request").build();
	}

}
