/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.SiteDTO;

import java.util.List;

import org.springframework.dao.DataAccessException;

/**
 * handle query for Editing collection description feature
 * @author lethai
 *
 */
public interface SiteDAO  {



	public SiteDTO findSiteByCollectionNameAndSiteName(String collectionName, String siteName) throws DataAccessException;
	public void update(SiteDTO siteDTO);

}
