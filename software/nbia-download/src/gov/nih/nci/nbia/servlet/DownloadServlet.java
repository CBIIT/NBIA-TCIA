/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.servlet;

import gov.nih.nci.nbia.DownloadProcessor;
import gov.nih.nci.nbia.dao.GeneralSeriesDAO;
import gov.nih.nci.nbia.dto.AnnotationDTO;
import gov.nih.nci.nbia.dto.ImageDTO2;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.lookup.BasketSeriesItemBean;
import gov.nih.nci.nbia.searchresult.SeriesSearchResult;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;
import gov.nih.nci.nbia.util.StringEncrypter;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

/**
 * @author lethai
 *
 */
public class DownloadServlet extends HttpServlet {
    private static Logger logger = Logger.getLogger(DownloadServlet.class);

    public void doPost(HttpServletRequest request,
             HttpServletResponse response) throws ServletException,IOException {
        doGet(request, response);
    }

    public void doGet(HttpServletRequest request,
              HttpServletResponse response) throws ServletException,IOException {
        //first check if its download for jnlpfile at server or dicom images download
        String serverjnlpfileloc = request.getParameter("serverjnlpfileloc");
        if(StringUtils.isNotBlank(serverjnlpfileloc)) {
            downloadJNLPDataFile(serverjnlpfileloc, response);
        } else {
            String seriesUid = request.getParameter("seriesUid");
            String userId = request.getParameter("userId");
            String password = request.getHeader("password");
            Boolean includeAnnotation = Boolean.valueOf(request.getParameter("includeAnnotation"));
            Boolean hasAnnotation = Boolean.valueOf(request.getParameter("hasAnnotation"));
            String sopUids = request.getParameter("sopUids");          		
            
            if ((userId==null) ||(userId.length() <1)) {
            	userId = NCIAConfig.getGuestUsername();
            }

            logger.info("sopUids:"+sopUids);
            logger.info("seriesUid: " + seriesUid + " userId: " + userId + " includeAnnotation: " + includeAnnotation + " hasAnnotation: " + hasAnnotation);

            processRequest(response,
                       seriesUid,
                       userId,
                       password,
                       includeAnnotation,
                       hasAnnotation,
                       sopUids);
        	}
    }
    
	protected void processRequest(HttpServletResponse response, String seriesUid, String userId, String password,
			Boolean includeAnnotation, Boolean hasAnnotation, String sopUids) throws IOException {

		DownloadProcessor processor = new DownloadProcessor();
		List<AnnotationDTO> annoResults = new ArrayList<AnnotationDTO>();
		boolean hasAccess = false;

		try {
			password = decrypt(password);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		List<ImageDTO2> imageResults = processor.process(seriesUid, sopUids);
		if ((imageResults == null) || imageResults.isEmpty()) {
			// no data for this series
			logger.info("no data for series: " + seriesUid);
		} else {
			hasAccess = processor.hasAccess(userId, password, imageResults.get(0).getProject(),
					imageResults.get(0).getSite(), imageResults.get(0).getSsg());
		}

		if (hasAccess) {
			if (includeAnnotation && hasAnnotation) {
				annoResults = processor.process(seriesUid);
			}
			sendResponse(response, imageResults, annoResults);
			// compute the size for this series
			long size = computeContentLength(imageResults, annoResults);
			try {
				processor.recordDownload(seriesUid, userId, size);
			} catch (Exception e) {
				logger.error("Exception recording download " + e.getMessage());
			}
		}
	}
	
    private void sendResponse(HttpServletResponse response,
            List<ImageDTO2> imageResults,
            List<AnnotationDTO> annoResults) throws IOException {

        TarArchiveOutputStream tos = new TarArchiveOutputStream(response.getOutputStream());

        try {
            long start = System.currentTimeMillis();

            logger.info("images size: " + imageResults.size() + " anno size: " + annoResults.size());

            sendAnnotationData(annoResults, tos);
            sendImagesData(imageResults, tos);

            logger.info("total time to send  files are " + (System.currentTimeMillis() - start)/1000 + " ms.");
        }
        finally {
            IOUtils.closeQuietly(tos);
        }
    }

    private void sendImagesData(List<ImageDTO2> imageResults,
                                TarArchiveOutputStream tos) throws IOException {
        InputStream dicomIn = null;
        try {
        for (ImageDTO2 imageDto : imageResults){
             String filePath = imageDto.getFileName();
             String sop = imageDto.getSOPInstanceUID();

             logger.info("filepath: " + filePath + " filename: " + sop);
             try {
                  File dicomFile = new File(filePath);
                  ArchiveEntry tarArchiveEntry = tos.createArchiveEntry(dicomFile, sop + ".dcm");
                  dicomIn = new FileInputStream(dicomFile);
                  tos.putArchiveEntry(tarArchiveEntry);
                  IOUtils.copy(dicomIn, tos);
                  tos.closeArchiveEntry();
             } catch (FileNotFoundException e) {
                e.printStackTrace();
                //just print the exception and continue the loop so rest of images will get download.
             }
             finally {
                  IOUtils.closeQuietly(dicomIn);
                  logger.info("DownloadServlet Image transferred at " + new Date().getTime());
             }
        }
        } catch (Exception ex){
        	ex.printStackTrace();
        }
    }

    private void sendAnnotationData(List<AnnotationDTO> annoResults,
                                    TarArchiveOutputStream tos) throws IOException {
        InputStream annoIn = null;
        for(AnnotationDTO a : annoResults){
            String filePath = a.getFilePath();
            String fileName = a.getFileName();

            try {
                File annotationFile = new File(filePath);
                ArchiveEntry tarArchiveEntry = tos.createArchiveEntry(annotationFile, fileName);
                annoIn = new FileInputStream(annotationFile);
                tos.putArchiveEntry(tarArchiveEntry);
                IOUtils.copy(annoIn, tos);
                tos.closeArchiveEntry();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                //just print the exception and continue the loop so rest of images will get download.
             }
            finally {
                IOUtils.closeQuietly(annoIn);
                logger.info("DownloadServlet Annotation transferred at "
                                   + new Date().getTime());
            }
        }
    }
    private String decrypt(String password) throws Exception{
        StringEncrypter decrypter = new StringEncrypter();
        if(password.equals("")){
            return "";
        }else{
            return decrypter.decryptString(password);
        }
    }
    private static long computeContentLength(List<ImageDTO2> imageResults,
                    List<AnnotationDTO> annoResults) {
        long contentSize=0;
        for(ImageDTO2 imageDto : imageResults){
            contentSize += imageDto.getDicomSize();
        }
        for(AnnotationDTO annoDto : annoResults){
            contentSize += annoDto.getFileSize();
        }
        return contentSize;
    }
    private void downloadJNLPDataFile(String fileName, HttpServletResponse response) {
            logger.info("looking for file name ..."+fileName);
            System.out.println("looking for file name ..."+fileName);
            response.setContentType("text/plain");
            response.setHeader("Content-Disposition","attachment;filename=downloadname.txt");
            try{
                List <String> readLines = IOUtils.readLines(new FileReader(fileName));
                List <String> seriesIds=parse(readLines);
                if (seriesIds!=null){
                	readLines = getFullManifestString(seriesIds);
                }
                OutputStream os = response.getOutputStream();
                IOUtils.writeLines(readLines, System.getProperty("line.separator"), os);
                os.close();
            } catch (IOException e){
              e.printStackTrace();
        }
     }
    
    // All below added to fix manifest problem
	private static List<String> getFullManifestString(List<String> list){
		GeneralSeriesDAO generalSeriesDAO = (GeneralSeriesDAO)SpringApplicationContext.getBean("generalSeriesDAO");
		List<String> input = new ArrayList<String>();
		for (String item:list){
			input.add(item);
		}
		System.out.println("Regenerating Manifest");
        List<SeriesDTO> ssList = generalSeriesDAO.findSeriesBySeriesInstanceUIDAnyVisibility(input);

		List<SeriesSearchResult> seriesFound=convert(ssList);
		List<BasketSeriesItemBean> seriesItems=new ArrayList<BasketSeriesItemBean>();
		for (SeriesSearchResult series:seriesFound){
			seriesItems.add(convert(series));
		}
		List<String> seriesDownloadData = new ArrayList<String>();
		for (BasketSeriesItemBean seriesItem : seriesItems) {

			String collection = seriesItem.getProject();
			String patientId = seriesItem.getPatientId();
			String studyInstanceUid = seriesItem.getStudyId();
			String seriesInstanceUid = seriesItem.getSeriesId();
			String annotation = seriesItem.getAnnotated();
			Integer numberImages = seriesItem.getTotalImagesInSeries();
			Long imagesSize = seriesItem.getTotalSizeForAllImagesInSeries();
			Long annoSize = seriesItem.getAnnotationsSize();
			String url = "url";
			String displayName = "displayName";
			String studyDate = seriesItem.getStudyDate();
			String studyDesc = cleanStr(seriesItem.getStudyDescription());
			String seriesDesc = cleanStr(seriesItem.getSeriesDescription());
			String study_id = cleanStr(seriesItem.getStudy_id());
			String seriesNumber = seriesItem.getSeriesNumber();
			String argument = "" + collection + "|" + patientId + "|" + studyInstanceUid + "|" + seriesInstanceUid + "|"
					+ annotation + "|" + numberImages + "|" + imagesSize + "|" + annoSize + "|" + url + "|"
					+ displayName + "|" + true + "|" + studyDate + "|" + study_id + "|" + studyDesc + "|" + seriesNumber + "|" + seriesDesc;
			seriesDownloadData.add(argument);
		}
		return seriesDownloadData;
	}
	private static BasketSeriesItemBean convert(SeriesSearchResult seriesDTO){
		BasketSeriesItemBean returnBean = new BasketSeriesItemBean(seriesDTO);

		returnBean.setAnnotationsFlag(seriesDTO.isAnnotated());
		returnBean.setAnnotationsSize(seriesDTO.getAnnotationsSize());
		returnBean.setPatientId(seriesDTO.getPatientId());
		returnBean.setProject(seriesDTO.getProject());
		returnBean.setSeriesId(seriesDTO.getSeriesInstanceUid());
		returnBean.setSeriesPkId(seriesDTO.getId());
		returnBean.setStudyId(seriesDTO.getStudyInstanceUid());
		returnBean.setStudyPkId(seriesDTO.getStudyId());
		returnBean.setTotalImagesInSeries(seriesDTO.getNumberImages());
		returnBean.setTotalSizeForAllImagesInSeries(seriesDTO.getTotalSizeForAllImagesInSeries());
		returnBean.setStudyDate(seriesDTO.getStudyDate());
		returnBean.setStudyDescription(seriesDTO.getStudyDescription());
		returnBean.setSeriesDescription(seriesDTO.getDescription());
		returnBean.setStudy_id(seriesDTO.getStudy_id());
		returnBean.setSeriesDescription(seriesDTO.getDescription());
		returnBean.setSeriesNumber(seriesDTO.getSeriesNumber());
		returnBean.setPatientpk(seriesDTO.getPatientpk());
		return returnBean;
	}
	private static String cleanStr(String in) {
		if ((in != null) && (in.length() > 0)) {
			String out= in.replaceAll("[^a-zA-Z0-9 .-]", "");
			return out;
		}
		else return null;
	}
    private static List<String> parse(List<String> args){
        List<String> seriesDataList = new ArrayList<String>();
        for(String seriesData:args ) {
            String series;
            String[] result = StringUtils.split(seriesData,"\\|");
            if(result != null && result.length > 0) {
            	if (result.length > 11){
            		// its a new style manifest just send i
            		return null;
            	}
                series=result[3];
                seriesDataList.add(series);
            }
        }
        return seriesDataList;
    }
    private static List<SeriesSearchResult> convert(List<SeriesDTO> dtos) {
    	List<SeriesSearchResult> results = new ArrayList<SeriesSearchResult>();

    	for(SeriesDTO dto : dtos) {
    		SeriesSearchResult result = new SeriesSearchResult();

    		result.setId(dto.getSeriesPkId());
    		result.setSeriesInstanceUid(dto.getSeriesUID());
    		result.setStudyId(dto.getStudyPkId());
    		result.setStudyInstanceUid(dto.getStudyId());
    		result.setNumberImages(dto.getNumberImages());
    		result.setSeriesNumber(dto.getSeriesNumber());
    		result.setManufacturer(dto.getManufacturer());
    		result.setModality(dto.getModality());
    		result.setAnnotated(dto.isAnnotationsFlag());
    		result.setProject(dto.getProject());
            
    		result.setPatientId(dto.getPatientId());
    		result.setAnnotationsSize(dto.getAnnotationsSize());
    		result.setDescription(dto.getDescription());
    		result.setTotalSizeForAllImagesInSeries(dto.getTotalSizeForAllImagesInSeries());
    		result.setMaxFrameCount(dto.getMaxFrameCount());
    		result.setPatientpk(dto.getPatientPkId());
    		result.setStudy_id(dto.getStudy_id());
    		result.setStudyDescription(dto.getStudyDesc());
    		result.setStudyDate(dto.getStudyDateString());
    		results.add(result);
    	}
    	return results;
    }
}