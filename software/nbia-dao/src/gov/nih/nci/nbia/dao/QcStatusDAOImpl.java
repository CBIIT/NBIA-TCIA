/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.AdvancedCriteriaDTO;
import gov.nih.nci.nbia.dto.QcSearchResultDTO;
import gov.nih.nci.nbia.dto.QcStatusHistoryDTO;
import gov.nih.nci.nbia.internaldomain.GeneralSeries;
import gov.nih.nci.nbia.internaldomain.QCStatusHistory;
import gov.nih.nci.nbia.qctool.VisibilityStatus;
import gov.nih.nci.nbia.util.CollectionSiteUtil;
import gov.nih.nci.nbia.util.CrossDatabaseUtil;
import gov.nih.nci.ncia.criteria.*;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


public class QcStatusDAOImpl extends AbstractDAO
                             implements QcStatusDAO{

	private static final int PARAMETER_LIMIT = 800;

	@Transactional(propagation=Propagation.REQUIRED)
	public List<QcSearchResultDTO> findSeries(String[] qcStatus,
			                                  List<String> collectionSites, String[] additionalQcFlagList,
			                                  String[] patients) throws DataAccessException {
		return findSeries(qcStatus, collectionSites, additionalQcFlagList, patients, null, null, 100000);
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public List<QcSearchResultDTO> findSeries(String[] qcStatus,
			                                  List<String> collectionSites, String[] additionalQcFlagList, 
			                                  String[] patients, Date fromDate, Date toDate, int maxRows) throws DataAccessException {
		
		String selectStmt = "SELECT gs.project," +
                "gs.site," +
                "gs.patientId,"+
                "gs.studyInstanceUID," +
                "gs.seriesInstanceUID,"+
                "gs.visibility," +
                "gs.maxSubmissionTimestamp,"+
                "gs.modality, "+
                "gs.seriesDesc, " +
                
                "gs.batch, " +
                "gs.submissionType, gs.releasedStatus, tdp.id,  gs.id, gs.studyDate ";
		
		String fromStmt = "FROM GeneralSeries as gs, Patient as pt, TrialDataProvenance as tdp ";
			
		String whereStmt = " WHERE 1=1 " +
		                   computeVisibilityCriteria(qcStatus) +
		                   computeCollectionCriteria(collectionSites) +
		                   computeAdditionalFlags(additionalQcFlagList) +	                 
		                   computePatientCriteria(patients) +
		                   computeSubmissionDateCriteria(fromDate, toDate);
        
		List<QcSearchResultDTO> searchResultDtos = new ArrayList<QcSearchResultDTO>();

		String hql = selectStmt + fromStmt + whereStmt;

		System.out.println("In QcStatusDAOImpl:findSeries(...) with additional qc values: " 
	        		+ "Batch = '" + additionalQcFlagList[0] + "', submissionType = '" + additionalQcFlagList[1] + "', releasedStatus = '"  + additionalQcFlagList[2] + "'");
	    
		System.out.println("\n In QcStatusDAOImpl:findSeries(...) with hibernate hql query = " + hql + "\n");
		
//		List<Object[]> searchResults = getHibernateTemplate().find(hql);

		SessionFactory sf = getHibernateTemplate().getSessionFactory();
		Session s = sf.getCurrentSession();
		Query q = s.createQuery(hql);
		q.setFirstResult(0);
		q.setMaxResults(maxRows);
		List<Object[]> searchResults = q.list();

		for (Object[] row : searchResults) {
			String collection = (String) row[0];
			String site = (String) row[1];
			String patient = (String) row[2];
			String study = (String) row[3];
			String series = (String) row[4];
			String visibilitySt = (String) row[5];
			Timestamp submissionDate = (Timestamp) row[6];
			String modality = (String) row[7];
			String seriesDesc = (String) row[8];
			
			String batch = "" + row[9];
			String submissionType = (String) row[10];
			String releasedStatus = (String) row[11];
			String trialDpPkId = "" + row[12];
			String seriesDpPkId = "" + row[13];
			String studyDate = "";
			if  (row[14]!=null) {
				Timestamp sDate = (Timestamp) row[14];
				String pattern = "MM-dd-yyyy";
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
				studyDate =simpleDateFormat.format(sDate);
			}
			
			Date subDate = null;
			if(submissionDate != null) {
				subDate = new Date(submissionDate.getTime());
			} 

			QcSearchResultDTO qcSrDTO = new QcSearchResultDTO(collection,
					                                          site,
					                                          patient,
					                                          study,
					                                          series,
					                                          subDate,
					                                          visibilitySt, 
					                                          modality, 
					                                          seriesDesc, 
					                                          batch, submissionType, releasedStatus, trialDpPkId,
					                                          seriesDpPkId, studyDate);
			searchResultDtos.add(qcSrDTO);
		}

		return searchResultDtos;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public List<QcSearchResultDTO> findSeries(Map<String, QCSearchCriteria>criteria, Map<String, AdvancedCriteriaDTO> criteriaMap, List<String> crtieriaList, int maxRows) throws DataAccessException {
		QCSearchCriteria qcStatusCriteria = criteria.get("qcstatus");
		String[]qcStatus=null;
		Map <String,String> hqlMap=new HashMap<String,String>();
		if (qcStatusCriteria!=null) {
			List<String>qcStatusList=((ListCriteria)qcStatusCriteria).getlistObjects();
			qcStatus = new String[qcStatusList.size()];
			qcStatus= qcStatusList.toArray(qcStatus);
			criteria.remove("qcstatus");
			hqlMap.put("qcstatus", computeVisibilityCriteria(qcStatus));
		}
		qcStatusCriteria = criteria.get("collection");
		List<String>collectionSites=null;
		if (qcStatusCriteria!=null) {
			collectionSites=((ListCriteria)qcStatusCriteria).getlistObjects();
			collectionSites=CollectionSiteUtil.getOriginalCollectionSites(collectionSites);
			criteria.remove("collection");
			hqlMap.put("collection",computeCollectionCriteria(collectionSites));
		}
		qcStatusCriteria = criteria.get("complete");
		List<String>released=null;
		if (qcStatusCriteria!=null) {
			released=((ListCriteria)qcStatusCriteria).getlistObjects();
			List<String>newReleased=new ArrayList<String>();
			for (String currentValue:released) {
				if (currentValue!=null&&currentValue.equalsIgnoreCase("Yes")) {
					newReleased.add("Complete");
				}
				if (currentValue!=null&&currentValue.equalsIgnoreCase("No")) {
					newReleased.add("Not Complete");
				}
			}
			((ListCriteria)qcStatusCriteria).setlistObjects(newReleased);
		}
        int i=0;
        
        boolean joinImage=false;
        boolean joinManfacturing=false;
        Map<String, Object> parameters=new HashMap<String, Object>();
	    for (Map.Entry<String, QCSearchCriteria> entry : criteria.entrySet()) {
	    	   String andStmt="";
		       System.out.println(entry.getKey() + ":" + entry.getValue());
		       System.out.println(entry.getValue().getClass().getName());
		       String fieldName=null;
		       andStmt=andStmt+" "+entry.getValue().getBooleanOperator()+" ";
		      if (entry.getValue() instanceof TextCriteria) {
		    	  TextCriteria textCriteria=(TextCriteria)entry.getValue();
		    	  AdvancedCriteriaDTO dto=criteriaMap.get(textCriteria.getQueryField());
		    	  System.out.println(textCriteria.getQueryField());
		    	  fieldName=dto.getField();
		    	  andStmt=andStmt+" "+computeTextCriteria(fieldName, textCriteria.getQueryType(), textCriteria.getQueryValue(), parameters, i);
		    	  i++;
		      }
		      if (entry.getValue() instanceof ListCriteria) {
		    	  ListCriteria listCriteria=(ListCriteria)entry.getValue();
		    	  AdvancedCriteriaDTO dto=criteriaMap.get(listCriteria.getQueryField());
		    	  fieldName=dto.getField();
		    	  andStmt=andStmt+" "+computeListCriteria(fieldName, dto.getDataType(), listCriteria.getlistObjects(), parameters, i);
		    	  i++;
		      }
		      if (entry.getValue() instanceof DateRangeCriteriaForQCSearch) {
		    	  DateRangeCriteriaForQCSearch dateCriteria=(DateRangeCriteriaForQCSearch)entry.getValue();
		    	  AdvancedCriteriaDTO dto=criteriaMap.get(dateCriteria.getQueryField());
		    	  System.out.println(dateCriteria.getQueryField());
		    	  fieldName=dto.getField();
		    	  andStmt=andStmt+" "+computeDateCriteria(fieldName, dateCriteria.getFromDate(), dateCriteria.getToDate());
		      }
		      if (entry.getValue() instanceof DateFromCriteriaForQCSearch) {
		    	  DateFromCriteriaForQCSearch dateCriteria=(DateFromCriteriaForQCSearch)entry.getValue();
		    	  AdvancedCriteriaDTO dto=criteriaMap.get(dateCriteria.getQueryField());
		    	  fieldName=dto.getField();
		    	  andStmt=andStmt+" "+computeDateFromCriteria(fieldName, dateCriteria.getFromDate());
		      }
		      if (entry.getValue() instanceof DateToCriteriaForQCSearch) {
		    	  DateToCriteriaForQCSearch dateCriteria=(DateToCriteriaForQCSearch)entry.getValue();
		    	  AdvancedCriteriaDTO dto=criteriaMap.get(dateCriteria.getQueryField());
		    	  fieldName=dto.getField();
		    	  andStmt=andStmt+" "+computeDateToCriteria(fieldName, dateCriteria.getToDate());
		      }
		      hqlMap.put(entry.getKey(),andStmt);
		      System.out.println("fieldName-"+fieldName);
		      if (fieldName.startsWith("gi.")){
		    	  joinImage=true;
		      }
		      if (fieldName.startsWith("ge.")) {
		    	  joinManfacturing=true;
		      }
		}
		String selectStmt = "SELECT gs.project," +
                "gs.site," +
                "gs.patientId,"+
                "gs.studyInstanceUID," +
                "gs.seriesInstanceUID,"+
                "gs.visibility," +
                "gs.maxSubmissionTimestamp,"+
                "gs.modality, "+
                "gs.seriesDesc, " +
                
                "gs.batch, " +
                "gs.submissionType, gs.releasedStatus, '',  gs.id, gs.studyDate ";
		
		String fromStmt = "FROM Patient as pt join pt.studyCollection as st join st.generalSeriesCollection as gs ";
		if (joinImage) {
			fromStmt = fromStmt+" join gs.generalImageCollection gi ";
		}
		if (joinManfacturing) {
			fromStmt = fromStmt+" join gs.generalEquipment ge ";
		}
			
		
		String whereStmt = " where 1=1 ";
    boolean hasCriteria = false;


		List<String> processedItem = new ArrayList<>();

        for (String item:crtieriaList) {
		     if (hqlMap.get(item)!=null) {
		    	 if(!processedItem.contains(item)) {
		    		 processedItem.add(item);
		    		 whereStmt=whereStmt+hqlMap.get(item);
             hasCriteria = true;
		    	 }
		     }
        }
        processedItem.clear();
		List<QcSearchResultDTO> searchResultDtos = new ArrayList<QcSearchResultDTO>();

    //If no criteria have been added, return an empty response
    if (hasCriteria == false) {
      return searchResultDtos;
    }

		String hql = selectStmt + fromStmt + whereStmt;
	    
		System.out.println("\n In QcStatusDAOImpl:findSeries(...) with hibernate hql query = " + hql + "\n");
	

		SessionFactory sf = getHibernateTemplate().getSessionFactory();
		Session s = sf.getCurrentSession();
		Query q = s.createQuery(hql);
	    for (Map.Entry<String, Object> entry : parameters.entrySet()) {
	    	System.out.println("paramter-"+entry.getKey()+"-"+entry.getValue());
	    	if (entry.getValue() instanceof ArrayList) {
	    		q.setParameterList(entry.getKey(), (Collection)entry.getValue());
	    		
	    	} else {
	    	    q.setParameter(entry.getKey(), entry.getValue());
	    	}
	    }
		q.setFirstResult(0);
		q.setMaxResults(maxRows);
		System.out.println("maxRows-"+maxRows);
		List<Object[]> searchResults = q.list();

		for (Object[] row : searchResults) {
			String collection = (String) row[0];
			String site = (String) row[1];
			String patient = (String) row[2];
			String study = (String) row[3];
			String series = (String) row[4];
			String visibilitySt = (String) row[5];
			Timestamp submissionDate = (Timestamp) row[6];
			String modality = (String) row[7];
			String seriesDesc = (String) row[8];
			
			String batch = "" + row[9];
			String submissionType = (String) row[10];
			String releasedStatus = (String) row[11];
			String trialDpPkId = "" + row[12];
			String seriesDpPkId = "" + row[13];
			String studyDate = "";
			if  (row[14]!=null) {
				Timestamp sDate = (Timestamp) row[14];
				String pattern = "MM-dd-yyyy";
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
				studyDate =simpleDateFormat.format(sDate);
			}
			
			Date subDate = null;
			if(submissionDate != null) {
				subDate = new Date(submissionDate.getTime());
			} 

			QcSearchResultDTO qcSrDTO = new QcSearchResultDTO(collection,
					                                          site,
					                                          patient,
					                                          study,
					                                          series,
					                                          subDate,
					                                          visibilitySt, 
					                                          modality, 
					                                          seriesDesc, 
					                                          batch, submissionType, releasedStatus, trialDpPkId,
					                                          seriesDpPkId, studyDate);
			searchResultDtos.add(qcSrDTO);
		}

		return searchResultDtos;
	}
	
	
	
	
	
	
	@Transactional(propagation=Propagation.REQUIRED)
	public List<QcStatusHistoryDTO> findQcStatusHistoryInfo(List<String> seriesList) throws DataAccessException{
		
		List<QcStatusHistoryDTO> qcsList = new ArrayList<QcStatusHistoryDTO>();
		String selectStmt = "SELECT qsh.historyTimestamp,"
				+ "qsh.seriesInstanceUid," + "qsh.oldValue," + "qsh.newValue," 
				+ "qsh.oldBatch, qsh.newBatch, " 
				+ "qsh.oldSubmissionType, qsh.newSubmissionType,"
				+ "qsh.oldReleasedStatus, qsh.newReleasedStatus,"
				+ "qsh.comment," + "qsh.userId ";
		String fromStmt = "FROM QCStatusHistory as qsh";
		String whereStmt = " WHERE qsh.seriesInstanceUid in (";

		if (seriesList.size() > PARAMETER_LIMIT) {
			Collection<Collection<String>> seriesPkIdsBatches = split(new ArrayList<String>(seriesList), PARAMETER_LIMIT);
			for (Collection<String> seriesPkIdBatch : seriesPkIdsBatches) {
				String hql = new String() + selectStmt + fromStmt + whereStmt;
				hql += constructSeriesIdList(new ArrayList<String>(seriesPkIdBatch));
				hql += ") ORDER BY qsh.seriesInstanceUid,qsh.historyTimestamp";
				qcsList.addAll(getResults(hql));
			}
		} else {
		
			whereStmt = whereStmt + constructSeriesIdList(seriesList) + ")"
					+ " ORDER BY qsh.seriesInstanceUid,qsh.historyTimestamp";
			String hql = selectStmt + fromStmt + whereStmt;
			qcsList.addAll(getResults(hql));
		}
		return qcsList;

	}
	private <T> Collection<Collection<T>> split(Collection<T> bigCollection, int maxBatchSize) {
		Collection<Collection<T>> result = new ArrayList<Collection<T>>();
		ArrayList<T> currentBatch = null;
		for (T t : bigCollection) {
			if (currentBatch == null) {
				currentBatch = new ArrayList<T>();
			} else if (currentBatch.size() >= maxBatchSize) {
				result.add(currentBatch);
				currentBatch = new ArrayList<T>();
			}
			currentBatch.add(t);
		}

		if (currentBatch != null) {
			result.add(currentBatch);
		}

		return result;
	}

	private List<QcStatusHistoryDTO> getResults(String hql) {
		List<QcStatusHistoryDTO> qcsList = new ArrayList<QcStatusHistoryDTO>();
		List<Object[]> searchResults = getHibernateTemplate().find(hql);

		for (Object[] row : searchResults) {
			Timestamp historyTimestamp = (Timestamp) row[0];
			String series = (String) row[1];
			String oldValue = (String) row[2];
			String newValue = (String) row[3];
			
			String oldBatch = (String) row[4];
			String newBatch = (String) row[5];
			String oldSubmissionType = (String) row[6];
			String newSubmissionType = (String) row[7];
			
			String oldReleasedStatus = (String) row[8];
			String newReleasedStatus = (String) row[9];
	 		
			String comment = (String) row[10];
			String userId = (String) row[11];
			
			QcStatusHistoryDTO qcshDTO = new QcStatusHistoryDTO(new Date(historyTimestamp.getTime()),
					 series, newValue, oldValue, oldBatch, newBatch, oldSubmissionType, newSubmissionType, oldReleasedStatus, newReleasedStatus,
					 comment, userId);
			
			qcsList.add(qcshDTO);
		}
		return qcsList;
	}
	private String constructSeriesIdList(List<String> seriesList) {
		StringBuffer sb = new StringBuffer();
		if (seriesList != null) {
			for (int i = 0; i < seriesList.size(); ++i) {
				if (i == 0) {
					sb.append("'" + seriesList.get(i) + "'");
				} else {
					sb.append(", '" + seriesList.get(i) + "'");
				}
			}
		}
		return sb.toString();
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public void updateQcStatus(List<String> seriesList,
			                   List<String> statusList,
			                   String newStatus, 
			                   String[] additionalQcFlagList, String[] newAdditionalQcFlagList, 
			                   String userName, String comment) throws DataAccessException {
		
		System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - statusList size is: " + statusList.size());
		
		
		
		for (int i = 0; i < seriesList.size(); ++i) {
			String seriesId = seriesList.get(i);
			
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - in forLoop B4 calling updateDb with the following params: ");
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) -  seriesId = " + seriesId);
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) -  statusList.get(" + i + ") = " + statusList.get(i));
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) -  newStatus = " + newStatus);
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - additionalQcFlagList[0] is batchNum b4 = " + additionalQcFlagList[0]);
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - newAdditionalQcFlagList[0] is batchNum after = " + newAdditionalQcFlagList[0]);
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - additionalQcFlagList[1] is submissionType b4 = " + additionalQcFlagList[1]);
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - newAdditionalQcFlagList[1] is submissionType after = " + newAdditionalQcFlagList[1]);
			
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - additionalQcFlagList[2] is releasedStatus b4 = " + additionalQcFlagList[2]);
		//	System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - newAdditionalQcFlagList[2] is releasedStatus after = " + newAdditionalQcFlagList[2]);
		//	
			updateDb(seriesId, statusList.get(i), newStatus, additionalQcFlagList, newAdditionalQcFlagList, userName, comment);
			
		}
	}
	
	
	@Transactional
	public void updateQcStatus(List<String> seriesList,
			                   String newStatus, 
			                   String batch,
			                   String submissionType,
			                   String releasedStatus,
			                   String userName, 
			                   String comment,
			                   String site,
			                   String url,
			                   Date dateReleased) throws DataAccessException {
		
		//System.out.println("========== In QcStatusDAOImpl:updateQcStatus(...) - statusList size is: " + statusList.size());
		
		
		Transaction transaction = getHibernateTemplate().getSessionFactory().getCurrentSession().beginTransaction();
		for (int i = 0; i < seriesList.size(); ++i) {
			String seriesId = seriesList.get(i);
			

			updateDb(seriesId, newStatus, batch, submissionType, releasedStatus, userName, comment, site, url, dateReleased);
			
		}
		

	}
	
	
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Map<String,String>> findExistingStatus(String project, String site, List<String> seriesUids) throws DataAccessException {
		String whereStmt = " WHERE gs.project='" + project + "' and gs.site='" + site +"' and gs.seriesInstanceUID in (" + constructSeriesIdList(seriesUids) +")";
		if (project==null) {
			whereStmt = " WHERE gs.seriesInstanceUID in (" + constructSeriesIdList(seriesUids) +")";
		}
		SessionFactory sf = getHibernateTemplate().getSessionFactory();
		Session s = sf.getCurrentSession();

		String HQL_QUERY = "select new map(gs.seriesInstanceUID as id, gs.visibility as oldStatus) from GeneralSeries gs " + whereStmt ;  
		List<Map<String,String>> statusList = s.createQuery(HQL_QUERY).list(); 
		return statusList;
	}
	//////////////////////////////////////PRIVATE//////////////////////////////////////////

	private static String computeSubmissionDateCriteria(Date fromDate, Date toDate) {
		if( fromDate == null && toDate == null ) {
			return "";
		}
		else if( fromDate != null && toDate == null ) {
			toDate = Calendar.getInstance().getTime();
		}
		SimpleDateFormat dateFormat = CrossDatabaseUtil.getDatabaseSpecificDatePattern();

		// add a day to toDate because Oracle between command does not include the toDate
		Calendar cal = Calendar.getInstance();
		cal.setTime(toDate);
		cal.add( Calendar.DATE, 1 );
		toDate = cal.getTime();

		StringBuffer sb = new StringBuffer(49);
		sb.append( " and gs.maxSubmissionTimestamp between '" );
		sb.append( dateFormat.format(fromDate) );
		sb.append( "' and '" );
		sb.append(dateFormat.format(toDate) );
		sb.append( '\'' );

		return sb.toString();
	}

	private static String computePatientCriteria(String[] patients) {
		StringBuffer sb = new StringBuffer();
		if (patients != null && patients.length>0) {
			for (int i = 0; i < patients.length; ++i) {
				if (i == 0) {
					sb.append(" and (gs.patientId in ('" + patients[i] + "'");
				} else {
					sb.append(",'" + patients[i] + "'");
				}
			}
			sb.append("))");
		}
		return sb.toString();
	}

	private static String computeCollectionCriteria(List<String> collectionSites) {
		StringBuffer sb = new StringBuffer();
		if ((collectionSites != null) && (collectionSites.size() >= 1)) {
			sb.append(" and (");
			for (int i = 0; i < collectionSites.size(); ++i) {
				String item = (String) collectionSites.get(i);
				String[] collectionSiteNames = item.split("//");

				if (i == 0) {
					sb
							.append(" (gs.project='" + collectionSiteNames[0]
									+ "' and gs.site='"
									+ collectionSiteNames[1] + "')");
				} else {
					sb
							.append(" or (gs.project='"
									+ collectionSiteNames[0]
									+ "' and gs.site='"
									+ collectionSiteNames[1] + "')");
				}
			}
			sb.append(')');
		}
		return sb.toString();
	}
	
	private static String computeAdditionalFlags(String[] additionalQcFlagList){
		String retStr = "";
		
		retStr = " and gs.patientPkId = pt.id and pt.dataProvenance = tdp.id ";
		
		if(additionalQcFlagList[0] != null && additionalQcFlagList[0].trim().length() > 0){	
			if (additionalQcFlagList[0].equalsIgnoreCase("None")){
				retStr += " and gs.batch is null";
			} else if (additionalQcFlagList[0].equalsIgnoreCase("Any")){
				retStr += " and gs.batch is not null";
			} else {
			     int batchNum = Integer.parseInt(additionalQcFlagList[0]);				
			     if(batchNum > 0){
				   retStr += " and gs.batch=" + batchNum;
			     }		
			  }
		}
		
		if(additionalQcFlagList[1] != null && additionalQcFlagList[1].trim().length() > 0){		
			if(additionalQcFlagList[1].toUpperCase().contains("YES"))
				retStr += " and gs.submissionType='Complete' ";
	    	else if(additionalQcFlagList[1].toUpperCase().contains("NO"))
	    		retStr += " and gs.submissionType='Ongoing' ";	
	    }
		
		if(additionalQcFlagList[2] != null && additionalQcFlagList[2].trim().length() > 0){		
			if(additionalQcFlagList[2].toUpperCase().contains("YES"))
				retStr += " and gs.releasedStatus='Yes' ";
	    	else if(additionalQcFlagList[2].toUpperCase().contains("NO"))
	    		retStr += " and gs.releasedStatus='No' ";	
	    }
		
		System.out.println("In QcStatusDAOImpl:computeAdditionalFlags(...) retStr is: " + retStr);
		
		return retStr;
	}
	
	private static String computeVisibilityCriteria(String[] qcStatus) {
		StringBuffer sb = new StringBuffer();
		if (qcStatus != null && qcStatus.length > 0) {
			sb.append(" and (");
			for (int j = 0; j < qcStatus.length; ++j) {
				if (j == 0) {
					sb.append("(gs.visibility='"
							+ VisibilityStatus.stringStatusFactory(qcStatus[j])
									.getNumberValue().intValue() + "'");
				} else {
					sb.append(" or gs.visibility='"
							+ VisibilityStatus.stringStatusFactory(qcStatus[j])
									.getNumberValue().intValue() + "'");
				}
			}
			sb.append("))");
		}
		return sb.toString();
	}
	private static String computeTextCriteria(String fieldName, String type, String value, Map<String, Object> parameters, int x) {

		String parameter= "param"+x;
		String returnValue=fieldName+" like:"+parameter+" ";
		if (type.equalsIgnoreCase("contains")) {
			parameters.put(parameter, "%"+value+"%");
		}
		if (type.equalsIgnoreCase("startsWith")) {
			parameters.put(parameter, value+"%");
		}
		return returnValue;
	}
	private static String computeListCriteria(String fieldName, String dataType, List<String> valuesList, Map<String, Object> parameters, int x) {
		String parameter= "param"+x;
		String returnValue=fieldName+" in(:"+parameter+") ";
		if (dataType.equalsIgnoreCase("Integer")) {
			List<Integer> newValueList= new ArrayList<Integer>();
			for (String value:valuesList) {
				newValueList.add(Integer.valueOf(value));
			}
			parameters.put(parameter, newValueList);
			return returnValue;
		}
		parameters.put(parameter, valuesList);
		return returnValue;
	}
	private static String computeDateCriteria(String fieldName, Date fromDate, Date toDate) {
		if( fromDate == null && toDate == null ) {
			return "";
		}
		else if( fromDate != null && toDate == null ) {
			toDate = Calendar.getInstance().getTime();
		}
		SimpleDateFormat dateFormat = CrossDatabaseUtil.getDatabaseSpecificDatePattern();

		// add a day to toDate because Oracle between command does not include the toDate
		Calendar cal = Calendar.getInstance();
		cal.setTime(toDate);
		cal.add( Calendar.DATE, 1 );
		toDate = cal.getTime();

		StringBuffer sb = new StringBuffer(49);
		sb.append( " "+fieldName+" between '" );
		sb.append( dateFormat.format(fromDate) );
		sb.append( "' and '" );
		sb.append(dateFormat.format(toDate) );
		sb.append( "'" );

		return sb.toString();
	}
	private static String computeDateToCriteria(String fieldName, Date toDate) {

		SimpleDateFormat dateFormat = CrossDatabaseUtil.getDatabaseSpecificDatePattern();

		StringBuffer sb = new StringBuffer(49);
		sb.append( " "+fieldName+" <= '" );
		sb.append(dateFormat.format(toDate) );
		sb.append( "'" );

		return sb.toString();
	}
	private static String computeDateFromCriteria(String fieldName, Date fromDate) {

		SimpleDateFormat dateFormat = CrossDatabaseUtil.getDatabaseSpecificDatePattern();


		StringBuffer sb = new StringBuffer(49);
		sb.append( " "+fieldName+" >= '" );
		sb.append(dateFormat.format(fromDate) );
		sb.append( "'" );

		return sb.toString();
	}
	private void updateDb(String seriesId,
			              String oldStatus,
			              String newStatus,
			              String[] additionalQcFlagList, String[] newAdditionalQcFlagList, 
			              String userName,
			              String comment) {

		QCStatusHistory qsh = new QCStatusHistory();
		qsh.setNewValue(newStatus);
		qsh.setHistoryTimestamp(new Date());
		qsh.setOldValue(oldStatus);
		qsh.setSeriesInstanceUid(seriesId);
		qsh.setUserId(userName);
		qsh.setComment(comment);
	
	//// Additional QC Flags settings before and after changes ////
		if(additionalQcFlagList!= null && additionalQcFlagList[0] != null && additionalQcFlagList[0].trim().length() > 0){
			qsh.setOldBatch(additionalQcFlagList[0]);
		}
	    if(additionalQcFlagList!= null && newAdditionalQcFlagList[0] != null && newAdditionalQcFlagList[0].trim().length() > 0){	
	    	qsh.setNewBatch(newAdditionalQcFlagList[0]);
	    }
		
	    //-------------------------------------------------------------
	    if(additionalQcFlagList!= null && additionalQcFlagList[1] != null && additionalQcFlagList[1].trim().length() > 0){
	    	if(additionalQcFlagList[1].toUpperCase().contains("YES"))
		    	qsh.setOldSubmissionType("Complete");
		    else if(additionalQcFlagList[1].toUpperCase().contains("NO"))
		    	qsh.setOldSubmissionType("Ongoing");
	    }
	    
	    if(newAdditionalQcFlagList!= null && newAdditionalQcFlagList[1] != null && newAdditionalQcFlagList[1].trim().length() > 0){
		    if(newAdditionalQcFlagList[1].toUpperCase().contains("YES"))
		    	qsh.setNewSubmissionType("Complete");
		    else if(newAdditionalQcFlagList[1].toUpperCase().contains("NO"))
		    	qsh.setNewSubmissionType("Ongoing");  	
	    }		
	    //---------------------------------------------------------------------
	    
	    if(additionalQcFlagList!= null && additionalQcFlagList[2] != null && additionalQcFlagList[2].trim().length() > 0){
	    	if(additionalQcFlagList[2].toUpperCase().contains("YES"))
		    	qsh.setOldReleasedStatus("Yes");
		    else if(additionalQcFlagList[2].toUpperCase().contains("NO"))
		    	qsh.setOldReleasedStatus("No");
	    }
	    
	    if(newAdditionalQcFlagList!= null && newAdditionalQcFlagList[2] != null && newAdditionalQcFlagList[2].trim().length() > 0){
		    if(newAdditionalQcFlagList[2].toUpperCase().contains("YES"))
		    	qsh.setNewReleasedStatus("Yes");
		    else if(newAdditionalQcFlagList[2].toUpperCase().contains("NO"))
		    	qsh.setNewReleasedStatus("No");  	
	    }
	    
		String hql = "select distinct gs from GeneralSeries gs where gs.seriesInstanceUID ='"
				+ seriesId + "'";
		final String updateHql = createUpdateCurationTStatement(seriesId);
		List searchResults = getHibernateTemplate().find(hql);
		
		if (searchResults != null) {
			GeneralSeries gs = (GeneralSeries) (searchResults.get(0));
			
			gs.setVisibility(newStatus);
			
			if(newAdditionalQcFlagList!= null && newAdditionalQcFlagList[0] != null && newAdditionalQcFlagList[0].trim().length() > 0){
				gs.setBatch(Integer.parseInt(newAdditionalQcFlagList[0]));
			}
				
			if(newAdditionalQcFlagList!= null && newAdditionalQcFlagList[1] != null && newAdditionalQcFlagList[1].trim().length() > 0){
			   	if(newAdditionalQcFlagList[1].toUpperCase().contains("YES"))
			   		gs.setSubmissionType("Complete");
			    else if(newAdditionalQcFlagList[1].toUpperCase().contains("NO"))
			    	gs.setSubmissionType("Ongoing");
			}
			
			if(newAdditionalQcFlagList!= null && newAdditionalQcFlagList[2] != null && newAdditionalQcFlagList[2].trim().length() > 0){
			   	if(newAdditionalQcFlagList[2].toUpperCase().contains("YES"))
			   		gs.setReleasedStatus("Yes");
			    else if(newAdditionalQcFlagList[2].toUpperCase().contains("NO"))
			    	gs.setReleasedStatus("No");
			}
		
			getHibernateTemplate().update(gs);
			getHibernateTemplate().bulkUpdate(updateHql);	
			getHibernateTemplate().saveOrUpdate(qsh);
			
		}
	}

	
	private void updateDb(String seriesId,
			      String newStatus, 
			      String batch,
			      String submissionType,
			      String releasedStatus,
			      String userName, 
			      String comment,
		          String site,
		          String url,
		          Date dateReleased) {
		    System.out.println("newStatus-"+newStatus);
		    Integer visibility=null;
		    if (newStatus!=null) {
		      visibility=VisibilityStatus.stringStatusFactory(newStatus).getNumberValue();
	        }
			QCStatusHistory qsh = new QCStatusHistory();
			if (visibility!=null) {
			      qsh.setNewValue(visibility.toString());
			}
			qsh.setHistoryTimestamp(new Date());
			qsh.setSeriesInstanceUid(seriesId);
			qsh.setUserId(userName);
			qsh.setComment(comment);
		
			String hql = "select distinct gs from GeneralSeries gs where gs.seriesInstanceUID ='"
					+ seriesId + "'";
			final String updateHql = createUpdateCurationTStatement(seriesId);
			List searchResults = getHibernateTemplate().find(hql);
			
			if (searchResults != null) {
				GeneralSeries gs = (GeneralSeries) (searchResults.get(0));
				
				qsh.setOldValue(gs.getVisibility());
				if (visibility!=null) {				
				    gs.setVisibility(visibility.toString());
				}
				if (gs.getBatch()!=null) {
					qsh.setOldBatch(gs.getBatch().toString());
            	}
				if (batch!=null) {
					gs.setBatch(Integer.parseInt(batch));
					qsh.setNewBatch(batch.toString());
				}
				if (gs.getSubmissionType()!=null) {
					qsh.setOldSubmissionType(gs.getSubmissionType());
				}
				if (submissionType!=null) {
					gs.setSubmissionType(submissionType);
					qsh.setNewSubmissionType(submissionType);
				}
				if (gs.getReleasedStatus()!=null) {
					qsh.setOldReleasedStatus(gs.getReleasedStatus());
				}
				if (releasedStatus!=null) {
					gs.setReleasedStatus(releasedStatus);
					qsh.setNewReleasedStatus(releasedStatus);
					if(releasedStatus.equalsIgnoreCase("No")){
						gs.setDateReleased(null);
						qsh.setDateReleased(null);;
					}
				}
				if (url!=null) {
					gs.setDescriptionURI(url);
					qsh.setUri(url);
				}
				if (site!=null) {
					System.out.println("Site Sent-"+site);
					gs.setSite(site);;
					qsh.setSite(site);
				}	
				if (dateReleased!=null) {
					gs.setDateReleased(dateReleased);
					qsh.setDateReleased(dateReleased);
				}
				getHibernateTemplate().update(gs);
				getHibernateTemplate().bulkUpdate(updateHql);	
				getHibernateTemplate().saveOrUpdate(qsh);
				
			}
	}	
	@Transactional(propagation=Propagation.REQUIRED)	
	public void setSiteForSeries(List<String> seriesList, 
            String site) throws DataAccessException{
		
		try {
			String sqlString = "update general_series set site=:site where series_instance_uid in(:series)";
			SQLQuery qu = this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sqlString);
			qu.setParameter("site", site);
			qu.setParameterList("series", seriesList);
			int count = qu.executeUpdate();
		} catch (HibernateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
	}
	private String createUpdateCurationTStatement(String seriesId){
	    String hql = "update GeneralImage set curationTimestamp = current_timestamp() where seriesInstanceUID = '"+seriesId+"'";
	    return hql;
	}
}
