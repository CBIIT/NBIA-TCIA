/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
* $Id$
*
* $Log: not supported by cvs2svn $
* Revision 1.7  2008/02/22 17:09:10  lethai
* Add method to get mail server hostname from jboss
*
* Revision 1.6  2008/02/20 20:51:07  lethai
* Task 2267 - Change to use LDAP
*
* Revision 1.5  2008/01/11 23:07:11  panq
*  Modified for track 11509
*
* Revision 1.4  2007/12/13 17:41:41  lethai
* Externalize ftp_url for image download
*
* Revision 1.3  2007/11/07 18:38:17  panq
* Added properties for track item 6788
*
* Revision 1.2  2007/09/28 22:02:14  bauerd
* *** empty log message ***
*
* Revision 1.1  2007/08/07 12:05:12  bauerd
* *** empty log message ***
*
* Revision 1.1  2007/08/05 21:44:38  bauerd
* Initial Check in of reorganized components
*
* Revision 1.27  2007/07/27 18:12:08  bauerd
* *** empty log message ***
*
* Revision 1.26  2007/07/27 13:39:08  bauerd
* Externalized the following Properties to the JBoss Property Service MDB:
* gov.nih.nci.security.configFile
* gov.nih.nci.ncia.imaging.server.url
* gov.nih.nci.ncia.quarantine.directory
* gov.nih.nci.ncia.mapped.image.path.head
* gov.nih.nci.ncia.image.path.pattern
* gov.nih.nci.ncia.irw.address
* gov.nih.nci.ncia.irw.port
* gov.nih.nci.ncia.frontier.http.port
* gov.nih.nci.ncia.jboss.mq.url
* gov.nih.nci.ncia.zip.location
* gov.nih.nci.ncia.ftp.location
*
* Revision 1.25  2007/04/11 15:26:44  panq
* Added constant definition used in ImageServlet
*
* Revision 1.24  2007/04/11 15:22:50  panq
* Added constant definition used in ImageServlet
*
* Revision 1.23  2007/03/26 16:56:01  lethai
* cedara integration enhancement
*
* Revision 1.22  2007/03/16 17:04:37  lethai
* added new methods for cedara integration enhancement
*
* Revision 1.21  2007/02/28 17:57:06  bauerd
* Corrected property file call for: numberOfQueriesOnHistoryPage
*
* Revision 1.20  2007/02/28 16:46:34  mccrimms
* numberofQueriesOnHistoryPage changed from numberOfQueriesOnHistoryPage
*
* Revision 1.19  2007/02/15 03:24:01  bauerd
* Added some try catch and cleaned up the comments
*
* Revision 1.18  2007/02/09 09:20:29  bauerd
* *** empty log message ***
*
* Revision 1.17  2007/01/10 21:37:43  panq
* Modified for fixing bug #163.
*
* Revision 1.16  2006/11/27 16:53:56  panq
* Modified for getting thumbnails from the grid.
*
* Revision 1.15  2006/11/10 14:00:04  shinohaa
* grid prototype
*
* Revision 1.14  2006/09/27 20:46:27  panq
* Reformated with Sun Java Code Style and added a header for holding CVS history.
*
*/
package gov.nih.nci.nbia.util;

import java.text.SimpleDateFormat;
import java.util.Properties;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;

/**
 * Encapsulates the various NCIA configuration files
 *
 *@author NCIA Team
 */

public class NCIAConfig {
    /****
     *  STATIC INSTANCE VARIABLES
     *
     */
     private static Logger logger = LogManager.getLogger(NCIAConfig.class);
     private static Properties properties;
     static {
    	 ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    	 InputStream input = classLoader.getResourceAsStream("nbia.properties");
    	 // ...
    	 properties = new Properties();
    	     	 
    	 try {
			properties.load(input);
		
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
     }

     public static void update() {
	   ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
	   InputStream input = classLoader.getResourceAsStream("nbia.properties");
	   // ...
	   properties = new Properties();
	     	 
	   try {
		  properties.load(input);
	
		
	   } catch (IOException e) {
		// TODO Auto-generated catch block
		  e.printStackTrace();
	   }
     }
     
     public static boolean getShowCollectionSearchCriteria() {
         String propertyValue = properties.getProperty("show.collection.search.criteria");
         checkProperty("show.collection.search.criteria", propertyValue);
         return Boolean.valueOf(propertyValue);
     }

     public static String getDatabaseType() {
         String propertyValue = properties.getProperty("database.type");
         checkProperty("database.type", propertyValue);
         return propertyValue;
     }

     public static String getQCToolPropertyValue(String key){
    	 String propertyValue = properties.getProperty(key);
    	 checkProperty(key, propertyValue);
    	 return propertyValue;
    	 
     }
     
     public static Integer getQCBatchNumberSelectSize() {
         return getIntProperty( "qctool.batchNumberSelect.size");
     }
     
     
    /**
     *  The Name of the Local Node
     *  Property: local_node_name
     *  File: ncia.properties
     */
    public static String getLocalNodeName() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.grid.local.node.name");
        checkProperty("gov.nih.nci.ncia.grid.local.node.name", propertyValue);
        return propertyValue;
    }

    /**
     *  Number of queries to display for a user on the query history page
     *  Property: numberOfQueriesOnHistoryPage
     *  File: database.properties
     */
    public static Integer getNumberOfQueriesOnHistoryPage() {
        return getIntProperty( "numberOfQueriesOnHistoryPage");
    }


    /**
     *  Size at which any files larger than that size will result in a FTP
     *  download instead of HTTP
     *  Property: ftp_threshold
     *  File: ncia.properties
     */
    public static Double getFtpThreshold() {
        return getDoubleProperty("ftp_threshold");
    }

    /**
     *  Prefix used on all protection elements
     *  Property: protection_element_prefix
     *  File: ncia.properties
     */
    public static String getProtectionElementPrefix() {
        String propertyValue = properties.getProperty("protection_element_prefix");
        checkProperty("protection_element_prefix", propertyValue);
        return propertyValue;
    }

    /**
     *  NCIA's CSM Application Name
     *  Property: csm_application_name
     *  File: ncia.properties
     */
    public static String getCsmApplicationName() {
        String propertyValue = properties.getProperty("csm_application_name");
        checkProperty("csm_application_name", propertyValue);
        return propertyValue;
    }

    /**
     *  Timeout for the MDB
     *  Property: image_zipping_mdb_timeout
     *  File: ncia.properties
     */
//    public static int getImageZippingMDBTimeout() {
//        return getIntProperty("image_zipping_mdb_timeout");
//    }

    /**
     *  Date format
     *  Property: date_format
     *  File: ncia.properties
     */
    public static SimpleDateFormat getDateFormat() {
        String propertyValue = properties.getProperty("date_format");
        checkProperty("date_format", propertyValue);
        return new SimpleDateFormat(propertyValue);
    }


    /**
     *  Property that sets whether or not to run the new data flag update
     *  process on a scheduled basis
     *  Property: runNewDataFlagUpdate
     *  File: ncia.properties
     */
    public static boolean runNewDataFlagUpdate() {
        String propertyValue = properties.getProperty("runNewDataFlagUpdate");
        checkProperty("runNewDataFlagUpdate", propertyValue);
        return Boolean.valueOf(propertyValue);
    }

    /**
     *  The hour to run the new data flag update process
     *  Property: hourToRunNewDataFlagUpdate
     *  File: ncia.properties
     */
    public static int getHourToRunNewDataFlagUpdate() {
         return getIntProperty("hourToRunNewDataFlagUpdate");
    }



    /**********************************************************************
    /*  The following properties are externalized property  set via the JBoss Property Service MDB.
     *   That means that you MUST modify them via JBoss Configuration in the file:
     *   server/deploy/property-service.xml
     ***********************************************************************/
    /**
     * Externalized Property!
     *  Location where files zipped for HTTP download will be placed
     *  Property: gov.nih.nci.ncia.zip.location
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getZipLocation() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.zip.location");
        checkProperty("gov.nih.nci.ncia.zip.location", propertyValue);
        return propertyValue;
    }

    /**
     *  Externalized Property!
     *  URL of JMS provider
     *  Property: gov.nih.nci.ncia.jboss.mq.url
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getMessagingUrl() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.jboss.mq.url");
        checkProperty("gov.nih.nci.ncia.jboss.mq.url", propertyValue);
        return propertyValue;
    }

    /**
     *  Externalized Property!
     *  Location where files zipped for FTP download will be placed
     *  Property: gov.nih.nci.ncia.ftp.location
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getFtpLocation() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.ftp.location");
        checkProperty("gov.nih.nci.ncia.ftp.location", propertyValue);
        return propertyValue;
    }
    /**
     *  Externalized Property!
     *  Url where Image Server Located
     *  Property: gov.nih.nci.ncia.imaging.server.urll
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getImageServerUrl() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.imaging.server.url");
        checkProperty("gov.nih.nci.ncia.imaging.server.url", propertyValue);
        return propertyValue;
    }


    /**
     * Externalized Property!
     * Location of quarantined files
     * Property: gov.nih.nci.ncia.quarantine.directory
     * This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getAdminEmailAddress() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.admin.email");
        checkProperty("gov.nih.nci.ncia.admin.email", propertyValue);
        return propertyValue;
    }
    
    
    /**
     * Externalized Property!
     * Property: show.anatomical.search.criteria
     * This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getShowAnatomicalSearchCriteria() {
        String propertyValue = properties.getProperty("show.anatomical.search.criteria");
        checkProperty("show.anatomical.search.criteria", propertyValue);
        return propertyValue;
    }
    

    /**
     * Externalized Property!
     * Lookupmanager class
     * Property: lookupManager.className
     * This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getlookupManagerClassName() {
        String propertyValue = properties.getProperty("lookupManager.className");
        checkProperty("lookupManager.className", propertyValue);
        return propertyValue;
    }
    /**
     * Externalized Property!
     * Mail server host name
     * Property: gov.nih.nci.ncia.mail.server.host
     * This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getMailServerHostName() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.mail.server.host");
        checkProperty("gov.nih.nci.ncia.mail.server.host", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     * Installation site, default value is ncicb.
     * Property: gov.nih.nci.ncia.installationSite
     * This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getInstallationSite() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.installationSite");
        checkProperty("gov.nih.nci.ncia.installationSite", propertyValue);
        return propertyValue;
    }


    /**
     * Externalized Property!
     * Property: gov.nih.nci.ncia.image.path.pattern
     * This property is configured via the JBoss Property Service MDB (property-service.xml)
     */

    public static String getImagePathPattern() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.image.path.pattern");
        checkProperty("gov.nih.nci.ncia.image.path.pattern", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.mapped.image.path.head
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getMappedImagePathHead() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.mapped.image.path.head");
        checkProperty("gov.nih.nci.ncia.mapped.image.path.head", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.ftp.url
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getFTPHostAndPort() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.ftp.url");
        checkProperty("gov.nih.nci.ncia.ftp.url", propertyValue);
        return propertyValue;
    }
    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.mapped.IRW.link
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getMappedIRWLink() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.mapped.IRW.link");
        checkProperty("gov.nih.nci.ncia.mapped.IRW.link", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.mapped.IRW.version
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getMappedIRWVersion() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.mapped.IRW.version");
        checkProperty("gov.nih.nci.ncia.mapped.IRW.version", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.JBoss.publicUrl
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getJBossPublicUrl() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.JBoss.publicUrl");
        checkProperty("gov.nih.nci.ncia.JBoss.publicUrl", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.fileRetentionPeriodInDays
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain number of days that files are retained for FTP
     */
    public static String getFileRetentionPeriodInDays(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.fileRetentionPeriodInDays");
        checkProperty("gov.nih.nci.ncia.fileRetentionPeriodInDays", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: guest_username
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value whether guest account is enabled for the system.
     */
    public static String getGuestUsername(){
        String propertyValue = properties.getProperty("guest_username");
        checkProperty("guest_username", propertyValue);
        return propertyValue;
    }
    
    /**
     * Externalized Property!
     *  Property: guest_password
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value whether guest account is enabled for the system.
     */
    public static String getGuestPassword(){
        String propertyValue = properties.getProperty("guest_password");
        checkProperty("guest_password", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: enabled_guest_account
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value whether guest account is enabled for the system.
     */
    public static String getEnabledGuestAccount(){
        String propertyValue = properties.getProperty("enabled_guest_account");
        checkProperty("enabled_guest_account", propertyValue);
        return propertyValue;
    }
    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.download.server.url
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value for the download servlet server url.
     */
    public static String getDownloadServerUrl(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.download.server.url");
        checkProperty("gov.nih.nci.ncia.download.server.url", propertyValue);
        return propertyValue;
    }
    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.download.no.retry
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value for the no of retry for downloading image.
     */
    public static String getNoOfRetry(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.download.no.retry");
        checkProperty("gov.nih.nci.ncia.download.no.retry", propertyValue);
        return propertyValue;
    }
    public static boolean getEnableClassicDownload(){
        String propertyValue = properties.getProperty("enable_classic_download");
        checkProperty("enable_classic_download", propertyValue);
        return propertyValue.equalsIgnoreCase("yes") ? true : false;
    }

    /**
     * Externalized Property!
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getRegistrationMailSubject() {
        String propertyValue = properties.getProperty("registration.email.subject");
        checkProperty("registration.email.subject", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     */
    public static String getUsersGroupListEmailAddress() {
        String propertyValue = properties.getProperty("usergroup.list.email");
        checkProperty("usergroup.list.email", propertyValue);
        return propertyValue;
    }

    public static String getUsersGroupListName() {
        String propertyValue = properties.getProperty("usergroup.list.name");
        checkProperty("usergroup.list.name", propertyValue);
        return propertyValue;
    }



    public static String getIndexServerURL() {
        String propertyValue = properties.getProperty("grid.index.url");
        checkProperty("grid.index.url", propertyValue);
        return propertyValue;
    }

    public static String getLocalGridURI() {
        String propertyValue = properties.getProperty("local.grid.uri");
        checkProperty("local.grid.uri", propertyValue);
        return propertyValue;
    }

    public static String getDiscoverRemoteNodes() {
        String propertyValue = properties.getProperty("discover.remote.nodes");
        checkProperty("discover.remote.nodes", propertyValue);
        return propertyValue;
    }

    public static String getRemoteNodeCaGridVersion() {
        String propertyValue = properties.getProperty("remote.node.caGrid.version");
        checkProperty("remote.node.caGrid.version", propertyValue);
        return propertyValue;
    }



    public static int getCollectionDescriptionMaxlength() {
    	return getIntProperty("collection.description.maxlength");
    }


    public static String getDiscoverPeriodInHrs() {
        String propertyValue = properties.getProperty("discover.period.in.hrs");
        checkProperty("discover.period.in.hrs", propertyValue);
        return propertyValue;
    }

    public static long getTimeoutInMin() {
         return getIntProperty("future.task.timeout.in.min");
    }

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.encrypt.key
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value for the download servlet server url.
     */
    public static String getEncryptionKey(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.encrypt.key");
        checkProperty("gov.nih.nci.ncia.encrypt.key", propertyValue);
        return propertyValue;
    }

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.wiki.context.sensitive.help.url
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value for the download servlet server url.
     */
    public static String getWikiURL(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.wiki.context.sensitive.help.url");
        checkProperty("gov.nih.nci.ncia.wiki.context.sensitive.help.url", propertyValue);
        return propertyValue;
    }
	
    /**
     * Externalized Property!
     *  Property: nbia.wiki.base.url
     *  This property is configured  for context sensitive help links in UAT and Data Admin
     */
    public static String getWikiBaseURL(){
        String propertyValue = properties.getProperty("nbia.wiki.base.url");
        checkProperty("nbia.wiki.base.url", propertyValue);
        return propertyValue;
    }	

    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.encrypt.key
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value for the download servlet server url.
     */
    public static String getSolrHome(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.solr.home");
        if (propertyValue==null) propertyValue="/Apps/nbia/solr-home";
        checkProperty("gov.nih.nci.ncia.solr.home", propertyValue);
        return propertyValue;
    }
    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.encrypt.key
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value for the download servlet server url.
     */
    public static String getSolrUpdateInterval(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.solr.updateinterval");
        checkProperty("gov.nih.nci.ncia.solr.updateinterval", propertyValue);
        return propertyValue;
    }
    /**
     * Externalized Property!
     *  Property: gov.nih.nci.ncia.encrypt.key
     *  This property is configured via the JBoss Property Service MDB (property-service.xml)
     *  to contain value for the download servlet server url.
     */
    public static String getWorkflowUpdateInterval(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.workflow.updateinterval");
        checkProperty("gov.nih.nci.ncia.workflow.updateinterval", propertyValue);
        return propertyValue;
    }
    public static String getPWM(){
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.registration.server");
        checkProperty("gov.nih.nci.ncia.registration.server", propertyValue);
        return propertyValue;
    }
    
    public static String getQctoolSearchResultsMaxNumberOfRows(){
        String propertyValue = properties.getProperty("qctool.search.results.max.number.of.rows");
        checkProperty("qctool.search.results.max.number.of.rows", propertyValue);
        return propertyValue;
    }
    
    public static String getQctoolSearchResultsCheckUncheckOption(){
        String propertyValue = properties.getProperty("qctool.search.results.check.uncheck.option");
        checkProperty("qctool.search.results.check.uncheck.option", propertyValue);
        return propertyValue;
    }
    public static String getQctoolSearchResultsPerPageOption1(){
        String propertyValue = properties.getProperty("qctool.search.results.per.page.option.1");
        checkProperty("qctool.search.results.per.page.option.1", propertyValue);
        return propertyValue;
    }
    public static String getQctoolSearchResultsPerPageOption2(){
        String propertyValue = properties.getProperty("qctool.search.results.per.page.option.2");
        checkProperty("qctool.search.results.per.page.option.2", propertyValue);
        return propertyValue;
    }
    public static String getQctoolSearchResultsPerPageOption3(){
        String propertyValue = properties.getProperty("qctool.search.results.per.page.option.3");
        checkProperty("qctool.search.results.per.page.option.3", propertyValue);
        return propertyValue;
    }
    public static String getQctoolSearchResultsPerPageOption4(){
        String propertyValue = properties.getProperty("qctool.search.results.per.page.option.4");
        checkProperty("qctool.search.results.per.page.option.4", propertyValue);
        return propertyValue;
    }
    public static String getQctoolSearchResultsPerPageOption5(){
        String propertyValue = properties.getProperty("qctool.search.results.per.page.option.5");
        checkProperty("qctool.search.results.per.page.option.5", propertyValue);
        return propertyValue;
    }
    public static String getQctoolSearchResultsPerPageOption6(){
        String propertyValue = properties.getProperty("qctool.search.results.per.page.option.6");
        checkProperty("qctool.search.results.per.page.option.6", propertyValue);
        return propertyValue;
    }
    public static String getPatientSearcherServiceClassName(){
        String propertyValue = properties.getProperty("patientSearcherService.className");
        checkProperty("patientSearcherService.className", propertyValue);
        return propertyValue;
    }
    public static String getDrilldownClassName(){
        String propertyValue = properties.getProperty("drilldown.className");
        checkProperty("drilldown.className", propertyValue);
        return propertyValue;
    }
    public static String getAuthenticationType() {
        String propertyValue = properties.getProperty("authentication.type");
        checkProperty("authentication.type", propertyValue);
        return propertyValue;   	
    }
    
    public static String getLDAPMailAttrName() {
        String propertyValue = properties.getProperty("ldap.mail.attribute.name");
        checkProperty("ldap.mail.attribute.name", propertyValue);
        return propertyValue;   	
    }
    
    public static String getLDAPMemberOfAttrName() {
        String propertyValue = properties.getProperty("ldap.memberOf.attribute.name");
        checkProperty("ldap.memberOf.attribute.name", propertyValue);
        return propertyValue;   	
    } 
	
    public static String getLDAPUserIdLabel() {
        String propertyValue = properties.getProperty("ldap.user.id.label");
        checkProperty("ldap.user.id.label", propertyValue);
        return propertyValue;   	
    } 	
    
//    public static String getLDAPGroupIgnoreList() {
//        String propertyValue = properties.getProperty("ldap.group.ignore.list");
//        return propertyValue;   	
//    } 
    public static String getPublicGroupName() {
        String propertyValue = properties.getProperty("public.collection.access.group.name");
        checkProperty("public.collection.access.group.name", propertyValue);
        return propertyValue;   	
    } 
    public static String getProductVariation() {
        String propertyValue = properties.getProperty("product.variation");
        if(propertyValue==null || "".equals(propertyValue)|| " ".equals(propertyValue))
        	return new String();

        return propertyValue;   	
    } 

    public static String getWinInstallerLink() {
        String propertyValue = properties.getProperty("win.downloader.installer.path");
        checkProperty("win.downloader.installer.path", propertyValue);
        return propertyValue;   	
    } 
    
    public static String getMacInstallerLink() {
        String propertyValue = properties.getProperty("mac.downloader.installer.path");
        checkProperty("mac.downloader.installer.path", propertyValue);
        return propertyValue;   	
    } 
    
    public static String getCentOSInstallerLink() {
        String propertyValue = properties.getProperty("centos.downloader.installer.path");
        checkProperty("centos.downloader.installer.path", propertyValue);
        return propertyValue;   	
    }
    
    public static String getUbuntuInstallerLink() {
        String propertyValue = properties.getProperty("ubuntu.downloader.installer.path");
        checkProperty("ubuntu.downloader.installer.path", propertyValue);
        return propertyValue;   	
    } 
    
    public static String getLatestDownloaderVersion() {
        String propertyValue = properties.getProperty("latest.TCIA.downloader.version");
        checkProperty("latest.TCIA.downloader.version", propertyValue);
        return propertyValue;   	
    }
    
    public static String getLatestManifestVersion() {
        String propertyValue = properties.getProperty("latest.manifest.version");
        checkProperty("latest.manifest.version", propertyValue);
        return propertyValue;   	
    }
    
    public static String getDownloaderAppForcedUpgrade() {
        String propertyValue = properties.getProperty("force.downloader.upgrade");
        checkProperty("force.downloader.upgrade", propertyValue);
        return propertyValue;   	
    } 
    
    public static String getNoUpgradeMinimumVersion() {
        String propertyValue = properties.getProperty("no.upgrade.minimum.version");
        checkProperty("no.upgrade.minimum.version", propertyValue);
        return propertyValue;   	
    }     
    
    public static String getDownloaderAppHelpDeskLink() {
        String propertyValue = properties.getProperty("help.desk.url");
        checkProperty("help.desk.url", propertyValue);
        return propertyValue;   	
    } 
    
    public static String getDownloaderAppOnlineHelpUrl() {
        String propertyValue = properties.getProperty("online.help.url");
        checkProperty("online.help.url", propertyValue);
        return propertyValue;   	
    }           
    
    public static String getAppName() {
        String propertyValue = properties.getProperty("branding.appname");
        //checkProperty("branding.appname", propertyValue);
        return propertyValue;   	
    } 
    public static String getButtonText() {
        String propertyValue = properties.getProperty("gui.text");
        return propertyValue;   	
    } 
    public static String getBannerText() {
        String propertyValue = properties.getProperty("banner.text");
        return propertyValue;   	
    } 
    public static String getBannerColor() {
        String propertyValue = properties.getProperty("banner.color");
        return propertyValue;   	
    } 
    public static String getButtonAction() {
        String propertyValue = properties.getProperty("gui.link");
        checkProperty("gui.link", propertyValue);
        return propertyValue;   	
    } 
    public static String getTomcatPort() {
        String propertyValue = properties.getProperty("tomcat.server.port");
		checkProperty("tomcat.server.port", propertyValue);
        return propertyValue;   	
    } 
    public static String getSolrType() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.solr.type");
        return propertyValue;   	
    } 
    public static String getSolrUrls() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.solr.urls");
        return propertyValue;   	
    } 
    public static String getSolrIndexer() {
        String propertyValue = properties.getProperty("gov.nih.nci.ncia.solr.indexer");
        return propertyValue;   	
    } 
    public static String getSpeciesDescription() {
        String propertyValue = properties.getProperty("species.description");
        if (propertyValue==null) {
        	propertyValue = "Human (Homo sapiens)";
        }
        return propertyValue;   	
    } 
    public static String getSpeciesCode() {
        String propertyValue = properties.getProperty("species.code");
        if (propertyValue==null) {
        	propertyValue = "337915000";
        }
        return propertyValue;   	
    }
    /**
     * Externalized Property!
     *  Property: ctp.block.creating.newCollectionSite
     *  This property is configured via nbia.properties/defaultAHP3.properties
     *  to contain value for ctp allowing imaging submission to creat new collection and site in DB.
     */
    public static String getCtpBlockCreationNewProjectSite(){
        String propertyValue = properties.getProperty("ctp.block.creating.newCollectionSite");
        checkProperty("ctp.block.creating.newCollectionSite", propertyValue);
        return propertyValue;
    } 
    
    /**
     * Externalized Property!
     *  Property: uat.enable.creating.newCollectionSite
     *  This property is configured via nbia.properties/defaultAHP3.properties
     *  to contain value for UAT to creat new collection and site in DB.
     */
    public static String getUatCreationNewProjectSite(){
        String propertyValue = properties.getProperty("uat.enable.creating.newCollectionSite");
        checkProperty("uat.enable.creating.newCollectionSite", propertyValue);
        return propertyValue;
    } 
    
    /**
     * Externalized Property!
     *  Property: uat.enable.assign.user.to.userGroup
     *  This property is configured via nbia.properties/defaultAHP3.properties
     *  to contain value for UAT to creat new collection and site in DB.
     */
    public static String getUatUserAssginToUG(){
        String propertyValue = properties.getProperty("uat.enable.assign.user.to.userGroup");
        checkProperty("uat.enable.assign.user.to.userGroup", propertyValue);
        return propertyValue;
    }
    
    /**
     * Externalized Property!
     *  Property: uat.enable.assign.user.to.protectionGroup
     *  This property is configured via nbia.properties/defaultAHP3.properties
     *  to contain value for UAT to creat new collection and site in DB.
     */
    public static String getUatUserAssginToPG(){
        String propertyValue = properties.getProperty("uat.enable.assign.user.to.protectionGroup");
        checkProperty("uat.enable.assign.user.to.protectionGroup", propertyValue);
        return propertyValue;
    } 
    
    /**
     * Externalized Property!
     *  Property: uat.enable.assign.user.to.protectionGroup
     *  This property is configured via nbia.properties/defaultAHP3.properties
     *  to contain value for UAT to creat new collection and site in DB.
     */
    public static String getOtherDataLocationFile(){
        String propertyValue = properties.getProperty("other.data.location.file");
//  maybe turn it on later     
//        checkProperty("other.data.location.file", propertyValue);
        return propertyValue;
    } 
    
    /**
     * Externalized Property!
     *  Property: user.agreement.file.location
     *  This property is configured via nbia.properties/defaultAHP3.properties
     *  to contain user agreement file name and path.
     */
    public static String getUserAgreementFileLocation(){
        String propertyValue = properties.getProperty("user.agreement.file.location");    
        //checkProperty("user.agreement.file.location", propertyValue);
        return propertyValue;
    } 
    public static String getLicenseText(){
        String propertyValue = properties.getProperty("licenseText");    
        //checkProperty("user.agreement.file.location", propertyValue);
        return propertyValue;
    } 
    public static String getMd5MaxThreads(){
        String propertyValue = properties.getProperty("md5MaxThreads");    
        //checkProperty("user.agreement.file.location", propertyValue);
        return propertyValue;
    } 

    public static String getKeycloakTokenUrl() {
        String propertyValue = properties.getProperty("keycloak.token.url");
        return propertyValue;   	
    } 

    public static String getKeycloakUserInfoUrl() {
        String propertyValue = properties.getProperty("keycloak.user.info.url");
        return propertyValue;   	
    }
    
    public static String getAuthenticationConfig() {
        String propertyValue = properties.getProperty("authentication.config");
        return propertyValue;   	
    }        

    public static String getKeycloakClientId() {
        String propertyValue = properties.getProperty("keycloak.client.id");
        return propertyValue;   	
    } 

    public static boolean includeExceptionsInErrors() {
        String propertyValue = properties.getProperty("include.exceptions.in.errors");
        if(propertyValue==null){
            return false;
        }
        return propertyValue.equalsIgnoreCase("yes") ? true : false;
    }
    
    /**
     * Utility method for retrieving a property
     * Sets the value to -1 if not found or not an integer
     * and logs an exception
     *
     * @param key
     */
    private static int getIntProperty(String key){
        //set error value
        int returnValue = -1;
        //grab the property

        String value = properties.getProperty(key);
        try {
            returnValue = Integer.parseInt(value);
        }catch(NumberFormatException nfe){
            logger.error("Incorrect Property Setting:");
            logger.error("Property: "+key+ " = "+value);
            throw new RuntimeException(nfe);
        }
        return returnValue;

    }

    /**
     * Utility method for retrieving a double property
     * Sets the value to -1 if not found or not an integer
     * and logs an exception
     *
     * @param key
     */
    private static double getDoubleProperty(String key) {
        //set error value
        double  returnValue = -1;
        //grab the property
        String value = properties.getProperty(key);
        try {
            returnValue = Double.parseDouble(value);
        }catch(NumberFormatException nfe){
            logger.error("Incorrect Property Setting:");
            logger.error("Property: "+key+ " = "+value);
            throw new RuntimeException(nfe);
        }
        return returnValue;
    }


    private static void checkProperty(String propertyName, String propertyValue){
        if(propertyValue==null || "".equals(propertyValue)|| " ".equals(propertyValue)){
            throw new RuntimeException("The following NCIA System Property is missing: "+propertyName);
        }
    }
}
