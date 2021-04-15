/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.EquipmentDTO;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.util.SiteData;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

public interface GeneralSeriesDAO  {

	public Collection<String> findProjectsOfVisibleSeries() throws DataAccessException;
	
	public List<String> findProjectSitesOfSeries(List<String> seriesInstanceUids) throws DataAccessException;

	public Collection<EquipmentDTO> findEquipmentOfVisibleSeries() throws DataAccessException;


	public Collection<String> findDistinctBodyPartsFromVisibleSeries()throws DataAccessException;

	public Collection<String> findDistinctModalitiesFromVisibleSeries()throws DataAccessException;


    public List<SeriesDTO> getDataForSeries(Integer seriesPkId) throws DataAccessException;

	/**
	 * This returns the series objects by their primary keys.  This method
	 * does NOT look at authorization of any kind.
	 */
	public List<SeriesDTO> findSeriesBySeriesPkId(Collection<Integer> seriesPkIds) throws DataAccessException;

	/**
	 * Return all the series for a given list of series instance UIDs IGNORING
	 * authorization.
	 */
	public List<SeriesDTO> findSeriesBySeriesInstanceUID(List<String> seriesIds)throws DataAccessException;
	/**
	 * Return all the series for a given list of series instance UIDs IGNORING
	 * authorization and visibility
	 */
	public List<SeriesDTO> findSeriesBySeriesInstanceUIDAnyVisibility(List<String> seriesIds)throws DataAccessException;

	/**
	 * Return all the series for a given list of patients, but only when
	 * the series are authorized.
	 */
	public List<SeriesDTO> findSeriesByPatientId(List<String> patientIDs,
			                                     List<SiteData> authorizedSites,
			                                     List<String> authroizedSeriesSecurityGroups) throws DataAccessException;


	/**
	 * Return all the series for a given list of studies, but only when
	 * the series are authorized.
	 */
	public List<SeriesDTO> findSeriesByStudyInstanceUid(List<String> studyInstanceUids,
			                                            List<SiteData> authorizedSites,
			                                            List<String> authroizedSeriesSecurityGroups)throws DataAccessException;

	/**
	 * Return all the series for a given list of series instance UIDs, but only when
	 * the series are authorized.
	 */
	public List<SeriesDTO> findSeriesBySeriesInstanceUID(List<String> seriesIds,
			                                             List<SiteData> authorizedSites,
			                                             List<String> authorizedSeriesSecurityGroups) throws DataAccessException;
	public List<SeriesDTO> findSeriesBySeriesInstanceUID112(List<String> seriesIds,
            List<SiteData> authorizedSites,
            List<String> authorizedSeriesSecurityGroups) throws DataAccessException;
	public List<SeriesDTO> findSeriesBySeriesInstanceUID112Light(List<String> seriesIds,
            List<SiteData> authorizedSites,
            List<String> authorizedSeriesSecurityGroups) throws DataAccessException;

	public SeriesDTO getGeneralSeriesByPKid(Integer seriesPkId) throws DataAccessException;

	// Below Methods are added for Rest API
	public List<String> getModalityValues(String collection, String bodyPart, List<String> authorizedProjAndSites) throws DataAccessException;
	public List<String> getBodyPartValues(String collection, String modality, List<String> authorizedProjAndSites) throws DataAccessException;
	public List<String> getManufacturerValues(String collection, String modality, String bodyPart, List<String> authorizedProjAndSites) throws DataAccessException;
	public List<Object[]> getSeries(String collection, String patientId, String studyInstanceUid, List<String> authorizedProjAndSites,
			String modality, String bodyPartExamined, String manufacturerModelName, String manufacturer, String seriesInstanceUID) throws DataAccessException;
	public List<Object[]> getSeries(String collection, List<String> authorizedProjAndSites) throws DataAccessException;
	public List<Object[]> getSeries(List<String> seriesInstanceUids, List<String> authorizedProjAndSites) throws DataAccessException;
	public List<Object[]> getSeriesSize(String seriesInstanceUID, List<String> authorizedProjAndSites) throws DataAccessException;
	public List<String> getRequestedProjectAndSite(Map<String,String> queryParams) throws DataAccessException;
	public List<String> getSeriesFromPatientStudySeriesUIDs(List<String> patientIDs,
	           List<String> studyIDs,
	           List<String> seriesIDs) throws DataAccessException;
	public List<SeriesDTO> findSeriesBySeriesInstanceUIDAllVisibilities(List<String> seriesIds, List<SiteData> authorizedSites, List<String> authorizedSeriesSecurityGroups) throws DataAccessException;
	public List<SeriesDTO> findSeriesBySeriesInstanceUIDAllVisibilitiesLight(List<String> seriesIds, List<SiteData> authorizedSites, List<String> authorizedSeriesSecurityGroups) throws DataAccessException;
	public List<String> findSeriesByCollectionAndVisibility(String collection, String visibility) throws DataAccessException;
	public List<SeriesDTO> getSeriesFromSeriesInstanceUIDsIgnoreSecurity(List<String> seriesIds) throws DataAccessException;
	public Object [] findSeriesBySeriesInstanceUIDAllVisibilitiesLight(boolean allVisibilities, String seriesId,
			List<String> authorizedCollections) throws DataAccessException;
	public List<String> getDeniedSeries(List<String> seriesInstanceUids, List<String> authorizedProjAndSites) throws DataAccessException;
	public int updateDOIForSeries(String project, String doi)throws DataAccessException;
}
