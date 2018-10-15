package gov.nih.nci.nbia.restUtil;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.searchresult.ExtendedPatientSearchResult;
import gov.nih.nci.nbia.dto.CustomSeriesListDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dto.ImageDTO;
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;
import gov.nih.nci.nbia.dto.CriteriaValuesForPatientDTO;
import gov.nih.nci.nbia.dto.*;
import gov.nih.nci.nbia.util.*;

import java.io.IOException;
import java.util.List;

import gov.nih.nci.nbia.textsupport.PatientTextSearchResultImpl;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
public class JSONUtil {
	
	public static String getJSONforPatients(List<PatientSearchResult> patients){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(patients);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	
	public static String getJSONforPatientSearchSummary(PatientSearchSummary patients){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(patients);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	
	public static String getJSONforPatientSearchSummary(TextSearchSummary patients){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(patients);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	
	public static String getJSONforPatientsWithModalityAndBodyPart(List<PatientSearchResultWithModilityAndBodyPart> patients){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(patients);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforExtendedPatients(List<ExtendedPatientSearchResult> patients){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(patients);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforTextPatients(List<PatientTextSearchResult> patients){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(patients);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforStudies(List<StudyDTO> studies){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(studies);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforImages(List<ImageDTO> images){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(images);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforDicomTagDTOs(List<DicomTagDTO> DicomTagDTOs){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(DicomTagDTOs);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforCollectionCounts(List<ValuesAndCountsDTO> valuesAndCounts){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(valuesAndCounts);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforCollectionDecs(List<CollectionDescDTO> collectionDescs){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(collectionDescs);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforPatientCounts(List<CriteriaValuesForPatientDTO> valuesAndCounts){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(valuesAndCounts);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforTreeNode(TreeNode valuesAndCounts){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(valuesAndCounts);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforStringList(List<String> values){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(values);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforShareList(CustomSeriesListDTO value){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			jsonInString = mapper.writeValueAsString(value);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
}
