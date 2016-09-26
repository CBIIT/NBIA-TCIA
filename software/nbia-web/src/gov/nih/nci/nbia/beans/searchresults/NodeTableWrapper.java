/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.beans.searchresults;

import gov.nih.nci.nbia.beans.BeanManager;
import gov.nih.nci.nbia.beans.basket.BasketBean;
import gov.nih.nci.nbia.beans.security.SecurityBean;
import gov.nih.nci.nbia.search.DrillDown;
import gov.nih.nci.nbia.search.DrillDownFactory;
import gov.nih.nci.nbia.search.PatientSearchResults;
import gov.nih.nci.nbia.util.JsfUtil;
import gov.nih.nci.nbia.util.MessageUtil;
import gov.nih.nci.nbia.searchresult.PatientSearchResult;
import gov.nih.nci.nbia.searchresult.SeriesSearchResult;
import gov.nih.nci.nbia.searchresult.StudySearchResult;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.faces.component.UIComponent;
import javax.faces.component.UIData;
import javax.faces.event.ActionEvent;

/**
 * This is managed bean allocated per NBIA node results to show.  For example
 * one for the local node, and one per each remote node.
 * 
 * <p>This is not a "top level" bean....
 */
public class NodeTableWrapper {
	
	public NodeTableWrapper(SearchResultBean srb) {
		this.srb = srb;
	}
	
	/**
	 * Set the results to show for the given node.
	 */
	public void setPatientSearchResults(PatientSearchResults patientSearchResults) {
		this.patientSearchResults = patientSearchResults;
		
		this.patients = new ArrayList<PatientResultWrapper>();
		
		//this will be null if patientSearchResults.getSearchError is true.
		//must be to distinguish from 0 results
		if(patientSearchResults.getResults()!=null) {
			for(PatientSearchResult dto : patientSearchResults.getResults()) {
				patients.add(new PatientResultWrapper(dto));
			}
		}
	}
	

	/**
	 * The results for the node.  This could be null if still waiting.
	 */
	public PatientSearchResults getPatientSearchResults() {
		return patientSearchResults;
	}	

	public boolean isErrorState() {
		if(patientSearchResults!=null) {
			return patientSearchResults.getSearchError()!=null;
		}
		else {
			return false; //if no results, not in an error state
		}
	}
	

	/**
	 * This is the drill down method to view the details of a patient.
	 * It looks at the current selection in the patient table and then
	 * brings up the page to show the studies for that patient.  The
	 * return value is the page to go to (action).
	 */
	public void viewPatient(ActionEvent e) throws Exception {
		//have to go this route because cant figure out a way
		//to do a component binding against a backing bean
		//that is NOT enumerated in faces-config.xml - like this one and its siblings
		UIComponent commandLink = (UIComponent)e.getComponent();
		UIData patientTable = JsfUtil.findNearestTable(commandLink);
		
		try {
			srb.viewPatient((PatientResultWrapper)patientTable.getRowData());
		}
		catch(Exception ex) {
			MessageUtil.addErrorMessage("MAINbody:dataForm:tableOfPatientResultTables",
					                    "drillDownRequestFailure",
                                        null );
			viewPatientException = ex;
		}	
	}
	
	/**
	 * Responsible for deciding where to go when clickin on a patient.
	 * This is tied to the viewPatient action listener.... need to be able
	 * to bail if node is down.
	 */
	public String navPatient() {
		if(viewPatientException!=null) {
			viewPatientException = null;
			return null;
		}
		else {
			return "displayStudy";
		}
	}
	
	/**
	 * Adds all of the selected patients to the data basket.
	 */
	public String addPatientToBasket() throws Exception {
		PatientSearchResult selectedPatient = getSelectedPatients(toAdd);
		addToBasket(Arrays.asList(selectedPatient));
		return null;
	}
	private String addToBasket(List<PatientSearchResult> selectedPatients) throws Exception {
		List<SeriesSearchResult> selectedSeries = new ArrayList<SeriesSearchResult>();
		try {
			DrillDown drillDown = DrillDownFactory.getDrillDown();
			SimpleDateFormat sdf =  new SimpleDateFormat("MM-dd-yyyy");
			java.util.Date date2= new java.util.Date();
			System.out.println("Before adding to Basket, Current Time" + new Timestamp(date2.getTime()));
			SecurityBean sb = BeanManager.getSecurityBean();
			String token = sb.getTokenValue();
			for(PatientSearchResult selectedPatient : selectedPatients) {
				
				StudySearchResult[] studyResults = drillDown.retrieveStudyAndSeriesForPatient(selectedPatient, token);
				for(StudySearchResult studySearchResult : studyResults) {
					for(SeriesSearchResult series: studySearchResult.getSeriesList()) {
						Date date = studySearchResult.getDate();
					    if (date == null) {
					    	series.setStudyDate("");
					    } else {
					    	series.setStudyDate(sdf.format(date));
					    }
						series.setStudyDescription(studySearchResult.getDescription());
						selectedSeries.add(series);
					}
				}
			}
			java.util.Date date3= new java.util.Date();
			System.out.println("After Adding to Basket, Current Time" + new Timestamp(date3.getTime()));
			uncheckAllPatients();
			BeanManager.getBasketBean().getBasket().addSeries(selectedSeries);
		}
		catch(Exception ex) {
			MessageUtil.addErrorMessage("MAINbody:dataForm:tableOfPatientResultTables",
					                    "drillDownRequestFailure",
	                                    null );
		}			

		return null;
	}
	private int toAdd;

	public int getToAdd() {
		return toAdd;
	}
	
	public void setToAdd(int toAdd) {
		this.toAdd = toAdd;
	}

	public String removePatientFromBasket() {
		PatientSearchResult selectedPatient = getSelectedPatients(toAdd);
		List<SeriesSearchResult> selectedSeries = new ArrayList<SeriesSearchResult>();
		
		try {
			DrillDown drillDown = DrillDownFactory.getDrillDown();
			SecurityBean sb = BeanManager.getSecurityBean();
			String token = sb.getTokenValue();
				StudySearchResult[] studyResults = drillDown.retrieveStudyAndSeriesForPatient(selectedPatient, token);
				for(StudySearchResult studySearchResult : studyResults) {
					selectedSeries.addAll(Arrays.asList(studySearchResult.getSeriesList()));
				}
				for(SeriesSearchResult s : selectedSeries) {	
					String toDelete = s.getId().toString();
					BeanManager.getBasketBean().getBasket().removeSelectedSeries(toDelete);
				}
		} catch(Exception ex) {
			MessageUtil.addErrorMessage("MAINbody:dataForm:tableOfPatientResultTables",
                    "drillDownRequestFailure",
                    null );
		}		
		return null;
	}

	/**
	 * Checks all of the patients in the list.
	 */
	public String checkAllPatients() {
		for(PatientResultWrapper patientWrapper : getPatients()) {
			patientWrapper.setChecked(true);			
		}
		return null;
	}

	/**
	 * Unchecks all patients in the list.
	 */
	public String uncheckAllPatients() {
		for(PatientResultWrapper patientWrapper : getPatients()) {
			patientWrapper.setChecked(false);			
		}		
		return null;
	}
	
	
	/**
	 * The number of patients for this node
	 */
	public int getNumPatientResults() {
		return getPatients().size();
	}
	
	/**
	 * For a given Patient ID, tell whether that patient has been added to the basket.
	 * This is a bit awkward but necessary for execution through EL which doesnt allow
	 * parameterized accessors.
	 * 
	 * <p>investigate more efficient method to hold the map
	 */
    public Map<String, Boolean> getInBasketMap() {
    	Map<String, Boolean> inBasketMap = new HashMap<String, Boolean>();

    	BasketBean basketBean = BeanManager.getBasketBean();
    	List<PatientSearchResult> patients = getUnwrappedPatients();
    	for(PatientSearchResult patient : patients) {
    		boolean anySeriesInBasket = false;
			for (Integer seriesId : patient.computeListOfSeriesIds()) {
				 if (basketBean.getBasket().isSeriesInBasket(seriesId)) {
	                anySeriesInBasket = true;
	                break;
	            }
			}
			if(anySeriesInBasket) {
				inBasketMap.put(patient.getSubjectId(), Boolean.TRUE);
			}
    	}
		
    	return inBasketMap;
    }	
	
    //use this?
	public List<PatientResultWrapper> getPatients() {
		return patients;		
	}    
	
	
	/**
	 * This property is for whether the collapsible panel that shows the
	 * patients results table is expanded or not.
	 */
	public boolean isExpanded() {
		return expanded;
	}

	
	/**
	 * This property is for whether the collapsible panel that shows the
	 * patients results table is expanded or not.
	 */	
	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}	
	
	////////////////////////////////////////PRIVATE/////////////////////////////////////////////
		
	private boolean expanded = true;
	
	private PatientSearchResults patientSearchResults;
	
	private List<PatientResultWrapper> patients;

	private SearchResultBean srb;
	
	private Exception viewPatientException = null;;

	private List<PatientSearchResult> getUnwrappedPatients() {
		List<PatientResultWrapper> wrappedResults = getPatients();
		List<PatientSearchResult> patientDtoList = new ArrayList<PatientSearchResult>();
		for(PatientResultWrapper wrapper : wrappedResults) {
			patientDtoList.add(wrapper.getPatient());
		}
		return patientDtoList;
	}	
	
	private List<PatientSearchResult> findSelectedPatients() {
		List<PatientSearchResult> selectedPatientsList = new ArrayList<PatientSearchResult>();
		for(PatientResultWrapper patientWrapper : getPatients()) {
			if(patientWrapper.isChecked()) {
				selectedPatientsList.add(patientWrapper.getPatient());				
			}
		}	
		return selectedPatientsList;
	}
	
	private PatientSearchResult getSelectedPatients(int patId) {
		for(PatientResultWrapper patientWrapper : getPatients()) {
			if(patientWrapper.getPatient().getId() == patId) {
				return patientWrapper.getPatient();				
			}
		}	
		return null;
	}
	public String addAllPatientToBasket() throws Exception {
		List<PatientSearchResult> allPatients= new ArrayList<PatientSearchResult>();
		for(PatientResultWrapper patientWrapper : getPatients()) {
				allPatients.add(patientWrapper.getPatient());				
			}
		addToBasket(allPatients);
		return null;
	}
	public String addAllPatientInTableToBasket() throws Exception {
		List<PatientSearchResult> allPatients= new ArrayList<PatientSearchResult>();
		allPatients = findSelectedPatients();
		addToBasket(allPatients);
		return null;
	}	 

}