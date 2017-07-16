package gov.nih.nci.ncia.criteria;

public class ValuesAndCountsCriteria {
	private String objectType;
	private AuthorizationCriteria auth;
	private String bodyPart;
	private String collection;
	private String modality;
	public String getObjectType() {
		return objectType;
	}
	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}
	public AuthorizationCriteria getAuth() {
		return auth;
	}
	public void setAuth(AuthorizationCriteria auth) {
		this.auth = auth;
	}
	public String getBodyPart() {
		return bodyPart;
	}
	public void setBodyPart(String bodyPart) {
		this.bodyPart = bodyPart;
	}
	public String getCollection() {
		return collection;
	}
	public void setCollection(String collection) {
		this.collection = collection;
	}
	public String getModality() {
		return modality;
	}
	public void setModality(String modality) {
		this.modality = modality;
	}

}
