package gov.nih.nci.nbia.restUtil;



import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import gov.nih.nci.nbia.textsupport.PatientTextSearchResultImpl;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;
import gov.nih.nci.nbia.dto.*;

import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jackson.map.annotate.*;

public class JSONDeserializer {
static List<PopupCriteriaSelectorDTO> popupDTOs=null;
static Map<String, AdvancedCriteriaDTO> advancedMap=null; 
public static List<PopupCriteriaSelectorDTO> getPopUpCriteriaFromJson(){
	if (popupDTOs!=null) {
		return popupDTOs;
	}
	try {
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		InputStream input = classLoader.getResourceAsStream("AdvancedQCCriteria.json");
		ObjectMapper mapper = new ObjectMapper();
		popupDTOs = mapper.readValue(input, new TypeReference<List<PopupCriteriaSelectorDTO>>(){});
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return popupDTOs;
	
}
public static Map<String, AdvancedCriteriaDTO> getAdvancedCriteriaFromJson(){
	if (advancedMap!=null) {
		return advancedMap;
	}
	try {
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		InputStream input = classLoader.getResourceAsStream("AdvancedQCData.json");
		ObjectMapper mapper = new ObjectMapper();
		List<AdvancedCriteriaDTO> list= mapper.readValue(input, new TypeReference<List<AdvancedCriteriaDTO>>(){});
		advancedMap=new HashMap<String, AdvancedCriteriaDTO>();
		for (AdvancedCriteriaDTO item:list) {
			advancedMap.put(item.getCriteriaType(), item);
		}
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return advancedMap;
	
}
}
