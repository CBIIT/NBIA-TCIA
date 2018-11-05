package gov.nih.nci.nbia.restUtil;
import java.util.HashMap;
import java.util.List;
import java.util.*;

import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;
public class TextSummaryFactory {
	public static TextSearchSummary getNewPatientSearchSummary(List<PatientTextSearchResult> input, String sort) {
		TextSearchSummary returnValue = new TextSearchSummary();
		returnValue.setResultSet(input);
		returnValue.setSort(sort);
		returnValue.setTotalPatients(input.size());
		return returnValue;
	}
	public static TextSearchSummary getReturnValue(TextSearchSummary input, int start, int size) {
		TextSearchSummary returnValue = new TextSearchSummary();
	   	if (size+start>input.getResultSet().size()) {
			size=input.getResultSet().size()-start;
		} 
		returnValue.setResultSet(input.getResultSet().subList(start, start+size));
		returnValue.setSort(input.getSort());
		returnValue.setTotalPatients(input.getTotalPatients());

		return returnValue;
	}
}
