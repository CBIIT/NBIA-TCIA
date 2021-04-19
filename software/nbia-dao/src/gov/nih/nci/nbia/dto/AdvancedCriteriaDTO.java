package gov.nih.nci.nbia.dto;

public class AdvancedCriteriaDTO {
	    public String criteriaType;
	    public String field;
	    public String object;
	    public String alias;
	    public String dataType;
		public String getCriteriaType() {
			return criteriaType;
		}
		public void setCriteriaType(String criteriaType) {
			this.criteriaType = criteriaType;
		}
		public String getField() {
			return field;
		}
		public void setField(String field) {
			this.field = field;
		}
		public String getObject() {
			return object;
		}
		public void setObject(String object) {
			this.object = object;
		}
		public String getAlias() {
			return alias;
		}
		public void setAlias(String alias) {
			this.alias = alias;
		}
		public String getDataType() {
			return dataType;
		}
		public void setDataType(String dataType) {
			this.dataType = dataType;
		}
	    
}
