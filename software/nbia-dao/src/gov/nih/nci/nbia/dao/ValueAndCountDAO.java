/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import java.util.List;

import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;
import gov.nih.nci.nbia.dto.CriteriaValuesForPatientDTO;
import gov.nih.nci.ncia.criteria.ValuesAndCountsCriteria;




import org.springframework.dao.DataAccessException;

public interface ValueAndCountDAO {
	 

	public List<ValuesAndCountsDTO> getValuesAndCounts(ValuesAndCountsCriteria criteria) throws DataAccessException;
	public List<CriteriaValuesForPatientDTO> patientQuery(ValuesAndCountsCriteria criteria) throws DataAccessException;
		

}
