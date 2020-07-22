/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.download;

public class SeriesData {
	
	private String collection;
	private String patientId;
	private String studyInstanceUid;
	private String seriesInstanceUid;
	private boolean hasAnnotation;
	private String numberImages;
	private Long imagesSize;
	private Long annoSize;
	private String url;
	private String displayName;
	private boolean local;
	private String studyDate;
	private String studyId;
	private String studyDesc;
	private String seriesNum;
	private String seriesDesc;
	private String thirdPartyAnalysis;
    private String descriptionURI;
    private String sopClassUID;
    private String sopClassName;
    private String modality;
    private String manufacturer;  
    private String licenseName;
    private String licenseUrl;    
	
	public String getStudyDate() {
		return studyDate;
	}
	public void setStudyDate(String studyDate) {
		this.studyDate = studyDate;
	}
	public String getStudyId() {
		return studyId;
	}
	public void setStudyId(String studyId) {
		this.studyId = studyId;
	}
	public String getStudyDesc() {
		return studyDesc;
	}
	public void setStudyDesc(String studyDesc) {
		this.studyDesc = studyDesc;
	}
	public String getSeriesNum() {
		return seriesNum;
	}
	public void setSeriesNum(String seriesNum) {
		this.seriesNum = seriesNum;
	}
	public String getSeriesDesc() {
		return seriesDesc;
	}
	public void setSeriesDesc(String seriesDesc) {
		this.seriesDesc = seriesDesc;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getDisplayName() {
		return displayName;
	}
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	public Long getImagesSize() {
		return imagesSize;
	}
	public void setImagesSize(Long imagesSize) {
		this.imagesSize = imagesSize;
	}
	public Long getAnnoSize() {
		return annoSize;
	}
	public void setAnnoSize(Long annoSize) {
		this.annoSize = annoSize;
	}
	public String getNumberImages() {
		return numberImages;
	}
	public void setNumberImages(String numberImages) {
		this.numberImages = numberImages;
	}
	public String getCollection() {
		return collection;
	}
	public void setCollection(String collection) {
		this.collection = collection;
	}
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	public String getStudyInstanceUid() {
		return studyInstanceUid;
	}
	public void setStudyInstanceUid(String studyInstanceUid) {
		this.studyInstanceUid = studyInstanceUid;
	}
	public String getSeriesInstanceUid() {
		return seriesInstanceUid;
	}
	public void setSeriesInstanceUid(String seriesInstanceUid) {
		this.seriesInstanceUid = seriesInstanceUid;
	}
	public boolean isHasAnnotation() {
		return hasAnnotation;
	}
	public void setHasAnnotation(boolean hasAnnotation) {
		this.hasAnnotation = hasAnnotation;
	}
	public boolean isLocal() {
		return local;
	}
	public void setLocal(boolean local) {
		this.local = local;
	}
	public String getThirdPartyAnalysis() {
		return thirdPartyAnalysis;
	}
	public void setThirdPartyAnalysis(String thirdPartyAnalysis) {
		this.thirdPartyAnalysis = thirdPartyAnalysis;
	}
	public String getDescriptionURI() {
		return descriptionURI;
	}
	public void setDescriptionURI(String descriptionURI) {
		this.descriptionURI = descriptionURI;
	}
	public String getSopClassUID() {
		return sopClassUID;
	}
	public void setSopClassUID(String sopClassUID) {
		this.sopClassUID = sopClassUID;
	}
	public String getSopClassName() {
		return sopClassName;
	}
	public void setSopClassName(String sopClassName) {
		this.sopClassName = sopClassName;
	}
	public String getModality() {
		return modality;
	}
	public void setModality(String modality) {
		this.modality = modality;
	}
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public String getLicenseName() {
		return licenseName;
	}
	public void setLicenseName(String licenseName) {
		this.licenseName = licenseName;
	}
	public String getLicenseUrl() {
		return licenseUrl;
	}
	public void setLicenseUrl(String licenseUrl) {
		this.licenseUrl = licenseUrl;
	}
}
