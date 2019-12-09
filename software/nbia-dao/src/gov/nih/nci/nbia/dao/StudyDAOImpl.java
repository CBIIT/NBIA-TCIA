/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.Util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public class StudyDAOImpl extends AbstractDAO
                          implements StudyDAO {

    /**
     * This method will deal with the query where a list of SeriesPkId's
     * is passed in as a Query to the QueryHandler.  It will then return
     * the SeriesListResultSet, which contains all of the information necessary
     * for the second level query.
     */
	@Transactional(propagation=Propagation.REQUIRED)
    public List<StudyDTO> findStudiesBySeriesId(Collection<Integer> seriesPkIds) throws DataAccessException {
    	if(seriesPkIds.size()==0) {
    		return new ArrayList<StudyDTO>();
    	}

        String selectStmt = SQL_QUERY_SELECT;
        String fromStmt = SQL_QUERY_FROM;
        String whereStmt = SQL_QUERY_WHERE;

        // Add the series PK IDs to the where clause
        

        int listSize = seriesPkIds.size();
		if (listSize > PARAMETER_LIMIT) {
			Collection<Collection<Integer>> seriesPkIdsBatches = split(
					seriesPkIds, PARAMETER_LIMIT);
			whereStmt = new String() + SQL_QUERY_WHERE+" and (";
			int i = 0;
			for (Collection<Integer> seriesPkIdBatch : seriesPkIdsBatches) {
				if (i==0) {
					whereStmt += "series.id IN (";
				} else {
				    whereStmt += "or series.id IN (";
				}
				i++;
				whereStmt += constructSeriesIdList(seriesPkIdBatch);
				whereStmt += ")";
			}
			whereStmt += ")";
		} else {
			  whereStmt += "and series.id IN (";
              whereStmt += constructSeriesIdList(seriesPkIds);
		}

        whereStmt += ")";

        long start = System.currentTimeMillis();
        logger.info("Issuing the query: " + selectStmt + fromStmt + whereStmt);

        List<Object[]> seriesResults = getHibernateTemplate().find(selectStmt + fromStmt + whereStmt);
        long end = System.currentTimeMillis();
        logger.info("total query time: " + (end - start) + " ms");


        // List of StudyDTOs to eventually be returned
        Map<Integer, StudyDTO> studyList = new HashMap<Integer, StudyDTO>();
        Iterator<Object[]> iter = seriesResults.iterator();

        // Loop through the results.  There is one result for each series
        while (iter.hasNext()) {
        	Object[] row = iter.next();

            // Create the seriesDTO
        	System.out.println("in series dto");
            SeriesDTO seriesDTO = new SeriesDTO();
            //modality should never be null... but currently possible
            seriesDTO.setModality(Util.nullSafeString(row[8]));
            //Getting real data from Surendra, find data for manufacture could be null
            seriesDTO.setManufacturer(Util.nullSafeString(row[9]));
            seriesDTO.setSeriesUID(row[3].toString());
            seriesDTO.setSeriesNumber(Util.nullSafeString(row[10]));
            seriesDTO.setSeriesPkId((Integer) row[0]);
            seriesDTO.setDescription(Util.nullSafeString(row[7]));
            seriesDTO.setNumberImages((Integer) row[6]);
            Boolean annotationFlag = (Boolean) row[11];
            if(annotationFlag!=null) {
            	seriesDTO.setAnnotationsFlag(true);
            }
            seriesDTO.setAnnotationsSize((row[15] != null) ? (Long) row[15] : 0);
            seriesDTO.setStudyPkId((Integer) row[1]);
            seriesDTO.setStudyId(row[2].toString());
            seriesDTO.setTotalImagesInSeries((Integer)row[6]);
            seriesDTO.setTotalSizeForAllImagesInSeries((Long)row[12]);
            seriesDTO.setPatientId((String)row[13]);
            seriesDTO.setProject((String)row[14]);
            seriesDTO.setMaxFrameCount((String)row[16]);
            seriesDTO.setPatientPkId(row[17].toString());
            seriesDTO.setBodyPartExamined(Util.nullSafeString(row[19]));
            seriesDTO.setThirdPartyAnalysis(Util.nullSafeString(row[20]));
            seriesDTO.setDescriptionURI(Util.nullSafeString(row[21]));
            seriesDTO.setProject(Util.nullSafeString(row[22]));
            // Try to get the study if it already exists
            StudyDTO studyDTO = studyList.get(seriesDTO.getStudyPkId());

            if (studyDTO != null) {
                // Study already exists.  Just add series info
                studyDTO.getSeriesList().add(seriesDTO);
            } else {
                // Create the StudyDTO
                studyDTO = new StudyDTO();
                studyDTO.setStudyId(row[2].toString());
                studyDTO.setDate((Date) row[4]);
                studyDTO.setDescription(Util.nullSafeString(row[5]));
                if (row[18]!=null){
                    studyDTO.setStudy_id(row[18].toString());
                }
                studyDTO.setId(seriesDTO.getStudyPkId());

                // Add the series to the study
                studyDTO.getSeriesList().add(seriesDTO);

                // Add the study to the list
                studyList.put(studyDTO.getId(), studyDTO);
            }
        }

        //maybe a candidate to move this out of DAO into higher level

        // Convert to a list for sorting and to be returned
        List<StudyDTO> returnList = new ArrayList<StudyDTO>(studyList.values());

        // Sort the studies
        Collections.sort(returnList);
        for (StudyDTO studyDTO : returnList) {
        	List<SeriesDTO> seriesList = new ArrayList<SeriesDTO>(studyDTO.getSeriesList());
            Collections.sort(seriesList);
            studyDTO.setSeriesList(seriesList);
        }
        return returnList;
    }
	@Transactional(propagation=Propagation.REQUIRED)
    public List<StudyDTO> findStudiesBySeriesUIds(Collection<String> seriesPkIds) throws DataAccessException {
    	if(seriesPkIds.size()==0) {
    		return new ArrayList<StudyDTO>();
    	}

        String selectStmt = SQL_QUERY_SELECT;
        String fromStmt = SQL_QUERY_FROM;
        String whereStmt = SQL_QUERY_WHERE;

        // Add the series PK IDs to the where clause
        whereStmt += "and series.seriesInstanceUID IN (";

        whereStmt += constructSeriesIUdList(seriesPkIds);

        whereStmt += ")";

        long start = System.currentTimeMillis();
        logger.info("Issuing query: " + selectStmt + fromStmt + whereStmt);

        List<Object[]> seriesResults = getHibernateTemplate().find(selectStmt + fromStmt + whereStmt);
        long end = System.currentTimeMillis();
        logger.info("total query time: " + (end - start) + " ms");


        // List of StudyDTOs to eventually be returned
        Map<Integer, StudyDTO> studyList = new HashMap<Integer, StudyDTO>();
        Iterator<Object[]> iter = seriesResults.iterator();

        // Loop through the results.  There is one result for each series
        while (iter.hasNext()) {
        	Object[] row = iter.next();

            // Create the seriesDTO
            SeriesDTO seriesDTO = new SeriesDTO();
            //modality should never be null... but currently possible
            seriesDTO.setModality(Util.nullSafeString(row[8]));
            //Getting real data from Surendra, find data for manufacture could be null
            seriesDTO.setManufacturer(Util.nullSafeString(row[9]));
            seriesDTO.setSeriesUID(row[3].toString());
            seriesDTO.setSeriesNumber(Util.nullSafeString(row[10]));
            seriesDTO.setSeriesPkId((Integer) row[0]);
            seriesDTO.setDescription(Util.nullSafeString(row[7]));
            seriesDTO.setNumberImages((Integer) row[6]);
            Boolean annotationFlag = (Boolean) row[11];
            if(annotationFlag!=null) {
            	seriesDTO.setAnnotationsFlag(true);
            }
            seriesDTO.setAnnotationsSize((row[15] != null) ? (Long) row[15] : 0);
            seriesDTO.setStudyPkId((Integer) row[1]);
            seriesDTO.setStudyId(row[2].toString());
            seriesDTO.setTotalImagesInSeries((Integer)row[6]);
            seriesDTO.setTotalSizeForAllImagesInSeries((Long)row[12]);
            seriesDTO.setPatientId((String)row[13]);
            seriesDTO.setProject((String)row[14]);
            seriesDTO.setMaxFrameCount((String)row[16]);
            seriesDTO.setPatientPkId(row[17].toString());
            seriesDTO.setBodyPartExamined(Util.nullSafeString(row[19]));
            seriesDTO.setThirdPartyAnalysis(Util.nullSafeString(row[20]));
            seriesDTO.setDescriptionURI(Util.nullSafeString(row[21]));
            seriesDTO.setProject(Util.nullSafeString(row[22]));
            // Try to get the study if it already exists
            StudyDTO studyDTO = studyList.get(seriesDTO.getStudyPkId());

            if (studyDTO != null) {
                // Study already exists.  Just add series info
                studyDTO.getSeriesList().add(seriesDTO);
            } else {
                // Create the StudyDTO
                studyDTO = new StudyDTO();
                studyDTO.setStudyId(row[2].toString());
                studyDTO.setDate((Date) row[4]);
                studyDTO.setDescription(Util.nullSafeString(row[5]));
                if (row[18]!=null){
                    studyDTO.setStudy_id(row[18].toString());
                }
                studyDTO.setId(seriesDTO.getStudyPkId());

                // Add the series to the study
                studyDTO.getSeriesList().add(seriesDTO);

                // Add the study to the list
                studyList.put(studyDTO.getId(), studyDTO);
            }
        }

        //maybe a candidate to move this out of DAO into higher level

        // Convert to a list for sorting and to be returned
        List<StudyDTO> returnList = new ArrayList<StudyDTO>(studyList.values());

        // Sort the studies
        Collections.sort(returnList);
        for (StudyDTO studyDTO : returnList) {
        	List<SeriesDTO> seriesList = new ArrayList<SeriesDTO>(studyDTO.getSeriesList());
            Collections.sort(seriesList);
            studyDTO.setSeriesList(seriesList);
        }
        return returnList;
    }
	
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getSeriesMetadata(List<String> seriesIDs, List<String> authorizedProjAndSites) throws DataAccessException
	{
		String hql = "select distinct gs.patientId, gs.studyInstanceUID, s.studyDesc, s.studyDate, gs.seriesInstanceUID, " +
				"gs.seriesDesc, gs.imageCount, gs.totalSize, gs.project, gs.modality, ge.manufacturer " +
				"FROM Study s join s.generalSeriesCollection gs join gs.generalEquipment ge where gs.visibility in ('1') ";
		StringBuffer where = new StringBuffer();
		List<Object[]> rs = new ArrayList<Object[]>();
		List<String> paramList = new ArrayList<String>();
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}
		int i = 0;
        if (seriesIDs==null||seriesIDs.size()<1) {
        	return rs;
        }
        String seriesString=seriesIDs.get(0);
        String[] seriesStrings=seriesString.split(",");
        List<String> seriesList=Arrays.asList(seriesStrings);
        String queryString=constructSeriesIUdList(seriesList);
        System.out.println("queryString-"+queryString);
		if (seriesIDs != null) {
			where = where.append(" and gs.seriesInstanceUID in("+queryString+")");
			paramList.add(queryString);
		}


		where.append(addAuthorizedProjAndSites(authorizedProjAndSites));
		
	System.out.println("===== In nbia-dao, StudyDAOImpl:getPatientStudy() - downloadable visibility - hql is: " + hql + where.toString());
		
			Object[] values = paramList.toArray(new Object[paramList.size()]);
			rs = getHibernateTemplate().find(hql + where.toString());


        return rs;
	}
	
	
	
	/**
	 * Fetch a set of patient/study info filtered by query keys
	 * This method is used for NBIA Rest API.
	 * @param collection A label used to name a set of images collected for a specific trial or other reason.	 * Assigned during the process of curating the data. The info is kept under project column
	 * @param patientId Patient ID
	 * @param studyInstanceUid Study Instance UID
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientStudy(String collection, String patientId, String studyInstanceUid, List<String> authorizedProjAndSites) throws DataAccessException
	{
		String hql = "select distinct s.studyInstanceUID, s.studyDate, s.studyDesc, s.admittingDiagnosesDesc, s.studyId, " +
				"s.patientAge, s.patient.patientId, s.patient.patientName, s.patient.patientBirthDate, s.patient.patientSex, " +
				"s.patient.ethnicGroup, s.patient.dataProvenance.project, " +
				"(select count(*) from GeneralSeries gs where s.studyInstanceUID=gs.studyInstanceUID) "  +
				"from Study as s, GeneralSeries gs where s.studyInstanceUID=gs.studyInstanceUID and gs.visibility in ('1') ";
		StringBuffer where = new StringBuffer();
		List<Object[]> rs = null;
		List<String> paramList = new ArrayList<String>();
		int i = 0;
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

		if (collection != null) {
			where = where.append(" and UPPER(s.patient.dataProvenance.project)=?");
			paramList.add(collection.toUpperCase());
		++i;
		}
		if (patientId != null) {
			where = where.append(" and UPPER(s.patient.patientId)=?");
			paramList.add(patientId.toUpperCase());
			++i;
		}
		if (studyInstanceUid != null) {
			where = where.append(" and s.studyInstanceUID=?");
			paramList.add(studyInstanceUid.toUpperCase());
			++i;
		}

		where.append(addAuthorizedProjAndSites(authorizedProjAndSites));
		
	System.out.println("===== In nbia-dao, StudyDAOImpl:getPatientStudy() - downloadable visibility - hql is: " + hql + where.toString());
		
		if (i > 0) {
			Object[] values = paramList.toArray(new Object[paramList.size()]);
			rs = getHibernateTemplate().find(hql + where.toString(), values);
		} else
			rs = getHibernateTemplate().find(hql + where.toString());

        return rs;
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientStudyFromDate(String collection, String patientId, String fromDate, List<String> authorizedProjAndSites) throws DataAccessException
	{
		String hql = "select distinct s.studyInstanceUID, s.studyDate, s.studyDesc, s.admittingDiagnosesDesc, s.studyId, " +
				"s.patientAge, s.patient.patientId, s.patient.patientName, s.patient.patientBirthDate, s.patient.patientSex, " +
				"s.patient.ethnicGroup, s.patient.dataProvenance.project, " +
				"(select count(*) from GeneralSeries gs where s.studyInstanceUID=gs.studyInstanceUID) "  +
				"from Study as s, GeneralSeries gs where s.studyInstanceUID=gs.studyInstanceUID and gs.visibility in ('1') ";
		StringBuffer where = new StringBuffer();
		List<Object[]> rs = null;
		Date date1=null;
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}		
		try {
			date1=new SimpleDateFormat("yyyy/MM/dd").parse(fromDate);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}  
		List<Object> paramList = new ArrayList<Object>();
		int i = 0;

		if (collection != null) {
			where = where.append(" and UPPER(s.patient.dataProvenance.project)=?");
			paramList.add(collection.toUpperCase());
		++i;
		}
		if (patientId != null) {
			where = where.append(" and UPPER(s.patient.patientId)=?");
			paramList.add(patientId.toUpperCase());
			++i;
		}
		if (date1 != null) {
			where = where.append("  and gs.maxSubmissionTimestamp>?");
			paramList.add(date1);
			++i;
		}

		where.append(addAuthorizedProjAndSites(authorizedProjAndSites));
		
	System.out.println("===== In nbia-dao, StudyDAOImpl:getPatientStudy() - downloadable visibility - hql is: " + hql + where.toString());
		
		if (i > 0) {
			Object[] values = paramList.toArray(new Object[paramList.size()]);
			rs = getHibernateTemplate().find(hql + where.toString(), values);
		} else
			rs = getHibernateTemplate().find(hql + where.toString());

        return rs;
	}
	/**
	 * Construct the partial where clause which contains checking with authorized project and site combinations.
	 *
	 * This method is used for NBIA Rest API
	 */
	private StringBuffer addAuthorizedProjAndSites(List<String> authorizedProjAndSites) {
		StringBuffer where = new StringBuffer();

		if ((authorizedProjAndSites != null) && (!authorizedProjAndSites.isEmpty())){
			where = where.append(" and gs.projAndSite in (");

			for (Iterator<String> projAndSites =  authorizedProjAndSites.iterator(); projAndSites .hasNext();) {
	    		String str = projAndSites.next();
	            where.append (str);

	            if (projAndSites.hasNext()) {
	            	where.append(",");
	            }
	        }
			where.append(")");
		}
		System.out.println("&&&&&&&&&&&&where clause for project and group=" + where.toString());
		return where;
	}

	/////////////////////////////////////PRIVATE/////////////////////////////////////////
    private static final String SQL_QUERY_SELECT = "SELECT distinct series.id, study.id, study.studyInstanceUID, series.seriesInstanceUID, study.studyDate, study.studyDesc, series.imageCount, series.seriesDesc, series.modality, ge.manufacturer, series.seriesNumber, series.annotationsFlag, series.totalSize, series.patientId, study.patient.dataProvenance.project, series.annotationTotalSize, series.maxFrameCount, series.patientPkId, study.studyId, series.bodyPartExamined, series.thirdPartyAnalysis, series.descriptionURI, series.project  ";
    private static final String SQL_QUERY_FROM = "FROM Study study join study.generalSeriesCollection series join series.generalEquipment ge ";
    private static final String SQL_QUERY_WHERE = "WHERE series.visibility in ('1') ";

	private static Logger logger = Logger.getLogger(ImageDAO.class);


    /**
     * Given a collection of integers, return a Stirng that is a comma
     * separate list of the single-quoted integers, without a trailing comma
     */
    private static String constructSeriesIdList(Collection<Integer> theSeriesPkIds) {
    	String theWhereStmt = "";
    	for (Iterator<Integer> i = theSeriesPkIds.iterator(); i.hasNext();) {
            Integer seriesPkId = i.next();
            theWhereStmt += ("'" + seriesPkId + "'");

            if (i.hasNext()) {
            	theWhereStmt += ",";
            }
        }
    	return theWhereStmt;
    }
    
    /**
    * Given a collection of strings, return a Stirng that is a comma
    * separate list of the single-quoted integers, without a trailing comma
    */
   private static String constructSeriesIUdList(Collection<String> theSeriesPkIds) {
   	String theWhereStmt = "";
   	for (Iterator<String> i = theSeriesPkIds.iterator(); i.hasNext();) {
           String seriesPkId = i.next();
           System.out.println("seriesPkId-"+seriesPkId);
           theWhereStmt += ("'" + seriesPkId + "'");

           if (i.hasNext()) {
           	theWhereStmt += ",";
           }
       }
   	return theWhereStmt;
   }
    private static int PARAMETER_LIMIT = 5000;

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

	@Transactional(propagation = Propagation.REQUIRED)
	public List<StudyDTO> findStudiesBySeriesIdDBSorted(
			Collection<Integer> seriesPkIds) throws DataAccessException {
		if (seriesPkIds.size() == 0) {
			return new ArrayList<StudyDTO>();
		}
		String selectStmt = "SELECT distinct series.id, study.id, study.studyInstanceUID, series.seriesInstanceUID, study.studyDate, study.studyDesc, series.imageCount, series.seriesDesc, series.modality, ge.manufacturer, series.seriesNumber, series.annotationsFlag, series.totalSize, series.patientId, study.patient.dataProvenance.project, series.annotationTotalSize , ge.manufacturerModelName, ge.softwareVersions, series.patientPkId ";
		String fromStmt = SQL_QUERY_FROM;
		String whereStmt = SQL_QUERY_WHERE;
		String oderBy = " Order by study.patient.dataProvenance.project,series.patientId,study.studyDate, study.studyDesc, series.modality, series.seriesDesc,ge.manufacturer, ge.manufacturerModelName, ge.softwareVersions, series.seriesInstanceUID";

		StringBuffer hql = null;
		List<Integer> partitions = null;
		
		int listSize = seriesPkIds.size();
		List<StudyDTO> returnList = new ArrayList<StudyDTO>();
		long start = System.currentTimeMillis();

		if (listSize > PARAMETER_LIMIT) {
			Collection<Collection<Integer>> seriesPkIdsBatches = split(
					seriesPkIds, PARAMETER_LIMIT);
			for (Collection<Integer> seriesPkIdBatch : seriesPkIdsBatches) {
				whereStmt = new String() + SQL_QUERY_WHERE;
				whereStmt += "and series.id IN (";
				whereStmt += constructSeriesIdList(seriesPkIdBatch);
				whereStmt += ")";
				returnList.addAll(getResults(selectStmt + fromStmt + whereStmt
						+ oderBy));
			}
		} else {
			whereStmt += "and series.id IN (";
			whereStmt += constructSeriesIdList(seriesPkIds);
			whereStmt += ")";
			hql = new StringBuffer().append(selectStmt + fromStmt + whereStmt
					+ oderBy);
			returnList.addAll(getResults(hql.toString()));
		}
		
	System.out.println("===== In nbia-dao, StudyDAOImpl:findStudiesBySeriesIdDBSorted() - downloadable visibility - hql is: " + hql);
		
		long end = System.currentTimeMillis();
		logger.info("total time to excute all queries: " + (end - start)
				+ " ms");	
		
		return returnList;
	}

	private List<StudyDTO> getResults(String hql) {
		List<StudyDTO> resultList = new ArrayList<StudyDTO>();
		long start = System.currentTimeMillis();
		List<Object[]> seriesResults = getHibernateTemplate().find(hql);
		long end = System.currentTimeMillis();
		logger.info("total query time: " + (end - start) + " ms");
		Iterator<Object[]> iter = seriesResults.iterator();
		// Loop through the results. There is one result for each series
		while (iter.hasNext()) {
			Object[] row = iter.next();
			// Create the seriesDTO
			SeriesDTO seriesDTO = new SeriesDTO();
			// modality should never be null... but currently possible
			seriesDTO.setModality(Util.nullSafeString(row[8]));
			// Getting real data from Surendra, find data for manufacture could
			// be null
			seriesDTO.setManufacturer(Util.nullSafeString(row[9]));
			seriesDTO.setSeriesUID(row[3].toString());
			seriesDTO.setSeriesNumber(Util.nullSafeString(row[10]));
			seriesDTO.setSeriesPkId((Integer) row[0]);
			seriesDTO.setDescription(Util.nullSafeString(row[7]));
			seriesDTO.setNumberImages((Integer) row[6]);
			Boolean annotationFlag = (Boolean) row[11];
			if (annotationFlag != null) {
				seriesDTO.setAnnotationsFlag(true);
			}
			seriesDTO
					.setAnnotationsSize((row[15] != null) ? (Long) row[15] : 0);
			seriesDTO.setStudyPkId((Integer) row[1]);
			seriesDTO.setStudyId(row[2].toString());
			seriesDTO.setTotalImagesInSeries((Integer) row[6]);
			seriesDTO.setTotalSizeForAllImagesInSeries((Long) row[12]);
			seriesDTO.setPatientId((String) row[13]);
			seriesDTO.setProject((String) row[14]);

			seriesDTO.setManufacturerModelName((String) row[16]);
			seriesDTO.setSoftwareVersion((String) row[17]);
			seriesDTO.setPatientPkId(row[18].toString());
			// Try to get the study if it already exists
			StudyDTO studyDTO = new StudyDTO();
			studyDTO.setStudyId(row[2].toString());
			studyDTO.setDate((Date) row[4]);
			studyDTO.setDescription(Util.nullSafeString(row[5]));
			studyDTO.setId(seriesDTO.getStudyPkId());
			// Add the series to the study
			studyDTO.getSeriesList().add(seriesDTO);
			resultList.add(studyDTO);
		}
		return resultList;
	}
}
