/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */


package gov.nih.nci.nbia.executors;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;

import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;


public class md5CacheUpdateJob implements Job {
	static Logger log = Logger.getLogger(md5CacheUpdateJob.class);
    /**
     * This method allows this class to be called as a Job using Quartz
     */
    public void execute(JobExecutionContext jec) {

        try {   
        	// 	Cache the latest date
        	log.info("md5Cache update job called by Quartz");
        	GeneralSeriesDAO tDao = (GeneralSeriesDAO) SpringApplicationContext.getBean("generalSeriesDAO");
        	tDao.cacheMD5ForAllCollections();

        }
        catch(Exception ex) {
        	throw new RuntimeException(ex);
        }
    }
    

}
