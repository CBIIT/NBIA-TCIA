/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.internaldomain.GUIActionHistory;

import java.util.Date;

import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


public class GUIActionDAOImpl extends AbstractDAO
                                 implements GUIActionDAO  {

	@Transactional(propagation=Propagation.REQUIRED)
    public void record(String action)throws DataAccessException{

		GUIActionHistory actionHistory = new GUIActionHistory();
    	actionHistory.setAction(action);
    	actionHistory.setActionTimestamp(new Date());


    	getHibernateTemplate().save(actionHistory);
    }

}