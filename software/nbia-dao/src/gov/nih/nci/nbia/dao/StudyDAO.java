/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dto.TimePointDTO;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.ncia.criteria.AuthorizationCriteria;

import java.util.Collection;
import java.util.List;

import org.springframework.dao.DataAccessException;

public interface StudyDAO  {

    /**
     * This method will deal with the query where a list of SeriesPkId's
     * is passed in as a Query to the QueryHandler.  It will then return
     * the SeriesListResultSet, which contains all of the information necessary
     * for the second level query.
     */
	public List<String> getEventTypes() throws DataAccessException;
	public TimePointDTO getMinMaxTimepoints_v4() throws DataAccessException;
	public TimePointDTO getMinMaxTimepoints(AuthorizationCriteria auth) throws DataAccessException;
    public List<StudyDTO> findStudiesBySeriesId_v4(Collection<Integer> seriesPkIds) throws DataAccessException;
    public List<StudyDTO> findStudiesBySeriesId(Collection<Integer> seriesPkIds) throws DataAccessException;
    public List<StudyDTO> findStudiesBySeriesIdForCart(Collection<Integer> seriesPkIds) throws DataAccessException;
    public List<StudyDTO> findStudiesBySeriesUIds_v4(Collection<String> seriesPkIds) throws DataAccessException;
    public List<StudyDTO> findStudiesBySeriesUIds(Collection<String> seriesPkIds) throws DataAccessException;
	public List<Object[]> getSeriesMetadata(List<String> seriesIDs, List<String> authorizedProjAndSites) throws DataAccessException;
    public List<Object[]> getPatientStudy_v4(String collection, String patientId, String studyInstanceUid, List<String> authorizedProjAndSites) throws DataAccessException;
    public List<Object[]> getPatientStudy(String collection, String patientId, String studyInstanceUid, List<String> authorizedProjAndSites) throws DataAccessException;
    public List<Object[]> getPatientStudyFromDate_v4(String collection, String patientId, String fromDate, List<String> authorizedProjAndSites) throws DataAccessException;
    public List<Object[]> getPatientStudyFromDate(String collection, String patientId, String fromDate, List<String> authorizedProjAndSites) throws DataAccessException;
    public List<Object[]> getPatientStudyBySeries(String series, List<String> authorizedProjAndSites) throws DataAccessException;
    /**
     * This method will deal with the query where a list of SeriesPkId's
     * is passed in as a Query to the QueryHandler.  It will then return
     * the SeriesListResultSet, which contains all of the information sorted.
     */
    public List<StudyDTO> findStudiesBySeriesIdDBSorted(Collection<Integer> seriesPkIds) throws DataAccessException;
}
