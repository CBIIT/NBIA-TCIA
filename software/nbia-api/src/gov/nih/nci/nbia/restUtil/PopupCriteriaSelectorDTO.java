package gov.nih.nci.nbia.restUtil;

import java.util.*;
public class PopupCriteriaSelectorDTO {
	
	private String parentMenuName;
	private List<PopupCriteriaObjects> criteriaObjects;

	public List<PopupCriteriaObjects> getCriteriaObjects() {
		return criteriaObjects;
	}
	public void setCriteriaObjects(List<PopupCriteriaObjects> criteriaObjects) {
		this.criteriaObjects = criteriaObjects;
	}
	public String getParentMenuName() {
		return parentMenuName;
	}
	public void setParentMenuName(String parentMenuName) {
		this.parentMenuName = parentMenuName;
	}
	

}
