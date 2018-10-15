package gov.nih.nci.nbia.restUtil;
import java.util.List;
import java.util.Set;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;
public class TextSearchSummary {
	private List <PatientTextSearchResult> resultSet;
	private int totalPatients;
	private String sort;
	public List<PatientTextSearchResult> getResultSet() {
		return resultSet;
	}
	public void setResultSet(List<PatientTextSearchResult> resultSet) {
		this.resultSet = resultSet;
	}
	public int getTotalPatients() {
		return totalPatients;
	}
	public void setTotalPatients(int totalPatients) {
		this.totalPatients = totalPatients;
	}

	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	

}
