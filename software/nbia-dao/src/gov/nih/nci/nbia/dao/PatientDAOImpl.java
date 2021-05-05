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
import java.util.ArrayList;
import java.text.ParseException;
import java.text.SimpleDateFormat;  
import java.util.Date; 

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
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
		whereCondition.append(date1 == null ? "":" and gs.maxSubmissionTimestamp>?");
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
}
