/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dbadapter;

import gov.nih.nci.nbia.domain.operation.CTImageOperationInterface;
import gov.nih.nci.nbia.domain.operation.MRImageOperationInterface;
import gov.nih.nci.nbia.domain.operation.GeneralEquipmentOperationInterface;
import gov.nih.nci.nbia.domain.operation.GeneralImageOperationInterface;
import gov.nih.nci.nbia.domain.operation.ImageSubmissionHistoryOperationInterface;
import gov.nih.nci.nbia.domain.operation.PatientOperationInterface;
import gov.nih.nci.nbia.domain.operation.SeriesOperationInterface;
import gov.nih.nci.nbia.domain.operation.StudyOperationInterface;
import gov.nih.nci.nbia.domain.operation.TrialDataProvenanceOperationInterface;
import gov.nih.nci.nbia.domain.operation.SiteOperationInterface;
import gov.nih.nci.nbia.internaldomain.CTImage;
import gov.nih.nci.nbia.internaldomain.MRImage;
import gov.nih.nci.nbia.internaldomain.GeneralEquipment;
import gov.nih.nci.nbia.internaldomain.GeneralImage;
import gov.nih.nci.nbia.internaldomain.GeneralSeries;
import gov.nih.nci.nbia.internaldomain.Patient;
import gov.nih.nci.nbia.internaldomain.Study;
import gov.nih.nci.nbia.internaldomain.SubmissionHistory;
import gov.nih.nci.nbia.internaldomain.TrialDataProvenance;
import gov.nih.nci.nbia.internaldomain.Site;
import gov.nih.nci.nbia.util.DicomConstants;
import java.io.PrintWriter;
import java.io.StringWriter;

import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

public class NonCTPImageStorage extends HibernateDaoSupport{
	private String md5 = "";
	private long fileSize;
	private static String FAIL="fail";

	@Autowired
	private TrialDataProvenanceOperationInterface tdpo;
	@Autowired
	private SiteOperationInterface siteo;
	@Autowired
	private PatientOperationInterface po;
	@Autowired
	private StudyOperationInterface so;
	@Autowired
	private GeneralEquipmentOperationInterface geo;
	@Autowired
	private SeriesOperationInterface serieso;
	@Autowired
	private GeneralImageOperationInterface gio;
	@Autowired
	private CTImageOperationInterface ctio;
	@Autowired
	private MRImageOperationInterface mrio;
	@Autowired
	private ImageSubmissionHistoryOperationInterface imageSubmissionHistoryOperation;


	public String getMd5() {
		return md5;
	}

	public void setMd5(String md5) {
		this.md5 = md5;
	}
	
	public long getFileSize() {
		return fileSize;
	}

	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}
	

	public String storeDicomObject(Map numbers,
            String fileName,
            boolean visibility, String project, String siteName, 
    		String siteID, String trialName, String batch, String thirdPartyAnalysis, String descriptionURI, String fileId, String overwriteValue) {
		return storeDicomObject(numbers, fileName, getFileSize(), visibility, project, siteName, 
	    		siteID, trialName, batch, thirdPartyAnalysis, descriptionURI, fileId, overwriteValue);
	}
	public String storeDicomObject(Map numbers,
			                       String fileName,
			                       long fileSize,
			                       boolean visibility, String project, String siteName, 
			               		String siteID, String trialName, String batch, String thirdPartyAnalysis, 
			               		String descriptionURI, String fileId, String overwriteValues) {

		numbers.put(DicomConstants.BATCH_NUMBER, batch);
		numbers.put(DicomConstants.PROJECT_NAME, project);
		numbers.put(DicomConstants.TRIAL_NAME, trialName);
		numbers.put(DicomConstants.SITE_NAME, siteName);
		numbers.put(DicomConstants.SITE_ID, siteID);
		numbers.put(DicomConstants.THIRD_PARTY_ANALYSIS, thirdPartyAnalysis);
		numbers.put(DicomConstants.DESCRIPTION_URI, descriptionURI);
		numbers.put(DicomConstants.FILE_ID, fileId);
		
		TrialDataProvenance tdp=null;
		boolean overwrite=true;
		if (overwriteValues != null && overwriteValues.equalsIgnoreCase("NO")) {
			overwrite=false;
		}
        errors.clear();
        try {
			tdp = (TrialDataProvenance)tdpo.validate(numbers);
			getHibernateTemplate().saveOrUpdate(tdp);
        }catch(Exception e) {
            log.error("Exception in TrialDataProvenanceOperation " + e);
            errors.put("TrialDataProvenance", e.getMessage());
            return errorMessage(e, "TrialDataProvenanceOperation");
        }

        Site site=null;
        try {
        	siteo.setTdp(tdp);
			site = (Site)siteo.validate(numbers);
			getHibernateTemplate().saveOrUpdate(site);
        }catch(Exception e) {
            log.error("Exception in SiteOperation " + e);
            return errorMessage(e, "SiteOperation");
        }
        
        Patient patient=null;
        try {
			po.setTdp(tdp);
			po.setSite(null);  ///we dont care about this....
			patient = (Patient)po.validate(numbers, overwrite);
			getHibernateTemplate().saveOrUpdate(patient);
        }catch(Exception e) {
            log.error("Exception in PatientOperation " + e);
            return errorMessage(e, "PatientOperation");
        }
        Study study=null;
        try {
			so.setPatient(patient);
			study = (Study)so.validate(numbers, overwrite);
			getHibernateTemplate().saveOrUpdate(study);
        }catch(Exception e) {
            log.error("Exception in StudyOperation " + e);
            return errorMessage(e,"StudyOperation");
        }
        GeneralEquipment equip=null;
        try {
			equip = (GeneralEquipment)geo.validate(numbers, overwrite);
			getHibernateTemplate().saveOrUpdate(equip);
        }catch(Exception e) {
            log.error("Exception in GeneralEquipmentOperation " + e);
            return errorMessage(e, "GeneralEquipmentOperation");
        }
        GeneralSeries series=null;
        try {
			serieso.setEquip(equip);
			serieso.setPatient(patient);
			serieso.setStudy(study);
			series = (GeneralSeries)serieso.validate(numbers, overwrite);
			getHibernateTemplate().saveOrUpdate(series);
			//ao.updateAnnotation(series);
        }catch(Exception e) {
            log.error("Exception in SeriesOperation " + e);
            return errorMessage(e, "SeriesOperation");
        }
        GeneralImage gi=null;
        try {
			gio.setDataProvenance(tdp);
			gio.setPatient(patient);
			gio.setSeries(series);
			gio.setStudy(study);
			gi = (GeneralImage)gio.validate(numbers);

		    if (fileName != null) {
		        gi.setFilename(fileName);
		    }
		    gi.setDicomSize(Long.valueOf(fileSize));
		    gi.setMd5Digest(md5);
		    getHibernateTemplate().saveOrUpdate(gi);
        }catch(Exception e) {
            log.error("File " + fileName + " " + e);
            e.printStackTrace();
            return errorMessage(e, "ImageOperation");
        }
        
        if (numbers.get(DicomConstants.SOP_CLASS_UID).toString().equals("1.2.840.10008.5.1.4.1.1.4")) {        
	        try {
	        	log.debug("True MR Image");
				mrio.setGeneralImage(gi);
				MRImage mr = (MRImage)mrio.validate(numbers);
				getHibernateTemplate().saveOrUpdate(mr);
	
			}catch(Exception e) {
				log.error("Exception in MRImageOperation " + e);
	            errors.put("MRImage", e.getMessage());
	            return errorMessage(e,  "ImageOperation");
			}
        }
        else //Modality is anything except "MR"
        {
	        try {
				ctio.setGeneralImage(gi);
				CTImage ct = (CTImage)ctio.validate(numbers);
				getHibernateTemplate().saveOrUpdate(ct);
	
			}catch(Exception e) {
				log.error("Exception in CTImageOperation " + e);
	            errors.put("CTImage", e.getMessage());
	            return errorMessage(e,  "ImageOperation");
			}
        }

		try {
			 imageSubmissionHistoryOperation.setProperties(gio.isReplacement(),
						                              tdp,
						                              patient,
					                                  study,
					                                  series);

			SubmissionHistory imageSubmissionHistory =
				(SubmissionHistory)imageSubmissionHistoryOperation.validate(numbers);
			getHibernateTemplate().saveOrUpdate(imageSubmissionHistory);
		}
		catch(Exception e) {
			log.error("Exception in ImageSubmissionHistoryOperation " + e);
            //it is my belief that this is totally useless but will follow pattern till overall analysis is done
            errors.put("ImageSubmissionHistory", e.getMessage());
            //getHibernateTemplate().getSessionFactory().getCurrentSession().getTransaction().rollback();
            return errorMessage(e,  "ImageHistorySubmission");
        }

        if(errors.size()> 0) {
            System.out.println("Total numbers of errors: " + errors.size());
            return FAIL;
        }
        return "ok";
    }

	private String errorMessage(Exception e, String component) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        e.printStackTrace(pw);
        return "Error in "+ component + " --- "+e.getMessage()+" --- "+sw.toString();
	}
    private Map<String,String> errors = new HashMap<String,String>();

    private Logger log = LogManager.getLogger(NonCTPImageStorage.class);
}
