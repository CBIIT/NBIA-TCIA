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

import org.hibernate.criterion.DetachedCriteria;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import gov.nih.nci.nbia.dto.LicenseDTO;
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

		getHibernateTemplate().saveOrUpdate(license.getLicense());
	}



}
