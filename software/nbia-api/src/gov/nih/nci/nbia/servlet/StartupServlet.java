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
* Revision 1.1  2007/08/07 19:20:07  bauerd
* *** empty log message ***
*
* Revision 1.1  2007/08/05 21:44:38  bauerd
* Initial Check in of reorganized components
*
* Revision 1.6  2007/02/09 10:48:53  bauerd
* *** empty log message ***
*
* Revision 1.5  2007/02/09 09:20:38  bauerd
* *** empty log message ***
*
* Revision 1.4  2007/01/11 22:44:28  dietrich
* Defect 174
*
* Revision 1.3  2006/09/27 20:46:27  panq
* Reformated with Sun Java Code Style and added a header for holding CVS history.
*
*/
package gov.nih.nci.nbia.servlet;
import java.time.*;
import gov.nih.nci.nbia.factories.ApplicationFactory;
import gov.nih.nci.nbia.restUtil.LatestCurationDateJob;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import java.util.Date;
import javax.servlet.http.HttpServlet;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.SimpleTrigger;
import org.quartz.TriggerUtils;
import org.quartz.impl.StdSchedulerFactory;
import  gov.nih.nci.nbia.textsupport.SolrUpdateJob;
import gov.nih.nci.nbia.workflowsupport.WorkflowUpdateJob;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.executors.PropertiesUpdateJob;
import gov.nih.nci.nbia.executors.md5CacheUpdateJob;

public class StartupServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static Logger logger = LogManager.getLogger(StartupServlet.class);
    /**
     * Run upon initialization of the servlet
     *
     * @see javax.servlet.GenericServlet#init()
     */
    public void init() {
        // Set initial latest curation date
        Date latestCurationDate = null;
        try {
            latestCurationDate = new LatestCurationDateJob().getLatestCurationDate();
        }
        catch (Exception e) {
            latestCurationDate = new Date();
        }
        finally{
            ApplicationFactory.getInstance().setLatestCurationDate(latestCurationDate);
        }

        /*
        * Create the  3 Quatz Tasks
        * see http://www.opensymphony.com/quartz/
        */
       System.out.println("---------- startup servlet ---------------------");

       // Schedule it to get updated daliy at midnight
       Trigger latestCurationDateTrigger = TriggerUtils.makeDailyTrigger(0, 0);
       latestCurationDateTrigger.setName("Daily Trigger for Latest Curation Date");
       JobDetail  latestCurationDateJobDetail = new JobDetail("LatestCurationDate",
                                                              Scheduler.DEFAULT_GROUP,
                                                              LatestCurationDateJob.class);
       // wait an 1 min before starting solrUpdates
       long startTime = System.currentTimeMillis() + 6000L;
       Long interval = null;

       try {
        interval = Long.valueOf(NCIAConfig.getSolrUpdateInterval());
       } catch (Exception e1) {
            interval = Long.valueOf("60");
            System.out.println("unable to read solr interval, defaulting to one hour");
            e1.printStackTrace();
       }

       SimpleTrigger md5CacheTrigger = new SimpleTrigger("md5CacheTrigger",
               null,
               new Date(startTime),
               null,
               SimpleTrigger.REPEAT_INDEFINITELY,
               86400000L);
       md5CacheTrigger.setName("Daily Trigger for md5HashCache");
       JobDetail  md5HashCacheJobDetail = new JobDetail("md5HashCache",
                                                              Scheduler.DEFAULT_GROUP,
                                                              md5CacheUpdateJob.class);





       SimpleTrigger solrTrigger = new SimpleTrigger("myTrigger",
               null,
               new Date(startTime),
               null,
               SimpleTrigger.REPEAT_INDEFINITELY,
               interval * 60000L);

       JobDetail solrUpdateJobDetail = new JobDetail("SolrUpdate",
               Scheduler.DEFAULT_GROUP,
               SolrUpdateJob.class);


       System.out.println("Properties update");
       SimpleTrigger propertiesTrigger = new SimpleTrigger("pTrigger",
               null,
               new Date(startTime),
               null,
               SimpleTrigger.REPEAT_INDEFINITELY,
               5 * 60000L);

       JobDetail propertiesUpdateJobDetail = new JobDetail("Properties",
               Scheduler.DEFAULT_GROUP,
               PropertiesUpdateJob.class);
        //Schedule the tasks...
        try {
            SchedulerFactory sf = new StdSchedulerFactory();

            Scheduler scheduler = sf.getScheduler();
            // my jobs  first!
            scheduler.scheduleJob(solrUpdateJobDetail, solrTrigger);

            scheduler.scheduleJob(propertiesUpdateJobDetail, propertiesTrigger);
            //Job 1 - Latest Curation Date
            scheduler.scheduleJob(latestCurationDateJobDetail, latestCurationDateTrigger);
            scheduler.scheduleJob(md5HashCacheJobDetail, md5CacheTrigger);
            scheduler.startDelayed(10);
           // scheduler.start();
        } catch (SchedulerException se) {
            logger.error(se);
        }catch(Exception e){
            logger.error(e);
        }

    }

}
