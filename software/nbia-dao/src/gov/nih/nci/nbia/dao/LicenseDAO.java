/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.LicenseDTO;

import java.util.List;

import org.springframework.dao.DataAccessException;

/**
 * handle query for Editing cLicense feature
 * @author lethai
 *
 */
public interface LicenseDAO  {
	/**
	 * retrieve list of License
	 */
	public List<LicenseDTO> findLicenses() throws DataAccessException;
	
	public void save(LicenseDTO license) throws DataAccessException;
}
