package gov.nih.nci.nbia.restUtil;
import java.util.List;
import java.util.Set;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
public class PatientSearchSummary {
	private List <PatientSearchResultWithModilityAndBodyPart> resultSet;
	private int totalPatients;
	private Set<String> bodyParts;
	private Set<String> modalities;
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
	public Set<String> getBodyParts() {
		return bodyParts;
	}
	public void setBodyParts(Set<String> bodyParts) {
		this.bodyParts = bodyParts;
	}
	public Set<String> getModalities() {
		return modalities;
	}
	public void setModalities(Set<String> modalities) {
		this.modalities = modalities;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	

}
