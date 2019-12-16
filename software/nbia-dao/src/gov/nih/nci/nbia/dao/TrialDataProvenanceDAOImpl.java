/**
 *
 */
package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.internaldomain.TrialDataProvenance;
import gov.nih.nci.nbia.util.SiteData;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author panq
 *
 */
public class TrialDataProvenanceDAOImpl extends AbstractDAO implements
		TrialDataProvenanceDAO {
	/**
	 * Fetch set of collection values.
	 *
	 * This method is used for NBIA Rest API.
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public List<String> getCollectionValues(List<String> authorizedProjAndSites) throws DataAccessException {
	// Actually the Rest API only need project. Added second project just
	// for using common util for format transferring.
	if (authorizedProjAndSites == null || authorizedProjAndSites.size() == 0){
			return null;
	}
	String hql = "select distinct(tdp.project) from TrialDataProvenance tdp " + addAuthorizedProjAndSites(authorizedProjAndSites);
	String orderBy = " order by upper(tdp.project)";
	List<String> rs = getHibernateTemplate().find(hql + orderBy);

	return rs;
}

	/**
	 * Fetch set of collection (ie. project) and site values.
	 *
	 * This method is used in User Authorization Tool.
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public List<String> getProjSiteValues() throws DataAccessException {
	// Actually the Rest API only need project. Added second project just
	// for using common util for format transferring.

	String hql = "select distinct(CONCAT(tdp.project, '//', tdp.dpSiteName)) from TrialDataProvenance tdp ";
	String orderBy = " order by CONCAT(tdp.project, '//', tdp.dpSiteName)";
	List<String> rs = getHibernateTemplate().find(hql + orderBy);

	return rs;
}
	
	/**
	 * Check if collection and site exist already.
	 *
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean hasExistingProjSite(String project, String site) throws DataAccessException {
	String hql = "select distinct(CONCAT(tdp.project, '//', tdp.dpSiteName)) from TrialDataProvenance tdp ";
	String where = " where tdp.project = '" + project +"' and tdp.dpSiteName = '" + site +"'";
	List<String> rs = getHibernateTemplate().find(hql + where);
	if ((rs != null) && (rs.size() == 1))
		return true;
	else return false;

}	
	
	/**
	 * Save a collection (ie. project) and site.
	 *
	 * This method is used in User Authorization Tool.
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public void setProjSiteValues(String project, String site) throws DataAccessException {
		TrialDataProvenance tdp = new TrialDataProvenance();
		tdp.setProject(project.trim());
		tdp.setDpSiteName(site.trim());
		getHibernateTemplate().save(tdp);
}	
	/**
	 * Construct the partial where clause which contains checking with authorized project and site combinations.
	 *
	 * This method is used for NBIA Rest API filter.
	 */
	private StringBuffer addAuthorizedProjAndSites(List<String> authorizedProjAndSites) {
		StringBuffer where = new StringBuffer();

		if ((authorizedProjAndSites != null) && (!authorizedProjAndSites.isEmpty())){
			where = where.append("where tdp.projAndSite in (");

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
}
