/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.criteriahandler.CriteriaHandler;
import gov.nih.nci.nbia.criteriahandler.CriteriaHandlerFactory;
import gov.nih.nci.nbia.dto.CriteriaValuesForPatientDTO;
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;
import gov.nih.nci.nbia.dto.CriteriaValuesDTO;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.searchresult.ExtendedPatientSearchResult;
import gov.nih.nci.nbia.util.HqlUtils;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;
import gov.nih.nci.ncia.criteria.CollectionCriteria;
import gov.nih.nci.ncia.criteria.ExtendedSearchResultCriteria;
import gov.nih.nci.ncia.criteria.PatientCriteria;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public class ValueAndCountDAOImpl extends AbstractDAO
                                   implements ValueAndCountDAO {
	public static final String AND = "AND ";
	public static final String OR = "OR ";
	public static final String OPEN_PARENTHESIS = " ( ";
	public static final String CLOSE_PARENTHESIS = " ) ";
	private static final String COLLECTION_FIELD = "dp.project ";
	private static final String SITE_FIELD = "dp.dp_site_name ";
    public static final String PATIENT_ID = "p.patientId ";
	private final static String COLLECTION_QUERY="select project, count(*) thecount from patient p, trial_data_provenance dp where p.trial_dp_pk_id=dp.trial_dp_pk_id ";
	private final static String MODALITY_QUERY="select modality, count(distinct p.patient_pk_id) thecount from patient p, trial_data_provenance dp, general_series gs"
			+ " where p.trial_dp_pk_id=dp.trial_dp_pk_id and gs.patient_pk_id=p.patient_pk_id ";
	private final static String BODYPART_QUERY="select body_part_examined, count(distinct p.patient_pk_id) thecount from patient p, trial_data_provenance dp, general_series gs"
			+ " where p.trial_dp_pk_id=dp.trial_dp_pk_id and gs.patient_pk_id=p.patient_pk_id ";
	private final static String MANUFACTURER_QUERY="select manufacturer, count(distinct p.patient_pk_id) thecount from patient p, trial_data_provenance dp, general_series gs, general_equipment ge"
			+ " where p.trial_dp_pk_id=dp.trial_dp_pk_id and gs.patient_pk_id=p.patient_pk_id and gs.general_equipment_pk_id=ge.general_equipment_pk_id ";
	private final static String EXTENDED_QUERY="select patient_pk_id, count(distinct image_pk_id) imageCount, sum(dicom_size) disksize from general_image gi ";
	
	static Logger log = Logger.getLogger(ValueAndCountDAOImpl.class);
	


	@Transactional(propagation=Propagation.REQUIRED)
	public List<ValuesAndCountsDTO> getValuesAndCounts(ValuesAndCountsCriteria criteria) throws DataAccessException{
        if (criteria.getObjectType().equalsIgnoreCase("COLLECTION"))
        {
        	return collectionQuery(criteria);
        }
        if (criteria.getObjectType().equalsIgnoreCase("MODALITY"))
        {
        	return modalityQuery(criteria);
        }
        if (criteria.getObjectType().equalsIgnoreCase("BODYPART"))
        {
        	return bodyPartQuery(criteria);
        }
        if (criteria.getObjectType().equalsIgnoreCase("MANUFACTURER"))
        {
        	return manufacturerQuery(criteria);
        }
        return null;
	}
    private List<ValuesAndCountsDTO> collectionQuery(ValuesAndCountsCriteria criteria){
    	List<ValuesAndCountsDTO> returnValue=new ArrayList<ValuesAndCountsDTO>();
        String SQLQuery = COLLECTION_QUERY+processAuthorizationSites(criteria.getAuth());
        SQLQuery=SQLQuery+" group by project ";
		List<Object[]> data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
        .list();		
        for(Object[] row : data)
        {

           ValuesAndCountsDTO item=new ValuesAndCountsDTO();
           item.setCriteria(row[0].toString());
           item.setCount(row[1].toString());
           returnValue.add(item);
        }
		return returnValue;
    }
    private List<ValuesAndCountsDTO> modalityQuery(ValuesAndCountsCriteria criteria){
    	List<ValuesAndCountsDTO> returnValue=new ArrayList<ValuesAndCountsDTO>();
        String SQLQuery = MODALITY_QUERY+processAuthorizationSites(criteria.getAuth());
        
		if (criteria.getCollection() != null) {
			SQLQuery=SQLQuery+" and dp.project=:project";
		}
		if (criteria.getBodyPart() != null) {
			SQLQuery=SQLQuery+" and gs.body_part_examined=:bodyPartExamined";
		}
		SQLQuery = SQLQuery+" group by modality";
		Query query = this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery);
		if (criteria.getCollection() != null) {
			query.setParameter("project", criteria.getCollection());
		}
		if (criteria.getBodyPart() != null) {
			query.setParameter("bodyPartExamined", criteria.getBodyPart());
		}
		List<Object[]> data= query.list();		
        for(Object[] row : data)
        {

           ValuesAndCountsDTO item=new ValuesAndCountsDTO();
           item.setCriteria(row[0].toString());
           item.setCount(row[1].toString());
           returnValue.add(item);
        }
		return returnValue;
    }
    private List<ValuesAndCountsDTO> bodyPartQuery(ValuesAndCountsCriteria criteria){
    	List<ValuesAndCountsDTO> returnValue=new ArrayList<ValuesAndCountsDTO>();
        String SQLQuery = BODYPART_QUERY+processAuthorizationSites(criteria.getAuth());
        
		if (criteria.getCollection() != null) {
			SQLQuery=SQLQuery+" and dp.project=:project";
		}
		if (criteria.getModality() != null) {
			SQLQuery=SQLQuery+" and gs.modality=:modality";
		}
		SQLQuery = SQLQuery+" group by body_part_examined";
		Query query = this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery);
		if (criteria.getCollection() != null) {
			query.setParameter("project", criteria.getCollection());
		}
		if (criteria.getModality() != null) {
			query.setParameter("modality", criteria.getModality());
		}
		List<Object[]> data= query.list();		
        for(Object[] row : data)
        {

           ValuesAndCountsDTO item=new ValuesAndCountsDTO();
           item.setCriteria(row[0].toString());
           item.setCount(row[1].toString());
           returnValue.add(item);
        }
		return returnValue;
    }
    private List<ValuesAndCountsDTO> manufacturerQuery(ValuesAndCountsCriteria criteria){
    	List<ValuesAndCountsDTO> returnValue=new ArrayList<ValuesAndCountsDTO>();
        String SQLQuery = MANUFACTURER_QUERY+processAuthorizationSites(criteria.getAuth());
        
		if (criteria.getCollection() != null) {
			SQLQuery=SQLQuery+" and dp.project=:project";
		}
		if (criteria.getModality() != null) {
			SQLQuery=SQLQuery+" and gs.modality=:modality";
		}
		if (criteria.getBodyPart() != null) {
			SQLQuery=SQLQuery+" and gs.body_part_examined=:bodyPartExamined";
		}
		SQLQuery = SQLQuery+" group by manufacturer";
		Query query = this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery);
		if (criteria.getCollection() != null) {
			query.setParameter("project", criteria.getCollection());
		}
		if (criteria.getModality() != null) {
			query.setParameter("modality", criteria.getModality());
		}
		if (criteria.getBodyPart() != null) {
			query.setParameter("bodyPartExamined", criteria.getBodyPart());
		}
		List<Object[]> data= query.list();		
        for(Object[] row : data)
        {
           ValuesAndCountsDTO item=new ValuesAndCountsDTO();
           if (row[0]!=null){
              item.setCriteria(row[0].toString());
           }   else {
        	  item.setCriteria("");
           }
           item.setCount(row[1].toString());
           returnValue.add(item);
        }
		return returnValue;
    }
   @Transactional
   public List<CriteriaValuesForPatientDTO> patientQuery(ValuesAndCountsCriteria criteria) throws DataAccessException{
    	List<CriteriaValuesForPatientDTO> returnValue=new ArrayList<CriteriaValuesForPatientDTO>();
    	PatientCriteria pc=criteria.getPatientCriteria();
    	CriteriaHandlerFactory handlerFac = CriteriaHandlerFactory.getInstance();
    	String whereStatement="";
    	try {
			whereStatement=processPatientCriteria(pc,handlerFac);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	// Collections
        String SQLQuery = COLLECTION_QUERY+processAuthorizationSites(criteria.getAuth());
        SQLQuery=SQLQuery+whereStatement+" group by project ";
		List<Object[]> data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
        .list();	
        CriteriaValuesForPatientDTO item=new CriteriaValuesForPatientDTO();
        item.setCriteria("Collections");
        List<CriteriaValuesDTO> values=new ArrayList<CriteriaValuesDTO>();
        for(Object[] row : data)
        {
           CriteriaValuesDTO value=new CriteriaValuesDTO();
           value.setCriteria(row[0].toString());
           value.setCount(row[1].toString());
           values.add(value);
        }
        if (values.size()>0)
        {
           item.setValues(values);
           returnValue.add(item);
        }  
        
        //Modality        
        SQLQuery = MODALITY_QUERY+processAuthorizationSites(criteria.getAuth());
        SQLQuery=SQLQuery+whereStatement+" group by modality ";
		data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
        .list();	
        item=new CriteriaValuesForPatientDTO();
        item.setCriteria("Image Modality");
        values=new ArrayList<CriteriaValuesDTO>();
        for(Object[] row : data)
        {
           CriteriaValuesDTO value=new CriteriaValuesDTO();
           value.setCriteria(row[0].toString());
           value.setCount(row[1].toString());
           values.add(value);
        }
        if (values.size()>0)
        {
           item.setValues(values);
           returnValue.add(item);
        }  
        
        //bodyPart        
        SQLQuery = BODYPART_QUERY+processAuthorizationSites(criteria.getAuth());
        SQLQuery=SQLQuery+whereStatement+" group by body_part_examined ";
		data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
        .list();	
        item=new CriteriaValuesForPatientDTO();
        item.setCriteria("Anatomical Site");
        values=new ArrayList<CriteriaValuesDTO>();
        for(Object[] row : data)
        {
           CriteriaValuesDTO value=new CriteriaValuesDTO();
           if (row[0]==null){
        	   value.setCriteria("");
           } else {
              value.setCriteria(row[0].toString());
           }
           value.setCount(row[1].toString());
           values.add(value);
        }
        if (values.size()>0)
        {
           item.setValues(values);
           returnValue.add(item);
        }  
        //Manufacturer        
        SQLQuery = MANUFACTURER_QUERY+processAuthorizationSites(criteria.getAuth());
        SQLQuery=SQLQuery+whereStatement+" group by manufacturer ";
		data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
        .list();	
        item=new CriteriaValuesForPatientDTO();
        item.setCriteria("Manufacturer");
        values=new ArrayList<CriteriaValuesDTO>();
        for(Object[] row : data)
        {
           CriteriaValuesDTO value=new CriteriaValuesDTO();
           if (row[0]==null){
        	   value.setCriteria("");
           } else {
              value.setCriteria(row[0].toString());
           }
           value.setCount(row[1].toString());
           values.add(value);
        }
        if (values.size()>0)
        {
           item.setValues(values);
           returnValue.add(item);
        }  
        
		return returnValue;
    }
    private static String processAuthorizationSites(AuthorizationCriteria authCrit)  {
   

        if (authCrit.getSites().isEmpty()) {
            // User is not allowed to view any sites.
            // Since all data has a site, user is not allowed to see anything
            // Return empty list
            //logger.info("No results returned because user does not have access to any sites");

            return null;
        }
        else {
            // Build HQL for sites
        	String whereStmt = "";
            whereStmt += (AND + OPEN_PARENTHESIS);

            boolean first = true;

            // For each site, need to include both collection and site
            // since site names can be duplicated across collections
            for (SiteData siteData : authCrit.getSites()) {
                if (!first) {
                    whereStmt += OR;
                }

                whereStmt += "(";
                whereStmt += COLLECTION_FIELD;
                whereStmt += " = '";
                whereStmt += siteData.getCollection();
                whereStmt += ("' " + AND);
                whereStmt += SITE_FIELD;
                whereStmt += " = '";
                whereStmt += siteData.getSiteName();
                whereStmt += "') ";
                first = false;
            }

            whereStmt += CLOSE_PARENTHESIS;
            return whereStmt;
        }
    }
    private static String processPatientCriteria(PatientCriteria pc,
			 CriteriaHandlerFactory theHandlerFac) throws Exception {

              CriteriaHandler handler = null;

              String patientWhereStmt = "";
              if (pc != null) {

                 handler = theHandlerFac.createCriteriaCollection();
                 patientWhereStmt += (AND + handler.handle(PATIENT_ID, pc));
             }
             
              patientWhereStmt=patientWhereStmt.replace("p.patientId", "p.patient_id");
             return patientWhereStmt;
    }
    @Transactional
    public Map<String, ExtendedPatientSearchResult> extendedQuery(ExtendedSearchResultCriteria criteria) throws DataAccessException{
    	Map<String, ExtendedPatientSearchResult> returnValue=new HashMap();
        PatientCriteria pcriteria=new PatientCriteria();
        for (String item:criteria.getSeriesIds())
        {
        	pcriteria.setCollectionValue(item);
        }
        CriteriaHandlerFactory handlerFac = CriteriaHandlerFactory.getInstance();
    	String whereStatement="";
    	try {
			whereStatement=processPatientCriteria(pcriteria,handlerFac);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	whereStatement=" where general_series_pk_id "+whereStatement.substring(19);
    	if (whereStatement.length()<2) return returnValue;
    	String SQLQuery = EXTENDED_QUERY+whereStatement+" group by patient_id ";
    	List<Object[]> data= this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
    	        .list();
    	
        for(Object[] row : data)
        {
           String patientId=row[0].toString();
           ExtendedPatientSearchResult item = new ExtendedPatientSearchResult();
           item.setDiskSpace(new Long((long)Double.parseDouble(row[2].toString())));
           item.setImageCount(new Long((long)Double.parseDouble(row[1].toString())));;
           returnValue.put(patientId, item);
        }
    	return returnValue;
    }

}
