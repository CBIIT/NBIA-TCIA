package gov.nih.nci.ncia.criteria;

public class TextCriteria implements QCSearchCriteria{

	
    private String queryField;
    private String booleanOperator;
    private String queryValue;
    private String queryType;
	public String getQueryField() {
		return queryField;
	}
	public void setQueryField(String queryField) {
		this.queryField = queryField;
	}
	public String getBooleanOperator() {
		return booleanOperator;
	}
	public void setBooleanOperator(String booleanOperator) {
		this.booleanOperator = booleanOperator;
	}
	public String getQueryValue() {
		return queryValue;
	}
	public void setQueryValue(String queryValue) {
		this.queryValue = queryValue;
	}
	public String getQueryType() {
		return queryType;
	}
	public void setQueryType(String queryType) {
		this.queryType = queryType;
	}
	
	
}
