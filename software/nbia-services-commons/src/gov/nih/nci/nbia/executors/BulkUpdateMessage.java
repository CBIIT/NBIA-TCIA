/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.executors;

import java.io.Serializable;
import java.util.List;

public class BulkUpdateMessage implements Serializable{
	private static final long serialVersionUID = -8320007034599986923L;
	
	
	private List<String> seriesList;
	private List<String> statusList;
	private String newStatus; 
	private String[] additionalQcFlagList;
	private String[] newAdditionalQcFlagList;
	private String comments;
	
	private String emailAddress;
	private String userName;
		  
	public String getEmailAddress() {
		return emailAddress;
	}
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public List<String> getSeriesList() {
		return seriesList;
	}
	public void setSeriesList(List<String> seriesList) {
		this.seriesList = seriesList;
	}
	public List<String> getStatusList() {
		return statusList;
	}
	public void setStatusList(List<String> statusList) {
		this.statusList = statusList;
	}
	public String getNewStatus() {
		return newStatus;
	}
	
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public void setNewStatus(String newStatus) {
		this.newStatus = newStatus;
	}
	public String[] getAdditionalQcFlagList() {
		return additionalQcFlagList;
	}
	public void setAdditionalQcFlagList(String[] additionalQcFlagList) {
		this.additionalQcFlagList = additionalQcFlagList;
	}
	public String[] getNewAdditionalQcFlagList() {
		return newAdditionalQcFlagList;
	}
	public void setNewAdditionalQcFlagList(String[] newAdditionalQcFlagList) {
		this.newAdditionalQcFlagList = newAdditionalQcFlagList;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
}
