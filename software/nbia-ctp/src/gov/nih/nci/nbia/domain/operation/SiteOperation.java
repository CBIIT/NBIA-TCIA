/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.domain.operation;

import gov.nih.nci.nbia.internaldomain.Site;
import gov.nih.nci.nbia.internaldomain.TrialDataProvenance;
import gov.nih.nci.nbia.util.DicomConstants;
import gov.nih.nci.nbia.util.SpringApplicationContext;

import java.util.Map;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public class SiteOperation extends DomainOperation implements SiteOperationInterface{
	
	public SiteOperation() {
		
	}
	
	TrialDataProvenance tdp;
	
	public TrialDataProvenance getTdp() {
		return tdp;
	}

	public void setTdp(TrialDataProvenance tdp) {
		this.tdp = tdp;
	}

	@Transactional(propagation=Propagation.REQUIRED)
	public Object validate(Map numbers) throws Exception {
		String temp;
	    String hql = "from Site as site where ";
	
	    Site site = (Site)SpringApplicationContext.getBean("site");
	
	    try {
	    	if ((temp = (String) numbers.get(DicomConstants.PROJECT_NAME)) != null) {
		        hql += ("lower(site.trialDataProvenance.project) = '" + temp.trim().toLowerCase() +
		        "' and ");
		    } else {
		    	throw new Exception("Exception in TrialDataProvenanceOperation: Collection is null");
		    }
		/** No more matching site id
		     if ((temp = (String) numbers.get(DicomConstants.SITE_ID)) != null) {

		        hql += ("site.dpSiteId = '" + temp.trim() + "' and ");
		        site.setDpSiteId(temp.trim());
		    } else {
		    	throw new Exception("Exception in Site: Site id is null");
		    }
				 */
		    if ((temp = (String) numbers.get(DicomConstants.SITE_NAME)) != null) {
		        hql += ("lower(site.dpSiteName) = '" + temp.trim().toLowerCase() +
		        "' ");
		        site.setDpSiteName(temp.trim());
		    } else {
		    	throw new Exception("Exception in Site: Site name is null");
		    }
		
		    List ret = getHibernateTemplate().find(hql);
		    if(ret != null  && ret.size() > 0) {
		    	if (ret.size() == 1) {
		    		site = (Site) ret.get(0);
		    	}
		    	else if (ret.size() > 1)
		    	{
		    		throw new Exception("Site table (" 
		    				+ (String)numbers.get(DicomConstants.PROJECT_NAME) + "/" 
		    				+ (String) numbers.get(DicomConstants.SITE_NAME) 
		    				+") has duplicate records, please contact Data Team to fix data, then upload data again");
		    	}
		    }		    else {
			    site.setTrialDataProvenance(tdp);		
		    }
	    }catch(Exception e) {
	    	log.error("Exception in SiteOperation " + e);
	    	throw new Exception("Exception in SiteOperation: " + e);
	    }
	
	    return site;		
	}

}
