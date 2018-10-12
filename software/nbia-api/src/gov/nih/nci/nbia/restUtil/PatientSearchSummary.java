package gov.nih.nci.nbia.restUtil;
import java.util.List;
import java.util.Set;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
public class PatientSearchSummary {
	private List <PatientSearchResultWithModilityAndBodyPart> resultSet;
	private int totalPatients;
	private List<ValueAndCount> bodyParts;
	private List<ValueAndCount> modalities;
	private List<ValueAndCount> collections;
	private String sort;
	public List<PatientSearchResultWithModilityAndBodyPart> getResultSet() {
		return resultSet;
	}
	public void setResultSet(List<PatientSearchResultWithModilityAndBodyPart> resultSet) {
		this.resultSet = resultSet;
	}
	public int getTotalPatients() {
		return totalPatients;
	}
	public void setTotalPatients(int totalPatients) {
		this.totalPatients = totalPatients;
	}

	public List<ValueAndCount> getBodyParts() {
		return bodyParts;
	}
	public void setBodyParts(List<ValueAndCount> bodyParts) {
		this.bodyParts = bodyParts;
	}
	public List<ValueAndCount> getModalities() {
		return modalities;
	}
	public void setModalities(List<ValueAndCount> modalities) {
		this.modalities = modalities;
	}
	public List<ValueAndCount> getCollections() {
		return collections;
	}
	public void setCollections(List<ValueAndCount> collections) {
		this.collections = collections;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	

}
