/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
 *
 */
package gov.nih.nci.nbia;

import gov.nih.nci.nbia.download.SeriesData;
import gov.nih.nci.nbia.ui.DownloadManagerFrame;
import gov.nih.nci.nbia.util.JnlpArgumentsParser;
import gov.nih.nci.nbia.util.PropertyLoader;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.ProxySelector;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.ProxySelectorRoutePlanner;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;

/**
 * @author Thai Thi Le
 *
 */
public class Application {
	public static Integer getNumberOfMaxThreads(){
		return new Integer(NBIA_PROPERTIES.getProperty( "number_max_threads"));
	}
	public static String getOnlineHelpUrl(){
		return NBIA_PROPERTIES.getProperty("online_help_url");
	}

	public static void setFileLocation(String f){
		fileLocation = f;
	}

	public static String getFileLocation(){
		return fileLocation;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String userId = System.getProperty("jnlp.userId");
		String password = System.getProperty("jnlp.password");
		String codebase = System.getProperty("jnlp.codebase");
		Application.codebase = codebase;
		String serverUrl = System.getProperty("jnlp.downloadServerUrl");
		boolean includeAnnotation = Boolean.valueOf((System.getProperty("jnlp.includeAnnotation")));
		Integer noOfRetry = NumberUtils.toInt(System.getProperty("jnlp.noofretry"));

		if(args != null && ( args.length > 0)) {
			String fileName = args[0];
			List<String> seriesInfo = null;
//	    	long start = System.currentTimeMillis();
			try {
				seriesInfo = connectAndReadFromURL(new URL(serverUrl),fileName);
			} catch (MalformedURLException e1) {
				e1.printStackTrace();
			}
			String[] strResult=new String[seriesInfo.size()];
			seriesInfo.toArray(strResult);
			List<SeriesData> seriesData = JnlpArgumentsParser.parse(strResult);
//			long end = System.currentTimeMillis();
//	        System.out.println("launch time---"+(end - start) / 1000f + " seconds");
    		DownloadManagerFrame manager = new DownloadManagerFrame(userId,
    				                                                password,
    				                                                includeAnnotation,
    				                                                seriesData,
    				                                                serverUrl, noOfRetry);
    		manager.setVisible(true);
		}
	}

    private  static List<String> connectAndReadFromURL(URL url, String fileName) {
        List<String>  data = null;
        DefaultHttpClient httpClient = null;
        TrustStrategy easyStrategy = new TrustStrategy() {
            @Override
            public boolean isTrusted(X509Certificate[] certificate, String authType)
                    throws CertificateException {
                return true;
            }
        };
        try {
            //SSLContext sslContext = SSLContext.getInstance("SSL");
            // set up a TrustManager that trusts everything
            //sslContext.init(null, new TrustManager[] { new EasyX509TrustManager(null)}, null);

            SSLSocketFactory sslsf = new SSLSocketFactory(easyStrategy,SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
            Scheme httpsScheme = new Scheme("https", 443, sslsf);
            SchemeRegistry schemeRegistry = new SchemeRegistry();
            schemeRegistry.register(httpsScheme);
            schemeRegistry.register(new Scheme("http", 80,PlainSocketFactory.getSocketFactory()));
            ClientConnectionManager ccm = new ThreadSafeClientConnManager(schemeRegistry);

	        HttpParams httpParams = new BasicHttpParams();
	        HttpConnectionParams.setConnectionTimeout(httpParams, 50000);
	        HttpConnectionParams.setSoTimeout(httpParams,  new Integer(120000));
	        httpClient = new DefaultHttpClient(ccm,httpParams);
	        httpClient.setRoutePlanner(new ProxySelectorRoutePlanner(schemeRegistry, ProxySelector.getDefault()));
	//        // Additions by lrt for tcia -
	//        //    attempt to reduce errors going through a Coyote Point Equalizer load balance switch
	        httpClient.getParams().setParameter("http.socket.timeout", new Integer(120000));
	        httpClient.getParams().setParameter("http.socket.receivebuffer", new Integer(16384));
	        httpClient.getParams().setParameter("http.tcp.nodelay", true);
	        httpClient.getParams().setParameter("http.connection.stalecheck", false);
	//        // end lrt additions

	        HttpPost httpPostMethod = new HttpPost(url.toString());

	        List<BasicNameValuePair> postParams = new ArrayList<BasicNameValuePair>();
	        postParams.add(new BasicNameValuePair("serverjnlpfileloc",fileName));
	        UrlEncodedFormEntity query = new UrlEncodedFormEntity(postParams);
	        httpPostMethod.setEntity(query);
	        HttpResponse response = httpClient.execute(httpPostMethod);
//            int responseCode = response.getStatusLine().getStatusCode();
//            System.out.println("response code for jnlp datda file: " + responseCode);
            InputStream inputStream = response.getEntity().getContent();
            data = IOUtils.readLines(inputStream);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            // 	TODO Auto-generated catch block
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (KeyStoreException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnrecoverableKeyException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
            if (httpClient != null) {
                httpClient.getConnectionManager().shutdown();
            }
        }
        return data;
    }

	 private static Properties NBIA_PROPERTIES = null;

	 private static String fileLocation="";
	 private static String codebase;

	 static{
	     try {
	    	 NBIA_PROPERTIES =  PropertyLoader.loadProperties( "config.properties");
	     }
	     catch(Exception e){
	    	 /*
	    	  * Create EMPTY properties to avoid null pointer exceptions
	    	  */
	    	 if(NBIA_PROPERTIES==null){
	    		 NBIA_PROPERTIES = new Properties();
	    	 }
	     }
     }
}
