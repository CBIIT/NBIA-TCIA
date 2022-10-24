/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import gov.nih.nci.nbia.dto.LicenseDTO;
import gov.nih.nci.nbia.internaldomain.CollectionDesc;
import gov.nih.nci.nbia.internaldomain.License;

/**
 * handle query for License feature
 * @author lethai
 *
 */
public class LicenseDAOImpl extends AbstractDAO
                                   implements LicenseDAO {
	@Transactional(propagation=Propagation.REQUIRED)
	
	public List<LicenseDTO> findLicenses() throws DataAccessException{
        List <LicenseDTO> returnValue = new ArrayList  <LicenseDTO> ();
        DetachedCriteria criteria = DetachedCriteria.forClass(License.class);
        List<License> licenses = getHibernateTemplate().findByCriteria(criteria);
        for (License license:licenses) {
        	returnValue.add(new LicenseDTO(license));
        }
		return returnValue;
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public void save(LicenseDTO license) throws DataAccessException {

		getHibernateTemplate().saveOrUpdate(license.theLicense());
		setExcludeCommercialForSeries(license);
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public String deleteLicense(Integer id) {
		String returnValue=null;
        DetachedCriteria criteria2 = DetachedCriteria.forClass(License.class);
        criteria2.add(Restrictions.eq("id", id));
        List<License> licenses = getHibernateTemplate().findByCriteria(criteria2);
        License licenseToDelete = null;
        for (License license:licenses) {
        	licenseToDelete=license;
        }
        if (licenseToDelete==null) {
        	return "No license with id="+id;
        }
        DetachedCriteria criteria = DetachedCriteria.forClass(CollectionDesc.class);
        criteria.add(Restrictions.eq("license", licenseToDelete));
        int i=0;
        List<CollectionDesc> collectionDescList = getHibernateTemplate().findByCriteria(criteria);
        for (CollectionDesc colDes : collectionDescList) {
        	if (i==0) {
        		returnValue="";
        		i++;
        	} else {
        		returnValue=returnValue+", ";
        	}
        	returnValue=returnValue+colDes.getCollectionName();
        }
        if (returnValue!=null) {
        	return returnValue;
        }
        
        getHibernateTemplate().delete(licenseToDelete);;

        
		return returnValue;
	}
	@Transactional(propagation=Propagation.REQUIRED)
	private void setExcludeCommercialForSeries(LicenseDTO license)  {
		String excludeCommercial="YES";
       if (license.getCommercialUse()==null||license.getCommercialUse().equalsIgnoreCase("YES")) {
    	   excludeCommercial="NO";
       }
		String queryString = "update GeneralSeries s set excludeCommercial='"+excludeCommercial+
				"'licenseURL='"+license.getLicenseURL()+
				"' where licenseName='"+license.getLongName()+"'";
        Query query = getHibernateTemplate().getSessionFactory().getCurrentSession().createQuery(queryString);
        int count = query.executeUpdate();

	} 

}
