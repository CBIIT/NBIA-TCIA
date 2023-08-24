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
import org.apache.log4j.Logger;
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
	private static Logger logger = Logger.getLogger(StartupServlet.class);
    /**
     * Run upon initialization of the servlet
     *
     * @see javax.servlet.GenericServlet#init()
     */
    public void init() {

    }

}
