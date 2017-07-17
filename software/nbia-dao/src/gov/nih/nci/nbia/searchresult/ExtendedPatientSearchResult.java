package gov.nih.nci.nbia.searchresult;

public class ExtendedPatientSearchResult extends PatientSearchResultImpl {

	String diskSpace;
	String imageCount;
	public String getDiskSpace() {
		return diskSpace;
	}
	public void setDiskSpace(String diskSpace) {
		this.diskSpace = diskSpace;
	}
	public String getImageCount() {
		return imageCount;
	}
	public void setImageCount(String imageCount) {
		this.imageCount = imageCount;
	}
	
}
