/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.beans.populator;

import gov.nih.nci.nbia.beans.BeanManager;
import gov.nih.nci.nbia.beans.security.AnonymousLoginBean;

import java.util.List;


/**
 * This bean became necessary after switching to ICEfaces.
 *
 *  
 */
public class ExternalPatientSearchPopulatorMgBean {

	public String populate() {
		String path = "externalPatSearch";
		AnonymousLoginBean anonymousLoginBean = BeanManager.getAnonymousLoginBean();
		try {
			path = anonymousLoginBean.externalBypassLogin(null, patientID);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("!!!!path =" + path);
		;
		return path;
	}

	private String patientID;

	public String getPatientID() {
		return patientID;
	}

	public void setPatientID(String patientID) {
		this.patientID = patientID;
	}
}
