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

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

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
			dto.setUserName(c.getUserName());
			//calling this from save() causes duplicate object in session
			//might be better to rework this so the find can just return
			//that object and save update that instead of re-creating
			getHibernateTemplate().evict(c);
		}
		return dto;
	}	@Transactional(propagation=Propagation.REQUIRED)
	
	public List<CollectionDescDTO> findCollectionDescs() throws DataAccessException{


        List<CollectionDescDTO> returnValue=new ArrayList<CollectionDescDTO>();
        DetachedCriteria criteria = DetachedCriteria.forClass(CollectionDesc.class);
        criteria.add(Restrictions.isNotNull("collectionName"));
        List<CollectionDesc> collectionDescList = getHibernateTemplate().findByCriteria(criteria);
        System.out.println("collectionDescList:"+collectionDescList.size());
		for(CollectionDesc collectionDesc : collectionDescList)	{
			CollectionDescDTO dto = new CollectionDescDTO();
			dto.setDescription(collectionDesc.getDescription());
			dto.setId(collectionDesc.getId());
			dto.setCollectionName(collectionDesc.getCollectionName());
			System.out.println("Description:"+dto.getDescription());
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
		setExcludeCommercialForSeries(collectionDescDTO.getCollectionName());
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
	private void setExcludeCommercialForSeries(String project)  {
	
  
        String SQLQuery="select collection_descriptions_pk_id from collection_descriptions where license_id in (select license_id from license where commercial_use<>'YES') and collection_name='"+project+"'";
		List<Object[]> data= getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
        .list();
		if (!(data!=null&&data.size()>0)) {
			String queryString = "update GeneralSeries s set excludeCommercial=null where project='"+project+"'";
	        Query query = getHibernateTemplate().getSessionFactory().getCurrentSession().createQuery(queryString);
	        int count = query.executeUpdate();
		}  else {
			String queryString = "update GeneralSeries s set excludeCommercial='YES' where project='"+project+"'";
	        Query query = getHibernateTemplate().getSessionFactory().getCurrentSession().createQuery(queryString);
	        int count = query.executeUpdate();
		}

	} 

	/////////////////////////////////PRIVATE/////////////////////////////////////////////
	private CollectionDesc convertDTOToObject(CollectionDescDTO collectionDescDTO){
		CollectionDesc collectionDesc = new CollectionDesc();
		collectionDesc.setCollectionName(collectionDescDTO.getCollectionName());
		collectionDesc.setDescription(collectionDescDTO.getDescription());
		collectionDesc.setUserName(collectionDescDTO.getUserName());
		collectionDesc.setId(collectionDescDTO.getId());
		collectionDesc.setCollectionDescTimestamp(new Date());
		return collectionDesc;
	}
}
