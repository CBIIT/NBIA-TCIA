package gov.nih.nci.nbia.restAPI;

import java.io.File;

import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.dbadapter.NonCTPDatabaseDelegator;
import java.io.File;
public class FileSubmitter {
	
public static String submit(String file, String project, String siteName, 
		String siteID, String batch, String thirdPartyAnalysis, String descriptionURI, String fileId, String overwrite) throws Exception{
	File dfile=new File(file);
	if (!dfile.isFile()) {
		throw new Exception("File not found "+dfile);
	}
	NonCTPDatabaseDelegator delegator = (NonCTPDatabaseDelegator)SpringApplicationContext.getBean("nciaDelegator");
	delegator.setCorrectFileSize(dfile);
	return delegator.process(dfile, null, project, siteName, siteID, null, batch, thirdPartyAnalysis, descriptionURI, fileId, overwrite);
	
	}
}
