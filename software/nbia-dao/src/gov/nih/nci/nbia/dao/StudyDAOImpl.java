/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.dto.TimePointDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.Util;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;

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
import java.math.BigInteger;
import java.math.BigDecimal;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
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
    public List<StudyDTO> findStudiesBySeriesId_v4(Collection<Integer> seriesPkIds) throws DataAccessException {
    	if(seriesPkIds.size()==0) {
    		return new ArrayList<StudyDTO>();
    	}

        String selectStmt =  "SELECT distinct series.general_series_pk_id, study.study_pk_id, study.study_instance_uid, series.series_instance_uid, study.study_date, study.study_desc, (select count(*) from general_image gi where gi.general_series_pk_id = series.general_series_pk_id) as image_count, series.series_desc, series.modality, ge.manufacturer, series.series_number, series.annotations_flag, (select sum(gi.dicom_size) from general_image gi where gi.general_series_pk_id = series.general_series_pk_id) as total_size, series.patient_id, series.project, (select coalesce(sum(a.file_size), 0) from annotation a where a.general_series_pk_id = series.general_series_pk_id) as annotation_total_size, (select coalesce(max(gi.us_frame_number), '0') from general_image gi where gi.general_series_pk_id = series.general_series_pk_id), series.patient_pk_id, study.study_id, series.body_part_examined, series.third_party_analysis, series.description_uri, series.project , series.exclude_commercial "; 

        String fromStmt = "FROM Study study join general_series series on study.study_pk_id = series.study_pk_id join general_equipment ge on ge.general_equipment_pk_id = series.general_equipment_pk_id";

        String whereStmt =  "WHERE series.visibility in ('1') ";

        // Add the series PK IDs to the where clause
        

        int listSize = seriesPkIds.size();
		if (listSize > PARAMETER_LIMIT) {
			Collection<Collection<Integer>> seriesPkIdsBatches = split(
					seriesPkIds, PARAMETER_LIMIT);
			whereStmt = whereStmt +" and (";
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
        logger.debug("Issuing the query: " + selectStmt + fromStmt + whereStmt);

        // Create the query and set parameters in one go
        Query query = this.getHibernateTemplate()
            .getSessionFactory()
            .getCurrentSession()
            .createSQLQuery(selectStmt + fromStmt + whereStmt);

        List<Object[]> seriesResults  = query.list();

        long end = System.currentTimeMillis();
        logger.debug("total query time: " + (end - start) + " ms");


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
        logger.debug("Issuing the query: " + selectStmt + fromStmt + whereStmt);

        List<Object[]> seriesResults = getHibernateTemplate().find(selectStmt + fromStmt + whereStmt);
        long end = System.currentTimeMillis();
        logger.debug("total query time: " + (end - start) + " ms");


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
    public List<StudyDTO> findStudiesBySeriesUIds_v4(Collection<String> seriesPkIds) throws DataAccessException {
    	if(seriesPkIds.size()==0) {
    		return new ArrayList<StudyDTO>();
    	}

        String selectStmt =  "SELECT distinct series.general_series_pk_id, study.study_pk_id, study.study_instance_uid, series.series_instance_uid, study.study_date, study.study_desc, (select count(*) from general_image gi where gi.general_series_pk_id = series.general_series_pk_id) as image_count, series.series_desc, series.modality, ge.manufacturer, series.series_number, series.annotations_flag, (select sum(gi.dicom_size) from general_image gi where gi.general_series_pk_id = series.general_series_pk_id) as total_size, series.patient_id, series.project, (select coalesce(sum(a.file_size), 0) from annotation a where a.general_series_pk_id = series.general_series_pk_id) as annotation_total_size, (select coalesce(max(gi.us_frame_number), '0') from general_image gi where gi.general_series_pk_id = series.general_series_pk_id), series.patient_pk_id, study.study_id, series.body_part_examined, series.third_party_analysis, series.description_uri, series.project , series.exclude_commercial "; 

        String fromStmt = "FROM Study study join general_series series on study.study_pk_id = series.study_pk_id join general_equipment ge on ge.general_equipment_pk_id = series.general_equipment_pk_id";

        String whereStmt =  "WHERE series.visibility in ('1') ";

        // Add the series PK IDs to the where clause
        whereStmt += "and series.seriesInstanceUID IN (";

        whereStmt += constructSeriesIUdList(seriesPkIds);

        whereStmt += ")";

        long start = System.currentTimeMillis();
        logger.debug("Issuing query: " + selectStmt + fromStmt + whereStmt);

        // Create the query and set parameters in one go
        Query query = this.getHibernateTemplate()
            .getSessionFactory()
            .getCurrentSession()
            .createSQLQuery(selectStmt + fromStmt + whereStmt);

        List<Object[]> seriesResults = query.list();
        long end = System.currentTimeMillis();
        logger.debug("total query time: " + (end - start) + " ms");


        // List of StudyDTOs to eventually be returned
        Map<Integer, StudyDTO> studyList = new HashMap<Integer, StudyDTO>();
        Iterator<Object[]> iter = seriesResults.iterator();

        // Loop through the results.  There is one result for each series
        while (iter.hasNext()) {
        	Object[] row = iter.next();
			boolean excludeFlag=false;

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
			if (row[23]!=null&&row[23].toString().equalsIgnoreCase("YES")){
            	excludeFlag=true;
            }
            // Try to get the study if it already exists
            StudyDTO studyDTO = studyList.get(seriesDTO.getStudyPkId());

            if (studyDTO != null) {
                // Study already exists.  Just add series info
                studyDTO.getSeriesList().add(seriesDTO);
				if (excludeFlag) {
                	studyDTO.setExcludeCommercial("YES");
                }

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
				if (excludeFlag) {
                	studyDTO.setExcludeCommercial("YES");
                }
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
        logger.debug("Issuing query: " + selectStmt + fromStmt + whereStmt);

        List<Object[]> seriesResults = getHibernateTemplate().find(selectStmt + fromStmt + whereStmt);
        long end = System.currentTimeMillis();
        logger.debug("total query time: " + (end - start) + " ms");


        // List of StudyDTOs to eventually be returned
        Map<Integer, StudyDTO> studyList = new HashMap<Integer, StudyDTO>();
        Iterator<Object[]> iter = seriesResults.iterator();

        // Loop through the results.  There is one result for each series
        while (iter.hasNext()) {
        	Object[] row = iter.next();
			boolean excludeFlag=false;

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
			if (row[23]!=null&&row[23].toString().equalsIgnoreCase("YES")){
            	excludeFlag=true;
            }
            // Try to get the study if it already exists
            StudyDTO studyDTO = studyList.get(seriesDTO.getStudyPkId());

            if (studyDTO != null) {
                // Study already exists.  Just add series info
                studyDTO.getSeriesList().add(seriesDTO);
				if (excludeFlag) {
                	studyDTO.setExcludeCommercial("YES");
                }

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
				if (excludeFlag) {
                	studyDTO.setExcludeCommercial("YES");
                }
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
		String hql = "select distinct gs.patientId, gs.studyInstanceUID, s.studyDesc, DATE_FORMAT(s.studyDate,'%Y-%m-%d'), gs.seriesInstanceUID, " +
				"gs.seriesDesc, gs.imageCount, gs.totalSize, gs.project, gs.modality, ge.manufacturer, gs.thirdPartyAnalysis, " +
				"gs.descriptionURI, gs.seriesNumber, gs.licenseName, gs.licenseURL, DATE_FORMAT(gs.dateReleased, '%Y-%m-%d'), " +
        "DATE_FORMAT(gs.seriesDate, '%Y-%m-%d'), gs.protocolName, gs.bodyPartExamined, gs.annotationsFlag, " +
        "ge.manufacturerModelName, ge.softwareVersions, gs.dateReleased " +
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
	public List<Object[]> getPatientStudy_v4(String collection, String patientId, String studyInstanceUid, List<String> authorizedProjAndSites) throws DataAccessException
	{
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}
		StringBuffer where = new StringBuffer();
		Map<String, Object> params = new HashMap<>();


		String sql = "select s.study_instance_uid, date_format(s.study_date, '%m-%d-%Y'), s.study_desc, s.admitting_diagnoses_desc, s.study_id, " +
				"s.patient_age, p.patient_id, p.patient_name, date_format(p.patient_birth_date, '%m-%d-%Y'), p.patient_sex, " +
				"p.ethnic_group, gs.project, " +
				"count(gs.general_series_pk_id), s.longitudinal_temporal_event_type, s.longitudinal_temporal_offset_from_event, " 
        + addAuthorizedProjAndSitesCaseStatement(authorizedProjAndSites) + 
				" from study s join general_series gs on s.study_instance_uid = gs.study_instance_uid " +
        "left join patient p on s.patient_pk_id = p.patient_pk_id" + 
        " where gs.visibility in ('1') and authorized = 1 ";
		

		if (collection != null) {
			where = where.append(" and UPPER(gs.project)=:project");
			params.put("project", collection.toUpperCase());
		}
		if (patientId != null) {
			where = where.append(" and UPPER(p.patient_id)=:patientId");
			params.put("patientId", patientId.toUpperCase());
		}
		if (studyInstanceUid != null) {
			where = where.append(" and UPPER(s.study_instance_uid)=:studyInstanceUid");
			params.put("studyInstanceUid", studyInstanceUid.toUpperCase());
		}

		where.append(" group by s.study_pk_id ");
		
	  System.out.println("===== In nbia-dao, StudyDAOImpl:getPatientStudy_v4() - downloadable visibility - sql is: " + sql + where.toString());

    // Create the query and set parameters in one go
    Query query = this.getHibernateTemplate()
        .getSessionFactory()
        .getCurrentSession()
        .createSQLQuery(sql + where.toString())
        .setProperties(params);

    List<Object[]> rs = query.list();
  
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
		String hql = "select s.studyInstanceUID, s.studyDate, s.studyDesc, s.admittingDiagnosesDesc, s.studyId, " +
				"s.patientAge, s.patient.patientId, s.patient.patientName, s.patient.patientBirthDate, s.patient.patientSex, " +
				"s.patient.ethnicGroup, gs.project, " +
				"count(gs.id), s.longitudinalTemporalEventType, s.longitudinalTemporalOffsetFromEvent "  +
				"from Study as s, GeneralSeries gs where s.studyInstanceUID=gs.studyInstanceUID and gs.visibility in ('1') ";
		StringBuffer where = new StringBuffer();
		List<Object[]> rs = null;
		List<String> paramList = new ArrayList<String>();
		int i = 0;
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

		if (collection != null) {
			where = where.append(" and gs.project=?");
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
		where.append(" group by s.id ");
		
	System.out.println("===== In nbia-dao, StudyDAOImpl:getPatientStudy() - downloadable visibility - hql is: " + hql + where.toString());
	System.out.println("=====New");
	long startTime = System.currentTimeMillis();
		if (i > 0) {
			Object[] values = paramList.toArray(new Object[paramList.size()]);
			rs = getHibernateTemplate().find(hql + where.toString(), values);
		} else
			rs = getHibernateTemplate().find(hql + where.toString());
        long elapsedTime = System.currentTimeMillis() - startTime;
        System.out.println("Results returned from query in " + elapsedTime + " ms.");
        return rs;
	}


	/**
	 * Fetch a set of patient/study info filtered by query keys
	 * This method is used for NBIA Rest API.
	 * @param patientId Patient ID
	 * @param studyInstanceUid Study Instance UID
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientStudyBySeries(String series, List<String> authorizedProjAndSites) throws DataAccessException
	{
		String hql = "select s.studyInstanceUID, s.studyDate, s.studyDesc, s.admittingDiagnosesDesc, s.studyId, " +
				"s.patientAge, s.patient.patientId, s.patient.patientName, s.patient.patientBirthDate, s.patient.patientSex, " +
				"s.patient.ethnicGroup, gs.project, " +
				"count(gs.id), s.longitudinalTemporalEventType, s.longitudinalTemporalOffsetFromEvent "  +
				"from Study as s, GeneralSeries gs where s.studyInstanceUID=gs.studyInstanceUID and gs.visibility in ('1') ";
		StringBuffer where = new StringBuffer();
		List<Object[]> rs = null;
		List<String> paramList = new ArrayList<String>();
		int i = 0;
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

		if (series != null) {
			where = where.append(" and gs.seriesInstanceUID=?");
			paramList.add(series.toUpperCase());
		++i;
		}

		where.append(addAuthorizedProjAndSites(authorizedProjAndSites));
		where.append(" group by s.id ");
		
	System.out.println("===== In nbia-dao, StudyDAOImpl:getPatientStudyBySeries() - downloadable visibility - hql is: " + hql + where.toString());
	System.out.println("=====New");
	long startTime = System.currentTimeMillis();
		if (i > 0) {
			Object[] values = paramList.toArray(new Object[paramList.size()]);
			rs = getHibernateTemplate().find(hql + where.toString(), values);
		} else
			rs = getHibernateTemplate().find(hql + where.toString());
        long elapsedTime = System.currentTimeMillis() - startTime;
        System.out.println("Results returned from query in " + elapsedTime + " ms.");
        return rs;
	}


	@Transactional(propagation=Propagation.REQUIRED)
	public List<String> getEventTypes() throws DataAccessException{
		List<String> returnValue=new ArrayList<String>();
		String hql = "select distinct longitudinalTemporalEventType from Study";
		List<Object[]> rs = getHibernateTemplate().find(hql);
		for (Object object: rs) {
			if (object!=null&&object!="") {
				returnValue.add(object.toString());
			}
		}
		return returnValue;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientStudyFromDate_v4(String collection, String patientId, String dateFrom, List<String> authorizedProjAndSites) throws DataAccessException
	{
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}		
		String sql = "select distinct s.study_instance_uid, date_format(s.study_date, '%m-%d-%Y'), s.study_desc, s.admitting_diagnoses_desc, s.study_id, " +
				"s.patient_age, p.patient_id, p.patient_name, date_format(p.patient_birth_date, '%m-%d-%Y'), p.patient_sex, " +
				"p.ethnic_group, gs.project, " +
				"count(gs.general_series_pk_id), s.longitudinal_temporal_event_type, s.longitudinal_temporal_offset_from_event, "  
        + addAuthorizedProjAndSitesCaseStatement(authorizedProjAndSites) + 
				" from study s join general_series gs on s.study_instance_uid = gs.study_instance_uid " +
        "left join patient p on s.patient_pk_id = p.patient_pk_id " + 
        "where gs.visibility in ('1') and authorized = 1 ";
		StringBuffer where = new StringBuffer();
		
		Map<String, Object> params = new HashMap<>();

		if (collection != null) {
			where = where.append(" and UPPER(gs.project)=:project");
			params.put("project", collection.toUpperCase());
		}
		if (patientId != null) {
			where = where.append(" and UPPER(p.patient_id)=:patientId");
			params.put("patientId", patientId.toUpperCase());
		}
		if (dateFrom != null) {
			where = where.append("  and gs.date_released >= STR_TO_DATE(:dateFrom, '%m-%d-%Y')");
			params.put("dateFrom", dateFrom);
		}

		where.append(" group by s.study_pk_id ");		
  	System.out.println("===== In nbia-dao, StudyDAOImpl:getPatientStudy_v4() - downloadable visibility - sql is: " + sql + where.toString());
		
    // Create the query and set parameters in one go
    Query query = this.getHibernateTemplate()
        .getSessionFactory()
        .getCurrentSession()
        .createSQLQuery(sql + where.toString())
        .setProperties(params);

    List<Object[]> rs = query.list();

    return rs;
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientStudyFromDate(String collection, String patientId, String fromDate, List<String> authorizedProjAndSites) throws DataAccessException
	{
		String hql = "select distinct s.studyInstanceUID, s.studyDate, s.studyDesc, s.admittingDiagnosesDesc, s.studyId, " +
				"s.patientAge, s.patient.patientId, s.patient.patientName, s.patient.patientBirthDate, s.patient.patientSex, " +
				"s.patient.ethnicGroup, gs.project, " +
				"count(gs.id), s.longitudinalTemporalEventType, s.longitudinalTemporalOffsetFromEvent "  +
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
			where = where.append(" and gs.project=?");
			paramList.add(collection.toUpperCase());
		++i;
		}
		if (patientId != null) {
			where = where.append(" and UPPER(s.patient.patientId)=?");
			paramList.add(patientId.toUpperCase());
			++i;
		}
		if (date1 != null) {
			where = where.append("  and gs.dateReleased>?");
			paramList.add(date1);
			++i;
		}

		where.append(addAuthorizedProjAndSites(authorizedProjAndSites));
		where.append(" group by s.id ");		
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
    private static final String SQL_QUERY_SELECT = "SELECT distinct series.id, study.id, study.studyInstanceUID, series.seriesInstanceUID, study.studyDate, study.studyDesc, series.imageCount, series.seriesDesc, series.modality, ge.manufacturer, series.seriesNumber, series.annotationsFlag, series.totalSize, series.patientId, series.project, series.annotationTotalSize, series.maxFrameCount, series.patientPkId, study.studyId, series.bodyPartExamined, series.thirdPartyAnalysis, series.descriptionURI, series.project , series.excludeCommercial ";
    private static final String SQL_QUERY_FROM = "FROM Study study join study.generalSeriesCollection series join series.generalEquipment ge ";
    private static final String SQL_QUERY_WHERE = "WHERE series.visibility in ('1') ";

	private static Logger logger = LogManager.getLogger(ImageDAO.class);


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
		String selectStmt = "SELECT distinct series.id, study.id, study.studyInstanceUID, series.seriesInstanceUID, study.studyDate, study.studyDesc, series.imageCount, series.seriesDesc, series.modality, ge.manufacturer, series.seriesNumber, series.annotationsFlag, series.totalSize, series.patientId, series.project, series.annotationTotalSize , ge.manufacturerModelName, ge.softwareVersions, series.patientPkId ";
		String fromStmt = SQL_QUERY_FROM;
		String whereStmt = SQL_QUERY_WHERE;
		String oderBy = " Order by series.project,series.patientId,study.studyDate, study.studyDesc, series.modality, series.seriesDesc,ge.manufacturer, ge.manufacturerModelName, ge.softwareVersions, series.seriesInstanceUID";

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
		logger.debug("total time to excute all queries: " + (end - start)
				+ " ms");	
		
		return returnList;
	}

	private List<StudyDTO> getResults(String hql) {
		List<StudyDTO> resultList = new ArrayList<StudyDTO>();
		long start = System.currentTimeMillis();
		List<Object[]> seriesResults = getHibernateTemplate().find(hql);
		long end = System.currentTimeMillis();
		logger.debug("total query time: " + (end - start) + " ms");
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
	
 	
	@Transactional(propagation=Propagation.REQUIRED)
    public List<StudyDTO> findStudiesBySeriesIdForCart(Collection<Integer> seriesPkIds) throws DataAccessException {
    	if(seriesPkIds.size()==0) {
    		return new ArrayList<StudyDTO>();
    	}

    	String sQL="select distinct generalser1_.general_series_pk_id, study0_.STUDY_PK_ID , study0_.STUDY_INSTANCE_UID , generalser1_.SERIES_INSTANCE_UID , study0_.STUDY_DATE , study0_.STUDY_DESC ,"
    			+" ( SELECT COUNT(*) FROM general_image gi WHERE gi.general_series_pk_id = generalser1_.GENERAL_SERIES_PK_ID ) "
    			+ " as col_6_0_, generalser1_.SERIES_DESC , generalser1_.MODALITY , generalequ2_.MANUFACTURER, generalser1_.SERIES_NUMBER, generalser1_.ANNOTATIONS_FLAG ," 
                + " ( SELECT SUM(gi.dicom_size) FROM general_image gi WHERE gi.general_series_pk_id = generalser1_.GENERAL_SERIES_PK_ID ) "
                + " as col_12_0_, generalser1_.PATIENT_ID , generalser1_.PROJECT , "
                + " generalser1_.PATIENT_PK_ID , study0_.STUDY_ID , generalser1_.BODY_PART_EXAMINED , "
                + " generalser1_.THIRD_PARTY_ANALYSIS , generalser1_.DESCRIPTION_URI , generalser1_.project, generalser1_.exclude_commercial  "
                + " from STUDY study0_ inner join GENERAL_SERIES generalser1_ on study0_.STUDY_PK_ID=generalser1_.STUDY_PK_ID "
                + " inner join GENERAL_EQUIPMENT generalequ2_ on generalser1_.GENERAL_EQUIPMENT_PK_ID=generalequ2_.GENERAL_EQUIPMENT_PK_ID, "
                + " PATIENT patient3_ "
                + " where study0_.PATIENT_PK_ID=patient3_.PATIENT_PK_ID "
                + " and (generalser1_.VISIBILITY in ('1')) ";

        String whereStmt = "";

        // Add the series PK IDs to the where clause
        


			  whereStmt += "and generalser1_.GENERAL_SERIES_PK_ID in (";
              whereStmt += constructSeriesIdList(seriesPkIds);


        whereStmt += ")";

        long start = System.currentTimeMillis();
        logger.debug("Issuing the query: " + sQL + whereStmt);
        List<Object[]> seriesResults= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sQL + whereStmt).list();
  
      //  List<Object[]> seriesResults = getHibernateTemplate().find(sQL + whereStmt);
        long end = System.currentTimeMillis();
        logger.debug("total query time: " + (end - start) + " ms");


        // List of StudyDTOs to eventually be returned
        Map<Integer, StudyDTO> studyList = new HashMap<Integer, StudyDTO>();
        Iterator<Object[]> iter = seriesResults.iterator();

        // Loop through the results.  There is one result for each series
        while (iter.hasNext()) {
        	Object[] row = iter.next();
            boolean excludeFlag=false;
            // Create the seriesDTO
            SeriesDTO seriesDTO = new SeriesDTO();
            //modality should never be null... but currently possible
            seriesDTO.setModality(Util.nullSafeString(row[8]));
            //Getting real data from Surendra, find data for manufacture could be null
            seriesDTO.setManufacturer(Util.nullSafeString(row[9]));
            seriesDTO.setSeriesUID(row[3].toString());
            seriesDTO.setSeriesNumber(Util.nullSafeString(row[10]));
            seriesDTO.setSeriesPkId(((BigInteger)  row[0]).intValue());
            seriesDTO.setDescription(Util.nullSafeString(row[7]));
            seriesDTO.setNumberImages(((BigInteger)  row[6]).intValue());
            String annotationFlag = Util.nullSafeString(row[11]);
            if(annotationFlag!=null) {
            	seriesDTO.setAnnotationsFlag(true);
            }
            
            seriesDTO.setStudyPkId(((BigInteger)  row[1]).intValue());
            seriesDTO.setStudyId(row[2].toString());
            seriesDTO.setTotalImagesInSeries(((BigInteger)  row[6]).intValue());
            seriesDTO.setTotalSizeForAllImagesInSeries(((BigDecimal)  row[12]).longValue());
            seriesDTO.setPatientId((String)row[13]);
            seriesDTO.setProject((String)row[14]);
            seriesDTO.setPatientPkId(row[15].toString());
            seriesDTO.setBodyPartExamined(Util.nullSafeString(row[17]));
            seriesDTO.setThirdPartyAnalysis(Util.nullSafeString(row[18]));
            seriesDTO.setDescriptionURI(Util.nullSafeString(row[19]));
            seriesDTO.setProject(Util.nullSafeString(row[20]));
            if (row[21]!=null&&row[21].toString().equalsIgnoreCase("YES")){
            	excludeFlag=true;
            }
            // Try to get the study if it already exists
            StudyDTO studyDTO = studyList.get(seriesDTO.getStudyPkId());

            if (studyDTO != null) {
                // Study already exists.  Just add series info
                studyDTO.getSeriesList().add(seriesDTO);
                if (excludeFlag) {
                	studyDTO.setExcludeCommercial("YES");
                }
            } else {
                // Create the StudyDTO
                studyDTO = new StudyDTO();
                studyDTO.setStudyId(row[2].toString());
                studyDTO.setDate((Date) row[4]);
                studyDTO.setDescription(Util.nullSafeString(row[5]));
                if (row[16]!=null){
                    studyDTO.setStudy_id(row[16].toString());
                }
                studyDTO.setId(seriesDTO.getStudyPkId());

                // Add the series to the study
                studyDTO.getSeriesList().add(seriesDTO);
                if (excludeFlag) {
                	studyDTO.setExcludeCommercial("YES");
                }

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
	public TimePointDTO getMinMaxTimepoints_v4() throws DataAccessException
	{
		TimePointDTO returnValue=new TimePointDTO();
		String selectFrom = "select max(study.longitudinal_temporal_offset_from_event), min(study.longitudinal_temporal_offset_from_event), study.longitudinal_temporal_event_type " + 
				" from study, general_series gs " + 
				" where study.study_pk_id = gs.study_pk_id " +
				" and study.longitudinal_temporal_event_type is not null ";	
		String groupBy=" group by study.longitudinal_temporal_event_type ";
		String sql = selectFrom+groupBy;
		List<Object[]> data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sql)
		        .list();
		Map maxTimePoints=new HashMap<String, Integer>();
		Map minTimePoints=new HashMap<String, Integer>();
        for(Object[] row : data)
        {
        	if (row[0]!=null&&row[1]!=null&&row[2]!=null) {
        		maxTimePoints.put(row[2].toString(), new Integer(((Double)row[0]).intValue()));
        		minTimePoints.put(row[2].toString(), new Integer(((Double)row[1]).intValue()));
        	}
        }
        returnValue.setMaxTimepoints(maxTimePoints);
        returnValue.setMinTimepoints(minTimePoints);
		return returnValue;
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public TimePointDTO getMinMaxTimepoints(AuthorizationCriteria auth) throws DataAccessException
	{
		TimePointDTO returnValue=new TimePointDTO();
		String selectFrom = "select max(study.longitudinal_temporal_offset_from_event), min(study.longitudinal_temporal_offset_from_event), study.longitudinal_temporal_event_type " + 
				" from study, general_series gs " + 
				" where study.study_pk_id = gs.study_pk_id " +
				" and study.longitudinal_temporal_event_type is not null ";	
		String authorization=processAuthorizationSites(auth);
		String groupBy=" group by study.longitudinal_temporal_event_type ";
		String sql = selectFrom+authorization+groupBy;
		List<Object[]> data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sql)
		        .list();
		Map maxTimePoints=new HashMap<String, Integer>();
		Map minTimePoints=new HashMap<String, Integer>();
        for(Object[] row : data)
        {
        	if (row[0]!=null&&row[1]!=null&&row[2]!=null) {
        		maxTimePoints.put(row[2].toString(), new Integer(((Double)row[0]).intValue()));
        		minTimePoints.put(row[2].toString(), new Integer(((Double)row[1]).intValue()));
        	}
        }
        returnValue.setMaxTimepoints(maxTimePoints);
        returnValue.setMinTimepoints(minTimePoints);
		return returnValue;
	}
    private static String processAuthorizationSites(AuthorizationCriteria authCrit)  {
    	   
        if (authCrit.getSites().isEmpty()) {
            // User is not allowed to view any sites.
            // Since all data has a site, user is not allowed to see anything
            // Return empty list
            //logger.debug("No results returned because user does not have access to any sites");

            return null;
        }
        else {
            // Build HQL for sites
        	String whereStmt = "";
            whereStmt += " and (";

            boolean first = true;

            // For each site, need to include both collection and site
            // since site names can be duplicated across collections
            for (SiteData siteData : authCrit.getSites()) {
                if (!first) {
                    whereStmt += " OR ";
                }

                whereStmt += "(";
                whereStmt += "gs.project";
                whereStmt += " = '";
                whereStmt += siteData.getCollection();
                whereStmt += "' and ";
                whereStmt += "gs.site";
                whereStmt += " = '";
                whereStmt += siteData.getSiteName();
                whereStmt += "') ";
                first = false;
            }

            whereStmt += ")";
            return whereStmt;
        }
    }

  private StringBuffer addAuthorizedProjAndSitesCaseStatement(List<String> authorizedProjAndSites) {
    StringBuffer where = new StringBuffer();

    if ((authorizedProjAndSites != null) && (!authorizedProjAndSites.isEmpty())) {
      where = where.append(" case when concat(gs.project, '//', gs.site) in (");

      for (Iterator<String> projAndSites = authorizedProjAndSites.iterator(); projAndSites.hasNext();) {
        String str = projAndSites.next();
        where.append(str);

        if (projAndSites.hasNext()) {
          where.append(",");
        }
      }
      where.append(") then 1 else 0 end as authorized ");
    }

    return where;
  }
}
