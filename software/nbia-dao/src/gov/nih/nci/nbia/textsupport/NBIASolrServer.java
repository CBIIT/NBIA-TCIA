package gov.nih.nci.nbia.textsupport;

import java.io.File;

import org.apache.log4j.Logger;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.client.solrj.request.CoreAdminRequest;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.params.ModifiableSolrParams;
import org.apache.solr.core.CoreContainer;
import java.nio.file.*;
import java.util.*;
import gov.nih.nci.nbia.util.NCIAConfig;

public class NBIASolrServer implements SolrServerInterface{
	   private static SolrClient server;
	   private static String solrHome=NCIAConfig.getSolrHome();
	   static Logger log = Logger.getLogger(NBIASolrServer.class);
	   // Spring maintains this as a singleton so this only happens once
	   public NBIASolrServer() {
	         startServer();
	   }
	   private void startServer()
	   {
		   try {
			String solrType=NCIAConfig.getSolrType();
			
			if (solrType!=null&&!solrType.equalsIgnoreCase("external")&&!solrType.equalsIgnoreCase("single")) {
				System.out.println("SolrHome is " + solrHome);
				Path serverPath = Paths.get(solrHome);
				server = new EmbeddedSolrServer(serverPath, "nbia");
				log.info("Embedded Solr Server started successfully");
			} else if (solrType!=null&&solrType.equalsIgnoreCase("external")) {
				String solrUrls=NCIAConfig.getSolrUrls();
				if (solrUrls==null||solrUrls.isEmpty()) {
					throw new Exception("Solr URLs not specified");
				}
				List<String> solrUrlList = Arrays.asList(solrUrls.split(",", -1));
				CloudSolrClient client=new CloudSolrClient.Builder(solrUrlList).build();
				client.setDefaultCollection("nbia");
				System.out.println("----------External Solr Servers----------->"+solrUrlList);
				server =client;
			} else {
				String solrUrls=NCIAConfig.getSolrUrls();
				if (solrUrls==null||solrUrls.isEmpty()) {
					throw new Exception("Solr URLs not specified");
				}
				HttpSolrClient client=new HttpSolrClient.Builder(solrUrls+"/nbia").build();
				System.out.println("----------External Solr Servers----------->"+solrUrls);
				server =client;
			}

		} catch (Exception e) {
			log.error("Unable to start Solr");
			e.printStackTrace();
		}
	   }

	   protected void finalize() throws Throwable {
		     try {
		    	 server.close();;        // close open files
		     } finally {
		         super.finalize();
		     }
	   }
	   public SolrClient GetServer()
	   {
		   return server;
	   }
	   public String getSolrHome()
	   {
		   return solrHome;
	   }
}
