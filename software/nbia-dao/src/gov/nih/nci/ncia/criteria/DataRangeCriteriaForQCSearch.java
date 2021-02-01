package gov.nih.nci.ncia.criteria;



public class DataRangeCriteriaForQCSearch extends DateRangeCriteria  implements QCSearchCriteria{
    private String queryField;
    private String booleanOperator;
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

}
