/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.PatientDTO;
import gov.nih.nci.nbia.internaldomain.Patient;
import gov.nih.nci.nbia.internaldomain.Site;
import gov.nih.nci.nbia.util.SiteData;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Arrays;
import java.text.ParseException;
import java.text.SimpleDateFormat;  
import java.util.Date;
import java.util.HashMap;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public class PatientDAOImpl extends AbstractDAO
                            implements PatientDAO {

	/**
	 * Fetch Patient Object through patient PK ID
	 * @param pid patient PK id
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public PatientDTO getPatientById(Integer pid) throws DataAccessException
	{
		PatientDTO pDto = null;

        DetachedCriteria criteria = DetachedCriteria.forClass(Patient.class);
		criteria.add(Restrictions.eq("id", pid));

		List<Patient> result = getHibernateTemplate().findByCriteria(criteria);
		if (result != null && result.size() > 0)
		{
			Patient patient = result.get(0);
			pDto = new PatientDTO();
			pDto.setProject(patient.getDataProvenance().getProject());
			List<String> siteList=new ArrayList<String>();
			if (patient.getDataProvenance().getSiteCollection()!=null) {
				for (Site site : patient.getDataProvenance().getSiteCollection()) {
					siteList.add(site.getDpSiteName());
				} 
			}
			pDto.setSiteNames(siteList);
		}

		return pDto;
	}
	
	/**
	 * Fetch Patient Object through patient ID
	 * @param pid patient id
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public PatientDTO getPatientByPatientId(String pid) throws DataAccessException
	{
		PatientDTO pDto = null;

        DetachedCriteria criteria = DetachedCriteria.forClass(Patient.class);
		criteria.add(Restrictions.eq("patientId", pid));

		List<Patient> result = getHibernateTemplate().findByCriteria(criteria);
		if (result != null && result.size() > 0)
		{
			Patient patient = result.get(0);
			pDto = new PatientDTO();
			pDto.setProject(patient.getDataProvenance().getProject());
			List<String> siteList=new ArrayList<String>();
			if (patient.getDataProvenance().getSiteCollection()!=null) {
				for (Site site : patient.getDataProvenance().getSiteCollection()) {
					siteList.add(site.getDpSiteName());
				} 
			}
			pDto.setSiteNames(siteList);
		}

		return pDto;
	}	

	/**
	 * Fetch Patient Object through project, ie. collection
	 * This method is used for NBIA Rest API.
	 * @param collection A label used to name a set of images collected for a specific trial or other reason.
	 * Assigned during the process of curating the data. The info is kept under project column
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollectionAndId_v4(String collection, String patientId, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer where = new StringBuffer();
				
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

    Map<String, Object> params = new HashMap<>();

    if (collection != null) {
      where = where.append(" and UPPER(gs.project) = :project");
      params.put("project", collection.toUpperCase());
    }

		String sql = "select distinct p.patient_id, p.patient_name, date_format(p.patient_birth_date, '%m-%d-%Y'), p.patient_sex, p.ethnic_group, gs.project, p.qc_subject, p.species_code, p.species_description, " + addAuthorizedProjAndSitesCaseStatement(authorizedProjAndSites) + " from patient as p, general_series as gs " +
				" where gs.visibility in ('1') and p.patient_id = :patientId and p.patient_pk_id = gs.patient_pk_id "+ where;
    params.put("patientId", patientId);
				
    System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollectionAndId_v4() - downloadable visibility - sql is: " + sql);

    // Create the query and set parameters in one go
    Query query = this.getHibernateTemplate()
        .getSessionFactory()
        .getCurrentSession()
        .createSQLQuery(sql)
        .setProperties(params);

    List<Object[]> rs = query.list();


    fillInHuman(rs);
    return rs;
	}


	/**
	 * Fetch Patient Object through project, ie. collection
	 * This method is used for NBIA Rest API.
	 * @param collection A label used to name a set of images collected for a specific trial or other reason.
	 * Assigned during the process of curating the data. The info is kept under project column
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollectionAndId(String collection, String patientId, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer whereCondition = new StringBuffer();
				
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

		whereCondition.append(collection == null ? "":" and UPPER(gs.project)=?");
		whereCondition.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		String hql = "select distinct p.patientId, p.patientName, p.patientBirthDate, p.patientSex, p.ethnicGroup, gs.project, p.qcSubject, p.speciesCode, p.species from Patient as p, GeneralSeries as gs " +
				" where gs.visibility in ('1') and p.patientId = ? and p.id = gs.patientPkId "+ whereCondition;
		List<Object[]> rs = collection == null ?
				getHibernateTemplate().find(hql, patientId.toUpperCase()) : 
				getHibernateTemplate().find(hql, patientId.toUpperCase(), collection.toUpperCase()); 
				
      System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollection() - downloadable visibility - hql is: " + hql);
	    fillInHuman(rs);
        return rs;
	}

	/**
	 * Fetch Patient Object through project, ie. collection
	 * This method is used for NBIA Rest API.
	 * @param collection A label used to name a set of images collected for a specific trial or other reason.
	 * Assigned during the process of curating the data. The info is kept under project column
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollection_v4(String collection, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer where = new StringBuffer();
				
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

    Map<String, Object> params = new HashMap<>();

    if (collection != null) {
      where = where.append(" and UPPER(gs.project) = :project");
      params.put("project", collection.toUpperCase());
    }


		String sql = "select distinct p.patient_id, p.patient_name, date_format(p.patient_birth_date, '%m-%d-%Y'), p.patient_sex, p.ethnic_group, gs.project, p.qc_subject, p.species_code, p.species_description, " + addAuthorizedProjAndSitesCaseStatement(authorizedProjAndSites) + " from patient as p, general_series as gs " +
				" where gs.visibility in ('1') and p.patient_pk_id = gs.patient_pk_id "+ where;
				
	System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollection_v4() - downloadable visibility - sql is: " + sql);				

    // Create the query and set parameters in one go
    Query query = this.getHibernateTemplate()
        .getSessionFactory()
        .getCurrentSession()
        .createSQLQuery(sql)
        .setProperties(params);

    List<Object[]> rs = query.list();

  	fillInHuman(rs);
    return rs;
	}

	/**
	 * Fetch Patient Object through project, ie. collection
	 * This method is used for NBIA Rest API.
	 * @param collection A label used to name a set of images collected for a specific trial or other reason.
	 * Assigned during the process of curating the data. The info is kept under project column
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollection(String collection, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer whereCondition = new StringBuffer();
				
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

		whereCondition.append(collection == null ? "":" and UPPER(gs.project)=?");
		whereCondition.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		String hql = "select distinct p.patientId, p.patientName, p.patientBirthDate, p.patientSex, p.ethnicGroup, gs.project, p.qcSubject, p.speciesCode, p.species from Patient as p, GeneralSeries as gs " +
				" where gs.visibility in ('1') and p.id = gs.patientPkId "+ whereCondition;
		List<Object[]> rs = collection == null ?
				getHibernateTemplate().find(hql):
				getHibernateTemplate().find(hql, collection.toUpperCase()); // protect against sql injection
				
	System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollection() - downloadable visibility - hql is: " + hql);				
	    fillInHuman(rs);
        return rs;
	}

	/**
	 * Fetch Patient Object through series,
	 * This method is used for NBIA Rest API.
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientBySeries(String series, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer whereCondition = new StringBuffer();
				
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

		whereCondition.append(series == null ? "":" and UPPER(gs.seriesInstanceUID)=?");
		whereCondition.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		String hql = "select distinct p.patientId, p.patientName, p.patientBirthDate, p.patientSex, p.ethnicGroup, gs.project, p.qcSubject, p.speciesCode, p.species from Patient as p, GeneralSeries as gs " +
				" where gs.visibility in ('1') and p.id = gs.patientPkId "+ whereCondition;
		List<Object[]> rs = series == null ?
				getHibernateTemplate().find(hql):
				getHibernateTemplate().find(hql, series.toUpperCase()); // protect against sql injection
				
	System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientBySeries() - downloadable visibility - hql is: " + hql);				
	    fillInHuman(rs);
        return rs;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollection_v4(String collection, String dateFrom, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer where = new StringBuffer();
    Map<String, Object> params = new HashMap<>();
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

    if (collection != null) {
      where = where.append(" and UPPER(gs.project) = :project");
      params.put("project", collection.toUpperCase());
    }
    if (dateFrom != null) {
      where = where.append(" and gs.date_released >= str_to_date(:dateFrom, '%m-%d-%Y')");
      params.put("dateFrom", dateFrom);
    }

		String sql = "select distinct p.patient_id, p.patient_name, date_format(p.patient_birth_date, '%m-%d-%Y'), p.patient_sex, p.ethnic_group, gs.project, p.qc_subject, p.species_code, p.species_description, " + addAuthorizedProjAndSitesCaseStatement(authorizedProjAndSites) + " from patient as p, general_series as gs " +
				" where gs.visibility in ('1') and p.patient_pk_id = gs.patient_pk_id "+ where;
				
	System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollection_v4() - downloadable visibility - sql is: " + sql);				

    // Create the query and set parameters in one go
    Query query = this.getHibernateTemplate()
        .getSessionFactory()
        .getCurrentSession()
        .createSQLQuery(sql)
        .setProperties(params);

    List<Object[]> rs = query.list();


	  fillInHuman(rs);
    return rs;
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollection(String collection, String dateFrom, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer whereCondition = new StringBuffer();
		Date date1=null;
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}
		try {
			date1=new SimpleDateFormat("yyyy/MM/dd").parse(dateFrom);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}  
		whereCondition.append(collection == null ? "":" and UPPER(gs.project)=?");
		whereCondition.append(date1 == null ? "":" and gs.dateReleased>?");
		whereCondition.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		String hql = "select distinct p.patientId, p.patientName, p.patientBirthDate, p.patientSex, p.ethnicGroup, gs.project, p.qcSubject, p.speciesCode, p.species from Patient as p, GeneralSeries as gs " +
				" where gs.visibility in ('1') and p.id = gs.patientPkId "+ whereCondition;
		List<Object[]> rs = collection == null ?
				getHibernateTemplate().find(hql):
				getHibernateTemplate().find(hql, collection.toUpperCase(), date1); // protect against sql injection
				
	System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollection() - downloadable visibility - hql is: " + hql);				
	    fillInHuman(rs);
        return rs;
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollectionAndModality_v4(String collection, String modality, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer where = new StringBuffer();
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}
    Map<String, Object> params = new HashMap<>();

    if (collection != null) {
      where = where.append(" and UPPER(gs.project) = :project");
      params.put("project", collection.toUpperCase());
    }
    if (modality != null) {
      where = where.append(" and UPPER(gs.modality) = :modality");
      params.put("modality", modality.toUpperCase());
    }

		String sql = "select distinct p.patient_id, " 
      + addAuthorizedProjAndSitesCaseStatement(authorizedProjAndSites)
      + ", p.patient_name, date_format(p.patient_birth_date, '%m-%d-%Y'), p.patient_sex, p.ethnic_group, gs.project, p.qc_subject, p.species_code, p.species_description from patient as p, general_series as gs " +
				" where gs.visibility in ('1') and p.patient_pk_id = gs.patient_pk_id "+ where;
				
	System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollection_v4() - downloadable visibility - sql is: " + sql);				
    // Create the query and set parameters in one go
    Query query = this.getHibernateTemplate()
        .getSessionFactory()
        .getCurrentSession()
        .createSQLQuery(sql)
        .setProperties(params);

    List<Object[]> rs = query.list();
	  fillInHuman(rs);
    return rs;
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getPatientByCollectionAndModality(String collection, String modality, List<String> authorizedProjAndSites) throws DataAccessException
	{
		StringBuffer whereCondition = new StringBuffer();
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}

		whereCondition.append(collection == null ? "":" and UPPER(gs.project)=?");
		whereCondition.append(modality == null ? "":" and gs.modality=?");
		whereCondition.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		String hql = "select distinct p.patientId, p.patientName, p.patientBirthDate, p.patientSex, p.ethnicGroup, gs.project, p.qcSubject, p.speciesCode, p.species from Patient as p, GeneralSeries as gs " +
				" where gs.visibility in ('1') and p.id = gs.patientPkId "+ whereCondition;
		List<Object[]> rs = collection == null ?
				getHibernateTemplate().find(hql):
				getHibernateTemplate().find(hql, collection, modality); // protect against sql injection
				
	System.out.println("===== In nbia-dao, PatientDAOImpl:getPatientByCollection() - downloadable visibility - hql is: " + hql);				
	    fillInHuman(rs);
        return rs;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getCombinedDataBySeries_v4(String seriesInstanceUIDs, List<String> authorizedProjAndSites) throws DataAccessException {
    
		// Rather than pull all series if list is null, exits instead
		if (authorizedProjAndSites == null || authorizedProjAndSites.isEmpty() || seriesInstanceUIDs == null || seriesInstanceUIDs.isEmpty()) {
			return null;
		}
    String seriesString=seriesInstanceUIDs.replaceAll("[^0-9,\\.]","");

    String[] seriesStrings=seriesString.split(",");
    List<String> seriesList=Arrays.asList(seriesStrings);
    String queryString=constructSeriesUIDList(seriesList);

		StringBuffer whereCondition = new StringBuffer(" where gs.visibility in ('1')");
		whereCondition.append(" and UPPER(gs.series_instance_uid) in (" + queryString + ")");

		String sql = "select distinct " +
			"p.patient_id, p.patient_name, date_format(p.patient_birth_date, '%m-%d-%Y'), p.patient_sex, p.ethnic_group, p.qc_subject, p.species_code, p.species_description, " +
			"s.study_instance_uid, date_format(s.study_date, '%m-%d-%Y'), s.study_desc, s.admitting_diagnoses_desc, s.study_id, " +
			"s.patient_age, s.longitudinal_temporal_event_type, s.longitudinal_temporal_offset_from_event, " +
			"gs.series_instance_uid, gs.project, gs.modality, gs.protocol_name, date_format(gs.series_date, '%m-%d-%Y'), gs.series_desc, " +
			"gs.body_part_examined, gs.series_number, gs.annotations_flag, ge.manufacturer, " +
			"ge.manufacturer_model_name, " + 
			"gi.pixel_spacing, gi.slice_thickness, " +
			"ge.software_versions, (select count(*) from general_image gi where gi.general_series_pk_id = gs.general_series_pk_id) as image_count, " +
			"date_format(gs.max_submission_timestamp, '%m-%d-%Y'), gs.license_name, gs.license_url, gs.description_uri, (select sum(gi.dicom_size) from general_image gi where gi.general_series_pk_id = gs.general_series_pk_id) as total_size, " +
			"date_format(gs.date_released, '%m-%d-%Y'),  gs.third_party_analysis,  " +
      addAuthorizedProjAndSitesCaseStatement(authorizedProjAndSites) +
			"from general_series gs " +
			"join general_image gi on gi.general_series_pk_id = gs.general_series_pk_id " +
      "join general_equipment ge on gs.general_equipment_pk_id = ge.general_equipment_pk_id " +
			"join study s on s.study_pk_id = gs.study_pk_id " +
			"join patient  p on p.patient_pk_id = gs.patient_pk_id " +
			whereCondition.toString();

		System.out.println("Executing combined query: " + sql);
    
    // Create the query and set parameters in one go
    Query query = this.getHibernateTemplate()
        .getSessionFactory()
        .getCurrentSession()
        .createSQLQuery(sql);

    List<Object[]> results = query.list();

		for (Object[] patient:results) {
			
			if (patient[5]==null) patient[5]="NO";
			if (patient[6]==null) patient[6]="337915000";
			if (patient[7]==null) patient[7]="Homo sapiens";
		}
		return results;
	}

	public List<Object[]> getCombinedDataBySeries(String seriesInstanceUIDs, List<String> authorizedProjAndSites) throws DataAccessException {
    
		// Rather than pull all series if list is null, exits instead
		if (authorizedProjAndSites == null || authorizedProjAndSites.isEmpty() || seriesInstanceUIDs == null || seriesInstanceUIDs.isEmpty()) {
			return null;
		}
    String seriesString=seriesInstanceUIDs.replaceAll("[^0-9,\\.]","");

    String[] seriesStrings=seriesString.split(",");
    List<String> seriesList=Arrays.asList(seriesStrings);
    String queryString=constructSeriesUIDList(seriesList);

		StringBuffer whereCondition = new StringBuffer(" where gs.visibility in ('1')");
		whereCondition.append(" and UPPER(gs.seriesInstanceUID) in (" + queryString + ")");
		whereCondition.append(addAuthorizedProjAndSites(authorizedProjAndSites));   

		String hql = "select distinct " +
			"p.patientId, p.patientName, p.patientBirthDate, p.patientSex, p.ethnicGroup, p.qcSubject, p.speciesCode, p.species, " +
			"s.studyInstanceUID, s.studyDate, s.studyDesc, s.admittingDiagnosesDesc, s.studyId, " +
			"s.patientAge, s.longitudinalTemporalEventType, s.longitudinalTemporalOffsetFromEvent, " +
			"gs.seriesInstanceUID, gs.project, gs.modality, gs.protocolName, gs.seriesDate, gs.seriesDesc, " +
			"gs.bodyPartExamined, gs.seriesNumber, gs.annotationsFlag, gs.generalEquipment.manufacturer, " +
			"gs.generalEquipment.manufacturerModelName, " + 
			"gi.pixelSpacing, gi.sliceThickness, " +
			"gs.generalEquipment.softwareVersions, gs.imageCount, " +
			"gs.maxSubmissionTimestamp, gs.licenseName, gs.licenseURL, gs.descriptionURI, gs.totalSize, " +
			"gs.dateReleased,  gs.thirdPartyAnalysis " +
			"from GeneralSeries gs " +
			"join gs.generalImageCollection gi " +
			"join gs.study s " +
			"join s.patient  p " +
			whereCondition.toString();

		System.out.println("Executing combined query: " + hql);
    System.out.println(whereCondition.toString());

		List<Object[]> results = getHibernateTemplate().find(hql);
		for (Object[] patient:results) {
			
			if (patient[5]==null) patient[5]="NO";
			if (patient[6]==null) patient[6]="337915000";
			if (patient[7]==null) patient[7]="Homo sapiens";
		}
		results.forEach(System.out::println);
		return results;
	}
	/**
	 * Construct the partial where clause which contains checking with authorized project and site combinations.
	 *
	 * This method is used for NBIA Rest API filter.
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
	private void fillInHuman(List<Object[]> patients) {
		if (patients==null) return;
		for (Object[] patient:patients) {
			if (patient[6]==null) patient[6]="NO";
			if (patient[7]==null) patient[7]="337915000";
			if (patient[8]==null) patient[8]="Homo sapiens";
		}
		
	}

    /**
    * Given a collection of strings, return a Stirng that is a comma
    * separate list of the single-quoted integers, without a trailing comma
    */
   private static String constructSeriesUIDList(Collection<String> theSeriesPkIds) {
   	String theWhereStmt = "";
   	for (Iterator<String> i = theSeriesPkIds.iterator(); i.hasNext();) {
           String seriesPkId = i.next();
           theWhereStmt += ("'" + seriesPkId + "'");

           if (i.hasNext()) {
           	theWhereStmt += ",";
           }
       }
   	return theWhereStmt;
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
