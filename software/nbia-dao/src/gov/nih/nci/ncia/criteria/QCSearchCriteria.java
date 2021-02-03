package gov.nih.nci.ncia.criteria;

public interface QCSearchCriteria {
	public String getQueryField();
	public void setQueryField(String queryField);
	public String getBooleanOperator();
	public void setBooleanOperator(String booleanOperator);
}
