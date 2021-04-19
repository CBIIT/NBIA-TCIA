/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.util;

import gov.nih.nci.nbia.download.SeriesData;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

/**
 * @author lethai
 *
 */
public class JnlpArgumentsParser {

    public static List<SeriesData> parse(String [] args){
        int length = args.length;
        List<SeriesData> seriesDataList = new ArrayList<SeriesData>();     

        for(int i=0; i< length; i++ ) {          	
            SeriesData series = new SeriesData();
            String[] result = StringUtils.split(args[i],"\\|");
            if(result != null && result.length > 0) {
                series.setCollection(result[0]);
                series.setPatientId(result[1]);
                series.setStudyInstanceUid(result[2]);
                series.setSeriesInstanceUid(result[3]);
                if(result[4].equalsIgnoreCase("yes") ){
                    series.setHasAnnotation(true);
                }else if(Boolean.valueOf(result[4])){
                    series.setHasAnnotation(true);
                }
                //series.setHasAnnotation(Boolean.valueOf(result[4]));
                series.setNumberImages(result[5]);
                series.setImagesSize(Long.valueOf(result[6]));
                series.setAnnoSize(Long.valueOf(result[7]));

                series.setUrl(result[8]);
                series.setDisplayName(result[9]);
                series.setLocal(Boolean.valueOf(result[10]));
                series.setStudyDate(result[11]);
                series.setStudyId(result[12]);
                series.setStudyDesc(result[13]);
                series.setSeriesNum(result[14]);
                series.setSeriesDesc(result[15]);

                if (result.length >= 24) {
	                series.setThirdPartyAnalysis(result[16]);
	    	        series.setDescriptionURI(result[17]);
	    	        series.setManufacturer(result[18]);
	    	        series.setModality(result[19]);
	    	        series.setSopClassUID(result[20]);
	    	        series.setSopClassName(result[21]);
	    	        series.setLicenseName(result[22]);
	    	        series.setLicenseUrl(result[23]);
                }
                seriesDataList.add(series);
            }
        }
        return seriesDataList;
    }
}