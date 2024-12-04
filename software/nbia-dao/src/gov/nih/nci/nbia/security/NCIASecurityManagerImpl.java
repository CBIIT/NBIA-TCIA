/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
* $Id: NCIASecurityManager.java 12937 2010-10-04 15:34:23Z kascice $
*
* $Log: not supported by cvs2svn $
* Revision 1.5  2008/02/07 18:14:16  lethai
* commented out debugging message
*
* Revision 1.4  2007/12/17 20:36:25  lethai
* changes for tracker id 8161 and 11009
*
* Revision 1.3  2007/10/01 12:22:10  bauerd
* *** empty log message ***
*
* Revision 1.2  2007/08/29 19:11:19  bauerd
* *** empty log message ***
*
* Revision 1.1  2007/08/07 12:05:23  bauerd
* *** empty log message ***
*
* Revision 1.1  2007/08/05 21:44:39  bauerd
* Initial Check in of reorganized components
*
* Revision 1.15  2006/11/20 17:57:08  panq
* Modified for caGrid which needs to grant the public access.
*
* Revision 1.14  2006/09/27 20:46:27  panq
* Reformated with Sun Java Code Style and added a header for holding CVS history.
*
*/
package gov.nih.nci.nbia.security;

import gov.nih.nci.nbia.dao.AbstractDAO;
import gov.nih.nci.nbia.ldapService.UserLdapService;
import gov.nih.nci.nbia.security.NCIASecurityManager.RoleType;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.util.SimpleCache;
import gov.nih.nci.security.AuthenticationManager;
import gov.nih.nci.security.SecurityServiceProvider;
import gov.nih.nci.security.UserProvisioningManager;
import gov.nih.nci.security.authorization.domainobjects.Group;
import gov.nih.nci.security.authorization.domainobjects.ProtectionElement;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroup;
import gov.nih.nci.security.authorization.domainobjects.ProtectionGroupRoleContext;
import gov.nih.nci.security.authorization.domainobjects.Role;
import gov.nih.nci.security.authorization.domainobjects.User;
import gov.nih.nci.security.dao.AuthorizationDAOImpl;
import gov.nih.nci.security.dao.GroupSearchCriteria;
import gov.nih.nci.security.dao.ProtectionGroupSearchCriteria;
import gov.nih.nci.security.dao.SearchCriteria;
import gov.nih.nci.security.dao.UserSearchCriteria;
import gov.nih.nci.security.exceptions.CSConfigurationException;
import gov.nih.nci.security.exceptions.CSException;
import gov.nih.nci.security.exceptions.CSObjectNotFoundException;
import gov.nih.nci.security.exceptions.CSTransactionException;

import org.apache.commons.lang.time.DateUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;
//import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import gov.nih.nci.nbia.util.NCIAConfig;
public class NCIASecurityManagerImpl extends AbstractDAO
                                     implements NCIASecurityManager {

    private static Logger logger = LogManager.getLogger(NCIASecurityManager.class);
    static final Logger resultLog = LogManager.getLogger("LDAPSyncRPT");
    // Constants used in CSM API but is not provided in CSM API. So define here.
    private static final byte ZERO = 0;
    private static final int PASSWORD_EXPIRY_DAYS = 60;

    // Name of the "READ" Role
    private static final String readRoleName = RoleType.READ.toString();

    // Name of the public protection group
    private static final String publicProtectionGroupName = NCIAConfig.getProtectionElementPrefix() +
        "PUBLIC";

    // Primary key of the public protection group
    private static Long publicProtGroupId;
    private String applicationName = null;
    private UserProvisioningManager upm = null;
    private AuthenticationManager am = null;

    private static SimpleCache<String, Set<TableProtectionElement>> userCache =
		new SimpleCache<String, Set<TableProtectionElement>>();

    /*
     * Constructor
     */
    public NCIASecurityManagerImpl() {
    }

	@Transactional(propagation=Propagation.REQUIRED)
    public void init() throws DataAccessException {
    	try {
	        this.applicationName = NCIAConfig.getCsmApplicationName();
	        logger.info("CSM application name is " + this.applicationName);
		    upm = (UserProvisioningManager)SecurityServiceProvider.getAuthorizationManager(this.applicationName);

	        am = SecurityServiceProvider.getAuthenticationManager(this.applicationName);
	        //logger.debug("UserProvisioningManager: " + upm + " AuthenticationManager is " + am);

	        try {
	            // Get ID for public protection group
	            ProtectionGroup exampleProtGroup = new ProtectionGroup();
	            exampleProtGroup.setProtectionGroupName(publicProtectionGroupName);
	            ProtectionGroupSearchCriteria pgsc = new ProtectionGroupSearchCriteria(exampleProtGroup);

	            List<ProtectionGroup> protGroupResult = upm.getObjects(pgsc);
	            publicProtGroupId = ((ProtectionGroup) protGroupResult.get(0)).getProtectionGroupId();
	        } catch (Exception e) {

	            logger.error("A CSM protection group must be defined with the name " +
	                publicProtectionGroupName + " " +e);
	            throw new RuntimeException(e);
	        }
    	}
        catch(Exception ex) {
			ex.printStackTrace();
        	throw new RuntimeException(ex);
        }

    }
    /**
     * Returns an instance for the default application name
     *
     * @throws CSException
     */
//    public static NCIASecurityManager getInstance() throws Exception {
//        if (manager == null) {
//            manager = new NCIASecurityManagerImpl(NCIAConfig.getCsmApplicationName());
//        }
//
//        return manager;
//    }

    /*
     * login method is to check CSM database to validate user's username and
     * password @param username,password @return boolean
     */

    public boolean login(String username, String password) throws CSException {
    	boolean loggedIn = false;
    	if ("keycloak".equalsIgnoreCase(NCIAConfig.getAuthenticationConfig())) {
    		loggedIn = AuthenticationWithKeycloak.getInstance().authenticateUser(username, password, NCIAConfig.getKeycloakClientId(), "");
    		return loggedIn;
    	}
    	else {
    	try {
    		loggedIn = am.login(username, password);  		
    	}
    	catch (Exception ex) {
    		ex.printStackTrace();
    		throw ex;
    	}
    	}

    	return loggedIn;
}

	@Transactional(propagation=Propagation.REQUIRED)
	public boolean isInLocalDB(String username) {

		List<Object> results = null;
		String hql = "select user.loginName from NCIAUser user where ";
		hql = hql + "user.loginName = '" + username + "'";
		boolean flag = false;

		try {

			results = getHibernateTemplate().find(hql);
			if (results != null && results.size() > 0) {
				flag = true;
			}
			else {
				flag = false;
			}
		} catch (Exception e) {
			flag = false;
			e.printStackTrace();
			throw new RuntimeException("Could not execute the query.");
		}
		return flag;
	}

    /*
     * Build up the set of "protection elements" for a given user.
     * These fake protection elements are used to decide whether
     * a user can see a given collection, series, site, etc.
     *
     * <P>The authorization information is stored in CSM, so this
     * method queries CSM for the given user (login).  Then... the
     * TableProtectionElement objects are built in a non-obvious
     * way per "real" ProtectionElement in the CSM tables.
     */

    public Set<TableProtectionElement> getSecurityMap(String userId)
        throws CSObjectNotFoundException {
        // System.out.println("getSecurityMap init: " + userId);
    	Set<TableProtectionElement> retSet = null;
    	// try {
	    //     retSet = userCache.get(userId);
    	// } catch(InterruptedException e) {
    	// 	e.printStackTrace();
    	// }
        // if(retSet != null){
        // 	return retSet;
        // }
        // System.out.println("Starting getSecurityMap for user " + userId);
        retSet = new HashSet<TableProtectionElement>();
        Map<String, TableProtectionElement> tempHastable = new Hashtable<String, TableProtectionElement>();

        //userRoles = combination of user PG and users groups PGs
        List<ProtectionGroupRoleContext> userRoles = new ArrayList<ProtectionGroupRoleContext>();

        //step 1 get PG tied directly to user
        Set<ProtectionGroupRoleContext> userSpecificRoles = upm.getProtectionGroupRoleContextForUser(userId);
        userRoles.addAll(userSpecificRoles);

        //step 2 get PG tied to all the groups the user is a member of
        Set<Group> groups = upm.getGroups(userId);
        long startLoop = System.currentTimeMillis();
        for(Group group : groups) {
        	Set<ProtectionGroupRoleContext> groupRoles = upm.getProtectionGroupRoleContextForGroup(Long.toString(group.getGroupId()));
        	userRoles.addAll(groupRoles);
        }


        //  Iterate over the protection groups
        for (ProtectionGroupRoleContext roleContext : userRoles) {
            ProtectionGroup group = roleContext.getProtectionGroup();
            Set<Role> roles = roleContext.getRoles();
            Set<ProtectionElement> tempProtectionElements = upm.getProtectionElements(group.getProtectionGroupId()
                                                                                           .toString());

            // Iterate over the protection elements in a protection group
            for (ProtectionElement pElement : tempProtectionElements) {
                // If the protection element already exists, add the roles
                if (tempHastable.containsKey(
                            pElement.getProtectionElementName())) {
                    TableProtectionElement tempEl = tempHastable.get(pElement.getProtectionElementName());
                    tempEl.addAllRoles(roles);

                    // if not, create a new protection element
                }
                else {
                    TableProtectionElement el = new TableProtectionElement(pElement);
                    el.addAllRoles(roles);
                    tempHastable.put(pElement.getProtectionElementName(), el);
                }
            }
        }

        retSet.addAll(tempHastable.values());

        // userCache.put(userId, retSet);
        return retSet;
    }

    /*
     * getSecurityMap method is to get all ProtectionElementPrivilegeContext for
     * a public user.  It will return a set of TableProtectionElements as well as the
     * roles that are associated to those TableProtectionElements
     *
     * @param - String userId @return - A set of ProtectionElement
     */

    public Set<TableProtectionElement> getSecurityMapForPublicRole()
        throws CSObjectNotFoundException {

        Set<ProtectionElement> pes = upm.getProtectionElements(publicProtGroupId.toString());
        Set<TableProtectionElement> retSet = new HashSet<TableProtectionElement>();
        Map<String, TableProtectionElement> tempHastable = new Hashtable<String, TableProtectionElement>();

        for (ProtectionElement pElement : pes) {
            TableProtectionElement el = new TableProtectionElement(pElement);
            el.addRole(readRoleName);
            tempHastable.put(pElement.getProtectionElementName(), el);
        }

        retSet.addAll(tempHastable.values());

        return retSet;
    }

    /*
     * Given a user's login name, return the id of that user in the
     * CSM_USER table.  For example, kascice -> 485.  If a user is not
     * found then null is returned.
     */

    public String getUserId(String loginName) {
        User user = new User();
        user.setLoginName(loginName);
        UserSearchCriteria usc = new UserSearchCriteria(user);
        List<User> userList = upm.getObjects(usc);

        if(userList.size()>0) {
        	return userList.get(0).getUserId().toString();
        }
        else {
        	return null;
        }
    }

    /*
     * Given a user's login name, return the email of that user in the
     * CSM_USER table.  For example, kascice -> kascice@mail.nih.gov.  If a user is not
     * found then null is returned.
     */

    public String getUserEmail(String loginName) {
        User user = new User();
        user.setLoginName(loginName);
        UserSearchCriteria usc = new UserSearchCriteria(user);
        List<User> userList = upm.getObjects(usc);

        if(userList.size()>0) {
            return userList.get(0).getEmailId();
        }
        else {
        	return null;
        }
    }

    public void modifyPasswordForNewUser(String loginName, String password) throws Exception{
		User user = new User();
		user.setLoginName(loginName);
		UserSearchCriteria usc = new UserSearchCriteria(user);
		List<User> userList = upm.getObjects(usc);

		if(userList.size()>0) {
			user = userList.get(0);
			user.setPassword(password);
			user.setFirstTimeLogin(ZERO);
			user.setPasswordExpiryDate(DateUtils.addDays(user.getPasswordExpiryDate(),PASSWORD_EXPIRY_DAYS));
			user.setUpdateDate(new java.util.Date());
			upm.modifyUser(user);
		}
		else {
			//It should never get here
			throw new Exception("The user cannot be found in database. " +
			"Please re-register using the Register Now link on the login page.");
		}
	}
    
    public NCIAUser getUserInfoFromLDAP(String loginName) {
    	UserLdapService uls= (UserLdapService)SpringApplicationContext.getBean("userLdapService");
     	return (NCIAUser)uls.getUserGroupInfo(loginName).get(0);
    }
        
	public void syncDBWithLDAP(String loginName) {
		resultLog.info("user " + loginName + " in LDAP/DB sync process:");
    

//		List<String> ignoreGroups = getIgnoreGroupList();
		String publicGrpName = NCIAConfig.getPublicGroupName();
		Set<Group> grpsInDB = null;
		List<String> grpInDBList = null;

		// need to check and add public group if it does not exist
		checkThenAddGroup(publicGrpName);

		NCIAUser nciaUser = getUserInfoFromLDAP(loginName);
		Long userId = isUserExist(loginName);

		if (null == userId && !loginName.equalsIgnoreCase("nbia_guest")) {
			addNewUserToDB(nciaUser);
		} else { // the user in DB already. Get Associated groups
			try {
				grpsInDB = (Set<Group>) upm.getGroups(userId.toString());

				// add that to ignoreGroups list
				if ((grpsInDB != null) && grpsInDB.size() > 0)
					grpInDBList = new ArrayList<String>();
				for (Group obj : grpsInDB) {
//					ignoreGroups.add(obj.getGroupName());
					grpInDBList.add(obj.getGroupName());
					resultLog.info(loginName + "'s DB group: " + obj.getGroupName());
				}
			} catch (CSObjectNotFoundException e) {
				e.printStackTrace();
			}
		}
		// get LDAP groups now
		List<String> grps = nciaUser.getGroups();
		if ((null != grps) && (!grps.contains(publicGrpName))) {
			// user is in LDAP but not in public group -- possible case??
			grps.add(publicGrpName);
		}

		if (grps != null) {
			resultLog.info("get number of LDAP group for the user " + grps.size());
			// get the LDAP groups that are defined in DB already
			grps = getDefinedGroupsInDB(new ArrayList(grps));  // a list of groups in Both LDAP and Database

			for (String ldapGrpName: grps) {
				resultLog.info("LDAP group:" + ldapGrpName);

				if ((grpInDBList != null) && (grpInDBList.contains(ldapGrpName)))
					grpInDBList.remove(ldapGrpName); // the group in both LDAP
														// and DB then remove
														// from the list
				else {
//					if (!ignoreGroups.contains(ldapGrpName)) {
//						checkThenAddGroup(ldapGrpName);
						try {
							upm.assignUserToGroup(loginName, ldapGrpName);
							resultLog.info("assign user " + loginName + " to group: " + ldapGrpName + " in database");
						} catch (CSTransactionException e) {
							e.printStackTrace();
						}

//					}
				}
				// else System.out.println(ldapGrpName + " should be ignored");
			}
		}

		if ((grpInDBList != null) && (grpInDBList.size() > 0)) {
			deassignUserFromGroups(userId, grpInDBList);
			rptDeassignedGrp(loginName, grpInDBList);
		}
	}
    
//    private List<String> getIgnoreGroupList() {
//    	if ((null!= NCIAConfig.getLDAPGroupIgnoreList())  &&  (NCIAConfig.getLDAPGroupIgnoreList().length()>0))
//    		return  new ArrayList(Arrays.asList(NCIAConfig.getLDAPGroupIgnoreList().split(",")));
//    	else {
//   		return new ArrayList<String>();
//    	}
//    }
    
    private void rptDeassignedGrp(String loginName, List<String> grpInDBList) {
    	for (String grpN: grpInDBList) {
    		resultLog.info("Deassign user "+ loginName + "from grpup "+ grpN);
    	}   	
    }
    
	private Group isGroupExist(String grpName) {
		Group exampleGroup = new Group();

		exampleGroup.setGroupName(grpName);
		GroupSearchCriteria gsc = new GroupSearchCriteria(exampleGroup);
		List<Group> groupResult = upm.getObjects(gsc);
		if ((groupResult != null) && (groupResult.size() > 0)) {
			resultLog.info("group " + grpName + " is in database already");
			return ((Group) groupResult.get(0));
		} else
			return null;
	}

	private Long isUserExist(String loginName) {
		User user = new User();
		user.setLoginName(loginName);
		UserSearchCriteria usc = new UserSearchCriteria(user);
		List<User> userList = upm.getObjects(usc);

		if ((userList != null) && (userList.size() > 0)) {
			resultLog.info("user " + loginName + " is in database already");
			return userList.get(0).getUserId();
		} else
			return null;
	}
	
	private void addNewUserToDB(NCIAUser nciaUser) {
		resultLog.info("add new user:" + nciaUser.getLoginName() + " to db and public group");
		User user = new User();
		user.setLoginName(nciaUser.getLoginName());
		user.setEmailId(nciaUser.getEmail());
		user.setActiveFlag((byte) 1);
		user.setFirstName("csm-need-this-firstN");
		user.setLastName("csm-need-this-lastN");
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM/dd/yyyy");
		try {
			user.setPasswordExpiryDate(
					simpleDateFormat.parse(simpleDateFormat.format(Calendar.getInstance().getTime())));
		} catch (ParseException e) {
			e.printStackTrace();
		}

		try {
			upm.createUser(user);
			upm.assignUserToGroup(nciaUser.getLoginName(), NCIAConfig.getPublicGroupName());
		} catch (CSTransactionException e) {
			e.printStackTrace();
		}
	}
	
	private void checkThenAddGroup(String grpName) {
		Group grp = isGroupExist(grpName);
		if (grp == null) {
			try {
				resultLog.info(grpName + " group is not in DB and add it now");
				grp = new Group();
				grp.setGroupName(grpName);
				grp.setGroupDesc(grpName);
				upm.createGroup(grp);
			} catch (CSTransactionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	private void deassignUserFromGroups(Long userId, List<String> grpInDBList) {
		for (String grpName : grpInDBList) {
			Group exampleGroup = new Group();

			exampleGroup.setGroupName(grpName);
			GroupSearchCriteria gsc = new GroupSearchCriteria(exampleGroup);
			List<Group> groupResult = upm.getObjects(gsc);
			try {
				upm.removeUserFromGroup(groupResult.get(0).getGroupId().toString(), userId.toString());
			} catch (CSTransactionException e) {
				e.printStackTrace();
			}
		}
	}
	
	
	/**
	 * Returns unique user roles
	 */
	public Set getRoles(String userName) {
		String userId = this.getUserId(userName);
		Set<TableProtectionElement> securityRights;
		Set<String> roles = new HashSet<String>();
		try {
			securityRights = getSecurityMap(userId);
			for (TableProtectionElement tpe : securityRights) {
					roles.addAll(tpe.getRoles());
	        }
		} catch (CSObjectNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
       return roles;
	}
	
	/**
	 * Returns true if the user has the QA Tool role
	 */
	public boolean hasQaRole(String userName) {
		String userId = this.getUserId(userName);
		Set<TableProtectionElement> securityRights;
		try {
			securityRights = getSecurityMap(userId);
			for (TableProtectionElement tpe : securityRights) {
	            if (tpe.hasRole(RoleType.MANAGE_VISIBILITY_STATUS)) {
	                return true;
	            }
	        }
		} catch (CSObjectNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
       return false;
	}
	
	/**
	 * Returns true if the user has the QA Tool role
	 */
	public boolean hasQaRoleForProjSite(String userName, String proj, String site) {
		String userId = this.getUserId(userName);
		Set<TableProtectionElement> securityRights;
		try {
			securityRights = getSecurityMap(userId);
			for (TableProtectionElement tpe : securityRights) {
	            if (tpe.hasRole(RoleType.MANAGE_VISIBILITY_STATUS)) {
	            	if (tpe.getAttributeValue().equals(this.applicationName +"."+proj+"//"+site)) {
	            		return true;
	            	}
	            }
	        }
		} catch (CSObjectNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
       return false;
	}	
	
	private List<String> getDefinedGroupsInDB(ArrayList<String> ldapGrpList){
		ArrayList<String> data = null;
		try {
			Group group = new Group();
			SearchCriteria searchCriteria = new GroupSearchCriteria(group);

			java.util.List<Group> existGroupLst = upm.getObjects(searchCriteria);

			if ( existGroupLst != null) {
				data = new ArrayList<String>();
				for(Group existGroup : existGroupLst) {
		            data.add(existGroup.getGroupName());
		        }
				
				ldapGrpList.retainAll(data);
			}
		} 
		catch (Exception e) {
			e.printStackTrace();
		} 
		return ldapGrpList;
	}
}
