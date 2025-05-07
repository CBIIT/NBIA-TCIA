package gov.nih.nci.nbia.dto;

public class DOIDTO {
private String collection;
private String seriesInstanceUID;
private String thirdPartyAnanlysis;
private Integer authorized;
public String getCollection() {
	return collection;
}
public void setCollection(String collection) {
	this.collection = collection;
}
public String getThirdPartyAnanlysis() {
	return thirdPartyAnanlysis;
}
public void setThirdPartyAnanlysis(String thirdPartyAnanlysis) {
	this.thirdPartyAnanlysis = thirdPartyAnanlysis;
}
public String getSeriesInstanceUID() {
	return seriesInstanceUID;
}
public void setSeriesInstanceUID(String seriesInstanceUID) {
	this.seriesInstanceUID = seriesInstanceUID;
}

public Integer getAuthorized() {
  return this.authorized;
}

public void setAuthorized(Integer authorized) {
  this.authorized = authorized;
}

}
