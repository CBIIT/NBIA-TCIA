package gov.nih.nci.nbia.dao;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import gov.nih.nci.nbia.dto.PopupCriteriaSelectorDTO;
public class PopupCriteriaSelectorDAO {

	public static List<PopupCriteriaSelectorDTO>getPopupCriteriaSelector() {
		
		List<PopupCriteriaSelectorDTO>returnValue=new ArrayList<PopupCriteriaSelectorDTO>();
		PopupCriteriaSelectorDTO item = new PopupCriteriaSelectorDTO();
		item.setDynamicQueryCriteriaType("listMultipleSelection");
		item.setDynamicQueryCriteriaHeading("A Multi selection list");
        item.setDynamicQueryCriteriaOpenCloseButton("true");
        item.setDynamicQueryCriteriaSearchable("true");
        item.setDynamicQueryCriteriaSort("false");
        item.setDynamicQueryCriteriaAndOrType("andOr");
        item.setDynamicQueryCriteriaAndOrDefault("and");
        item.setDynamicQueryCriteria("testCriteriaTypeSeven");
        String[] dataArray=new String[]{"Alpha","Bravo","Charlie","Delta","Echo","Fox", "Golf","Hotel","India","Juliette","Kilo","Lima","Mike","November"};
        List<String> arrayList = new ArrayList<String>(); 
        Collections.addAll(arrayList, dataArray); 
        item.setDynamicQueryCriteriaDataArray(arrayList);
        returnValue.add(item);
		PopupCriteriaSelectorDTO item2 = new PopupCriteriaSelectorDTO();
		item.setDynamicQueryCriteriaType("textInput");
		item.setDynamicQueryCriteriaHeading("A Text Input");
        item.setDynamicQueryCriteriaOpenCloseButton("true");
        item.setDynamicQueryCriteriaSearchable("false");
        item.setDynamicQueryCriteriaSort("false");
        item.setDynamicQueryCriteriaAndOrType("andOr");
        item.setDynamicQueryCriteriaAndOrDefault("and");
        item.setDynamicQueryCriteria("testCriteriaTypeEight");
        returnValue.add(item2);
		return returnValue;
	}
	
	
}
