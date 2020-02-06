/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dto;

import java.util.List;

/**
 * This class holds the part of patient information from Patient object.
 * @author zhoujim
 *
 */
public class PatientDTO {
	//It might be necessary to add more fields. Current, project and site name have been
	//used in this object.
	private String project;
    private List siteNames;
	public String getProject() {
		return project;
	}
	public void setProject(String project) {
		this.project = project;
	}

	public List<String> getSiteNames() {
		return siteNames;
	}
	public void setSiteNames(List siteNames) {
		this.siteNames = siteNames;
	}
	
	
	

}
