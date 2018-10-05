package gov.nih.nci.nbia.restUtil;
import java.util.*;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
public class PatientSummaryFactory {
	public static PatientSearchSummary getNewPatientSearchSummary(List<PatientSearchResultWithModilityAndBodyPart> input, String sort, boolean compute) {
		PatientSearchSummary returnValue = new PatientSearchSummary();
		returnValue.setResultSet(input);
		returnValue.setSort(sort);
		returnValue.setTotalPatients(input.size());
		if (compute) {
		    returnValue=computeBodyPartsAndModalities(returnValue);
		}
		return returnValue;
	}
	public static PatientSearchSummary getReturnValue(PatientSearchSummary input, int start, int size) {
		PatientSearchSummary returnValue = new PatientSearchSummary();
	   	if (size+start>input.getResultSet().size()) {
			size=input.getResultSet().size();
		} 
		returnValue.setResultSet(input.getResultSet().subList(start, start+size));
		returnValue.setBodyParts(input.getBodyParts());
		returnValue.setModalities(input.getModalities());
		returnValue.setSort(input.getSort());
		returnValue.setTotalPatients(input.getTotalPatients());

		return returnValue;
	}
    private static PatientSearchSummary computeBodyPartsAndModalities(PatientSearchSummary input) {
    	Set<String> bodyParts=new HashSet<String>();
    	Set<String> modalities=new HashSet<String>();
    	for (PatientSearchResultWithModilityAndBodyPart item:input.getResultSet()) {
    		if (item.getBodyParts()!=null) {
    			bodyParts.addAll(item.getBodyParts());
    		}
    		if (item.getModalities()!=null) {
    			modalities.addAll(item.getModalities());
    		}
    	}
    	input.setBodyParts(bodyParts);
    	input.setModalities(modalities);
    	return input;
    }
}
