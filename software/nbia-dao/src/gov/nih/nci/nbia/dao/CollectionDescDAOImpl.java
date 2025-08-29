/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.CollectionDescDTO;
import gov.nih.nci.nbia.internaldomain.CollectionDesc;
import gov.nih.nci.nbia.internaldomain.GeneralSeries;
import gov.nih.nci.nbia.internaldomain.License;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.hibernate.Query;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * handle query for Editing collection description feature
 * @author lethai
 *
 */
public class CollectionDescDAOImpl extends AbstractDAO
                                   implements CollectionDescDAO {
	/**
	 * retrieve list of collection name from trial data provenance table
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public List<String> findCollectionNames() throws DataAccessException {
		String hql =
	    	"select distinct dp.project "+
	    	"from TrialDataProvenance dp";

        return (List<String>)getHibernateTemplate().find(hql);
	}
	@Transactional(propagation=Propagation.REQUIRED)
	public Map<String, String> findCollectionNamesAndDOI(String collectionName) throws DataAccessException {
		Map<String, String> returnValue= new HashMap<String, String>();
		String hql =
	    	"select gs.project,gs.descriptionURI "+
	    	"from GeneralSeries gs where gs.thirdPartyAnalysis is null or gs.thirdPartyAnalysis='NO'";

		if (collectionName!=null&&collectionName!="") {
			hql=hql+" and gs.project='"+collectionName+"'";
			
		}
		hql+=" group by gs.project,gs.descriptionURI";
		List<Object> cdataList=getHibernateTemplate().find(hql);
		for (Object cdata:cdataList) {
		   Object[] obj= (Object[]) cdata;
		     String name = (String)obj[0];
		     String description = (String)obj[1];
		     if (name!=null&description!=null) {
		    	 returnValue.put(name, description);
		     }
		    	 		}    
        return returnValue;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public CollectionDescDTO findCollectionDescByCollectionName(String collectionName) throws DataAccessException{
		CollectionDescDTO dto = new CollectionDescDTO();
		dto.setCollectionName(collectionName);

        DetachedCriteria criteria = DetachedCriteria.forClass(CollectionDesc.class);
        criteria.add(Restrictions.eq("collectionName", collectionName));
        List<CollectionDesc> collectionDescList = getHibernateTemplate().findByCriteria(criteria);

		if(collectionDescList != null && collectionDescList.size() == 1)	{
			CollectionDesc c = collectionDescList.get(0);
			dto.setDescription(c.getDescription());
			dto.setId(c.getId());
			dto.setCollectionName(c.getCollectionName());
			if (collectionName!=null) {
				Map <String, String>doiMap=findCollectionNamesAndDOI(collectionName);
			    dto.setDescriptionURI(doiMap.get(collectionName));
			}
			if (c.getLicense() != null)
				dto.setLicenseId(c.getLicense().getId());
			else dto.setLicenseId(null);
			//calling this from save() causes duplicate object in session
			//might be better to rework this so the find can just return
			//that object and save update that instead of re-creating
			getHibernateTemplate().evict(c);
		}
		return dto;
	}	

	@Transactional(propagation=Propagation.REQUIRED)
	public CollectionDescDTO findCollectionDescByCollectionName(String collectionName, List<String> authorizedCollection) throws DataAccessException{
		CollectionDescDTO dto = new CollectionDescDTO();
		dto.setCollectionName(collectionName);

        DetachedCriteria criteria = DetachedCriteria.forClass(CollectionDesc.class);
        authorizedCollection.replaceAll(s -> s.replaceAll("//.*", "")); 
        authorizedCollection.replaceAll(s -> s.replaceFirst("^'", ""));
        if (authorizedCollection.contains(collectionName))
        	criteria.add(Restrictions.eq("collectionName", collectionName));
        else return null;
        
        List<CollectionDesc> collectionDescList = getHibernateTemplate().findByCriteria(criteria);

		if(collectionDescList != null && collectionDescList.size() == 1)	{
			CollectionDesc c = collectionDescList.get(0);
			dto.setDescription(c.getDescription());
			dto.setId(c.getId());
			dto.setCollectionName(c.getCollectionName());
			dto.setUserName(c.getUserName());
			dto.setCollectionDescTimestamp(c.getCollectionDescTimestamp());
			if (collectionName!=null) {
				Map <String, String>doiMap=findCollectionNamesAndDOI(collectionName);
			    dto.setDescriptionURI(doiMap.get(collectionName));
			}
			if (c.getLicense() != null)
				dto.setLicenseId(c.getLicense().getId());
			else dto.setLicenseId(null);
			//calling this from save() causes duplicate object in session
			//might be better to rework this so the find can just return
			//that object and save update that instead of re-creating
			getHibernateTemplate().evict(c);
		}
		return dto;
	}	
		
	@Transactional(propagation=Propagation.REQUIRED)
	public List<CollectionDescDTO> findCollectionDescs() throws DataAccessException{


        List<CollectionDescDTO> returnValue=new ArrayList<CollectionDescDTO>();
        DetachedCriteria criteria = DetachedCriteria.forClass(CollectionDesc.class);
        criteria.add(Restrictions.isNotNull("collectionName"));
        List<CollectionDesc> collectionDescList = getHibernateTemplate().findByCriteria(criteria);
		Map <String, String>doiMap=findCollectionNamesAndDOI(null);
	    
		for(CollectionDesc collectionDesc : collectionDescList)	{
			CollectionDescDTO dto = new CollectionDescDTO();
			dto.setDescription(collectionDesc.getDescription());
			dto.setId(collectionDesc.getId());
			dto.setCollectionName(collectionDesc.getCollectionName());
			dto.setDescriptionURI(doiMap.get(collectionDesc.getCollectionName()));
			if (collectionDesc.getLicense()== null)
				dto.setLicenseId(null);
			else 
				dto.setLicenseId(collectionDesc.getLicense().getId());
			returnValue.add(dto);
		}
		return returnValue;
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
	public List<CollectionDescDTO> findCollectionDescs(List<String> authorizedCollection) throws DataAccessException{


        List<CollectionDescDTO> returnValue=new ArrayList<CollectionDescDTO>();
        DetachedCriteria criteria = DetachedCriteria.forClass(CollectionDesc.class);
        criteria.add(Restrictions.isNotNull("collectionName"));

        authorizedCollection.replaceAll(s -> s.replaceAll("//.*", "")); 
        authorizedCollection.replaceAll(s -> s.replaceFirst("^'", ""));
        if (authorizedCollection != null)
        	criteria.add(Restrictions.in("collectionName", authorizedCollection));

        List<CollectionDesc> collectionDescList = getHibernateTemplate().findByCriteria(criteria);
		Map <String, String>doiMap=findCollectionNamesAndDOI(null);
	    
		for(CollectionDesc collectionDesc : collectionDescList)	{
			CollectionDescDTO dto = new CollectionDescDTO();
			dto.setDescription(collectionDesc.getDescription());
			dto.setId(collectionDesc.getId());
			dto.setCollectionName(collectionDesc.getCollectionName());
			dto.setDescriptionURI(doiMap.get(collectionDesc.getCollectionName()));
			dto.setUserName(collectionDesc.getUserName());
			dto.setCollectionDescTimestamp(collectionDesc.getCollectionDescTimestamp());
			if (collectionDesc.getLicense()== null)
				dto.setLicenseId(null);
			else 
				dto.setLicenseId(collectionDesc.getLicense().getId());
			returnValue.add(dto);
		}
		return returnValue;
	}	
	@Transactional(propagation=Propagation.REQUIRED)
	public long save(CollectionDescDTO collectionDescDTO) throws DataAccessException {

		//find out whether this record already exist,
		//if yes, do update
		//else do insert
		Integer id = isCollectionExist(collectionDescDTO.getCollectionName());

		if(id != null){
			//this smells, need to investigate
			collectionDescDTO.setId(id);
			update(collectionDescDTO);
		}else{
			insert(collectionDescDTO);
		}
		return 1L;
	}

	////////////////////////////////PROTECTED//////////////////////////////////////////////



	protected void update(CollectionDescDTO collectionDescDTO){
		CollectionDesc collectionDesc = convertDTOToObject(collectionDescDTO);
		getHibernateTemplate().update(collectionDesc);
		getHibernateTemplate().flush();

	}

	protected void insert(CollectionDescDTO collectionDescDTO){
		CollectionDesc collectionDesc = convertDTOToObject(collectionDescDTO);

		getHibernateTemplate().saveOrUpdate(collectionDesc);
		getHibernateTemplate().flush();
	}
	/**
	 * search the collectionDesc to determine if the collectionName already exists
	 * @param collectionName
	 * @return true if the collectionName exists, false otherwise.
	 */
	protected Integer isCollectionExist(String collectionName){
		CollectionDescDTO collectionDesc = findCollectionDescByCollectionName(collectionName);

		if(collectionDesc.getId() != null){
			return collectionDesc.getId();
		}
		return null;

	}

	/////////////////////////////////PRIVATE/////////////////////////////////////////////
	private CollectionDesc convertDTOToObject(CollectionDescDTO collectionDescDTO){
		CollectionDesc collectionDesc = new CollectionDesc();
		collectionDesc.setCollectionName(collectionDescDTO.getCollectionName());
		collectionDesc.setDescription(collectionDescDTO.getDescription());
		collectionDesc.setUserName(collectionDescDTO.getUserName());
		collectionDesc.setId(collectionDescDTO.getId());
		collectionDesc.setCollectionDescTimestamp(new Date());
		DetachedCriteria criteria = DetachedCriteria.forClass(License.class);
		criteria.add(Restrictions.eq("id", collectionDescDTO.getLicenseId()));
        List<License> licenseList = getHibernateTemplate().findByCriteria(criteria);
        for (License license: licenseList) {
		    collectionDesc.setLicense(license);
        }
		return collectionDesc;
	}
}
