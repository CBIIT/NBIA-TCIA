package gov.nih.nci.nbia.restUtil;

import gov.nih.nci.nbia.lookup.BasketSeriesItemBean;
import gov.nih.nci.nbia.util.NCIAConfig;
import java.util.*;

public class ManifestMaker {

	public static String getManifextFromSeriesIds(List <String>seriesIds, String annotation, String manifestFileName) {
		long currentTimeMillis = System.currentTimeMillis();

		
		StringBuffer outSB = new StringBuffer();
		outSB.append("downloadServerUrl=" + NCIAConfig.getDownloadServerUrl() + "\n");
		String annotationString="false";

		if (annotation.equalsIgnoreCase("true")){
	         annotationString="true";
	    }
	
		outSB.append("includeAnnotation=" +  annotationString + "\n");
		outSB.append("noOfrRetry=" + NCIAConfig.getNoOfRetry() + "\n");
		outSB.append("databasketId=" + manifestFileName + "\n");


		// Manifest file will be versioned too
		outSB.append("manifestVersion=" + NCIAConfig.getLatestManifestVersion().trim() + "\n");
		outSB.append("ListOfSeriesToDownload=\n");

		for (String seriesId: seriesIds) {
			outSB.append(seriesId+"\n");
		}
		return outSB.toString();
	}
	
}
