/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */


package gov.nih.nci.nbia.executors;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import gov.nih.nci.nbia.util.NCIAConfig;


public class PropertiesUpdateJob implements Job {
	static Logger log = LogManager.getLogger(PropertiesUpdateJob.class);
    /**
     * This method allows this class to be called as a Job using Quartz
     */
    public void execute(JobExecutionContext jec) {

        try {   
        	// 	Cache the latest date
        	log.info("Properties update job called by Quartz");
        	NCIAConfig.update();

        }
        catch(Exception ex) {
        	throw new RuntimeException(ex);
        }
    }
    

}
