/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;
import java.text.SimpleDateFormat;
import java.sql.Date;
import java.text.DateFormat;
import java.text.ParseException;

import gov.nih.nci.nbia.dto.EquipmentDTO;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.dto.DOIDTO;
import gov.nih.nci.nbia.internaldomain.CollectionDesc;
import gov.nih.nci.nbia.internaldomain.GeneralSeries;
import gov.nih.nci.nbia.qctool.VisibilityStatus;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.util.HqlUtils;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.Util;
import gov.nih.nci.nbia.util.NCIAConfig;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Hibernate;
import org.hibernate.HibernateException;

import java.util.concurrent.*;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Collections;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Conjunction;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StringType;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public class GeneralSeriesDAOImpl extends AbstractDAO implements GeneralSeriesDAO {

  @Transactional(propagation = Propagation.REQUIRED)
  public Collection<String> findProjectsOfVisibleSeries() throws DataAccessException {
    String hql = "select distinct dp.project " + "from TrialDataProvenance dp, Patient p, GeneralSeries gs "
      + "where dp.id = p.dataProvenance.id and gs.visibility in ('1') and gs.patientPkId = p.id "
      + "order by dp.project";

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:findProjectsOfVisibleSeries() - downloadable hql is: ");

    return (Collection<String>) getHibernateTemplate().find(hql);
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public List<String> findProjectSitesOfSeries(List<String> seriesInstanceUids) throws DataAccessException {		
    HashSet<String> wholeList = null;

    List<List<String>> breakdownList = Util.breakListIntoChunks(seriesInstanceUids, 900);
    for (List<String> unitList : breakdownList) {

      DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
      //criteria = criteria.createCriteria("project");
      //criteria = criteria.createCriteria("site");
      criteria.add(Restrictions.in("seriesInstanceUID", unitList));
      Projection projection = Projections.property("projAndSite"); 
      criteria.setProjection(projection); 

      Collection<String> results = getHibernateTemplate().findByCriteria(criteria);
      if (wholeList == null) {
        wholeList = new HashSet<String>();
      }
      wholeList.addAll(results);
    }

    return new ArrayList<>(wholeList);		
  }	

  @Transactional(propagation = Propagation.REQUIRED)
  public Collection<EquipmentDTO> findEquipmentOfVisibleSeries() throws DataAccessException {
    String hql = "select distinct e.manufacturer, e.manufacturerModelName, e.softwareVersions "
      + "from GeneralSeries s join s.generalEquipment e "
      + "where s.visibility in ('1') and e.manufacturer is not null " + "order by e.manufacturer";

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:findEquipmentOfVisibleSeries() - downloadable hql is: ");

    Collection<EquipmentDTO> equipment = new ArrayList<EquipmentDTO>();
    List<Object[]> equipmentRows = (List<Object[]>) getHibernateTemplate().find(hql);
    for (Object[] equipmentRow : equipmentRows) {
      EquipmentDTO dto = new EquipmentDTO((String) equipmentRow[0], (String) equipmentRow[1],
          (String) equipmentRow[2]);
      equipment.add(dto);
    }

    return equipment;
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public Collection<String> findDistinctBodyPartsFromVisibleSeries() throws DataAccessException {
    String hql = "select distinct upper(bodyPartExamined) " + "from GeneralSeries "
      + "where visibility in ('1') " + "order by upper(bodyPartExamined)";

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:findDistinctBodyPartsFromVisibleSeries() - downloadable hql is: ");

    return (Collection<String>) getHibernateTemplate().find(hql);
  }

  /**
   * Fetch set of Modality through project, ie. collection, and bodyPartExamined
   * This method is used for NBIA Rest API.
   * 
   * @param collection
   *            A label used to name a set of images collected for a specific
   *            trial or other reason. Assigned during the process of curating the
   *            data. The info is kept under project column
   * @param bodyPart
   *            Body Part Examined
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<String> getModalityValues(String collection, String bodyPart, List<String> authorizedProjAndSites)
    throws DataAccessException {

    if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
      return null;
    }		

    List<String> rs = null;
    String hql = "select distinct(modality) from GeneralSeries s where visibility in ('1') ";
    String order = " order by upper(modality)";
    List<String> paramList = new ArrayList<String>();
    int i = 0;
    StringBuffer where = new StringBuffer();

    if (collection != null) {
      where.append(" and UPPER(s.project)=?");
      paramList.add(collection.toUpperCase());
      i++;
    }
    if (bodyPart != null) {
      where.append(" and UPPER(s.bodyPartExamined)=?");
      paramList.add(bodyPart.toUpperCase());
      i++;
    }
    where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getModalityValues() - downloadable visibility hql is: " + hql
        + where.toString() + order);

    if (i > 0) {
      Object[] values = paramList.toArray(new Object[paramList.size()]);
      rs = getHibernateTemplate().find(hql + where.toString() + order, values);
    } else {
      rs = getHibernateTemplate().find(hql + where.toString() + order);
    }

    return rs;
  }

  /**
   * Fetch set of body part values through project, ie. collection, and modality
   * This method is used for NBIA Rest API.
   * 
   * @param collection
   *            A label used to name a set of images collected for a specific
   *            trial or other reason. Assigned during the process of curating the
   *            data. The info is kept under project column
   * @param modality
   *            Body Part Examined
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<String> getBodyPartValues(String collection, String modality, List<String> authorizedProjAndSites)
    throws DataAccessException {

    if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
      return null;
    }				

    List<String> rs = null;
    String hql = "select distinct(upper(bodyPartExamined)) from GeneralSeries s where visibility in ('1') ";
    String order = " order by upper(bodyPartExamined)";
    List<String> paramList = new ArrayList<String>();
    int i = 0;
    StringBuffer where = new StringBuffer();
    if (collection != null) {
      where.append(" and UPPER(s.project)=?");
      paramList.add(collection.toUpperCase());
      i++;
    }
    if (modality != null) {
      where.append(" and UPPER(s.modality)=?");
      paramList.add(modality.toUpperCase());
      i++;
    }

    where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getBodyPartValues() - downloadable visibility hql is: " + hql
        + where.toString() + order);

    if (i > 0) {
      Object[] values = paramList.toArray(new Object[paramList.size()]);
      rs = getHibernateTemplate().find(hql + where.toString() + order, values);

    } else {
      rs = getHibernateTemplate().find(hql + where.toString() + order);

    }

    return rs;
  }

  /**
   * Fetch set of manufacturer names through project, ie. collection, bodyPart and
   * modality This method is used for NBIA Rest API.
   * 
   * @param collection
   *            A label used to name a set of images collected for a specific
   *            trial or other reason. Assigned during the process of curating the
   *            data. The info is kept under project column
   * @param modality
   *            Modality
   * @param bodyPart
   *            Body Part Examined
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<String> getManufacturerValues(String collection, String modality, String bodyPart,
      List<String> authorizedProjAndSites) throws DataAccessException {

    if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
      return null;
    }

    StringBuffer where = new StringBuffer();
    List<String> rs = null;
    String hql = "select distinct(s.generalEquipment.manufacturer) from GeneralSeries s where s.visibility in ('1') ";
    String order = " order by upper(s.generalEquipment.manufacturer)";
    List<String> paramList = new ArrayList<String>();
    int i = 0;

    if (collection != null) {
      where = where.append(" and UPPER(s.project)=?");
      paramList.add(collection.toUpperCase());
      ++i;
    }
    if (modality != null) {
      where = where.append(" and UPPER(s.modality)=?");
      paramList.add(modality.toUpperCase());
      ++i;
    }
    if (bodyPart != null) {
      where = where.append(" and UPPER(s.bodyPartExamined)=?");
      paramList.add(bodyPart.toUpperCase());
      ++i;
    }

    where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getManufacturerValues() - downloadable visibility hql is: "
        + hql + where.toString() + order);

    if (i > 0) {
      Object[] values = paramList.toArray(new Object[paramList.size()]);
      rs = getHibernateTemplate().find(hql + where.toString() + order, values);

    } else
      rs = getHibernateTemplate().find(hql + where.toString() + order);

    return rs;
  }

  /**
   * Construct the partial where clause which contains checking with authorized
   * project and site combinations.
   *
   * This method is used for NBIA Rest API filter.
   */
  private StringBuffer addAuthorizedProjAndSites(List<String> authorizedProjAndSites) {
    StringBuffer where = new StringBuffer();

    if ((authorizedProjAndSites != null) && (!authorizedProjAndSites.isEmpty())) {
      where = where.append(" and s.projAndSite in (");

      for (Iterator<String> projAndSites = authorizedProjAndSites.iterator(); projAndSites.hasNext();) {
        String str = projAndSites.next();
        where.append(str);

        if (projAndSites.hasNext()) {
          where.append(",");
        }
      }
      where.append(")");
    }

    return where;
  }

  /**
   * Fetch set of series objects filtered by project, ie. collection, patientId
   * and studyInstanceUid This method is used for NBIA Rest API.
   * 
   * @param collection
   *            A label used to name a set of images collected for a specific
   *            trial or other reason.
   * @param patientId
   *            Patient ID
   * @param seriesInstanceUid
   *            Series Instance UID
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<Object[]> getSeries(String collection, String patientId, String studyInstanceUid,
      List<String> authorizedProjAndSites, String modality, String bodyPartExamined, String manufacturerModelName,
      String manufacturer, String seriesInstanceUID) throws DataAccessException {

    if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
      return null;
    }

    StringBuffer where = new StringBuffer();
    List<Object[]> rs = null;
    String hql = "select s.seriesInstanceUID, s.studyInstanceUID, s.modality, s.protocolName, s.seriesDate, s.seriesDesc, "
      + "s.bodyPartExamined, s.seriesNumber, s.annotationsFlag, s.project, s.patientId, s.generalEquipment.manufacturer, "
      + "s.generalEquipment.manufacturerModelName, s.generalEquipment.softwareVersions, s.imageCount, s.maxSubmissionTimestamp, "
      + "s.licenseName, s.licenseURL, s.descriptionURI, s.totalSize"
      + " from GeneralSeries s where s.visibility in ('1') ";

    List<String> paramList = new ArrayList<String>();
    int i = 0;

    if (collection != null) {
      where = where.append(" and UPPER(s.project)=?");
      paramList.add(collection.toUpperCase());
      ++i;
    }
    if (patientId != null) {
      where = where.append(" and UPPER(s.patientId)=?");
      paramList.add(patientId.toUpperCase());
      ++i;
    }
    if (studyInstanceUid != null) {
      where = where.append(" and s.studyInstanceUID=?");
      paramList.add(studyInstanceUid);
      ++i;
    }
    if (modality != null) {
      where = where.append(" and s.modality=?");
      paramList.add(modality);
      ++i;
    }
    if (bodyPartExamined != null) {
      where = where.append(" and s.bodyPartExamined=?");
      paramList.add(bodyPartExamined);
      ++i;
    }
    if (manufacturerModelName != null) {
      where = where.append(" and s.generalEquipment.manufacturerModelName=?");
      paramList.add(manufacturerModelName);
      ++i;
    }
    if (manufacturer != null) {
      where = where.append(" and s.generalEquipment.manufacturer=?");
      paramList.add(manufacturer);
      ++i;
    }
    if (seriesInstanceUID != null) {
      where = where.append(" and s.seriesInstanceUID=?");
      paramList.add(seriesInstanceUID);
      ++i;
    }
    where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

    //		System.out.println("===== In nbia-dao, GeneralSeriesDAOImpl:getSeries() - downloadable visibility hql is: "
    //				+ hql + where.toString());

    if (i > 0) {
      Object[] values = paramList.toArray(new Object[paramList.size()]);
      rs = getHibernateTemplate().find(hql + where.toString(), values);
    } else
      rs = getHibernateTemplate().find(hql + where.toString());

    return rs;
  }
  @Transactional(propagation = Propagation.REQUIRED)
  public List<Object[]> getSeries(String fromDate, List<String> authorizedProjAndSites) throws DataAccessException {

    if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
      return null;
    } 
    StringBuffer where = new StringBuffer();
    List<Object[]> rs = null;
    String hql = "select s.seriesInstanceUID, s.studyInstanceUID, s.modality, s.protocolName, s.seriesDate, s.seriesDesc, "
      + "s.bodyPartExamined, s.seriesNumber, s.annotationsFlag, s.project, s.patientId, s.generalEquipment.manufacturer, "
      + "s.generalEquipment.manufacturerModelName, s.generalEquipment.softwareVersions, s.imageCount, s.maxSubmissionTimestamp"
      + " from GeneralSeries s where s.visibility in ('1') ";

    List<Date> paramList = new ArrayList<Date>();
    int i = 0;
    if (fromDate==null) {
      fromDate="01/01/1900";
    }
    Date fromDayDate=null;
    DateFormat simpleDateFormat=new SimpleDateFormat("dd/MM/yyyy");
    try {
      fromDayDate = new java.sql.Date(simpleDateFormat.parse(fromDate).getTime());
    } catch (ParseException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    if (fromDate != null) {
      where = where.append(" and s.maxSubmissionTimestamp>?");
      paramList.add(fromDayDate);
      ++i;
    }

    where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

    //		System.out.println("===== In nbia-dao, GeneralSeriesDAOImpl:getSeries() - downloadable visibility hql is: "
    //				+ hql + where.toString());


    if (i > 0) {
      Object[] values = paramList.toArray(new Object[paramList.size()]);
      rs = getHibernateTemplate().find(hql + where.toString(), values);
    } else
      rs = getHibernateTemplate().find(hql + where.toString());

    return rs;
  }
  @Transactional(propagation = Propagation.REQUIRED)
  public List<Object[]> getSeries(List<String> seriesInstanceUids, List<String> authorizedProjAndSites)
    throws DataAccessException {

    if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
      return null;
    }		
    StringBuffer where = new StringBuffer();
    List<Object[]> rs = null;
    String hql = "select s.seriesInstanceUID, s.studyInstanceUID, s.modality, s.protocolName, s.seriesDate, s.seriesDesc, "
      + "s.bodyPartExamined, s.seriesNumber, s.annotationsFlag, s.project, s.patientId, s.generalEquipment.manufacturer, "
      + "s.generalEquipment.manufacturerModelName, s.generalEquipment.softwareVersions, s.imageCount"
      + " from GeneralSeries s where s.visibility in ('1') ";

    where = where.append(" and s.seriesInstanceUID in (:ids)");

    where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

    //		System.out.println("===== In nbia-dao, GeneralSeriesDAOImpl:getSeries() - downloadable visibility hql is: "
    //				+ hql + where.toString());

    rs = getHibernateTemplate().findByNamedParam(hql + where.toString(), "ids", seriesInstanceUids);

    return rs;
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public List<String> getDeniedSeries(List<String> seriesInstanceUids, List<String> authorizedProjAndSites)
    throws DataAccessException {

    if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
      return null;
    }	

    if (seriesInstanceUids == null || seriesInstanceUids.isEmpty())
      return null;

    StringBuffer where = new StringBuffer();
    List<String> rs = null;
    String hql = "select s.seriesInstanceUID"
      + " from GeneralSeries s where s.visibility in ('1', '12') ";

    where = where.append(" and s.seriesInstanceUID in (:ids)");

    where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

    //		System.out.println("===== In nbia-dao, GeneralSeriesDAOImpl:getSeries() - downloadable visibility hql is: "
    //				+ hql + where.toString());

    rs = getHibernateTemplate().findByNamedParam(hql + where.toString(), "ids", seriesInstanceUids);

    if (rs != null) {
      //			System.out.println(" get acceptable series size=" +rs.size());
      if (rs.size() == seriesInstanceUids.size()) //all accepted
        return null;
      else {
        List<String> original = new ArrayList<String>(seriesInstanceUids);
        List<String> newList = new ArrayList<String>(rs);
        //				seriesInstanceUids.removeAll(rs);
        original.removeAll(newList);
        return original;
      }
    }
    else return seriesInstanceUids; //all denied
  }	

  public List<Object[]> getSeriesSize(String seriesInstanceUID, List<String> authorizedProjAndSites)
      throws DataAccessException {

      if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
        return null;
      }			
      StringBuffer where = new StringBuffer();
      List<Object[]> rs = null;
      String hql = "select sum(gi.dicomSize), s.imageCount "
        + " from GeneralSeries s join s.generalImageCollection gi where s.visibility in ('1') ";
      List<String> paramList = new ArrayList<String>();
      int i = 0;
      if (i > 0) {
        Object[] values = paramList.toArray(new Object[paramList.size()]);
        rs = getHibernateTemplate().find(hql + where.toString(), values);
      } else
        rs = getHibernateTemplate().find(hql + where.toString());
      if (seriesInstanceUID != null) {
        where = where.append(" and s.seriesInstanceUID=?");
        paramList.add(seriesInstanceUID);
        ++i;
      }
      return rs;
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public Collection<String> findDistinctModalitiesFromVisibleSeries() throws DataAccessException {
    String hql = "select distinct modality " + "from GeneralSeries "
      + "where visibility in ('1') and modality is not null " + "order by modality";

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:findDistinctModalitiesFromVisibleSeries() - downloadable visibility hql is: "
        + hql);

    return (Collection<String>) getHibernateTemplate().find(hql);
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> getDataForSeries(Integer seriesPkId) throws DataAccessException {
    // Create a list to pass to the other method
    List<Integer> ids = new ArrayList<Integer>(1);
    ids.add(seriesPkId);

    return findSeriesBySeriesPkId(ids);
  }

  /**
   * This returns the series objects by their primary keys. This method does NOT
   * look at authorization of any kind.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesPkId(Collection<Integer> seriesPkIds) throws DataAccessException {
    List<List<Integer>> chunks = Util.breakListIntoChunks(new ArrayList<Integer>(seriesPkIds), CHUNK_SIZE);

    List<SeriesDTO> resultSets = new ArrayList<SeriesDTO>();

    String selectStmt = SQL_QUERY_SELECT;
    String fromStmt = SQL_QUERY_FROM;
    String whereStmt = "";

    // Run the query
    long start = System.currentTimeMillis();
    for (List<Integer> chunk : chunks) {
      whereStmt = HqlUtils.buildInClauseUsingIntegers(SQL_QUERY_WHERE + "series.id IN ", chunk);

      List resultsData = getHibernateTemplate().find(selectStmt + fromStmt + whereStmt);
      long end = System.currentTimeMillis();
      logger.debug("Data basket query: " + selectStmt + fromStmt + whereStmt);
      logger.debug("total query time: " + (end - start) + " ms");

      // Map the rows retrieved from hibernate to the DataBasketResultSet objects.
      for (Object item : resultsData) {
        Object[] row = (Object[]) item;

        SeriesDTO seriesDTO = new SeriesDTO();
        seriesDTO.setPatientId(row[1].toString());
        seriesDTO.setSeriesId(row[3].toString());
        seriesDTO.setSeriesPkId((Integer) row[0]);
        seriesDTO.setStudyId(row[2].toString());
        seriesDTO.setStudyPkId((Integer) row[4]);
        seriesDTO.setTotalImagesInSeries((Integer) row[5]);
        seriesDTO.setTotalSizeForAllImagesInSeries((Long) row[6]);
        seriesDTO.setProject(row[7].toString());
        if (row[8] == null) {
          seriesDTO.setAnnotationsFlag(Boolean.FALSE);
        } else {
          seriesDTO.setAnnotationsFlag((Boolean) row[8]);
        }
        seriesDTO.setAnnotationsSize((row[9] != null) ? (Long) row[9] : 0);
        seriesDTO.setSeriesNumber(Util.nullSafeString(row[10]));
        seriesDTO.setDescription(Util.nullSafeString(row[11]));
        seriesDTO.setModality(row[12].toString());
        seriesDTO.setPatientPkId(row[13].toString());
        seriesDTO.setCommercialRestrictions(false);
        if (row[14] != null && ((String)row[14]).equalsIgnoreCase("yes")) {
          seriesDTO.setCommercialRestrictions(true);
        }
        resultSets.add(seriesDTO);
      }
    }

    return resultSets;

  }

  /**
   * Return all the series for a given list of series instance UIDs IGNORING
   * authorization.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesInstanceUID(List<String> seriesIds) throws DataAccessException {
    return findSeriesBySeriesInstanceUID(seriesIds, null, null);
  }

  /**
   * Return all the series for a given list of patients, but only when the series
   * are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesByPatientId(List<String> patientIDs, List<SiteData> authorizedSites,
      List<String> authroizedSeriesSecurityGroups) throws DataAccessException {
    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }				

    List<GeneralSeries> gsList = getSeriesFromPatients(patientIDs, authorizedSites, authroizedSeriesSecurityGroups);
    return convertHibernateObjectToSeriesDTO(gsList);

  }

  /**
   * Return all the series for a given list of studies, but only when the series
   * are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesByStudyInstanceUid(List<String> studyInstanceUids, List<SiteData> authorizedSites,
      List<String> authroizedSeriesSecurityGroups) throws DataAccessException {
    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }				

    if (studyInstanceUids == null || studyInstanceUids.size() <= 0) {
      return null;
    }

    List<GeneralSeries> seriesList = getSeriesFromStudys(studyInstanceUids, authorizedSites,
        authroizedSeriesSecurityGroups);
    return convertHibernateObjectToSeriesDTO(seriesList);
  }

  /**
   * Return all the series for a given list of series instance UIDs, but only when
   * the series are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesInstanceUID(List<String> seriesIds, List<SiteData> authorizedSites,
      List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<GeneralSeries> seriesList = null;
    List<SeriesDTO> seriesDTOList = null;

    if (seriesIds == null || seriesIds.size() <= 0) {
      return null;
    }

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }		

    seriesList = getSeriesFromSeriesInstanceUIDs(seriesIds, authorizedSites, authorizedSeriesSecurityGroups);
    seriesDTOList = convertHibernateObjectToSeriesDTO(seriesList);
    return seriesDTOList;
  }

  /**
   * Return all the series for a given list of series instance UIDs, but only when
   * the series are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesInstanceUID112(List<String> seriesIds, List<SiteData> authorizedSites,
      List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<GeneralSeries> seriesList = null;
    List<SeriesDTO> seriesDTOList = null;

    if (seriesIds == null || seriesIds.size() <= 0) {
      return null;
    }

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }						

    seriesList = getSeriesFromSeriesInstanceUIDs112(seriesIds, authorizedSites, authorizedSeriesSecurityGroups);
    seriesDTOList = convertHibernateObjectToSeriesDTO(seriesList);
    return seriesDTOList;
  }

  /**
   * Return all the series for a given list of series instance UIDs, but only when
   * the series are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesInstanceUIDAllVisibilities(List<String> seriesIds,
      List<SiteData> authorizedSites, List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<GeneralSeries> seriesList = null;
    List<SeriesDTO> seriesDTOList = null;

    if (seriesIds == null || seriesIds.size() <= 0) {
      return null;
    }

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }		

    seriesList = getSeriesFromSeriesInstanceUIDsAllVisibilities(seriesIds, authorizedSites,
        authorizedSeriesSecurityGroups);
    seriesDTOList = convertHibernateObjectToSeriesDTO(seriesList);
    return seriesDTOList;
  }

  /**
   * Return all the series for a given list of series instance UIDs, but only when
   * the series are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesInstanceUIDAnyVisibility(List<String> seriesIds)
    throws DataAccessException {
    List<GeneralSeries> seriesList = null;
    List<SeriesDTO> seriesDTOList = null;

    if (seriesIds == null || seriesIds.size() <= 0) {
      return null;
    }

    List<List<String>> breakdownList = Util.breakListIntoChunks(seriesIds, 900);
    for (List<String> unitList : breakdownList) {

      DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
      criteria.add(Restrictions.in("seriesInstanceUID", unitList));
      criteria = criteria.createCriteria("study");
      criteria = criteria.createCriteria("patient");
      criteria = criteria.createCriteria("dataProvenance");
      List<GeneralSeries> results = getHibernateTemplate().findByCriteria(criteria);
      if (seriesList == null) {
        seriesList = new ArrayList<GeneralSeries>();
      }
      seriesList.addAll(results);
    }
    seriesDTOList = convertHibernateObjectToSeriesDTO(seriesList);
    return seriesDTOList;
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public SeriesDTO getGeneralSeriesByPKid(Integer seriesPkId) throws DataAccessException {
    SeriesDTO series = null;

    DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
    criteria.add(Restrictions.eq("id", seriesPkId));

    List<GeneralSeries> result = getHibernateTemplate().findByCriteria(criteria);
    if (result != null && result.size() > 0) {
      GeneralSeries gs = (GeneralSeries) result.get(0);
      series = new SeriesDTO();
      series.setProject(gs.getStudy().getPatient().getDataProvenance().getProject());
      series.setDataProvenanceSiteName(gs.getSite());
    }

    return series;
  }

  public List<String> getSeriesFromPatientStudySeriesUIDs(List<String> patientIDs, List<String> studyIDs,
      List<String> seriesIDs) throws DataAccessException {
    List<String> seriesList = new ArrayList<String>();

    DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);

    Disjunction myQueryDisjunc = Restrictions.disjunction();
    if (patientIDs != null) {
      myQueryDisjunc.add(Restrictions.in("patientId", patientIDs));
    }
    if (studyIDs != null) {
      myQueryDisjunc.add(Restrictions.in("studyInstanceUID", studyIDs));
    }
    if (seriesIDs != null) {
      myQueryDisjunc.add(Restrictions.in("seriesInstanceUID", seriesIDs));
    }
    criteria.add(myQueryDisjunc);
    List<GeneralSeries> results = getHibernateTemplate().findByCriteria(criteria);
    for (GeneralSeries series : results) {
      seriesList.add(series.getSeriesInstanceUID());
    }

    return seriesList;
  }

  ////////////////////////////////////////////////////////// PROTECTED//////////////////////////////////////////////////////////////


  public List<SeriesDTO> getSeriesFromSeriesInstanceUIDsIgnoreSecurity(List<String> seriesIds) throws DataAccessException {
    List<GeneralSeries> seriesList = null;


    List<List<String>> breakdownList = Util.breakListIntoChunks(seriesIds, 900);
    for (List<String> unitList : breakdownList) {

      DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
      criteria.add(Restrictions.in("seriesInstanceUID", unitList));
      criteria.add(Restrictions.in("visibility", new String[] { "1"}));
      criteria = criteria.createCriteria("study");
      criteria = criteria.createCriteria("patient");
      criteria = criteria.createCriteria("dataProvenance");
      List<GeneralSeries> results = getHibernateTemplate().findByCriteria(criteria);
      if (seriesList == null) {
        seriesList = new ArrayList<GeneralSeries>();
      }
      seriesList.addAll(results);
    }


    return convertHibernateObjectToSeriesDTO(seriesList);
  }

  protected List<GeneralSeries> getSeriesFromSeriesInstanceUIDs(List<String> seriesIds,
      List<SiteData> authorizedSites, List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<GeneralSeries> seriesList = null;

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }				

    List<List<String>> breakdownList = Util.breakListIntoChunks(seriesIds, 900);
    for (List<String> unitList : breakdownList) {

      DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
      if (authorizedSeriesSecurityGroups != null) {
        setSeriesSecurityGroups(criteria, authorizedSeriesSecurityGroups);
      }
      if (authorizedSites != null) {
        setAuthorizedSiteData(criteria, authorizedSites);
      }
      criteria.add(Restrictions.in("seriesInstanceUID", unitList));
      criteria.add(Restrictions.in("visibility", new String[] { "1"}));



      List<GeneralSeries> results = getHibernateTemplate().findByCriteria(criteria);
      if (seriesList == null) {
        seriesList = new ArrayList<GeneralSeries>();
      }
      seriesList.addAll(results);
    }

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getSeriesFromSeriesInstanceUIDs() - downloadable visibility - criteria.add(Restrictions.in('visibility', new String[] {'1'})) ");

    return seriesList;
  }

  protected List<GeneralSeries> getSeriesFromSeriesInstanceUIDsAllVisibilities(List<String> seriesIds,
      List<SiteData> authorizedSites, List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<GeneralSeries> seriesList = null;

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }						

    List<List<String>> breakdownList = Util.breakListIntoChunks(seriesIds, 900);
    for (List<String> unitList : breakdownList) {

      DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
      if (authorizedSeriesSecurityGroups != null) {
        setSeriesSecurityGroups(criteria, authorizedSeriesSecurityGroups);
      }
      if (authorizedSites != null) {
        setAuthorizedSiteData(criteria, authorizedSites);
      }
      criteria.add(Restrictions.in("seriesInstanceUID", unitList));



      List<GeneralSeries> results = getHibernateTemplate().findByCriteria(criteria);
      if (seriesList == null) {
        seriesList = new ArrayList<GeneralSeries>();
      }
      seriesList.addAll(results);
    }

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getSeriesFromSeriesInstanceUIDs() - downloadable visibility - all visibility ");

    return seriesList;
  }	

  protected List<GeneralSeries> getSeriesFromSeriesInstanceUIDs112(List<String> seriesIds,
      List<SiteData> authorizedSites, List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<GeneralSeries> seriesList = null;

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }				

    List<List<String>> breakdownList = Util.breakListIntoChunks(seriesIds, 900);
    for (List<String> unitList : breakdownList) {

      DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
      if (authorizedSeriesSecurityGroups != null) {
        setSeriesSecurityGroups(criteria, authorizedSeriesSecurityGroups);
      }
      if (authorizedSites != null) {
        setAuthorizedSiteData(criteria, authorizedSites);
      }
      criteria.add(Restrictions.in("seriesInstanceUID", unitList));
      criteria.add(Restrictions.in("visibility", new String[] { "1", "12" }));
      List<GeneralSeries> results = getHibernateTemplate().findByCriteria(criteria);
      if (seriesList == null) {
        seriesList = new ArrayList<GeneralSeries>();
      }
      seriesList.addAll(results);
    }

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getSeriesFromSeriesInstanceUIDs() - downloadable visibility - criteria.add(Restrictions.in('visibility', new String[] {'1','12'})) ");

    return seriesList;
  }


  ////////////////////////////////////////// PRIVATE/////////////////////////////////////////

  private static int CHUNK_SIZE = 500;

  private static String SQL_QUERY_SELECT = "SELECT series.id, patient.patientId, study.studyInstanceUID, series.seriesInstanceUID, study.id, series.imageCount, series.totalSize, dp.project, series.annotationsFlag, series.annotationTotalSize, series.seriesNumber, series.seriesDesc, series.modality, series.patientPkId, series.excludeCommercial ";
  private static String SQL_QUERY_FROM = "FROM Study study join study.generalSeriesCollection series join study.patient patient join patient.dataProvenance dp ";
  private static String SQL_QUERY_WHERE = "WHERE ";

  private static Logger logger = Logger.getLogger(GeneralSeriesDAO.class);

  private List<GeneralSeries> getSeriesFromStudys(List<String> studyIDs, List<SiteData> authorizedSites,
      List<String> authorizedSeriesSecurityGroups) {

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }				

    List<GeneralSeries> seriesList = null;
    DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
    setSeriesSecurityGroups(criteria, authorizedSeriesSecurityGroups);
    setAuthorizedSiteData(criteria, authorizedSites);
    criteria.add(Restrictions.in("visibility", new String[] { "1" }));
    criteria = criteria.createCriteria("study");
    criteria.add(Restrictions.in("studyInstanceUID", studyIDs));


    seriesList = getHibernateTemplate().findByCriteria(criteria);
    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getSeriesFromStudys() - downloadable visibility - criteria.add(Restrictions.in('visibility', new String[] {'1'})) ");
    return seriesList;
  }

  private List<GeneralSeries> getSeriesFromPatients(List<String> patientIDs, List<SiteData> authorizedSites,
      List<String> authorizedSeriesSecurityGroups) {
    List<GeneralSeries> seriesList = null;

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }				

    DetachedCriteria criteria = DetachedCriteria.forClass(GeneralSeries.class);
    setSeriesSecurityGroups(criteria, authorizedSeriesSecurityGroups);
    setAuthorizedSiteData(criteria, authorizedSites);
    criteria.add(Restrictions.in("patientId", patientIDs));
    // criteria.add(Restrictions.eq("visibility", "1"));
    criteria.add(Restrictions.in("visibility", new String[] { "1" }));

    seriesList = getHibernateTemplate().findByCriteria(criteria);

    System.out.println(
        "===== In nbia-dao, GeneralSeriesDAOImpl:getSeriesFromPatients() - downloadable visibility - criteria.add(Restrictions.in('visibility', new String[] {'1'})) ");

    return seriesList;
  }

  private List<SeriesDTO> convertHibernateObjectToSeriesDTO(List<GeneralSeries> daos) {
    List<SeriesDTO> returnList = new ArrayList<SeriesDTO>();
    if (daos != null) {
      for (int i = 0; i < daos.size(); i++) {
        SeriesDTO sd = new SeriesDTO();
        GeneralSeries gs = (GeneralSeries) (daos.get(i));
        sd.setAnnotationsFlag(gs.getAnnotationsFlag() == null ? false : gs.getAnnotationsFlag());
        sd.setAnnotationsSize(gs.getAnnotationTotalSize());
        sd.setDescription(gs.getSeriesDesc());
        sd.setSeriesPkId(gs.getId());
        sd.setModality(gs.getModality());
        sd.setNumberImages(gs.getImageCount());
        sd.setPatientId(gs.getPatientId());
        sd.setSeriesId(gs.getSeriesInstanceUID());
        sd.setSeriesNumber("" + gs.getSeriesNumber());
        sd.setSeriesPkId(gs.getId());
        sd.setSeriesUID(gs.getSeriesInstanceUID());
        sd.setStudyId(gs.getStudy().getStudyInstanceUID());
        sd.setStudyPkId(gs.getStudy().getId());
        sd.setTotalImagesInSeries(gs.getImageCount());
        sd.setTotalSizeForAllImagesInSeries(gs.getTotalSize());
        sd.setProject(gs.getStudy().getPatient().getDataProvenance().getProject());
        sd.setDataProvenanceSiteName(gs.getSite());
        sd.setStudyDate(gs.getStudy().getStudyDate());
        sd.setStudyDesc(gs.getStudy().getStudyDesc());
        sd.setStudy_id(gs.getStudy().getStudyId());
        returnList.add(sd);
      }
    }
    return returnList;
  }

  private static void setAuthorizedSiteData(DetachedCriteria criteria, List<SiteData> sites) {
    Disjunction disjunction = Restrictions.disjunction();

    for (SiteData sd : sites) {
      Conjunction con = new Conjunction();
      con.add(Restrictions.eq("site", sd.getSiteName()));
      con.add(Restrictions.eq("project", sd.getCollection()));
      disjunction.add(con);
    }
    criteria.add(disjunction);
  }

  private static void setSeriesSecurityGroups(DetachedCriteria criteria,
      List<String> securityGroups) {/**
                                     * security groups no longer used Conjunction con = new Conjunction();
                                     * 
                                     * if (securityGroups != null && securityGroups.size() != 0) { Disjunction
                                     * disjunction = Restrictions.disjunction();
                                     * disjunction.add(Restrictions.isNull("securityGroup"));
                                     * disjunction.add(Restrictions.in("securityGroup", securityGroups));
                                     * con.add(disjunction); criteria.add(con); } else {
                                     * criteria.add(Restrictions.isNull("securityGroup")); }
                                     **/
  }

  /**
   * Fetch set of collection values by giving name.
   *
   * This method is used for NBIA Rest API filter.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<String> getRequestedProjectAndSite(Map<String, String> queryParams) throws DataAccessException {

    List<String> returnList = new ArrayList<String>();
    Criteria criteria = getHibernateTemplate().getSessionFactory().getCurrentSession()
      .createCriteria(GeneralSeries.class);
    criteria.setProjection(Projections.distinct(
          Projections.projectionList().add(Projections.property("project")).add(Projections.property("site"))));
    // criteria.add(Restrictions.eq("visibility", "1"));
    criteria.add(Restrictions.in("visibility", new String[] { "1" }));
    Set<String> paramLst = queryParams.keySet();
    for (String param : paramLst) {
      criteria.add(Restrictions.eq(param, queryParams.get(param)));
    }

    List<Object[]> result = criteria.list();
    Iterator<Object[]> iter = result.iterator();
    while (iter.hasNext()) {
      Object[] row = iter.next();
      returnList.add(new String((String) row[0] + "//" + (String) row[1]));
    }

    //		System.out.println(
    //				"===== In nbia-dao, GeneralSeriesDAOImpl:getRequestedProjectAndSite() - downloadable visibility - criteria.add(Restrictions.in('visibility', new String[] {'1'})) ");

    return returnList;
  }


  /**
   * Fetch the list series instance uid by giving collection name and visibility.
   *
   * This method is used for NBIA Rest API.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<String> findSeriesByCollectionAndVisibility(String collection, String visibility)
    throws DataAccessException {
    String visiblityClause = "";
    if (!visibility.isEmpty() && !visibility.contains("13")) {
      String[] vList = visibility.split(",");
      StringBuffer sb = new StringBuffer();
      for (int i = 0; i < vList.length; ++i) {
        sb.append("'");
        sb.append(vList[i].trim());
        sb.append("'");
        if (i < vList.length-1)
          sb.append(",");
      }
      visibility = sb.toString();
      visiblityClause = " and gs.visibility in (" + visibility + ")";
    }
    String hql = "select gs.seriesInstanceUID from GeneralSeries gs where gs.project = '" + collection + "' "
      + visiblityClause + " order by gs.seriesInstanceUID";

    //		System.out.println(
    //				"===== In nbia-dao, GeneralSeriesDAOImpl:findSeriesByCollectionAndVisibility() - hql is: " + hql);

    return (List<String>) getHibernateTemplate().find(hql);
  }
  /**
   * Return all the series for a given list of series instance UIDs, but only when
   * the series are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesInstanceUID112Light(List<String> seriesIds, List<SiteData> authorizedSites,
      List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<GeneralSeries> seriesList = null;
    List<SeriesDTO> seriesDTOList = null;

    if (seriesIds == null || seriesIds.size() <= 0) {
      return null;
    }

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }						

    seriesDTOList = getSeriesDTOs(false, seriesIds, authorizedSites);
    return seriesDTOList;
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public List<Object []> findSeriesQCInfoBySeriesInstanceUIDs(List<String> seriesIds, List<String> authorizedSite) throws DataAccessException {
    List<Object[]> seriesDTOList = null;

    if (seriesIds == null || seriesIds.size() <= 0) {			
      return null;
    }

    if (authorizedSite == null || authorizedSite.size() == 0){		
      return null;
    }	

    seriesDTOList = getSeriesQCInfoDTOs(seriesIds, authorizedSite);
    return seriesDTOList;
  }	

  /**
   * Return all the series for a given list of series instance UIDs, but only when
   * the series are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public List<SeriesDTO> findSeriesBySeriesInstanceUIDAllVisibilitiesLight(List<String> seriesIds,
      List<SiteData> authorizedSites, List<String> authorizedSeriesSecurityGroups) throws DataAccessException {
    List<SeriesDTO> seriesDTOList = null;

    if (seriesIds == null || seriesIds.size() <= 0) {
      return null;
    }

    if (authorizedSites == null || authorizedSites.size() == 0){
      return null;
    }		

    seriesDTOList = getSeriesDTOs(true, seriesIds, authorizedSites);
    return seriesDTOList;
  }

  /**
   * Return the metadata for a series instance UIDs in selected visibilties (only 1 and 12 or all), but only when
   * the series are authorized.
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public Object[] findSeriesBySeriesInstanceUIDAllVisibilitiesLight(boolean allVisibilities, String seriesId,
      List<String> authorizedCollections) throws DataAccessException {
    List<SeriesDTO> seriesDTOList = null;
    List<String> seriesIds = new ArrayList<String>();

    if (seriesId != null) {
      seriesIds.add(seriesId);
    }
    else return null;

    List <SiteData> authorizedSites = new ArrayList<SiteData>();
    if (authorizedCollections != null && authorizedCollections.size() > 0) {
      for (String ac : authorizedCollections) {
        if (ac.endsWith("'") && ac.startsWith("'")) {
          int len = ac.length() - 1;
          ac = ac.substring(1, len);
        }
        SiteData sd = new SiteData(ac);
        authorizedSites.add(sd);
      }
    }
    else return null;

    seriesDTOList = getSeriesDTOs(allVisibilities, seriesIds, authorizedSites);

    if (seriesDTOList != null  && seriesDTOList.size() > 0) {
      SeriesDTO sdto = seriesDTOList.get(0);

      Object[] result = {
        seriesId,
        //					Util.nullToNAString(sdto.getProject()),
        //					Util.nullToNAString(sdto.getThirdPartyAnalysis()),
        //					Util.nullToNAString(sdto.getDescriptionURI()),
        //					Util.nullToNAString(sdto.getPatientId()),
        //					Util.nullToNAString(sdto.getStudyId()),
        //					Util.nullToNAString(sdto.getStudyDesc()),
        //					Util.nullToNAString(sdto.getStudyDateString()),		
        //					Util.nullToNAString(sdto.getDescription()),
        //					Util.nullToNAString(sdto.getManufacturer()),
        //					Util.nullToNAString(sdto.getModality()),
        //					"UnknownSOPClassName",
        //					Util.nullToNAString(sdto.getSopClassUID()),
        //					Util.nullToNAString(sdto.getNumberImages().toString()),
        //					Util.nullToNAString(sdto.getTotalSizeForAllImagesInSeries().toString()),
        //					Util.nullToNAString(sdto.getStudy_id()),
        //					Util.nullToNAString(sdto.getSeriesNumber())};
        Util.nullSafeString(sdto.getProject()),
        Util.nullSafeString(sdto.getThirdPartyAnalysis()),
        Util.nullSafeString(sdto.getDescriptionURI()),
        Util.nullSafeString(sdto.getPatientId()),
        Util.nullSafeString(sdto.getStudyId()),
        Util.nullSafeString(sdto.getStudyDesc()),
        Util.nullSafeString(sdto.getStudyDateString()),		
        Util.nullSafeString(sdto.getDescription()),
        Util.nullSafeString(sdto.getManufacturer()),
        Util.nullSafeString(sdto.getModality()),
        //			"UnknownSOPClassName",
        Util.nullSafeString(sdto.getSopClassUID()),
        Util.nullSafeString(sdto.getNumberImages().toString()),
        Util.nullSafeString(sdto.getTotalSizeForAllImagesInSeries().toString()),
        Util.nullSafeString(sdto.getStudy_id()),
        Util.nullSafeString(sdto.getSeriesNumber()),	
        Util.nullSafeString(sdto.getLicenseName()),
        Util.nullSafeString(sdto.getLicenseUrl()),
        Util.nullSafeString(sdto.getAnnotationsSize()),
        Util.nullSafeString(sdto.getReleaseDate())};

    return result;
  } else return null;
}	

private List<SeriesDTO> getSeriesDTOs(boolean allVisibilities, List<String> seriesIds,
    List<SiteData> authorizedSites) {

  List <SeriesDTO> returnValue= new ArrayList<SeriesDTO>();

  String sQL = "select G.GENERAL_SERIES_PK_ID,  G.ANNOTATIONS_FLAG, G.BODY_PART_EXAMINED, G.PATIENT_ID, G.SERIES_DESC, G.SERIES_INSTANCE_UID, G.SERIES_NUMBER, "+
    "G.STUDY_DATE, G.STUDY_DESC, G.STUDY_INSTANCE_UID, G.PROJECT, G.SITE, S.STUDY_ID, "+
    "( SELECT sum(a.file_size) FROM annotation a WHERE a.general_series_pk_id = G.general_series_pk_id  ) as ANNOSIZE, "+
    "( SELECT SUM(gi.dicom_size) FROM general_image gi WHERE gi.general_series_pk_id = G.GENERAL_SERIES_PK_ID ) as IMAGESIZE, "+
    "( SELECT COUNT(*) FROM general_image gi WHERE gi.general_series_pk_id = G.GENERAL_SERIES_PK_ID ) as IMAGECOUNT, "+
    "G.THIRD_PARTY_ANALYSIS, G.DESCRIPTION_URI, "+
    "ge.manufacturer as MANUFACTURER, "+
    "G.MODALITY, " +
    "( SELECT gi.SOP_CLASS_UID FROM general_image gi WHERE gi.general_series_pk_id = G.GENERAL_SERIES_PK_ID LIMIT 1) as SOPCLASSUID, "+
    "( select CONCAT_WS('||', l.long_name,  l.license_url) from license l where G.LICENSE_NAME = l.long_name) as license, "+
    "G.DATE_RELEASED " +
    "from GENERAL_SERIES G, STUDY S, general_equipment ge where S.STUDY_PK_ID=G.STUDY_PK_ID " +
    "and ge.GENERAL_EQUIPMENT_PK_ID = G.GENERAL_EQUIPMENT_PK_ID";		

  String siteWhereClause=" AND (";
  boolean first=true;
  for (SiteData sd : authorizedSites) {
    if (first) {
      siteWhereClause+="(G.SITE='"+sd.getSiteName()+"' AND G.PROJECT='"+sd.getCollection()+"')";
      first=false;
    } else {
      siteWhereClause+=" OR (G.SITE='"+sd.getSiteName()+"' AND G.PROJECT='"+sd.getCollection()+"')";
    }
  }
  siteWhereClause+=")";
  String seriesIdWhereClause=" AND G.SERIES_INSTANCE_UID IN(:ids) ";
  String visibilityWhereClause="";
  if (!allVisibilities) {
    visibilityWhereClause=" AND G.VISIBILITY IN ('1', '12') ";
  }
  String fullSQL=sQL+visibilityWhereClause+seriesIdWhereClause+siteWhereClause;

  List<Object[]> seriesResults= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(fullSQL).setParameterList("ids", seriesIds).list();
  Iterator<Object[]> iter = seriesResults.iterator();

  // Loop through the results.  There is one result for each series
  while (iter.hasNext()) {
    Object[] row = iter.next();

    // Create the seriesDTO

    SeriesDTO seriesDTO = new SeriesDTO();
    //modality should never be null... but currently possible
    seriesDTO.setSeriesPkId(((BigInteger)  row[0]).intValue());
    String annotationFlag = Util.nullSafeString(row[1]);
    if(annotationFlag!=null) {
      seriesDTO.setAnnotationsFlag(true);
    }
    seriesDTO.setBodyPartExamined(Util.nullSafeString(row[2]));
    seriesDTO.setPatientId((String)row[3]);
    seriesDTO.setDescription(Util.nullSafeString(row[4]));
    seriesDTO.setSeriesUID(row[5].toString());
    seriesDTO.setSeriesNumber(Util.nullSafeString(row[6]));
    if (row[7]!=null) {
      seriesDTO.setStudyDate((Date)(row[7]));
    }
    seriesDTO.setStudyDesc(Util.nullSafeString(row[8]));
    seriesDTO.setStudyId(row[9].toString());
    seriesDTO.setProject((String)row[10]);
    seriesDTO.setDataProvenanceSiteName((String)row[11]);
    seriesDTO.setStudy_id(Util.nullSafeString(row[12]));
    seriesDTO.setTotalSizeForAllImagesInSeries(((BigDecimal)  row[14]).longValue());
    if (row[13]!=null)
    {
      seriesDTO.setAnnotationsSize(((BigDecimal)  row[13]).longValue());
    } else {
      seriesDTO.setAnnotationsSize(0L);
    }
    seriesDTO.setNumberImages(((BigInteger)  row[15]).intValue());
    seriesDTO.setThirdPartyAnalysis(Util.nullSafeString(row[16]));
    seriesDTO.setDescriptionURI(Util.nullSafeString(row[17]));
    seriesDTO.setManufacturer(Util.nullSafeString(row[18]));
    seriesDTO.setModality(Util.nullSafeString(row[19]));
    seriesDTO.setSopClassUID(Util.nullSafeString(row[20]));

    if (row[21] == null) {
      seriesDTO.setLicenseName(null);
      seriesDTO.setLicenseUrl(null);	
    }
    else {
      String[] parts = ((String)row[21]).split("\\|\\|");
      seriesDTO.setLicenseName(parts[0]);
      seriesDTO.setLicenseUrl(parts[1]);	        
    }
    if (row[22]!=null) {
      seriesDTO.setReleaseDate((Date)(row[22]));
    }

    returnValue.add(seriesDTO);
  }
  return returnValue;	
}

private List<Object []> getSeriesQCInfoDTOs(List<String> seriesIds, List <String> authorizedSites) {
  String sQL = "select s.SERIES_INSTANCE_UID, s.VISIBILITY, s.RELEASED_STATUS, s.DATE_RELEASED, " +
    "( SELECT COUNT(*) FROM general_image gi WHERE gi.general_series_pk_id = s.GENERAL_SERIES_PK_ID ) as IMAGECOUNT, "+
    " s.DESCRIPTION_URI, "+
    " s.license_name "+
    "from GENERAL_SERIES s";	

  StringBuffer where = new StringBuffer();
  where = where.append(" and concat(concat(s.project, '//'), s.site) in (");

  for (Iterator<String> projAndSites = authorizedSites.iterator(); projAndSites.hasNext();) {
    String str = projAndSites.next();
    where.append(str);

    if (projAndSites.hasNext()) {
      where.append(",");
    }
  }
  where.append(")");		
  String seriesIdWhereClause=" where s.SERIES_INSTANCE_UID IN (:ids) ";
  String fullSQL=sQL + seriesIdWhereClause + where.toString();
  System.out.println(fullSQL);

  List<Object[]> seriesResults= (this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(fullSQL).setParameterList("ids", seriesIds)).list();

  List<Object[]> modifiedResults = new ArrayList<Object[]>();
  for (Object[] objs : seriesResults) {
    objs[1] = VisibilityStatus.statusFactory(Integer.parseInt((String) objs[1])).getText();
    modifiedResults.add(objs);
  }
  return modifiedResults;
}	

@Transactional(propagation = Propagation.REQUIRED)
public int updateDOIForSeries(String project, String doi)throws DataAccessException {
  int returnValue=0;
  String sqlString = "update general_series set description_uri=? where (upper(third_party_analysis)='NO' or third_party_analysis is null) and upper(project)=?";
  Query query = this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sqlString);
  System.out.println("uri-"+doi+"-collection-"+project);
  query.setParameter(0, doi, Hibernate.STRING);
  query.setParameter(1, project.toUpperCase(), Hibernate.STRING);
  try {
    returnValue=query.executeUpdate();
  } catch (HibernateException e) {
    e.printStackTrace();
  }
  return returnValue;
}


public List<DOIDTO> getCollectionOrSeriesForDOI(String doi, String collectionOrSeries, List<String> authorizedProjAndSites)throws DataAccessException{
  List<DOIDTO> returnValue=new ArrayList<DOIDTO>();
  if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
    return returnValue;
  }
  boolean forSeries=false;
  if (collectionOrSeries!=null&&collectionOrSeries.equalsIgnoreCase("Series")) {
    forSeries=true;
  }
  String sqlString = "select project, thirdPartyAnalysis ";
  if (forSeries) {
    sqlString += ",seriesInstanceUID ";
  }
  List<String> paramList = new ArrayList<String>();
  int i = 0;
  sqlString +=" from GeneralSeries s where 1=1 ";
  if (doi!=null&&doi.length()>0) {
    sqlString += " and s.descriptionURI=?";
    paramList.add(doi);
    ++i;
  }
  sqlString += addAuthorizedProjAndSites(authorizedProjAndSites);
  if (forSeries) {
    sqlString += " group by project, thirdPartyAnalysis, seriesInstanceUID ";
    Object[] values = paramList.toArray(new Object[paramList.size()]);
    List resultsData = null;
    if (i > 0) {
      resultsData = getHibernateTemplate().find(sqlString, values);
    } else {
      resultsData = getHibernateTemplate().find(sqlString, values);
    }
    for (Object item : resultsData) {
      DOIDTO dto = new DOIDTO();
      Object[] row = (Object[]) item;
      if (row[0] != null) {
        dto.setCollection(row[0].toString());

      }
      if (row[1] != null) {
        dto.setThirdPartyAnanlysis(row[1].toString());

      }
      if (row[2] != null) {
        dto.setSeriesInstanceUID(row[2].toString());

      }
      returnValue.add(dto);
    } 
  } else {
    sqlString += " group by project, thirdPartyAnalysis ";
    Object[] values = paramList.toArray(new Object[paramList.size()]);
    List resultsData = null;
    if (i > 0) {
      resultsData = getHibernateTemplate().find(sqlString, values);
    } else {
      resultsData = getHibernateTemplate().find(sqlString, values);
    }
    for (Object item : resultsData) {
      DOIDTO dto = new DOIDTO();
      Object[] row = (Object[]) item;
      if (row[0] != null) {
        dto.setCollection(row[0].toString());

      }
      if (row[1] != null) {
        dto.setThirdPartyAnanlysis(row[1].toString());

      }
      returnValue.add(dto);
    } 
  }
  return returnValue;
}

@Transactional(propagation = Propagation.REQUIRED)
public void cacheMD5ForAllCollections()throws DataAccessException{
  System.out.println("Caching MD5");
  Set<String> projectSet = new HashSet<String>();
  List<SiteData> siteData=new ArrayList<SiteData>();
  AuthorizationManager am = null;
  try {
    am = new AuthorizationManager(NCIAConfig.getGuestUsername());
  } catch (Exception e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
  }
  siteData = am.getAuthorizedSites();
  String sqlString = "select project, site from GeneralSeries where visibility=1 group by project, site";
  List<String[]> resultsData  = getHibernateTemplate().find(sqlString);
  for (SiteData item : siteData) {
    projectSet.add(item.getCollection());
  }
  for (String project:projectSet) {
    cacheMD5ForCollection(project, siteData);
  }
}

@Transactional(propagation = Propagation.REQUIRED)
private void cacheMD5ForCollection(String project, List<SiteData> authorizedSites)throws DataAccessException{
  String sqlString = "select patientId, project from GeneralSeries where visibility=1 and project=:project";
  boolean first=true;
  sqlString += " group by patientId, project";
  List<String[]> resultsData  = getHibernateTemplate().findByNamedParam(sqlString, "project", project);
  String md5Concat="";
  List<String> sortedList=new ArrayList<String>();
  for (Object item[] : resultsData) {
    sortedList.add(getMD5ForPatientId(item[0].toString(),item[1].toString(), authorizedSites));
  }
  Collections.sort(sortedList);
  for (String item : sortedList) {
    if (item != null) {
      md5Concat+=item;
    }
  }
  if (md5Concat.length()==0) {
    return;
  }
  String md5hash = digest(md5Concat);
  try {
    DetachedCriteria criteria = DetachedCriteria.forClass(CollectionDesc.class);
    criteria.add(Restrictions.eq("collectionName", project));
    List<CollectionDesc> collectionDescList = getHibernateTemplate().findByCriteria(criteria);
    if (collectionDescList!=null) {
      for (CollectionDesc cd: collectionDescList) {
        if ((cd.getMd5hash()==null)||!(cd.getMd5hash().equalsIgnoreCase(md5hash))){
          cd.setMd5hash(md5hash);
          System.out.println("Updating MD5 for "+project);
          getHibernateTemplate().update(cd);
          getHibernateTemplate().flush();
        }

      }
    }
  } catch (HibernateException e) {
    // TODO Auto-generated catch block
    // e.printStackTrace();
  }
}


@Transactional(propagation = Propagation.REQUIRED)
public String getMD5ForCollection(String project, List<SiteData> authorizedSites)throws DataAccessException{
  String sqlString = "select md5hash from CollectionDesc where collectionName=:project";
  List<String> resultsData  = getHibernateTemplate().findByNamedParam(sqlString, "project", project);
  for (String item : resultsData) {
    return item;
  }
  return null;
}


@Transactional(propagation = Propagation.REQUIRED)
public String getMD5ForPatientId(String patientId, String project, List<SiteData> authorizedSites)throws DataAccessException{
  String sqlString = "select gs.studyInstanceUID from GeneralSeries gs, Patient p  where "
    + " gs.patientPkId=p.id and "
    + " gs.visibility=1 and p.patientId=:id " + 
    "and gs.project=:project and (";
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
  sqlString += " group by gs.studyInstanceUID";
  String[] paramNames = {"id","project"};
  String[] params = {patientId, project};
  List<String> resultsData  = getHibernateTemplate().findByNamedParam(sqlString, paramNames, params);
  String md5Concat="";
  List<String> sortedList=new ArrayList<String>();
  for (String item : resultsData) {
    if (item != null) {
      sortedList.add(getMD5ForStudy(item, authorizedSites));
    }
  }
  Collections.sort(sortedList);
  for (String item : sortedList) {
    if (item != null) {
      md5Concat+=item;
    }
  }
  if (md5Concat.length()==0) {
    return md5Concat;
  }
  return digest(md5Concat);
}

@Transactional(propagation = Propagation.REQUIRED)
public String getMD5ForStudy(String studyInstanceUID, List<SiteData> authorizedSites)throws DataAccessException{
  String sqlString = "select seriesInstanceUID from GeneralSeries where visibility=1 and studyInstanceUID=:id and (";
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
  List<String> resultsData  = getHibernateTemplate().findByNamedParam(sqlString, "id", studyInstanceUID);
  String md5Concat="";
  List<String> sortedList=new ArrayList<String>();
  for (String item : resultsData) {
    if (item != null) {
      sortedList.add(getMD5ForSeries(item));
    }
  }

  Collections.sort(sortedList);
  for (String item : sortedList) {
    if (item != null) {
      md5Concat+=item;
    }
  }
  if (md5Concat.length()==0) {
    return md5Concat;
  }
  return digest(md5Concat);
}	
@Transactional(propagation = Propagation.REQUIRED)
public synchronized String getMD5ForSeries(String seriesInstanceUID)throws DataAccessException{
  String returnValue="";
  String sqlString = "SELECT md5_digest " + 
    "FROM general_image  " + 
    "where series_instance_uid=:id "+
    " order by md5_digest ";
  SQLQuery qu = this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sqlString);
  List<String> results= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sqlString).setParameter("id", seriesInstanceUID).list();
  for(String item:results) {
    returnValue=returnValue+item;
  }
  if (returnValue.length()==0) {
    return returnValue;
  }
  returnValue=digest(returnValue.toString());
  return returnValue;
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
@Transactional(propagation=Propagation.REQUIRED)
public List<String> getSitesForSeries(List<String> seriesIds) throws DataAccessException{
  if (seriesIds==null || seriesIds.size()<1) {
    return null;
  }
  String hql = "select distinct project, site from GeneralSeries where seriesInstanceUID in (:ids)";
  Query query=getHibernateTemplate().getSessionFactory().getCurrentSession().createQuery(hql);
  query.setParameterList("ids", seriesIds);
  List<Object[]> siteRows = query.list();
  boolean firstTime=true;
  String onlyCollection =null;
  for (Object[] siteRow : siteRows) {
    if (firstTime) {
      onlyCollection=(String)siteRow[0];
      firstTime=false;
    }
    if (!onlyCollection.equalsIgnoreCase((String)siteRow[0])){
      //more than one collection
      return null;
    }
  }
  List<String> returnValue=new ArrayList<String>();
  String protectionElementQuery="select  distinct s.dp_site_name "+
    " from trial_data_provenance tdp, site s where s.trial_dp_pk_id =tdp.trial_dp_pk_id and project like '"+
    onlyCollection+"'";
  List<String> results= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(protectionElementQuery).list();
  for (String result:results) {
    returnValue.add(result);
  }
  return returnValue;
}
}
