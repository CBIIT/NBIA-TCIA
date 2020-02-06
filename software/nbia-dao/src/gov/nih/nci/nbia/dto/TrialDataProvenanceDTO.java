/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dto;

import java.util.List;

public class TrialDataProvenanceDTO   {

    public TrialDataProvenanceDTO(String project, List siteNames) {
    	this.project = project;
    }


    public String getProject() {
    	return this.project;
    }


	
	public List<String> getSiteNames() {
		return siteNames;
	}



	///////////////////////////////////////PRIVATE//////////////////////////////////
    private String project;
    private List<String> siteNames;
	
}