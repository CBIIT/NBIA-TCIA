package gov.nih.nci.nbia.restUtil;
import java.util.*;

import gov.nih.nci.nbia.query.DICOMQuery;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModalityAndBodyPartImpl;
import gov.nih.nci.nbia.searchresult.StudyIdentifiers;
import gov.nih.nci.nbia.searchresult.SeriesAndModality;
import gov.nih.nci.ncia.criteria.ImageModalityCriteria;
public class PatientSummaryFactory {
	public static PatientSearchSummary getNewPatientSearchSummary(List<PatientSearchResultWithModilityAndBodyPart> input, String sort, boolean compute,
			List <ValueAndCount> bodyCounts, List <ValueAndCount> modalityCounts, List <ValueAndCount> collectionCounts, 
			List <ValueAndCount> speciesCounts, DICOMQuery theQuery) {
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
			returnValue.setSpecies(speciesCounts);
		}
		if (isModalityAll(theQuery)) {
			returnValue.setResultSet(cleanAllModalityScans(returnValue.getResultSet(), theQuery));
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
		returnValue.setMaxTimepoints(input.getMaxTimepoints());
		returnValue.setMinTimepoints(input.getMinTimepoints());
		returnValue.setSort(input.getSort());
		returnValue.setTotalPatients(input.getTotalPatients());

		return returnValue;
	}
    private static PatientSearchSummary computeBodyPartsAndModalities(PatientSearchSummary input) {
    	Map<String, Integer> bodyParts=new HashMap<String, Integer>();
    	Map<String, Integer> modalities=new HashMap<String, Integer>();
    	Map<String, Integer> collections=new HashMap<String, Integer>();
    	Map<String, Integer> species=new HashMap<String, Integer>();
    	Map<String, Integer> maxTimepoint=new HashMap<String, Integer>();
    	Map<String, Integer> minTimepoint=new HashMap<String, Integer>();
    	for (PatientSearchResultWithModilityAndBodyPart item:input.getResultSet()) {
    		try {
				if (item.getBodyParts()!=null&&item.getBodyParts().size()>0) {
					for (String part: item.getBodyParts()) {
						 if (part==null||part.isEmpty()) {
							 part="NOT SPECIFIED";
						 }
					     if (bodyParts.get(part)!=null){
					    	 Integer count = bodyParts.get(part);
					    	 count++;
					    	 bodyParts.put(part, count);
					     } else {
					    	 bodyParts.put(part, new Integer(1));
					     }
					}
				} else {

				     if (bodyParts.get("NOT SPECIFIED")!=null){
				    	 Integer count = bodyParts.get("NOT SPECIFIED");
				    	 count++;
				    	 bodyParts.put("NOT SPECIFIED", count);
				     } else {
				    	 bodyParts.put("NOT SPECIFIED", new Integer(1));
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
				if (item.getTimepoints()!=null) {
					Map<String, HashSet<Integer>> itemTimepoints= item.getTimepoints();
			        for (Map.Entry<String,HashSet<Integer>> entry : itemTimepoints.entrySet())  {
			        	for (Integer currentTimepoint : entry.getValue()) {
				        	Integer existingMax=maxTimepoint.get(entry.getKey());
				        	Integer existingMin=minTimepoint.get(entry.getKey());
			        	     if (existingMax==null) {
			        		     maxTimepoint.put(entry.getKey(), currentTimepoint);
			        	     } else {
			        		     if (currentTimepoint>existingMax) {
			        			     maxTimepoint.put(entry.getKey(), currentTimepoint);
			        		     }
			        	     }
			        	     if (existingMin==null) {
			        	    	 minTimepoint.put(entry.getKey(), currentTimepoint);
			        	     } else {
			        		     if (currentTimepoint<existingMin) {
			        			     minTimepoint.put(entry.getKey(), currentTimepoint);
			        		     }
			        	     } 

			        	}
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
    	input.setMaxTimepoints(maxTimepoint);
    	input.setMinTimepoints(minTimepoint);
    	return input;
    }
    private static boolean isModalityAll(DICOMQuery theQuery) {
    	 if (theQuery == null || theQuery.getModalityAndedSearchCriteria()==null) {
    		 return false;
		}
		if (theQuery != null &&
        		 theQuery.getModalityAndedSearchCriteria().getModalityAndedSearchValue()!=null &&
        		theQuery.getModalityAndedSearchCriteria().getModalityAndedSearchValue().equals("all")) {
              return true;
       } 
       return false;
    }
    private static List<PatientSearchResultWithModilityAndBodyPart> cleanAllModalityScans(List<PatientSearchResultWithModilityAndBodyPart> input,
    		DICOMQuery theQuery){
    	
    	List<PatientSearchResultWithModilityAndBodyPart> returnValue=new ArrayList<PatientSearchResultWithModilityAndBodyPart>();
    	List<String> modalityCriteriaList = new ArrayList<String>(theQuery.getImageModalityCriteria().getImageModalityObjects());
    	for (PatientSearchResultWithModilityAndBodyPart patient : input) {
    		 List<StudyIdentifiers> newStudyIdentifiers = new ArrayList<StudyIdentifiers>();
    		 for (StudyIdentifiers sdi : patient.getStudyIdentifiers()) {
    			 List<Integer> seriesIdsPerStudy = new ArrayList<Integer>();
    			 for (SeriesAndModality sam : sdi.getSeriesAndModality()) {
    				 if(modalityCriteriaList.contains(sam.getModality())){
    					 seriesIdsPerStudy.add(sam.getSeriesId());
    				 }
    				  				 
    			 }
    			 if (seriesIdsPerStudy.size()>0) {
    				 StudyIdentifiers newSDI = new StudyIdentifiers();
    				 newSDI.setStudyIdentifier(sdi.getStudyIdentifier());
    				 newSDI.setSeriesIdentifiers(seriesIdsPerStudy.toArray(new Integer[0]));
    				 newStudyIdentifiers.add(newSDI);
    			 }
    			 
    		 }
    		 if (newStudyIdentifiers.size()>0) {
    			 PatientSearchResultWithModalityAndBodyPartImpl patientImpl =  (PatientSearchResultWithModalityAndBodyPartImpl) patient;
    			 Set<String> modalitySet=new HashSet<String>(modalityCriteriaList);
    			 patientImpl.setModalities(modalitySet);
    			 patientImpl.setStudyIdentifiers(newStudyIdentifiers.toArray(new StudyIdentifiers[0]));
    			 returnValue.add(patientImpl);
    		 }
    		 
    	}
    	return returnValue;
    	
    }
}
