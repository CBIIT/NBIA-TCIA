/**
 *
 */
package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.internaldomain.TrialDataProvenance;
import gov.nih.nci.nbia.internaldomain.Site;
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
	String hql = "select distinct(tdp.project) from TrialDataProvenance tdp join tdp.siteCollection s " + addAuthorizedProjAndSites(authorizedProjAndSites);
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

	String hql = "select distinct(CONCAT(tdp.project, '//', s.dpSiteName)) from TrialDataProvenance tdp join tdp.siteCollection s ";
	String orderBy = " order by CONCAT(tdp.project, '//', s.dpSiteName)";
	List<String> rs = getHibernateTemplate().find(hql + orderBy);

	return rs;
}
	
	/**
	 * Check if collection and site exist already.
	 *
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean hasExistingProjSite(String project, String site) throws DataAccessException {
	String hql = "select distinct(CONCAT(tdp.project, '//', s.dpSiteName)) from TrialDataProvenance tdp join tdp.siteCollection s ";
	String where = " where tdp.project = '" + project +"' and s.dpSiteName = '" + site +"'";
	List<String> rs = getHibernateTemplate().find(hql + where);
	if ((rs != null) && (rs.size() == 1))
		return true;
	else return false;

}	
	/**
	 * Check if collection and site exist already.
	 *
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public TrialDataProvenance getTrialDataProvenance(String project) throws DataAccessException {
	TrialDataProvenance returnValue=null;
	String hql = "from TrialDataProvenance ";
	String where = " where project = '" + project +"'";
	List<TrialDataProvenance> list=(List<TrialDataProvenance>)getHibernateTemplate().find(hql + where);
	if (list.size()>0) {
	    returnValue = list.get(0);
	}
     return returnValue;

}
	/**
	 * Save a collection (ie. project) and site.
	 *
	 * This method is used in User Authorization Tool.
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public void setProjSiteValues(String project, String site) throws DataAccessException {
		// see if it already exists, if it does quit
		if (hasExistingProjSite(project, site)) {
			return;
		}
		// see if project exists, if so add or update site
		TrialDataProvenance tdp=getTrialDataProvenance(project);
		if (tdp!=null) {
			Site siteObject = new Site();
			siteObject.setDpSiteName(site);
			siteObject.setTrialDataProvenance(tdp);
			getHibernateTemplate().saveOrUpdate(siteObject);
			return;
		}
		tdp = new TrialDataProvenance();
		tdp.setProject(project.trim());
		getHibernateTemplate().save(tdp); 
		Site siteObject=new Site();
		siteObject.setDpSiteName(site.trim());
		siteObject.setTrialDataProvenance(tdp);
		getHibernateTemplate().save(siteObject);
		
}	
	/**
	 * Construct the partial where clause which contains checking with authorized project and site combinations.
	 *
	 * This method is used for NBIA Rest API filter.
	 */
	private StringBuffer addAuthorizedProjAndSites(List<String> authorizedProjAndSites) {
		StringBuffer where = new StringBuffer();

		if ((authorizedProjAndSites != null) && (!authorizedProjAndSites.isEmpty())){
			where = where.append("where concat(concat(tdp.project, '//'), s.dpSiteName) in (");

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
