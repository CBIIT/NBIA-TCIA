package gov.nih.nci.nbia.textsupport;

import gov.nih.nci.nbia.util.SpringApplicationContext;

import java.io.IOException;
import java.util.*;

import org.apache.log4j.Logger;
import org.apache.solr.common.params.GroupParams;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.request.CoreAdminRequest;
import org.apache.solr.client.solrj.request.LukeRequest;
import org.apache.solr.client.solrj.response.LukeResponse;
import java.util.concurrent.TimeUnit;
public class SolrFieldBuilder {
	private static Logger log = Logger.getLogger(SolrFieldBuilder.class);
	private static HashMap<String,String> dicomFieldMap=null; 
	private static long now=1L;
	public static Map<String,String> getTerms()
	{
      try {
    	      if (dicomFieldMap==null&&System.currentTimeMillis()>now) {
    	    	  refeshMap();
    	    	  now = System.currentTimeMillis() + TimeUnit.DAYS.toMillis(1);
    	      }
		} catch (Exception e) {

			e.printStackTrace();
		} 
		return dicomFieldMap;

	}
    public static void refeshMap() {
    	dicomFieldMap=new HashMap<String,String>();
    	SolrServerInterface serverAccess = (SolrServerInterface)SpringApplicationContext.getBean("solrServer");
	    SolrServer server = serverAccess.GetServer();
	    try {
			CoreAdminRequest.reloadCore("collection1", server);
		} catch (SolrServerException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	    LukeRequest lukeRequest = new LukeRequest();
	    lukeRequest.setNumTerms(0);

	    LukeResponse lukeResponse ;
	    try {
			lukeResponse = lukeRequest.process(server);
		} catch (Exception e) {
			
			e.printStackTrace();
			return;

		}
	    dicomFieldMap=new HashMap<String,String>();
	    Map<String, LukeResponse.FieldInfo> fieldInfoMap = lukeResponse.getFieldInfo();

	    for (Map.Entry<String, LukeResponse.FieldInfo> entry : fieldInfoMap.entrySet()) {

	      String fieldName = entry.getKey();

	      if (fieldName.startsWith("d_")) {
	    	  try {
				String elementValue=fieldName.substring(2, 11);
				  String dicomField=fieldName.substring(12);
				  if (elementValue.trim().length()>2) {
				    dicomFieldMap.put(elementValue, fieldName);
				  }
				  if (dicomField.trim().length()>2) {
				     dicomFieldMap.put(dicomField.replaceAll("_", " "), fieldName);
				  }
			} catch (Exception e) {
				System.out.println(fieldName);
			}
	      }

	    }
       /** for (Map.Entry<String, String> entry : dicomFieldMap.entrySet()) {
            System.out.println("dicom : " + entry.getKey() + " solr : " + entry.getValue());
        } */
    }
	
}
