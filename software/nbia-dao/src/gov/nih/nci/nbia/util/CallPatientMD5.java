package gov.nih.nci.nbia.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataAccessException;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import gov.nih.nci.nbia.dao.GeneralSeriesDAO;

@EnableAsync
public class CallPatientMD5 implements Callable<String> {
	
	private String project;
	private List<SiteData> authorizedSites;
	private String patientId;
    private HibernateTemplate template;
	
	public CallPatientMD5(String patientId, String project, List<SiteData> authorizedSites, HibernateTemplate template) {
		this.patientId=patientId;
		this.project=project;
		this.authorizedSites=authorizedSites;
		this.template=template;
	}
	
	@Async
	@Transactional(propagation = Propagation.REQUIRED)
	public String call() throws DataAccessException{
		String sqlString = "select studyInstanceUID from GeneralSeries where visibility=1 and patientId=:id " + 
				"and project=:project and (";
		boolean first=true;
		for (SiteData sd : authorizedSites) {
			if (first) {
				sqlString+="(site='"+sd.getSiteName()+"' and project='"+sd.getCollection()+"')";
			    first=false;
			} else {
				sqlString+=" or (site='"+sd.getSiteName()+"' and project='"+sd.getCollection()+"')";
			}
		}
		sqlString+=")";			
		sqlString += " group by studyInstanceUID";
		String[] paramNames = {"id","project"};
		String[] params = {patientId, project};
		List<String> resultsData=new ArrayList<String>();
		try {
             resultsData = template.findByNamedParam(sqlString, paramNames, params);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String md5Concat="";
		List<String> sortedList=new ArrayList<String>();
		GeneralSeriesDAO tDao = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
		for (String item : resultsData) {
			if (item != null) {
				sortedList.add(tDao.getMD5ForStudy(item, authorizedSites));
			}
		}
		Collections.sort(sortedList);
		for (String item : sortedList) {
			if (item != null) {
				md5Concat+=item;
			}
		}
		return digest(md5Concat);
	}
	private static String digest(String input) {
		String result="";
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.update(input.getBytes());
			byte[] hashed = messageDigest.digest();
			result = String.format("%032x", new BigInteger(1, hashed));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
}
	
	@Bean
	public Executor asyncExecutor() {
	    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
	    executor.setCorePoolSize(2);
	    executor.setMaxPoolSize(2);
	    executor.setQueueCapacity(1000);
	    executor.setThreadNamePrefix("JDAsync-");
	    executor.initialize();
	    return executor;
	}
}
