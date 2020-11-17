/**
 *
 */
package gov.nih.nci.nbia.restSecurity;


import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.security.TableProtectionElement;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.security.authorization.domainobjects.ProtectionElementPrivilegeContext;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;
import gov.nih.nci.security.exceptions.CSObjectNotFoundException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import javax.ws.rs.core.Response.Status;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

/**
 * @author panq
 *
 */
public class AuthorizationService {

	// private static final String AUTHORIZATION_PROPERTY = "Authorization";
	// private static final String AUTHENTICATION_SCHEME = "Basic";

	public static List<String> getCollectionForPublicRole()
			throws CSObjectNotFoundException {
		List<String> publicProtectionElemLst = new ArrayList<String>();
		String csmContextName = NCIAConfig.getCsmApplicationName()+".";
		NCIASecurityManager mgr = (NCIASecurityManager) SpringApplicationContext
				.getBean("nciaSecurityManager");
		Set<TableProtectionElement> publicPEs = mgr
				.getSecurityMapForPublicRole();
		for (TableProtectionElement tPE : publicPEs) {
			String protectionElementName = tPE.getAttributeValue();
			if (protectionElementName.indexOf("//") != -1) {
				protectionElementName = protectionElementName.replaceFirst(
						csmContextName, "'");
				protectionElementName = protectionElementName.concat("'");
				publicProtectionElemLst .add(protectionElementName);
//				System.out.println("!!!public protection group="
//						+ protectionElementName);
			}
		}
		return publicProtectionElemLst;
	}


	public static List<String> getAuthorizedCollections(String userName) throws Exception {
		
		
		   Authentication authentication = SecurityContextHolder.getContext()
					.getAuthentication();
			List<String> authorizedCollections = new ArrayList<String>();
			List<SiteData> authorizedSiteData = AuthorizationUtil.getUserSiteData(userName);
			if (authorizedSiteData==null){
			     AuthorizationManager am = new AuthorizationManager(userName);
			     authorizedSiteData = am.getAuthorizedSites();
			     AuthorizationUtil.setUserSites(userName, authorizedSiteData);
			}
			for (SiteData siteData:authorizedSiteData) {
				String protectionElement="'"+siteData.getCollection()+"//"+siteData.getSiteName()+"'";
				authorizedCollections.add(protectionElement);
			}
         
			return authorizedCollections;

	}

	public static boolean isGivenUserHasAccess(String userName, Map<String,String> queryParamsMap) {
	List<String> projAndSiteRequested = new ArrayList<String>();
	List<String> authorizedProjAndSite = null;

	try {
	if (userName.equalsIgnoreCase("anonymousUser")) {
		authorizedProjAndSite = AuthorizationService
				.getCollectionForPublicRole();
	} else {
		authorizedProjAndSite = AuthorizationService
				.getAuthorizedCollections(userName);
	}

	GeneralSeriesDAO generalSeriesDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
	projAndSiteRequested.addAll(generalSeriesDao.getRequestedProjectAndSite(queryParamsMap));

	if (authorizedProjAndSite != null) {
		//check if request collection is part of authorized collection for user
		for (String reqPandS :projAndSiteRequested) {
			//System.out.println("requested Project and site ="+reqPandS);
			String formatedS = "'"+ reqPandS +"'";
			if (authorizedProjAndSite.contains(formatedS))
			return true;
		}
	}
	else {
		return false;
		 //throw new  CSObjectNotFoundException ("The user "+userName+" is not in authrization database");
		//user is authenticated but not in local database
	}
    }
    catch (Exception ex) {
    	ex.printStackTrace();
    }
	return false;
	}
}
