/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.beans.customserieslist;

import gov.nih.nci.nbia.beans.BeanManager;
import gov.nih.nci.nbia.beans.basket.BasketBean;
import gov.nih.nci.nbia.beans.security.SecurityBean;
import gov.nih.nci.nbia.customserieslist.CustomSeriesListProcessor;
import gov.nih.nci.nbia.dto.CustomSeriesListAttributeDTO;
import gov.nih.nci.nbia.dto.CustomSeriesListDTO;
import gov.nih.nci.nbia.dto.SeriesDTO;
import gov.nih.nci.nbia.mail.MailManager;
import gov.nih.nci.nbia.security.AuthorizationManager;
import gov.nih.nci.nbia.util.SelectItemComparator;
import gov.nih.nci.nbia.util.SeriesDTOConverter;
import gov.nih.nci.nbia.util.StringUtil;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.faces.component.UIData;
import javax.faces.event.ActionEvent;
import javax.faces.event.PhaseId;
import javax.faces.event.ValueChangeEvent;
import javax.faces.model.SelectItem;

import org.apache.log4j.Logger;

public class SearchCustomSeriesListBean {

    private final String defaultSelectedValue = "--Please Select--";
	private static Logger logger = Logger.getLogger(SearchCustomSeriesListBean.class);
    private List<String> noPermissionSeries;
    private CustomSeriesListProcessor processor;
    private SecurityBean sb;
    private String name="";
    private boolean errorMessage=false;
    private String message;
    private String list = "";
    private List<CustomSeriesListDTO> results= new ArrayList<CustomSeriesListDTO>();
    private UIData table;
    private String selectedDispItemNum = "10";
    private String selectedListName;
    private boolean exception = false;


    public boolean isErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(boolean errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public SearchCustomSeriesListBean() throws Exception{
        sb = BeanManager.getSecurityBean();
        AuthorizationManager am = sb.getAuthorizationManager();
        processor = new CustomSeriesListProcessor(sb.getUsername(), am);
        List<String> uNames = processor.getSharedListUserNames(); 
        if(uNames.size()>1){
			list = "lists";
		}
		else{list = "list";}
        userNameItems.clear();
        for (String uName : uNames) {
        	userNameItems.add(new SelectItem(uName));
        }
        userNameItems.add(new SelectItem(defaultSelectedValue));
        Collections.sort(userNameItems, new SelectItemComparator());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

     /**
     * search the system for the series list. Add content to data basket for successful search
     */
    public String search(){
        errorMessage=false;
        message="";
        if(noPermissionSeries != null){
            noPermissionSeries.clear();
        }
        //redirect to data basket page after successfully search
        //CustomSeriesListDTO result = processor.searchByName(name);
        results = processor.searchByNameLikeSearch(name);
        
        if(results == null){        
            //display message not found here
            errorMessage=true;
            message="The list (" + name + ") could not be found.";
        }
        return null;
    }

    public List<String> getNoPermissionSeries() {
        return noPermissionSeries;
    }

    public void setNoPermissionSeries(List<String> noPermissionSeries) {
        this.noPermissionSeries = noPermissionSeries;
    }

    /**
     * Reset 
     */
    public String reset(){
        errorMessage=false;
        name="";
        message="";
        selectedListName="";
        if(noPermissionSeries != null){
            noPermissionSeries.clear();
        }
        return null;
    }
    
    /**
	 * action event when name is clicked for adding to data basket
	 * 
	 * @param actionEvent
	 * @throws Exception
	 */
	public void namedDetailsClicked(ActionEvent actionEvent) throws Exception {
		reset();
		//noPermissionSeries.clear();
		int index = table.getRowIndex();
		CustomSeriesListDTO selected = results.get(index);
		selectedListName = selected.getName();
		List<String> seriesList = selected.getSeriesInstanceUIDs();
        noPermissionSeries = processor.validate(seriesList);

        if(noPermissionSeries.isEmpty()){
            //add to databasket
            List<SeriesDTO> seriesDTO = processor.getSeriesDTO(seriesList);

            //check to see if the list has been compromised.
            if(hasTheListBeenCompromised(seriesList, seriesDTO)){
                message="The List (" + name + ") has been modified by the system recently. " +
                        "There is a discrepancy between the current search results and the original list. " + 
                        "Please contact the list owner or application support for additional information.";
                errorMessage=true;
                return ;
            }
    
            processor.updateUsageCount(selected.getId());
            //add to data basket
            BasketBean dataBasket = (BasketBean) BeanManager.getBasketBean();
            dataBasket.setCustomListSearch(true);
            dataBasket.setCustomListComment(selected.getComment());
            dataBasket.setCustomListName(selected.getName());
            dataBasket.setCustomListLink(selected.getHyperlink());

            try {
                if (seriesDTO != null && seriesDTO.size() > 0){
                    dataBasket.getBasket().addSeries(SeriesDTOConverter.convert(seriesDTO));
                }
                
            } catch (Exception e) {
                logger.error("Error adding series to databasket " + e);
                exception = true;
                errorMessage=true; 
                message ="Error adding the selected list to data basket" ;//throw new RuntimeException(e);
            }            
        }else{
        	exception=true;
        }
	}
	public String navToBasket(){
		if(exception){
			exception=false;
			return null;
		}else{
			return "dataBasket";
		}
		
	}
	public UIData getTable() {
		return table;
	}

	public void setTable(UIData table) {
		this.table = table;
	}

	/**
	 * Gets the options for number of displaying items for QC Result.
	 * 
	 * @return array of predefined numbers for displaying search result
	 */
	public SelectItem[] getDispItemNums() {
		SelectItem[] dispItemNums = new SelectItem[4];
		dispItemNums[0] = new SelectItem("10");
		dispItemNums[1] = new SelectItem("25");
		dispItemNums[2] = new SelectItem("50");
		dispItemNums[3] = new SelectItem("100");
		return dispItemNums;
	}

	/**
	 * Method called when the number of display item are changed.
	 * 
	 *@param vce
	 *            event of the change
	 */
	public void numberChangeListener(ValueChangeEvent vce) {
		System.out.println("numberChangeListener called");
	}

	/**
	 * @return the selectedDispItemNum
	 */
	public String getSelectedDispItemNum() {
		return selectedDispItemNum;
	}

	/**
	 * @param selectedDispItemNum
	 *            the selectedDispItemNum to set
	 */
	public void setSelectedDispItemNum(String selectedDispItemNum) {
		this.selectedDispItemNum = selectedDispItemNum;
	}

	
	
	
    private boolean hasTheListBeenCompromised(List<String> listSeriesUids, List<SeriesDTO> resultFromSearch){
        boolean changed = false;
        if(listSeriesUids.size() != resultFromSearch.size()){
            changed = true;
        }
        for(SeriesDTO series:resultFromSearch){
            if (!listSeriesUids.contains(series.getSeriesUID())){
                changed = true;
            }
        }
        return changed;	
    }

	public List<CustomSeriesListDTO> getResults() {
		return results;
	}

	public void setResults(List<CustomSeriesListDTO> results) {
		this.results = results;
	}

	public String getSelectedListName() {
		return selectedListName;
	}

	public void setSelectedListName(String selectedListName) {
		this.selectedListName = selectedListName;
	}
	
	private boolean showSelectedList = false;
	
	/* hold list of attribute for a given custom list */
	private List<CustomSeriesListAttributeDTO> seriesInstanceUidsList = new ArrayList<CustomSeriesListAttributeDTO>();
	private List<SelectItem> userNameItems = new ArrayList<SelectItem>();
	private String selectedUserName;
	private int seriesCount=0;
	private int toDelete;
	
	public void selectedNameChangeListener(ValueChangeEvent event) {
		if (!event.getPhaseId().equals(PhaseId.INVOKE_APPLICATION)) {
	   		event.setPhaseId(PhaseId.INVOKE_APPLICATION);
	   		event.queue();
	        return;
	    }
		String selectedUser = (String)event.getNewValue();
		System.out.println("user name new value" + selectedUser);
		this.selectedUserName = selectedUser;
		searchByUserName();
	}
	public String searchByUserName() {
		reset();
		System.out.println("selectedUserName"+selectedUserName);
	    if(!StringUtil.isEmptyTrim(selectedUserName) && !selectedUserName.equals(defaultSelectedValue)) {
	   		results = processor.getCustomListByUser(selectedUserName);
	   	} else {
	   		  message="The list could not be found.";
	   		  results = null;
	   		
	   	}
	    if(results.size()>1){
			list = "lists";
		}
		else{list = "list";}
	    showSelectedList = false; 
	    return null;
	}
	public void listNamedDetailsClicked(ActionEvent actionEvent) throws Exception {
		reset();
		int index = table.getRowIndex();
		CustomSeriesListDTO selectedSharedList = results.get(index);
		System.out.println("name: " + selectedSharedList.getName() + " comment: " + selectedSharedList.getComment());
		Integer customSeriesListPkId = selectedSharedList.getId();
		seriesInstanceUidsList.clear();
		showSelectedList = true;
		seriesInstanceUidsList = processor.getCustomseriesListAttributesById(customSeriesListPkId);
		selectedListName = selectedSharedList.getName();
	}
	public String resetManageList() {
		selectedUserName= defaultSelectedValue;
	    results.clear();
	    showSelectedList=false;
	    return reset();
	}
		     
	/**
	 * 
	 * @return
	*/
	public String performDelete() {
		int index = table.getRowIndex();
		CustomSeriesListDTO selectedSharedList = results.get(index);
		System.out.println("name: " + selectedSharedList.getName() + " comment: " + selectedSharedList.getComment());
		if (seriesInstanceUidsList == null || seriesInstanceUidsList.isEmpty()) {
			seriesInstanceUidsList = processor.getCustomseriesListAttributesById(selectedSharedList.getId());
		}
		CustomSeriesListDTO editDTO = new CustomSeriesListDTO();
		System.out.println("id: " + toDelete);
		editDTO.setId(toDelete);
		processor.delete(editDTO);
		String email = processor.findEmailByUserName(selectedUserName);
		StringBuffer impactList = new StringBuffer();
		for (CustomSeriesListAttributeDTO series : seriesInstanceUidsList) {
			impactList.append(series.getSeriesInstanceUid()).append(", ");
		}
		System.out.println("impact List: " + impactList.toString());
		MailManager.sendDeletionOfShareListEmail(email, selectedSharedList.getName(), impactList.toString());
	    return searchByUserName();
	}
	
	public String getList() {
		return list;
	}
	
	public List<SelectItem> getUserNameItems() {
		return userNameItems;
	}
	
	public void setUserNameItems(List<SelectItem> userNameItems) {
		this.userNameItems = userNameItems;
	}
	
	public String getSelectedUserName() {
		return selectedUserName;
	}
	
	public void setSelectedUserName(String selectedUserName) {
		this.selectedUserName = selectedUserName;
	}
	
	public boolean isShowSelectedList() {
		return showSelectedList;
	}
	
	public void setShowSelectedList(boolean showSelectedList) {
		this.showSelectedList = showSelectedList;
	}
	public int getSeriesCount() {
		if(getSeriesInstanceUidsList() != null){
			seriesCount = getSeriesInstanceUidsList().size();
		}
		return seriesCount;
	}
	public int getToDelete() {
		return toDelete;
	}
	public void setToDelete(int toDelete) {
		this.toDelete = toDelete;
	}
	public List<CustomSeriesListAttributeDTO> getSeriesInstanceUidsList() {
		return seriesInstanceUidsList;
	}
	public void setSeriesInstanceUidsList(List<CustomSeriesListAttributeDTO> seriesInstanceUidsList) {
		this.seriesInstanceUidsList = seriesInstanceUidsList;
	}
}