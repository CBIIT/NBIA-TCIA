package gov.nih.nci.nbia.restUtil;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import gov.nih.nci.nbia.searchresult.ExtendedPatientSearchResult;
import gov.nih.nci.nbia.dto.CustomSeriesListDTO;
import gov.nih.nci.nbia.dto.StudyDTO;
import gov.nih.nci.nbia.dto.ImageDTO;
import gov.nih.nci.nbia.dto.ValuesAndCountsDTO;
import gov.nih.nci.nbia.dto.CriteriaValuesForPatientDTO;
import gov.nih.nci.nbia.dto.SpeciesDTO;
import gov.nih.nci.nbia.dto.*;
import gov.nih.nci.nbia.dto.DOIDTO;
import gov.nih.nci.nbia.util.*;
import gov.nih.nci.nbia.deletion.DeletionDisplayObject;


import java.io.IOException;
import java.util.List;

import gov.nih.nci.nbia.textsupport.PatientTextSearchResultImpl;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.core.type.TypeReference;

import com.fasterxml.jackson.annotation.JsonInclude;

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
      mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

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
	public static String getJSONforCollectionCounts_v4(List<Object[]> valuesAndCounts){
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

	public static String getJSONforCollectionDecs_v4(List<CollectionDescDTO> collectionDescs){
    String jsonInString = null;
    try {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.valueToTree(collectionDescs);

    if (root.isArray()) {
        for (JsonNode node : root) {
            if (node.isObject()) {
                ObjectNode obj = (ObjectNode) node;
                obj.remove("collectionDescTimestamp");
                obj.remove("userName");
                obj.remove("licenseId");
            }
        }
    }
    
    // Convert back to JSON string
    return mapper.writeValueAsString(root);

    } catch (Exception e) {
        e.printStackTrace();
        return "Unable to map to JSON";
    }
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
	public static String getJSONforSpecies(List<SpeciesDTO> value){
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
	public static String getJSONforQCList(List<QcSearchResultDTO> value){
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
	
	public static String getJSONforQCListLight(List<QcSearchResultDTOLight> value){
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
	public static String getJSONforQcStatusHistory(List<QcStatusHistoryDTO> value){
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
	public static String getJSONforDeletionDisplayObject(List<DeletionDisplayObject> value){
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
	public static String getJSONforLicense(List<LicenseDTO> value){
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
	public static String getJSONforTimepoint(TimePointDTO value){
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
	public static String getJSONforPopupCriteriaSelector(List<PopupCriteriaSelectorDTO> value){
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
	public static String getJSONforDOI(List<DOIDTO> dois){
		String jsonInString = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
      mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

			jsonInString = mapper.writeValueAsString(dois);
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
	public static String getJSONforSite(SiteDTO site){
		String jsonInString = null;
		try {
			if (site.getSiteName()!=null) {
			  ObjectMapper mapper = new ObjectMapper();
			  jsonInString = mapper.writeValueAsString(site);
			} else {
				jsonInString="{}";
			}
		} catch (Exception e) {

			e.printStackTrace();
			return("Unable to map to JSON");
		}
		return jsonInString;
	}
}
