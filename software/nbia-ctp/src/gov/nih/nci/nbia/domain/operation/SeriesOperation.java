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
package gov.nih.nci.nbia.domain.operation;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import gov.nih.nci.nbia.internaldomain.GeneralEquipment;
import gov.nih.nci.nbia.internaldomain.GeneralSeries;
import gov.nih.nci.nbia.internaldomain.Patient;
import gov.nih.nci.nbia.internaldomain.Study;
import gov.nih.nci.nbia.internaldomain.License;
import gov.nih.nci.nbia.util.AdapterUtil;
import gov.nih.nci.nbia.util.DicomConstants;
import gov.nih.nci.nbia.util.SpringApplicationContext;

public class SeriesOperation extends DomainOperation implements SeriesOperationInterface{
	Logger log = Logger.getLogger(SeriesOperation.class);
	
	private Patient patient ;
	private Study study;
    private GeneralEquipment equip;
 //   private boolean visibility;

	public SeriesOperation() {
	}
	/** 
	 * This method query NCIA repository for existing records related to Series prior to update or insert
	 * @param numbers Hashtable contains dicom headers information
	 * @throws Exception
	 */
	@Transactional(propagation=Propagation.REQUIRED)
	public Object validate(Map numbers, boolean overwrite) throws Exception{		
		
        String temp;
        String hql = "from GeneralSeries as series where ";
        
        GeneralSeries series = (GeneralSeries)SpringApplicationContext.getBean("series");
        
        

        try {
	        hql += (" series.study.id = " + study.getId());
	        // overwrite the equipment to prevent duplication errors
	        // hql += (" and series.generalEquipment.id = " + equip.getId());
	
	        series.setStudy(study);
	        series.setGeneralEquipment(equip);
	       
	        if ((temp = (String) numbers.get(DicomConstants.SERIES_INSTANCE_UID)) != null) {
	            series.setSeriesInstanceUID(temp.trim());
	            hql += (" and series.seriesInstanceUID = '" + temp.trim() + "' ");
	        } 
		    else {
		    	String noSeriesInstanceUidErrorMsg = "There is no Series Instance UID in the submitted image.";
		    	log.error(noSeriesInstanceUidErrorMsg);
		        throw new Exception(noSeriesInstanceUidErrorMsg);
		    }
	        
	        List rs =getHibernateTemplate().find(hql);	        
	        if(rs != null && rs.size()> 0) {
	        	overwrite=true; // new series
	        	series = (GeneralSeries) rs.get(0);
	        	//db constraints will make 1 the max
	        }
	
	        String site;
			if (overwrite) {
				site = populateSeriesFromNumbers(numbers, series);
				series.setPatientPkId(patient.getId());
				series.setPatientId(patient.getPatientId());
				series.setStudyInstanceUID(study.getStudyInstanceUID());
				series.setProject(patient.getDataProvenance().getProject());
				series.setSite(site);
				setExcludeCommercial(series, patient.getDataProvenance().getProject(), site);
			}
			//does this cause any possible issue with parallelism?
	        //multiple images submitted to same series at "same time"?
	        series.setMaxSubmissionTimestamp((java.util.Date)numbers.get("current_timestamp"));
	        
            //enforce to set visibility to be "Not Yet Reviewed"
            //regardless what CTP annonymizer says.
            series.setVisibility("0");


        }catch(Exception e) {
        	//log.error("Exception in SeriesOperation " + e);
        	throw new Exception("Exception in SeriesOperation " + e);
        }
        return series;		
	}
	/**
	 * @param equip the equip to set
	 */
	public void setEquip(GeneralEquipment equip) {
		this.equip = equip;
	}
	/**
	 * @param patient the patient to set
	 */
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	/**
	 * @param study the study to set
	 */
	public void setStudy(Study study) {
		this.study = study;
	}

	
    private static String populateSeriesFromNumbers(Map numbers, 
                                                  GeneralSeries series) throws Exception {
        String temp;
       
        setModality(series, numbers);
        
        setAdditionalQcFlags(series, numbers);
        setThirdPartyAnalysis(series, numbers);
        
        if ((temp = (String) numbers.get(DicomConstants.LATERALITY)) != null) {
            series.setLaterality(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.SERIES_DATE)) != null) {
            series.setSeriesDate(AdapterUtil.stringToDate(temp.trim()));
        }	
        if ((temp = (String) numbers.get(DicomConstants.PROTOCOL_NAME)) != null) {
            series.setProtocolName(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.SERIES_DESCRIPTION)) != null) {
            series.setSeriesDesc(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.BODY_PART_EXAMINED)) != null) {
            String bodyPartExamined = "";
        	if (temp.trim().length() >= 16)
            {
            	bodyPartExamined = temp.trim().substring(0,15);
            }
        	else
        	{
        		bodyPartExamined = temp.trim();
        	}
        	series.setBodyPartExamined(bodyPartExamined);
        }
        
        if ((temp = (String) numbers.get(
                        DicomConstants.CLINICAL_TRIAL_PROTOCOL_ID)) != null) {
            series.setTrialProtocolId(temp.trim());
        }	
        if ((temp = (String) numbers.get(
                        DicomConstants.CLINICAL_TRIAL_PROTOCOL_NAME)) != null) {
            series.setTrialProtocolName(temp.trim());
        }	
        if ((temp = (String) numbers.get(
                        DicomConstants.CLINICAL_TRIAL_SITE_NAME)) != null) {
            series.setTrialSiteName(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.STUDY_DATE)) != null) {
            series.setStudyDate(AdapterUtil.stringToDate(temp.trim()));
        }	
        if ((temp = (String) numbers.get(DicomConstants.STUDY_DESCRIPTION)) != null) {
            series.setStudyDesc(temp.trim());
        }	
        if ((temp = (String) numbers.get(
                        DicomConstants.ADMITTING_DIAGNOSES_DESCRIPTION)) != null) {
            series.setAdmittingDiagnosesDesc(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.PATIENT_AGE)) != null) {
            series.setPatientAge(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.PATIENT_SEX)) != null) {
            series.setPatientSex(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.PATIENT_WEIGHT)) != null) {
            series.setPatientWeight(Double.valueOf(temp.trim()));
        }	
        if ((temp = (String) numbers.get(DicomConstants.PATIENT_AGE)) != null) {
            series.setAgeGroup(AdapterUtil.convertToAgeGroup(temp.trim()));
        }	
        if ((temp = (String) numbers.get(DicomConstants.SERIES_ID)) != null) {
            series.setSeriesNumber(Integer.valueOf(temp.trim()));
        }	
        if ((temp = (String) numbers.get(
                        DicomConstants.SYNCHRONIZATION_FRAME_OF_REF_UID)) != null) {
            series.setSyncFrameOfRefUID(temp.trim());
        }	
        if ((temp = (String) numbers.get(DicomConstants.FRAME_OF_REFERENCE_UID)) != null) {
            series.setFrameOfReferenceUID(temp.trim());
        }
        return ((String) numbers.get(DicomConstants.SITE_NAME)).trim();


    }
    
	private static void setModality(GeneralSeries series, Map numbers) throws Exception {
	    String modality = (String) numbers.get(DicomConstants.MODALITY);
    	if (modality != null) {
            series.setModality(modality.trim());
        } else {
        	throw new Exception("Modality is null and it is required by DICOM");
        }
	}  
	
	private static void setAdditionalQcFlags(GeneralSeries series, Map numbers) throws Exception {
	    
		String batchStr = (String) numbers.get(DicomConstants.BATCH_NUMBER);
	   
	    int batchNum = 0;
	    
    	if (batchStr != null) {
    		batchNum = Integer.parseInt(batchStr.trim());    	
    		series.setBatch(batchNum);
     	}
              
	}   
	private static void setThirdPartyAnalysis(GeneralSeries series, Map numbers) throws Exception {
	    
		String thirdPartyAnalysis = (String) numbers.get(DicomConstants.THIRD_PARTY_ANALYSIS);
		String descriptionURI = (String) numbers.get(DicomConstants.DESCRIPTION_URI);
		
		series.setThirdPartyAnalysis(thirdPartyAnalysis);
		series.setDescriptionURI(descriptionURI);
             
	} 
	private void setExcludeCommercial(GeneralSeries series, String project, String site) throws Exception {
	    
        String SQLQuery="select long_name, commercial_use, license_url from license where license_id in \n" + 
        		"(select license_id from site where dp_site_name='"+project+"' and trial_dp_pk_id in\n" + 
        		"(select trial_dp_pk_id from trial_data_provenance where project='"+project+"'))";

		List<Object[]> data= getHibernateTemplate().getSessionFactory().getCurrentSession().createSQLQuery(SQLQuery)
        .list();
		Iterator<Object[]> iter = data.iterator();
		if (!iter.hasNext()) return;
		Object[] row = iter.next();
		if (row[0]!=null) {
	        	series.setLicenseName(row[0].toString());
		}
		if (row[1]!=null) {
			String excludeCommercial="YES";
		       if (row[1].toString()==null||row[1].toString().equalsIgnoreCase("YES")) {
		    	   excludeCommercial="NO";
		       }
		   series.setExcludeCommercial(excludeCommercial);
		}
		if (row[2]!=null) {
			   series.setLicenseURL(row[2].toString());
		}
		
	} 
	
}
