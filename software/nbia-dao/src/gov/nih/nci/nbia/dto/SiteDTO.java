package gov.nih.nci.nbia.dto;

public class SiteDTO {
private String siteName;
private LicenseDTO licenseDTO;
private String collectionName;
public String getSiteName() {
	return siteName;
}
public void setSiteName(String siteName) {
	this.siteName = siteName;
}
public LicenseDTO getLicenseDTO() {
	return licenseDTO;
}
public void setLicenseDTO(LicenseDTO licenseDTO) {
	this.licenseDTO = licenseDTO;
}
public String getCollectionName() {
	return collectionName;
}
public void setCollectionName(String collectionName) {
	this.collectionName = collectionName;
}
@Override
public String toString() {
	return "SiteDTO [siteName=" + siteName + ", licenseDTO=" + licenseDTO + ", collectionName=" + collectionName + "]";
}

}
