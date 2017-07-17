package gov.nih.nci.nbia.searchresult;

public class ExtendedPatientSearchResult extends PatientSearchResultImpl {

	Long diskSpace;
	Long imageCount;
	public Long getDiskSpace() {
		return diskSpace;
	}
	public void setDiskSpace(Long diskSpace) {
		this.diskSpace = diskSpace;
	}
	public Long getImageCount() {
		return imageCount;
	}
	public void setImageCount(Long imageCount) {
		this.imageCount = imageCount;
	}
	public void fromSearchResult(PatientSearchResult input){
		this.setId(input.getId());
		this.setSubjectId(input.getSubjectId());
		this.setProject(input.getProject());
		this.setStudyIdentifiers(input.getStudyIdentifiers());
		this.setTotalNumberOfSeries(input.getTotalNumberOfSeries());
		this.setTotalNumberOfStudies(input.getTotalNumberOfStudies());
	}
}
