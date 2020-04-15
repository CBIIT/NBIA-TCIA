/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dto;


import java.text.SimpleDateFormat;
import java.util.Date;

import gov.nih.nci.nbia.qctool.VisibilityStatus;
import gov.nih.nci.nbia.searchresult.APIURLHolder;

public class QcSearchResultDTOLight {

	private String patientId;
	private String study;
	private	String series;
	private Date creationDate;
	private String visibility;
	private String modality;
	private String seriesDescription;
	private String batch;
	private String submissionType;
	private String releasedStatus;
	private String studyDate;
	private String seriesPkId;
	
	

	
	public QcSearchResultDTOLight(QcSearchResultDTO obj) {

		setPatientId(obj.getPatientId());
		setStudy(obj.getStudy());
		setSeries(obj.getSeries());
		setCreationDate(obj.getCreationDate());
		setVisibility(obj.getVisibility());
		setModality(obj.getModality());
		setSeriesDescription(obj.getSeriesDescription());
		setBatch(obj.getBatch());
		setSubmissionType(obj.getSubmissionType());		
		setReleasedStatus(obj.getReleasedStatus());	
		setSeriesPkId(obj.getSeriesPkId());

		
}


	
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getStudy() {
		return study;
	}

	public void setStudy(String study) {
		this.study = study;
	}

	public String getSeries() {
		return series;
	}

	public void setSeries(String series) {
		this.series = series;
	}

	public String getVisibility() {
		return visibility;
	}

	public void setVisibility(String visibility) {
		this.visibility = visibility;
	}
	
	public String getVisibilityStatus() {
		return VisibilityStatus.statusFactory(Integer.parseInt(visibility)).getText();
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	
	public String getDateTime() {
		if (creationDate != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss a");
			return sdf.format(creationDate);
		} else {
			return "N/A";
		}
	}

	public String getModality() {
		return modality;
	}

	public void setModality(String modality) {
		this.modality = modality;
	}

	public String getSeriesDescription() {
		return seriesDescription;
	}

	public void setSeriesDescription(String seriesDescription) {
		this.seriesDescription = seriesDescription;
	}
	
	//////////////////////////////////////////////////
	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch; 
	
	}
	//--------------------------------
	
	public String getSubmissionType() {
		return submissionType;
	}

	public void setSubmissionType(String submissionType) {
		this.submissionType = submissionType;
	}
	
	//--------------------------------
	
		public String getReleasedStatus() {
			return releasedStatus;
		}

		public void setReleasedStatus(String releasedStatus) {
			this.releasedStatus = releasedStatus;
		}
	//--------------------------------
	



	////////////////////////////////////////////////////////






	public String getStudyDate() {
		return studyDate;
	}



	public void setStudyDate(String studyDate) {
		this.studyDate = studyDate;
	}



	public String getSeriesPkId() {
		return seriesPkId;
	}



	public void setSeriesPkId(String seriesPkId) {
		this.seriesPkId = seriesPkId;
	}

	

	
}
