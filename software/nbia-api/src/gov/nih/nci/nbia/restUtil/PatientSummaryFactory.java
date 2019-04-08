package gov.nih.nci.nbia.restUtil;
import java.util.HashMap;
import java.util.List;
import java.util.*;

import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
public class PatientSummaryFactory {
	public static PatientSearchSummary getNewPatientSearchSummary(List<PatientSearchResultWithModilityAndBodyPart> input, String sort, boolean compute,
			List <ValueAndCount> bodyCounts, List <ValueAndCount> modalityCounts, List <ValueAndCount> collectionCounts, List <ValueAndCount> speciesCounts) {
		PatientSearchSummary returnValue = new PatientSearchSummary();
		returnValue.setResultSet(input);
		returnValue.setSort(sort);
		returnValue.setTotalPatients(input.size());
		if (compute) {
		    returnValue=computeBodyPartsAndModalities(returnValue);
		} else {
			returnValue.setBodyParts(bodyCounts);
			returnValue.setModalities(modalityCounts);
			returnValue.setCollections(collectionCounts);
			returnValue.setCollections(speciesCounts);
		}
		return returnValue;
	}
	public static PatientSearchSummary getReturnValue(PatientSearchSummary input, int start, int size) {
		PatientSearchSummary returnValue = new PatientSearchSummary();
	   	if (size+start>input.getResultSet().size()) {
			size=input.getResultSet().size()-start;
		} 
		returnValue.setResultSet(input.getResultSet().subList(start, start+size));
		returnValue.setBodyParts(input.getBodyParts());
		returnValue.setModalities(input.getModalities());
		returnValue.setCollections(input.getCollections());
		returnValue.setSpecies(input.getSpecies());
		returnValue.setSort(input.getSort());
		returnValue.setTotalPatients(input.getTotalPatients());

		return returnValue;
	}
    private static PatientSearchSummary computeBodyPartsAndModalities(PatientSearchSummary input) {
    	Map<String, Integer> bodyParts=new HashMap<String, Integer>();
    	Map<String, Integer> modalities=new HashMap<String, Integer>();
    	Map<String, Integer> collections=new HashMap<String, Integer>();
    	Map<String, Integer> species=new HashMap<String, Integer>();
    	for (PatientSearchResultWithModilityAndBodyPart item:input.getResultSet()) {
    		try {
				if (item.getBodyParts()!=null) {
					for (String part: item.getBodyParts()) {
					     if (bodyParts.get(part)!=null){
					    	 Integer count = bodyParts.get(part);
					    	 count++;
					    	 bodyParts.put(part, count);
					     } else {
					    	 bodyParts.put(part, new Integer(1));
					     }
					}
				}
				if (item.getModalities()!=null) {
					for (String modality: item.getModalities()) {
					     if (modalities.get(modality)!=null){
					    	 Integer count = modalities.get(modality);
					    	 count++;
					    	 modalities.put(modality, count);
					     }else {
					    	 modalities.put(modality, new Integer(1));
					     }
					}
				}
				if (item.getSpecies()!=null) {
					for (String specie: item.getSpecies()) {
					     if (species.get(specie)!=null){
					    	 Integer count = species.get(specie);
					    	 count++;
					    	 species.put(specie, count);
					     }else {
					    	 species.put(specie, new Integer(1));
					     }
					}
				}
				if (item.getProject()!=null) {
				   if (collections.get(item.getProject())!=null){
					 Integer count = collections.get(item.getProject());
					 count++;
					 collections.put(item.getProject(), count);
					} else {
						collections.put(item.getProject(), new Integer(1));
				     }
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
    	}
       List <ValueAndCount> bodyCounts = new ArrayList<ValueAndCount>();
       List <ValueAndCount> modalityCounts = new ArrayList<ValueAndCount>();
       List <ValueAndCount> collectionCounts = new ArrayList<ValueAndCount>();
       List <ValueAndCount> speciesCounts = new ArrayList<ValueAndCount>();
      
       for (Map.Entry<String, Integer> entry : bodyParts.entrySet()) {
          String key = entry.getKey();
          Integer value = entry.getValue();
          ValueAndCount item = new ValueAndCount();
          item.setValue(key);
          item.setCount(value.intValue());
          bodyCounts.add(item);
        }
       for (Map.Entry<String, Integer> entry : modalities.entrySet()) {
           String key = entry.getKey();
           Integer value = entry.getValue();
           ValueAndCount item = new ValueAndCount();
           item.setValue(key);
           item.setCount(value.intValue());
           modalityCounts.add(item);
         }
       for (Map.Entry<String, Integer> entry : species.entrySet()) {
           String key = entry.getKey();
           Integer value = entry.getValue();
           ValueAndCount item = new ValueAndCount();
           item.setValue(key);
           item.setCount(value.intValue());
           speciesCounts.add(item);
         }
       for (Map.Entry<String, Integer> entry : collections.entrySet()) {
           String key = entry.getKey();
           Integer value = entry.getValue();
           ValueAndCount item = new ValueAndCount();
           item.setValue(key);
           item.setCount(value.intValue());
           collectionCounts.add(item);
         }
    	input.setBodyParts(bodyCounts);
    	input.setModalities(modalityCounts);
    	input.setSpecies(speciesCounts);
    	input.setCollections(collectionCounts);
    	return input;
    }
}
