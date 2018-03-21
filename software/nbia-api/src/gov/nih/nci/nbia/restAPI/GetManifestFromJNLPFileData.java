//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=json
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=html
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=xml
//To Test: http://localhost:8080/nbia-api/api/v1/getCollectionValues?format=csv


package gov.nih.nci.nbia.restAPI;

import java.io.*;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.Consumes;



import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.nbia.lookup.*;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.util.StringEncrypter;
import gov.nih.nci.nbia.security.*;
import gov.nih.nci.nbia.util.SiteData;
import gov.nih.nci.nbia.restUtil.AuthorizationUtil;
import gov.nih.nci.nbia.restUtil.ManifestMaker;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.searchresult.SeriesSearchResult;
import gov.nih.nci.nbia.util.SeriesDTOConverter;



@Path("/getManifestFromJNLPFileData")
public class GetManifestFromJNLPFileData extends getData {
	public final static String TEXT_CSV = "text/csv";

	@Context
	private HttpServletRequest httpRequest;
	private HashSet<String> collectionSet;

	/**
	 * This method get a set of all collection names
	 *
	 * @return String - set of collection names
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	
	public Response constructResponse(@FormParam("jnlpArgument") String jnlpArgument,
			@FormParam("includeAnnotation") String includeAnnotation) {

		try {


			
			long currentTimeMillis = System.currentTimeMillis();
			String manifestFileName = "manifest-" + currentTimeMillis + ".tcia";
			System.out.println("looking for file name ..."+jnlpArgument);
            List <String> readLines = IOUtils.readLines(new FileReader(jnlpArgument));
           	List <String> seriesIds=parse(readLines);
			
			String manifest=ManifestMaker.getManifextFromSeriesIds(seriesIds, includeAnnotation, manifestFileName);
			return Response.ok(manifest).type("application/x-nbia-manifest-file").build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(500).entity("Server was not able to process your request").build();
	}

    private static List<String> parse(List<String> args){
        List<String> seriesDataList = new ArrayList<String>();
        for(String seriesData:args ) {
            String series;
            String[] result = StringUtils.split(seriesData,"\\|");
            if(result != null && result.length > 0) {
                series=result[3];
                seriesDataList.add(series);
            }
        }
        return seriesDataList;
    }
}
