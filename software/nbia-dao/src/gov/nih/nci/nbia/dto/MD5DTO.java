package gov.nih.nci.nbia.dto;

public class MD5DTO {
  private String fileName;
  private String MD5Hash;
  private String project;
public String getFileName() {
	return fileName;
}
public void setFileName(String fileName) {
	this.fileName = fileName;
}
public String getMD5Hash() {
	return MD5Hash;
}
public void setMD5Hash(String mD5Hash) {
	MD5Hash = mD5Hash;
}
public void setProject(String project) {
  this.project = project;
}
public String getProject() {
  return project;
}
  
}
