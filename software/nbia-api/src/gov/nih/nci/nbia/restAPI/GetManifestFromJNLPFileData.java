package gov.nih.nci.nbia.restAPI;

import java.io.*;
import java.util.List;
import java.util.ArrayList;

import javax.ws.rs.Path;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import gov.nih.nci.nbia.restUtil.ManifestMaker;

@Path("/getManifestFromJNLPFileData")
public class GetManifestFromJNLPFileData extends getData {
	public final static String TEXT_CSV = "text/csv";

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
