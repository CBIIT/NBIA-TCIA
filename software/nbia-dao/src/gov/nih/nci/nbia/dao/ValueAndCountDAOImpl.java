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
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;
import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.util.HqlUtils;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;
import gov.nih.nci.ncia.criteria.CollectionCriteria;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
	private final static String COLLECTION_QUERY="select project, count(*) thecount from patient p, trial_data_provenance dp where p.trial_dp_pk_id=dp.trial_dp_pk_id ";
	private final static String MODALITY_QUERY="select modality, count(distinct p.patient_pk_id) thecount from patient p, trial_data_provenance dp, general_series gs"
			+ " where p.trial_dp_pk_id=dp.trial_dp_pk_id and gs.patient_pk_id=p.patient_pk_id ";
	private final static String BODYPART_QUERY="select body_part_examined, count(distinct p.patient_pk_id) thecount from patient p, trial_data_provenance dp, general_series gs"
			+ " where p.trial_dp_pk_id=dp.trial_dp_pk_id and gs.patient_pk_id=p.patient_pk_id ";
	private final static String MANUFACTURER_QUERY="select manufacturer, count(distinct p.patient_pk_id) thecount from patient p, trial_data_provenance dp, general_series gs, general_equipment ge"
			+ " where p.trial_dp_pk_id=dp.trial_dp_pk_id and gs.patient_pk_id=p.patient_pk_id and gs.general_equipment_pk_id=ge.general_equipment_pk_id ";
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
	

}
