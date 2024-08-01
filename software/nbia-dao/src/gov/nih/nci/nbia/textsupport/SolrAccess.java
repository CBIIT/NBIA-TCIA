package gov.nih.nci.nbia.textsupport;

import gov.nih.nci.nbia.util.SpringApplicationContext;

import java.io.IOException;
import java.util.*;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.solr.common.params.GroupParams;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.client.solrj.util.ClientUtils;
public class SolrAccess {
	static Logger log = LogManager.getLogger(SolrAccess.class);
	private static String getHitText(String hitContext, int index){
		int hitLength=60;
		int offsetFromStart = 20;
		String returnValue = hitContext;
		if (returnValue==null || returnValue.length()<=hitLength) return returnValue;
		if (index<=offsetFromStart) return returnValue.substring(0, 60);
		returnValue = returnValue.substring(index-offsetFromStart);
		if (returnValue.length()<61) return returnValue;
		return returnValue.substring(0, 60);
	}
	public static List<SolrAllDocumentMetaData> querySolr(String queryTerm)
	{
		  List <SolrAllDocumentMetaData> returnValue = new ArrayList<SolrAllDocumentMetaData> ();
		  boolean classicSearch=true;
		  try {			   
			  if (queryTerm==null || queryTerm.length()<2)
			  {
				  return returnValue;
			  }
			  SolrServerInterface serverAccess = (SolrServerInterface)SpringApplicationContext.getBean("solrServer");
			  SolrClient server = serverAccess.GetServer();
			  String term;
			  String tempterm="";
			  String orginalTerm="";
			  if (queryTerm.contains(":")) {
				  try {
					orginalTerm = queryTerm.substring(0, queryTerm.indexOf(":"));
					tempterm = SolrFieldBuilder.getTerms().get(orginalTerm);
					if (tempterm==null || tempterm.length()<2)
					{
						  return returnValue;
					}
					term=ClientUtils.escapeQueryChars(tempterm);
					term=term+queryTerm.substring(queryTerm.indexOf(":"));
					System.out.println("Fielded Search");
					classicSearch=false;
				} catch (Exception e) {
					e.printStackTrace();
					return returnValue;
				}
			  } else {
				   queryTerm=queryTerm.replaceAll(":", "");
				   term = "text:"+queryTerm;
				   System.out.println("Classic Search");
			  }
			   if (queryTerm==null || queryTerm.length()<2)
			   {
			       return returnValue;
			   }
			   System.out.println("Searching for after processing-"+term+"-");
			   SolrQuery query = new SolrQuery(term);
			   query.setHighlight(true).setHighlightSnippets(1);
			   if (classicSearch) {
				   query.addHighlightField("text");
				   query.setFields("id,patientId,f*");
			   } else {
				   query.addHighlightField(tempterm);
				   query.addHighlightField("text");
				   query.setFields("id,patientId,tempterm");
			   }
			   query.setHighlightSimplePre("<strong>");
			   query.setHighlightSimplePost("</strong>");
			   
			   // hold to 3000 values for performance
			   query.setRows(1000);
			   query.setParam(GroupParams.GROUP, Boolean.TRUE);
			   query.setParam(GroupParams.GROUP_FIELD, "patientId"); 
			   query.setParam(GroupParams.GROUP_MAIN, true);
			   query.setParam(GroupParams.GROUP_FORMAT, "simple");
			   query.setParam(GroupParams.GROUP_LIMIT, "1");
			   QueryResponse rsp=null;
			   try {
				rsp = server.query( query );
			   } catch (IOException e) {
				  e.printStackTrace();
			   }
			   SolrDocumentList docs = rsp.getResults();
			   for (SolrDocument doc : docs){
				   String highlightedHit = "";
				   if (classicSearch) {
				       if (rsp.getHighlighting().get(doc.get("id").toString()) != null) {
				          List<String> highlightSnippets = rsp.getHighlighting().get(doc.get("id").toString()).get("text");
				          if (highlightSnippets!=null&&highlightSnippets.size()>0)
				          {
				        	  log.debug("Found highlight"+(String)highlightSnippets.get(0));
				        	  highlightedHit=(String)highlightSnippets.get(0);
				          }
				       }
				   } else  {
					      //System.out.println("--------------looking for highlights---------");
					      Map<String,List<String>> highlightMap=rsp.getHighlighting().get(doc.get("id").toString());
					      Set<String> topKeySet=highlightMap.keySet();
					      //System.out.println("--------------found set----"+topKeySet.size());
					      for (String key: topKeySet) {
					    	  List<String> highlightSnippets =highlightMap.get(key);
					    	  //System.out.println("--------------found list----"+highlightSnippets.size());
					    	  for (String snip:highlightSnippets) {
					    		  //System.out.println("--------------found hit----"+snip);
					    		  highlightedHit=snip;
					    	  }
					      }
				   }
				   SolrAllDocumentMetaData hits=null;
				   if (classicSearch) { 
				       hits = findIndexes(queryTerm, doc, doc.get("id").toString(),
						   highlightedHit);
				   } else {
				       hits = findHits(queryTerm, doc, doc.get("id").toString(),
						   highlightedHit, orginalTerm);
				   }
				   returnValue.add(hits);
			   }
			   
		} catch (SolrServerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return returnValue;

	}
	public static SolrAllDocumentMetaData findIndexes(String term, SolrDocument solrDoc, String documentId,  String highlightedHit)
	{
	    String fieldValue;
	    SolrAllDocumentMetaData found=null;
	    // need to remove wildcards to find in text
	    String localTerm=term.replaceAll("\\*", "");
        localTerm=localTerm.replaceAll("\\?", "");
        // remove the html so I can find the hit in the orginal field
        if (highlightedHit==null)
        {
        	highlightedHit="";
        }
        String localHighlightHit = highlightedHit.replaceAll("<strong>", "");
        localHighlightHit = localTerm.replaceAll("</strong>", "");
		for (String field  : solrDoc.getFieldNames()){
			  if (solrDoc.getFieldValue(field)!=null)
			  {
				  if (field=="id") continue;
				  fieldValue=solrDoc.getFieldValue(field).toString();
				  //System.out.println("field - "+field);
				  //System.out.println("field value is - "+fieldValue);
				  //System.out.println("localHighlightHit value is - "+localHighlightHit);
			      if (fieldValue.toLowerCase().indexOf(localHighlightHit.toLowerCase()) != -1)
			      {
			    	  String foundField = field;
			    	  //up carret is used to mark of the start of a dynamic field
			    	  if (foundField.indexOf("^")>1)
			    	  {
			    		  foundField=foundField.substring(foundField.indexOf("^")+1);
			    	  }
			    	//fields we want to check for text start with f-
			    	  if (foundField.startsWith("f_"))
			    	  {
			    		  foundField=foundField.substring(2);
			    	  }
			    	  if (localHighlightHit!=null&&localHighlightHit.length()>0)
			          {
		    	          found=new SolrAllDocumentMetaData(localTerm, 
		    	        		  "<em>"+foundField+"</em>"+": "+ highlightedHit,
				    			  documentId, (String)solrDoc.getFieldValue("patientId"));
			          }
			    	  else {
			    	          found=new SolrAllDocumentMetaData(localTerm, "<em>"+foundField+"</em>"+": "+
			    	          getHitText(fieldValue, fieldValue.toLowerCase().indexOf(localHighlightHit.toLowerCase())), 
			    			  documentId, (String)solrDoc.getFieldValue("patientId"));
			    	  }
			          return found;
			      }
			  }
		  }
		  // unable to locate where the hit is
          return new SolrAllDocumentMetaData(term, highlightedHit,
    			 documentId, (String)solrDoc.getFieldValue("patientId"));
	}
	 
	public static SolrAllDocumentMetaData findHits(String term, SolrDocument solrDoc, String documentId,  String highlightedHit, String field)
	{
	    String fieldValue;
	    //System.out.println(term+ "-"+field+"-"+": "+
        		//              highlightedHit+"-" +
			    //			  documentId+"-" +(String)solrDoc.getFieldValue("patientId"));
	    SolrAllDocumentMetaData found=null;
        found=new SolrAllDocumentMetaData(term, "<em>"+field+"</em>"+": "+
        		              highlightedHit, 
			    			  documentId, (String)solrDoc.getFieldValue("patientId"));

			          
        return found;
	}
	public static void main(String[] args)
	{

		querySolr("male");
		querySolr("from");
	}
	
}
