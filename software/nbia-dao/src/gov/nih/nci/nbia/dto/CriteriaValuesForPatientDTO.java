package gov.nih.nci.nbia.dto;
import java.util.List;
public class CriteriaValuesForPatientDTO {

	private String criteria;
	private List<CriteriaValuesDTO> values;
	public String getCriteria() {
		return criteria;
	}
	public void setCriteria(String criteria) {
		this.criteria = criteria;
	}
	public List<CriteriaValuesDTO> getValues() {
		return values;
	}
	public void setValues(List <CriteriaValuesDTO> values) {
		this.values = values;
	}
	
	
}
