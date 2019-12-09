/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.EquipmentDTO;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.internaldomain.GeneralSeries;
import gov.nih.nci.nbia.util.HqlUtils;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.util.Util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Conjunction;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
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
			System.out.println("!!!!where.toString()=" + where.toString());

		} else {
			rs = getHibernateTemplate().find(hql + where.toString() + order);
			System.out.println("!!!!where.toString()=" + where.toString());

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
		String hql = "select distinct(bodyPartExamined) from GeneralSeries s where visibility in ('1') ";
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
		System.out.println("&&&&&&&&&&&& where clause for project and group=" + where.toString());
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
			String manufacturer) throws DataAccessException {
				
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}
		
		StringBuffer where = new StringBuffer();
		List<Object[]> rs = null;
		String hql = "select s.seriesInstanceUID, s.studyInstanceUID, s.modality, s.protocolName, s.seriesDate, s.seriesDesc, "
				+ "s.bodyPartExamined, s.seriesNumber, s.annotationsFlag, s.project, s.patientId, s.generalEquipment.manufacturer, "
				+ "s.generalEquipment.manufacturerModelName, s.generalEquipment.softwareVersions, s.imageCount"
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
		where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		System.out.println("===== In nbia-dao, GeneralSeriesDAOImpl:getSeries() - downloadable visibility hql is: "
				+ hql + where.toString());

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

		System.out.println("===== In nbia-dao, GeneralSeriesDAOImpl:getSeries() - downloadable visibility hql is: "
				+ hql + where.toString());

		rs = getHibernateTemplate().findByNamedParam(hql + where.toString(), "ids", seriesInstanceUids);

		return rs;
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
			logger.info("Data basket query: " + selectStmt + fromStmt + whereStmt);
			logger.info("total query time: " + (end - start) + " ms");

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
			series.setDataProvenanceSiteName(gs.getStudy().getPatient().getDataProvenance().getDpSiteName());
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
			criteria.add(Restrictions.in("seriesInstanceUID", unitList));
			criteria.add(Restrictions.in("visibility", new String[] { "1"}));
			criteria = criteria.createCriteria("study");
			criteria = criteria.createCriteria("patient");
			criteria = criteria.createCriteria("dataProvenance");
			if (authorizedSites != null) {
				setAuthorizedSiteData(criteria, authorizedSites);
			}

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
			criteria.add(Restrictions.in("seriesInstanceUID", unitList));
			criteria = criteria.createCriteria("study");
			criteria = criteria.createCriteria("patient");
			criteria = criteria.createCriteria("dataProvenance");
			if (authorizedSites != null) {
				setAuthorizedSiteData(criteria, authorizedSites);
			}

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
			criteria.add(Restrictions.in("seriesInstanceUID", unitList));
			criteria.add(Restrictions.in("visibility", new String[] { "1", "12" }));
			criteria = criteria.createCriteria("study");
			criteria = criteria.createCriteria("patient");
			criteria = criteria.createCriteria("dataProvenance");
			if (authorizedSites != null) {
				setAuthorizedSiteData(criteria, authorizedSites);
			}

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

	private static String SQL_QUERY_SELECT = "SELECT series.id, patient.patientId, study.studyInstanceUID, series.seriesInstanceUID, study.id, series.imageCount, series.totalSize, dp.project, series.annotationsFlag, series.annotationTotalSize, series.seriesNumber, series.seriesDesc, series.modality, series.patientPkId ";
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
		criteria.add(Restrictions.in("visibility", new String[] { "1" }));
		criteria = criteria.createCriteria("study");
		criteria.add(Restrictions.in("studyInstanceUID", studyIDs));
		criteria = criteria.createCriteria("patient");
		criteria = criteria.createCriteria("dataProvenance");
		setAuthorizedSiteData(criteria, authorizedSites);

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
		criteria.add(Restrictions.in("patientId", patientIDs));
		// criteria.add(Restrictions.eq("visibility", "1"));
		criteria.add(Restrictions.in("visibility", new String[] { "1" }));
		criteria = criteria.createCriteria("study");
		criteria = criteria.createCriteria("patient");
		criteria = criteria.createCriteria("dataProvenance");
		setAuthorizedSiteData(criteria, authorizedSites);

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
				sd.setDataProvenanceSiteName(gs.getStudy().getPatient().getDataProvenance().getDpSiteName());
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
			con.add(Restrictions.eq("dpSiteName", sd.getSiteName()));
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

		System.out.println(
				"===== In nbia-dao, GeneralSeriesDAOImpl:getRequestedProjectAndSite() - downloadable visibility - criteria.add(Restrictions.in('visibility', new String[] {'1'})) ");

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
}
