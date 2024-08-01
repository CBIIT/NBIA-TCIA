/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
 *
 */
package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.ImageDTO2;
import gov.nih.nci.nbia.internaldomain.GeneralImage;
import gov.nih.nci.nbia.internaldomain.TrialDataProvenance;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author lethai
 *
 */
public class InstanceDAOImpl extends AbstractDAO
                          implements InstanceDAO {
	private static Logger logger = LogManager.getLogger(ImageDAO2.class);

	/**
	 * Fetch set of  image objects filtered by project, ie. collection, patientId and studyInstanceUid
	 * This method is used for NBIA Rest API.
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<Object[]> getImages(String sOPInstanceUID, String patientId, String studyInstanceUid, String seriesInstanceUid, List<String> authorizedProjAndSites) throws DataAccessException {
		StringBuffer where = new StringBuffer();
		List<Object[]> rs = null;
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}
		String hql = "select i.SOPInstanceUID, i.instanceNumber, i.SOPClassUID, i.usFrameNum, i.rows " +
		" from GeneralImage i where i.SOPInstanceUID is not null ";

		List<String> paramList = new ArrayList<String>();
		int i = 0;

		if (sOPInstanceUID != null) {
			where = where.append(" and i.SOPInstanceUID=?");
			paramList.add(sOPInstanceUID);
			++i;
		}
		if (patientId != null&&patientId.length()>0) {
			where = where.append(" and i.patientId=?");
			paramList.add(patientId.toUpperCase());
			++i;
		}
		if (studyInstanceUid != null) {
			where = where.append(" and i.studyInstanceUID=?");
			paramList.add(studyInstanceUid.toUpperCase());
			++i;
		}
		if (seriesInstanceUid != null) {
			where = where.append(" and i.seriesInstanceUID=?");
			paramList.add(seriesInstanceUid.toUpperCase());
			++i;
		}
	//	where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		if (i > 0) {
			Object[] values = paramList.toArray(new Object[paramList.size()]);
			rs = getHibernateTemplate().find(hql + where.toString(), values);
		} else
			rs = getHibernateTemplate().find(hql + where.toString());

		return rs;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public List<String> getImages(String seriesInstanceUid, List<String> authorizedProjAndSites) throws DataAccessException {
		StringBuffer where = new StringBuffer();
		List<String> rs = null;
		
		if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
		}		
		String hql = "select gi.SOPInstanceUID " +
		" from GeneralSeries s join s.generalImageCollection gi where "
		+ " gi.SOPInstanceUID is not null ";

		List<String> paramList = new ArrayList<String>();
		int i = 0;

		if (seriesInstanceUid != null) {
			where = where.append(" and gi.seriesInstanceUID=?");
			paramList.add(seriesInstanceUid.toUpperCase());
			++i;
		}
		where.append(addAuthorizedProjAndSites(authorizedProjAndSites));

		if (i > 0) {
			Object[] values = paramList.toArray(new Object[paramList.size()]);
			rs = getHibernateTemplate().find(hql + where.toString(), values);
		} else
			rs = getHibernateTemplate().find(hql + where.toString());

		return rs;
	}
	private StringBuffer addAuthorizedProjAndSites(List<String> authorizedProjAndSites) {
		StringBuffer where = new StringBuffer();

		if ((authorizedProjAndSites != null) && (!authorizedProjAndSites.isEmpty())){
			where = where.append(" and s.projAndSite in (");

			for (Iterator<String> projAndSites =  authorizedProjAndSites.iterator(); projAndSites .hasNext();) {
	    		String str = projAndSites.next();
	            where.append (str);

	            if (projAndSites.hasNext()) {
	            	where.append(",");
	            }
	        }
			where.append(")");
		}
		System.out.println("&&&&&&&&&&&& where clause for project and group=" + where.toString());
		return where;
	}
}
