package gov.nih.nci.nbia.executors;

import gov.nih.nci.nbia.dao.QcStatusDAO;
import gov.nih.nci.nbia.deletion.DeletionDisplayObject;
import gov.nih.nci.nbia.deletion.ImageDeletionService;
import gov.nih.nci.nbia.deletion.ImageFileDeletionService;
import gov.nih.nci.nbia.mail.MailManager;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import javax.jms.ObjectMessage;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BulkUpdateTask {
	private Logger log = LogManager.getLogger(BulkUpdateTask.class);

	public void bulkUpdate(BulkUpdateMessage message){
		
		log.info("start processing bulkUpdate...");

		try{
			String userName = message.getUserName();
			QcStatusDAO qsDao = (QcStatusDAO)SpringApplicationContext.getBean("qcStatusDAO");
			qsDao.updateQcStatus(message.getSeriesList(), 
					message.getStatusList(), 
					message.getNewStatus(), 
					message.getAdditionalQcFlagList(), 
					message.getNewAdditionalQcFlagList(), 
					message.getUserName(), 
					message.getComments());

		}catch(Throwable e){
			e.printStackTrace();
            log.error("Error updating status... " + e);
            e.printStackTrace();
            return;
		}


	}

	private String getCurrentTime(){
		String dateTime = "";
		Calendar now = Calendar.getInstance();

		dateTime = "" + (now.get(Calendar.MONTH) + 1)
        + "-"
        + now.get(Calendar.DATE)
        + "-"
        + now.get(Calendar.YEAR)
        + " "
        + now.get(Calendar.HOUR_OF_DAY)
        + ":"
        + now.get(Calendar.MINUTE)
        + ":"
        + now.get(Calendar.SECOND)
        + "."
        + now.get(Calendar.MILLISECOND);

		return dateTime;
	}
	

}
