package gov.nih.nci.nbia.util;

public class TreeData {
	String criteria;
	String value;
	public String getCriteria() {
		return criteria;
	}
	public void setCriteria(String criteria) {
		this.criteria = criteria;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public TreeData(){};
	public TreeData(String cri, String val)
	{
		criteria=cri;
		value=val;
	}
	

}
