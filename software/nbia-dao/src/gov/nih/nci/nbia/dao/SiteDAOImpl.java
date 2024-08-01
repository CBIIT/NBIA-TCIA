/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.SiteDTO;
import gov.nih.nci.nbia.dto.LicenseDTO;
import gov.nih.nci.nbia.internaldomain.Site;
import gov.nih.nci.nbia.util.SpringApplicationContext;
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
public class SiteDAOImpl extends AbstractDAO
                                   implements SiteDAO {
	
	
	
	


	@Transactional(propagation=Propagation.REQUIRED)
	public SiteDTO findSiteByCollectionNameAndSiteName(String collectionName, String siteName) throws DataAccessException{
		SiteDTO dto = new SiteDTO();

        String hql = "from Site as site where trialDataProvenance.project ='"+collectionName+
        		"' and site.dpSiteName='"+siteName+"'";
        
        Site site = (Site)SpringApplicationContext.getBean("site");
        List siteList =getHibernateTemplate().find(hql);	        
		System.out.println(dto);
		if(siteList != null && siteList.size() == 1)	{
			Site s = (Site)siteList.get(0);
			dto.setCollectionName(s.getTrialDataProvenance().getProject());
			dto.setSiteName(s.getDpSiteName());
			LicenseDTO licenseDTO=new LicenseDTO();
			if (s.getLicense()!=null) {
			   licenseDTO.setCommercialUse(s.getLicense().getCommercialUse());
			   licenseDTO.setId(s.getLicense().getId());
			   licenseDTO.setLicenseURL(s.getLicense().getUrl());
			   licenseDTO.setLicenseText(s.getLicense().getLicenseText());
			   licenseDTO.setShortName(s.getLicense().getShortName());
			   licenseDTO.setLongName(s.getLicense().getLongName());
			   dto.setLicenseDTO(licenseDTO);
			}
		}
		System.out.println(dto);
		return dto;
	}	

	





	@Transactional(propagation=Propagation.REQUIRED)

	public void update(SiteDTO siteDTO){
		
        String hql = "from Site as site where trialDataProvenance.project ='"+siteDTO.getCollectionName()+
        		"' and site.dpSiteName='"+siteDTO.getSiteName()+"'";
        
        Site site = (Site)SpringApplicationContext.getBean("site");
        List rs =getHibernateTemplate().find(hql);	        
        if(rs != null && rs.size()> 0) {
        	site = (Site) rs.get(0);
            hql = "from License as license where longName ='"+siteDTO.getLicenseDTO().getLongName()+"'";
            rs =getHibernateTemplate().find(hql);	        
            if(rs != null && rs.size()> 0) {
            	License license = (License) rs.get(0);
            	site.setLicense(license);
        		getHibernateTemplate().update(site);
            String commercialUse = license.getCommercialUse();
            String excludeCommercial = "";
            if (commercialUse.equalsIgnoreCase("no")) {
              excludeCommercial = "YES";
            } else if (commercialUse.equalsIgnoreCase("yes")) {
              excludeCommercial = "NO";
            }
        		setExcludeCommercialForSeries(siteDTO.getCollectionName(), siteDTO.getSiteName(), 
        				excludeCommercial, license.getLongName(), license.getUrl());

            }
        }


	}

	@Transactional(propagation=Propagation.REQUIRED)
	private void setExcludeCommercialForSeries(String project, String siteName, String excludeCommercial, String licenseName, String licenseURL)  {
	
  
 ;
			String queryString = "update GeneralSeries s set excludeCommercial='"+excludeCommercial+
					"', licenseName='"+licenseName+"', licenseURL='"+licenseURL+
					"' where project='"+project+"' and site='"+siteName+"'";
	        Query query = getHibernateTemplate().getSessionFactory().getCurrentSession().createQuery(queryString);
	        int count = query.executeUpdate();

		}

	} 



