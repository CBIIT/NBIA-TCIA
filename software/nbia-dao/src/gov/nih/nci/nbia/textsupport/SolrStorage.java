package gov.nih.nci.nbia.textsupport;
import java.io.*;
import java.util.*;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.solr.client.solrj.*;
import org.apache.solr.client.solrj.embedded.*;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.core.*;
import gov.nih.nci.nbia.dao.*;
import gov.nih.nci.nbia.dto.*;
import gov.nih.nci.nbia.util.SpringApplicationContext;

public class SolrStorage {
  static Logger log = LogManager.getLogger(SolrStorage.class);
  private SolrServerInterface serverAccess;
  private SolrClient server;
  public void  addPatientDocument(PatientDocument patientDocument)
  {
	  log.warn("Solr asked to store patient document for -"+patientDocument.getId());
	  serverAccess = (SolrServerInterface)SpringApplicationContext.getBean("solrServer");
	  server = serverAccess.GetServer();
	  try {
		// all fields that are to be returned by the query are prefixed by f_
		// this allows us to filter out the housekeeping fields and indexing such as id 
		//  and doctype and text by using the field parameter of solrquery
	    SolrInputDocument solrDoc = new SolrInputDocument();
	    // get rid of all of this patients documents before adding updated ones
	    try {
			server.deleteByQuery( "patientId:"+patientDocument.getPatientId()); 
		} catch (Exception e) {
			log.warn("Unable to delete old document for patient "+patientDocument.getPatientId());
		}
	    solrDoc.addField( "id", patientDocument.getId());
	    solrDoc.addField( "patientId", patientDocument.getPatientId());
	    solrDoc.addField("f_ethnicGroup", patientDocument.getEthnicGroup());
	    solrDoc.addField("f_patientBirthDate", patientDocument.getPatientBirthDate());
	    solrDoc.addField("f_patientName", patientDocument.getPatientName());
	    solrDoc.addField("f_patientSex", patientDocument.getPatientSex());
	    if (patientDocument.getTrialSite() != null){
	       solrDoc=fillInTrials(solrDoc, patientDocument);
	    }
	    if (patientDocument.getDataProvenance() != null){
		       solrDoc=fillInTrialDP(solrDoc, patientDocument);
		}
	    solrDoc=fillInStudies(solrDoc, patientDocument);
	    //String allFields=documentString(solrDoc);
	    //log.info("**** Text of patient document is "+allFields.length() + " characters long");
	    // in the end it was not feasible to retrieve all the information from solr
	    // so broke out into subdocs - patient series and image
	    // prefixing with a b and c allows the grouping in the solr query
	    // to bring the most important document to the top
	    solrDoc.addField("docType","a-patient");
	    server.add(solrDoc);
	    log.warn("Solr has stored documents for -"+patientDocument.getPatientId());
	    } catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
  }
	private SolrInputDocument fillInTrials(SolrInputDocument document, PatientDocument patient)
	{
		if (patient.getTrialSite()==null) return document;
		TrialSiteDoc site = patient.getTrialSite();		
		document.addField("f_trialSiteId", site.getTrialSiteId());
		document.addField("f_trialSiteName", site.getTrialSiteName());
		document=fillInClinicalTrials(document, site);
		return document;
	}
	private SolrInputDocument fillInClinicalTrials(SolrInputDocument document, TrialSiteDoc site)
	{
		if (site.getTrial()==null) return document;
		ClinicalTrialSubDoc trial=site.getTrial();
		document.addField("f_coordinatingCenter", trial.getCoordinatingCenter());
		document.addField("f_protocolName", trial.getProtocolName());
		document.addField("f_sponsorName", trial.getSponsorName());
		return document;
	}
	private SolrInputDocument fillInTrialDP(SolrInputDocument document, PatientDocument patient)
	{
		if (patient.getDataProvenance()==null) return document;
		TrialDataProvenanceDoc trialDP = patient.getDataProvenance();		
		document.addField("f_dpSiteId", trialDP.getDpSiteId());
		document.addField("f_dpSiteName", trialDP.getDpSiteName());
		document.addField("f_project", trialDP.getProject());
		document.addField("f_collectionDescription", trialDP.getCollectionDescription());
		return document;
	}
	private SolrInputDocument fillInStudies(SolrInputDocument document, PatientDocument patient)
	{
		if (patient.getStudyCollection()==null) return document;
		int i=0;
		long totalImages=0;
		for (StudyDoc study : patient.getStudyCollection()){
			i++;
			String studyIndentifier = "f_Study"+i+"^";
			document.addField(studyIndentifier+"admittingDiagnosesCodeSeq", study.getAdmittingDiagnosesCodeSeq());
			document.addField(studyIndentifier+"admittingDiagnosesDesc",study.getAdmittingDiagnosesDesc());
			document.addField(studyIndentifier+"studyDate", study.getStudyDate());
			document.addField(studyIndentifier+"studyDesc", study.getStudyDesc());
			document.addField(studyIndentifier+"studyId", study.getStudyId());
			document.addField(studyIndentifier+"studyTime", study.getStudyTime());
			document.addField(studyIndentifier+"timePointDesc", study.getTimePointDesc());
			document.addField(studyIndentifier+"timePointId", study.getTimePointId());
			document.addField(studyIndentifier+"ageGroup", study.getAgeGroup());
			document.addField(studyIndentifier+"occupation", study.getOccupation());
			totalImages=totalImages+fillInSeries(document, study, "Study"+i+"-");
		}
        log.info(totalImages+" stored for patient "+patient.getPatientId());
		return document;
	}
	private long fillInSeries(SolrInputDocument document, StudyDoc study, String studyIndentifier)
	{
		
		if (study.getGeneralSeriesCollection()==null) return 0;
		long totalImages=0;
		int i=0;
		for (GeneralSeriesSubDoc series : study.getGeneralSeriesCollection()){
			i++;
			SolrInputDocument seriesDoc = new SolrInputDocument();
			String orginalId = document.getFieldValue("id").toString();
			String seriesIndentifier = "Patient-"+orginalId+"-"+studyIndentifier+"Series-"+i;
			seriesDoc.addField("id",seriesIndentifier);
			seriesDoc.addField("f_modality",series.getModality());
			seriesDoc.addField("f_laterality",series.getLaterality());
			seriesDoc.addField("f_protocolName",series.getProtocolName());
			seriesDoc.addField("f_seriesDesc",series.getSeriesDesc());
			seriesDoc.addField("f_bodyPartExamined",series.getBodyPartExamined());
			seriesDoc.addField("f_trialProtocolId",series.getTrialProtocolId());
			seriesDoc.addField("f_site",series.getSite());
			seriesDoc.addField("f_studyDesc",series.getSeriesDesc());
			seriesDoc.addField("f_admittingDiagnosesDesc",series.getAdmittingDiagnosesDesc());
			seriesDoc.addField("f_patientSex",series.getPatientSex());
			seriesDoc.addField("f_ageGroup",series.getAgeGroup());
			seriesDoc.addField("patientId",document.getFieldValue("patientId").toString());
			seriesDoc.addField("f_project",series.getProject());
			int x = 0;
			List <String> annotationFileContents=series.getAnnotationContents();
			if (annotationFileContents!=null)
			{
				for (String fileContent : annotationFileContents)
				{
					x++;
					seriesDoc.addField("f_annotationFileContents-"+x, fileContent);
				}
			}

			seriesDoc=fillInEquipment(seriesDoc, series.getGeneralEquipment(), "Series"+i+"-");
			totalImages=totalImages+fillInImages(seriesDoc, series, "Series"+i+"-");
	    	String seriesFields=documentString(seriesDoc);
	    	log.debug("**** Text of series document is "+seriesFields.length() + " characters long");
	    	seriesDoc.addField("docType","b-series");
	    	try {
				server.add(seriesDoc);
				server.commit();
			} catch (SolrServerException e) {
				// TODO Auto-generated catch block
				// e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				// e.printStackTrace();
			}
		}
        return totalImages;
	}
	private SolrInputDocument fillInEquipment(SolrInputDocument document, GeneralEquipmentSubDoc equipment, String seriesIndentifier)
	{
		if (equipment==null) return document;
		String equipmentIdentifier=seriesIndentifier+"Equipment^";
		equipmentIdentifier="f_"+equipmentIdentifier;
		document.addField(equipmentIdentifier+"id", equipment.getId());
		document.addField(equipmentIdentifier+"deviceSerialNumber",equipment.getDeviceSerialNumber());
		document.addField(equipmentIdentifier+"manufacturer",equipment.getManufacturer());
		document.addField(equipmentIdentifier+"institutionName",equipment.getInstitutionName());
		document.addField(equipmentIdentifier+"institutionAddress",equipment.getInstitutionName());
		document.addField(equipmentIdentifier+"manufacturerModelName",equipment.getManufacturerModelName());
		document.addField(equipmentIdentifier+"softwareVersions",equipment.getSoftwareVersions());
		document.addField(equipmentIdentifier+"stationName",equipment.getStationName());
		return document;
	}
	private long fillInImages(SolrInputDocument document, GeneralSeriesSubDoc series, String seriesIndentifier)
	{
		
		if (series.getGeneralImageCollection()==null) return 0;
		int x=0;
		long y=1;
		// to be safe we will commit every 100 docs some of them are pretty big
		// and the process slows down due to memory
		int commitCounter=0;
		for (GeneralImageSubDoc image : series.getGeneralImageCollection()){
			x++;
			commitCounter++;
			SolrInputDocument imageDoc = new SolrInputDocument();
			String orginalId = document.getField("id").toString();
			String imageIdentifier = "Patient-"+orginalId+"-"+"Image-"+x;
			imageDoc.addField("id",imageIdentifier);
			imageDoc.addField("f_imageType",image.getImageType());
			imageDoc.addField("f_lossyImageCompression",image.getLossyImageCompression());
			imageDoc.addField("f_imageOrientationPatient",image.getImageOrientationPatient());
			imageDoc.addField("f_imagePositionPatient",image.getImagePositionPatient());
			imageDoc.addField("f_contrastBolusAgent",image.getContrastBolusAgent());
			imageDoc.addField("f_contrastBolusRoute",image.getContrastBolusRoute());
			imageDoc.addField("f_patientPosition",image.getPatientPosition());
			imageDoc.addField("f_imageComments",image.getImageComments());
			imageDoc.addField("f_annotation",image.getAnnotation());
			imageDoc.addField("f_imageLaterality",image.getImageLaterality());
			imageDoc.addField("patientId",document.getFieldValue("patientId").toString());
			imageDoc.addField("f_project",image.getProject());
			imageDoc.addField("f_usFrameNum",image.getUsFrameNum());
			imageDoc.addField("f_usColorDataPresent",image.getUsColorDataPresent());
			imageDoc.addField("f_usMultiModality",image.getUsMultiModality());
			imageDoc.addField("f_imageTypeValue3",image.getImageTypeValue3());
			imageDoc.addField("f_scanningSequence",image.getScanningSequence());
			imageDoc.addField("f_sequenceVariant",image.getSequenceVariant());
			imageDoc.addField("f_sequenceName",image.getSequenceName());
			imageDoc.addField("f_imagedNucleus",image.getImagedNucleus());
			imageDoc.addField("f_scanOptions",image.getScanOptions());
			imageDoc.addField("f_convolutionKernel",image.getConvolutionKernel());
			imageDoc.addField("f_anatomicRegionSeq",image.getAnatomicRegionSeq());
			// moved over from the orginal DAO to deal with memory issues
            if (image.getFilename()!=null)
            {
            	NCIADicomTextObject dicomObject;
            	//if (dicomFileCount<maxDicomFiles)
            	//{
				  try {
					File dicomFile = new File(image.getFilename());
					if (dicomFile.exists())
					{
					   List<DicomTagDTO> tags=NCIADicomTextObject.getTagElements(dicomFile);
					   if (tags!=null)
						{
							for (DicomTagDTO tag : tags)
							{
								if (tag.getData()!=null&&(tag.getData().length()>1))
								{
								   int position = tag.getElement().indexOf("(");
								   String element="0000,0000";
								   if (position>=0) {

										try {
											element=tag.getElement().substring(position+1, position+10);
										} catch (Exception e) {
                                           e.printStackTrace();
										}

								   }
								   String elementName="d_"+element+"_"+tag.getName();
								   String orginalName=elementName;
								   //log.debug(elementName + " - " + tag.getData());
								   if (document.get(elementName)!=null) // tag has multiple values, so we needed make up a unique name
								   {
								     for (int i=0; i<100000; i++) // that would be a real lot of values
								     {
								    	 String newElementName=elementName+","+i;
								    	 //log.debug(newElementName + " - " + tag.getData());
								    	 if (document.get(newElementName)==null)
								    	 {
								    		 elementName=newElementName;
								    		 break;
								    	 }
								      }
								   }
									log.debug("added-"+elementName+"-" + tag.getData());
									elementName=elementName.replace(" ", "_");
								   imageDoc.addField(elementName,tag.getData());
			 					}
							}
			            }
					} else
					{
						log.warn("**** The image file "+dicomFile+" does not exist ****");
					}
				  } catch (Exception e) {
					e.printStackTrace();
				  }
            	//}
            }
            y=y+documentString(imageDoc).length();
	    	imageDoc.addField("docType","c-image");
	    	try {
				server.add(imageDoc);
				if (commitCounter==100)
				{
					log.info("Perform interum commit "+orginalId);
					commitCounter=0;
					server.commit();
				}
			} catch (SolrServerException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		// get memory back
		series.setGeneralImageCollection(null);
		log.info("**** Text of "+x+" image documents is "+ y/1000 + "kb ");
        return x;
     }
	 // depricated by the use of copyfield
	  private String documentString(SolrInputDocument solrDoc)
	  {
		  StringBuilder returnValue = new StringBuilder("");
		  for (String field  : solrDoc.getFieldNames()){
			  if (solrDoc.getField(field).getValue()!=null)
			  returnValue.append(solrDoc.getField(field).getValue()).append("\n");
		  }
		  if (solrDoc.getChildDocuments()!=null)
		  {
		     for (SolrInputDocument doc: solrDoc.getChildDocuments())
		     {
			  returnValue.append(documentString(doc)).append("\n");;
		     }
		  }
		  return returnValue.toString();

	  }

}