//To Test: http://localhost:8080/nbia-auth/services/v3/getUserList?format=html

package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.csmDao.UserDao;

//import gov.nih.nci.security.UserProvisioningManager;
//import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
//import gov.nih.nci.security.authorization.domainobjects.UserGroupRoleProtectionGroup;
//
//import org.hibernate.Transaction;
//import org.hibernate.SessionFactory;
//import org.hibernate.Criteria;
//import org.hibernate.HibernateException;
//import org.hibernate.Session;
//import org.hibernate.criterion.Restrictions;
//import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v3/getUserListForPG")
public class V3_getUserListForPG extends getData{
	public final static String TEXT_CSV = "text/csv";
	private static final String column ="UserName";
//	private static SessionFactory factory; 
	
	@Context private HttpServletRequest httpRequest;

	/**
	 * This method get a list of login names associated with the given protection group
	 *
	 * @return String - list of user login names
	 */
	@GET
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.TEXT_HTML, TEXT_CSV})

	public Response constructResponse(@QueryParam("PGName") String pgName, @QueryParam("format") String format) {
		UserDao dao = (UserDao) SpringApplicationContext.getBean("userDao");
		List<String> userNames= dao.getAllUsersFromPG(pgName);

		return formatResponse(format, userNames, column);
	}
}
