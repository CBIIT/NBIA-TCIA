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
package gov.nih.nci.nbia.dao;

import gov.nih.nci.nbia.dto.ImageDTO2;
import gov.nih.nci.nbia.dto.MD5DTO;
import gov.nih.nci.nbia.internaldomain.GeneralImage;
import gov.nih.nci.nbia.internaldomain.TrialDataProvenance;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SiteData;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Iterator;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author lethai
 *
 */
public class ImageDAO2Impl extends AbstractDAO
                          implements ImageDAO2 {
	private static Logger logger = Logger.getLogger(ImageDAO2.class);

    /**
     * Return all the images for a given series.  Optionally exclude
     * sop instance uid's from the returned list.
     */
	
	@Transactional(propagation=Propagation.REQUIRED)
    public List<ImageDTO2> findImagesBySeriesUid(String seriesUid)  {
		List<ImageDTO2> imageResults = new ArrayList<ImageDTO2>();
		try {
			imageResults=findImagesBySeriesUid(seriesUid, null);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return imageResults;
	}
	
	@Transactional(propagation=Propagation.REQUIRED)
    public List<ImageDTO2> findImagesBySeriesUid(String seriesUid,
    		                                    String exclusionSopUidList) throws DataAccessException {
    	String query="";
    		query = "select distinct gimg.SOPInstanceUID, gimg.filename, gimg.dicomSize, gimg.usFrameNum,gs.project, gs.site, gs.securityGroup, gimg.instanceNumber, gimg.acquisitionNumber, gimg.md5Digest " +
    				"from GeneralImage gimg join gimg.generalSeries gs " +
    				"where gimg.seriesInstanceUID = '"+
                    seriesUid + "'";
    	// Submit the search
        long start = System.currentTimeMillis();
    	logger.info("Issuing query: ");
        List results = getHibernateTemplate().find(query);
        long end = System.currentTimeMillis();
        logger.info("total query time: " + (end - start) + " ms");
        List<ImageDTO2> imageResults = new ArrayList<ImageDTO2>();

        if(results == null || results.isEmpty()){
        	logger.info("No image found for request seriesuid="+seriesUid);
        	return imageResults;
        }
//        TrialDataProvenance tdp = results.get(0).getDataProvenance();
//        String ssg = results.get(0).getGeneralSeries().getSecurityGroup();
        for(Object item: results){
        	Object[] row = (Object[]) item;

//        	ImageDTO2 image = new ImageDTO2(gi.getSOPInstanceUID(),
//        			gi.getFilename(),
//        			gi.getDicomSize(),
//        			tdp.getProject(),
//        			tdp.getDpSiteName(),
//        			ssg, gi.getUsFrameNum());
        	ImageDTO2 image = new ImageDTO2((String)row[0],
        			(String)row[1],
        			(Long)row[2],
        			(String)row[4],
        			(String)row[5],
        			(String)row[6], 
        			(String)row[3],
        			(Integer)row[7],
        			(Integer)row[8],
        			(String)row[9]);
        	imageResults.add(image);
        }
        Collections.sort(imageResults);
        setNewFileNames(imageResults);
        try {
			if (exclusionSopUidList!=null&&exclusionSopUidList.length()>1) {
			   for (Iterator<ImageDTO2> iterator = imageResults.iterator(); iterator.hasNext(); ) {
				   ImageDTO2 image = iterator.next();
					  if (exclusionSopUidList.contains(image.getSOPInstanceUID())) {
						  iterator.remove();
					  }
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
        return imageResults;
    }
	
	
	@Transactional(propagation=Propagation.REQUIRED)
    public List<ImageDTO2> findImageChecksumsBySeriesUid(String seriesUid,
    		                                    String exclusionSopUidList, List<String>authorizedCollections) throws DataAccessException {
    	String query="";
//    		query = "select distinct gimg.SOPInstanceUID, gimg.filename, gimg.dicomSize, gimg.usFrameNum,gs.project, gs.site, gs.securityGroup, gimg.instanceNumber, gimg.acquisitionNumber, gimg.md5Digest " +
//    				"from GeneralImage gimg join gimg.generalSeries gs " +
//    				"where gimg.seriesInstanceUID = '"+
//                    seriesUid + "'";
    		
    		query = "select distinct gimg.SOPInstanceUID, gimg.instanceNumber, gimg.acquisitionNumber, gimg.md5Digest, gs.project, gs.site " +
    				"from GeneralImage gimg join gimg.generalSeries gs " +
    				"where gimg.seriesInstanceUID = '"+
                    seriesUid + "'";    		
    	// Submit the search
        long start = System.currentTimeMillis();
    	logger.info("Issuing query: ");
        List results = getHibernateTemplate().find(query);
        long end = System.currentTimeMillis();
        logger.info("total query time: " + (end - start) + " ms");
        List<ImageDTO2> imageResults = new ArrayList<ImageDTO2>();

        if(results == null || results.isEmpty()){
        	logger.info("No image found for request seriesuid="+seriesUid);
        	return imageResults;
        }

        String project = (String)((Object[])results.get(0))[4];
        String site = (String)((Object[])results.get(0))[5];
        boolean hasAccess = false;
        for (String csCombo : authorizedCollections) {
        	if (csCombo.equals("'"+project+"//"+site+"'")) {
        		hasAccess = true;
        		break;
        	}
        		
        }
         
        if (!hasAccess) {
        	return null;
        }
        for(Object item: results){
           	Object[] row = (Object[]) item;
        	ImageDTO2 image = new ImageDTO2((String)row[0], 
        			null, 
        			null, 
        			null, 
        			null, 
        			null, 
        			null, 
        			(Integer)row[1],
        			(Integer)row[2],
        			(String)row[3]);

        	imageResults.add(image);
        }
        Collections.sort(imageResults);
        setNewFileNames(imageResults);
        try {
			if (exclusionSopUidList!=null&&exclusionSopUidList.length()>1) {
			   for (Iterator<ImageDTO2> iterator = imageResults.iterator(); iterator.hasNext(); ) {
				   ImageDTO2 image = iterator.next();
					  if (exclusionSopUidList.contains(image.getSOPInstanceUID())) {
						  iterator.remove();
					  }
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
        return imageResults;
    }	
	
	
    /**
     * Return all the images names for a given series.  
     */
	@Transactional(propagation=Propagation.REQUIRED)
    public List<String []> getImageNamesBySeriesUid(String seriesUid) throws DataAccessException {
    	String query="";
    		query = "select distinct gimg.SOPInstanceUID, gimg.filename, gimg.dicomSize, gimg.usFrameNum,gs.project, gs.site, gs.securityGroup, gimg.instanceNumber, gimg.acquisitionNumber, gimg.md5Digest " +
    				"from GeneralImage gimg join gimg.generalSeries gs " +
    				"where gimg.seriesInstanceUID = '"+
                    seriesUid + "'" + " and gs.visibility in ('1','12')";
    	// Submit the search
        long start = System.currentTimeMillis();
    	logger.info("Issuing query: ");
        List results = getHibernateTemplate().find(query);
        long end = System.currentTimeMillis();
        logger.info("total query time: " + (end - start) + " ms");
        List<ImageDTO2> imageResults = new ArrayList<ImageDTO2>();
        List<String []> fileNames = new ArrayList<String[]>();

        if(results == null || results.isEmpty()){
        	logger.info("No image found for request seriesuid="+seriesUid);
        	return fileNames;
        }
//        TrialDataProvenance tdp = results.get(0).getDataProvenance();
//        String ssg = results.get(0).getGeneralSeries().getSecurityGroup();
        for(Object item: results){
        	Object[] row = (Object[]) item;

//        	ImageDTO2 image = new ImageDTO2(gi.getSOPInstanceUID(),
//        			gi.getFilename(),
//        			gi.getDicomSize(),
//        			tdp.getProject(),
//        			tdp.getDpSiteName(),
//        			ssg, gi.getUsFrameNum());
        	ImageDTO2 image = new ImageDTO2((String)row[0],
        			(String)row[1],
        			(Long)row[2],
        			(String)row[4],
        			(String)row[5],
        			(String)row[6], 
        			(String)row[3],
        			(Integer)row[7],
        			(Integer)row[8],
        			(String)row[9]);
        	imageResults.add(image);
        }
        Collections.sort(imageResults);
        setNewFileNames(imageResults);
        
        for (ImageDTO2 obj: imageResults) {
        	String newName = obj.getNewFilename();
        	String newFileName = newName.substring(newName.indexOf("^")+1);
        	String [] twoNames = {obj.getFileName(),  newFileName, obj.getMd5Digest(), obj.getDicomSize().toString()}; 
        	fileNames.add(twoNames);
        }

        return fileNames;
    }
	
	
	
	/**
	 * Fetch set of list of file path/name for given the series instance uid
	 * This method is used for NBIA Rest API.
	 * @param seriesInstanceUid series instance UID
	 */
	@Transactional(propagation=Propagation.REQUIRED)	
	public List<String> getImage(String seriesInstanceUid) throws DataAccessException {
		String hql = "select gi.filename "
				+ "from  GeneralImage gi "
				+ "where gi.generalSeries.visibility in ('1')"
				+ " and gi.seriesInstanceUID = ? ";
		
		//System.out.println("===== In nbia-dao, ImageDAO2Impl:getImage(..) - hql statement call with where visibility in ('1'): " + hql);
		List<String> rs = getHibernateTemplate().find(hql, seriesInstanceUid); // protect against sql injection				

        return rs;
	}
	/**
	 * Get md5 hash for sopinstanceuid 
	 * This method is used for NBIA Rest API.
	 * @param seriesInstanceUid series instance UID
	 */
	@Transactional(propagation=Propagation.REQUIRED)	
	public String getImage(String sopInstanceUid, List<SiteData> siteDataList ) throws DataAccessException {
		String returnValue=null;
		String hql = "select gi.md5Digest, gs.project, gs.site "
				+ "from  GeneralImage gi join gi.generalSeries gs "
				+ "where gs.visibility in ('1')"
				+ " and gi.SOPInstanceUID = ? ";
		
		//System.out.println("===== In nbia-dao, ImageDAO2Impl:getImage(..) - hql statement call with where visibility in ('1'): " + hql);
		List<Object[]> searchResults = getHibernateTemplate().find(hql, sopInstanceUid); // protect against sql injection
		if (searchResults!=null) {
			for (Object[] row : searchResults) {
				String md5Digest=row[0].toString();
				String project=row[1].toString();
				String site=row[2].toString();
				if (isAuthorized(project, site, siteDataList)) {
					return md5Digest;
				}
			}

		}

        return returnValue;
	}
	public List<MD5DTO> getImageAndMD5Hash(String seriesInstanceUID, List<SiteData> siteDataList ) throws DataAccessException {
		List<MD5DTO> returnValue= new ArrayList<MD5DTO>() ;
		String hql = "select gi.md5Digest, gs.project, gs.site, gi.filename "
				+ "from  GeneralImage gi join gi.generalSeries gs "
				+ "where gs.visibility in ('1')"
				+ " and gi.seriesInstanceUID = ? ";
		
		//System.out.println("===== In nbia-dao, ImageDAO2Impl:getImage(..) - hql statement call with where visibility in ('1'): " + hql);
		List<Object[]> searchResults = getHibernateTemplate().find(hql, seriesInstanceUID); // protect against sql injection
		if (searchResults!=null) {
			for (Object[] row : searchResults) {
				String md5Digest=row[0].toString();
				String project=row[1].toString();
				String site=row[2].toString();
				String filename=row[3].toString();
				if (isAuthorized(project, site, siteDataList)) {
					MD5DTO dto = new MD5DTO();
					dto.setFileName(filename);
					dto.setMD5Hash(md5Digest);
					returnValue.add(dto);
				}
			}

		}

        return returnValue;
	}
	private boolean isAuthorized(String project, String site, List<SiteData> siteDataList) {
		boolean returnValue=false;
		for (SiteData siteData: siteDataList) {
			if (siteData.getCollection().equalsIgnoreCase(project)) {
				if (siteData.getSiteName().equalsIgnoreCase(site)) {
					return true;
				}
			}
		}
		
		return returnValue;
		
	}
	
	
	private void setNewFileNames(List<ImageDTO2> imageResults)
	{
		int accNumberCount=1;
		int insNumberCount=1;
		Integer accNumber=new Integer(0);
		Integer insNumber=new Integer(0);;
		if (imageResults.size()>0) {
			ImageDTO2 dto =  imageResults.get(0);
			if (dto.getAcquisitionNumber()!=null) {
				accNumber=dto.getAcquisitionNumber();
			}
			if (dto.getInstanceNumber()!=null) {
				insNumber=dto.getInstanceNumber();
			}
		}
		// find the total for each
		for (ImageDTO2 dto:imageResults) {	
			if (dto.getAcquisitionNumber()!=null) {
				if (!dto.getAcquisitionNumber().equals(accNumber)) {
				    accNumber=dto.getAcquisitionNumber();
				    accNumberCount++;
				}
			}
			if (dto.getInstanceNumber()!=null) {
				if (!dto.getInstanceNumber().equals(insNumber)) {
				   insNumber=dto.getInstanceNumber();
				   insNumberCount++;
				}
			}
		}
		int accPadding=String.valueOf(accNumberCount).length();
		int insPadding=String.valueOf(insNumberCount).length();
		// set the filenames
		accNumber=new Integer(0);
		insNumber=new Integer(0);
		accNumberCount=1;
		insNumberCount=0;
		if (imageResults.size()>0) {
			ImageDTO2 dto =  imageResults.get(0);
			if (dto.getAcquisitionNumber()!=null) {
				accNumber=dto.getAcquisitionNumber();
			} else {
				accNumber=new Integer(0);
			}
			if (dto.getInstanceNumber()!=null) {
				insNumber=dto.getInstanceNumber();
			} else {
				insNumber=new Integer(0);
			}
		}
		String accNumberPart=String.format("%0"+accPadding+"d", 1);
		String insNumberPart=String.format("%0"+insPadding+"d", 1);
		Integer currentAccNumber;
		for (ImageDTO2 dto:imageResults) {	
			if (dto.getAcquisitionNumber()!=null) {
				currentAccNumber=dto.getAcquisitionNumber();
			} else {
				currentAccNumber=new Integer(0);
			}
			if (!currentAccNumber.equals(accNumber)) {
				    accNumber=dto.getAcquisitionNumber();
				    accNumberCount++;
				    accNumberPart=String.format("%0"+accPadding+"d", accNumberCount);
				    insNumberCount=1;
				    insNumberPart=String.format("%0"+insPadding+"d", insNumberCount);
			} else {
				// if the aquistion number has not change I need to increment in order to prevent name collisions
				   insNumberCount++;
				   insNumberPart=String.format("%0"+insPadding+"d", insNumberCount);
			}
			
			String newFileName=dto.getSOPInstanceUID()+"^"+accNumberPart+"-"+insNumberPart+".dcm";
			dto.setNewFilename(newFileName);
		}				
	}
	@Transactional(propagation=Propagation.REQUIRED)	
	public String getLicenseContent(String seriesInstanceUID) {
		String returnValue="";
		String licenseText=NCIAConfig.getLicenseText();
		String agreement=NCIAConfig.getUserAgreementFileLocation();
		if (licenseText==null&&agreement==null) {
			return null;
		}
		String sqlString = " select project, general_series.license_url, license.short_name "+
				" from license, general_series "+
				" where license.license_long_name=general_series.license_name"+
				" and series_instance_uid=:id";
		List<Object[]> resultsData = this.getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(sqlString).setParameter("id", seriesInstanceUID).list();
		String collection=null;
		String licenseName=null;
		String licenseUrl=null;
		boolean noLicense=false;
		for(Object[] item:resultsData) {
			if (item[0]!=null) {
				collection=item[0].toString();
			}
			if (item[1]!=null) {
				licenseUrl=item[1].toString();
			}
			if (item[2]!=null) {
				licenseName=item[2].toString();
			}
		}
		if (collection==null&&licenseUrl==null&&licenseName==null) {
			noLicense=true;
		}
		if (licenseUrl==null) licenseUrl="Not Specified";
		if (licenseName==null) licenseName="Not Specified";
		boolean hasDataFile=false;
		FileInputStream inputStream = null;
		String fileContents="";
   	    try {
   	    	  inputStream = new FileInputStream(agreement);
			  hasDataFile=true;
		} catch (Exception e) {
			//do nothing no file to read
		}
        if (noLicense&&!hasDataFile) {
        	return null;
        }
        if (hasDataFile) {
        	try {
				fileContents = IOUtils.toString(inputStream, "UTF-8");
			} catch (IOException e) {
				e.printStackTrace();
			}
        	
        }
        if (!noLicense) {
			returnValue = new MessageFormat(licenseText)
					.format(new String[] { collection, licenseName, licenseUrl });
        }
        if (hasDataFile) {
        	returnValue = returnValue+"\n"+fileContents;
        }
		return returnValue;
		
	}
}
