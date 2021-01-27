package gov.nih.nci.nbia.restUtil;



import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import gov.nih.nci.nbia.textsupport.PatientTextSearchResultImpl;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;

import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jackson.map.annotate.*;

public class JSONDeserializer {
	
public static List<PopupCriteriaSelectorDTO> getPopUpCriteriaFromJson(){
	List<PopupCriteriaSelectorDTO> returnValue=null;
	try {
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		InputStream input = classLoader.getResourceAsStream("PopUpCriteria.json");
		ObjectMapper mapper = new ObjectMapper();
		returnValue = mapper.readValue(input, new TypeReference<List<PopupCriteriaSelectorDTO>>(){});
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return returnValue;
	
}
}
