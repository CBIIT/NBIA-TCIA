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
import gov.nih.nci.nbia.beans.security.SecurityBean;
import gov.nih.nci.nbia.security.PublicData;
import gov.nih.nci.nbia.util.NCIAConfig;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * This bean became necessary after switching to ICEfaces.
 *
 * 
 */
public class ExternalPatientSearchPopulatorMgBean {

	public String populate() {
		String path = "externalPatSearch";

		savePatID();
		AnonymousLoginBean anonymousLoginBean = BeanManager.getAnonymousLoginBean();
		try {
			path = anonymousLoginBean.externalBypassLogin(null, patientID);
			if (path.equals("externalPatSearch")) {
				removeFromSession();
				anonymousLoginBean.setIsExternalSearchLogin(false);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			path = "externalSearchLogin";
		}
		return path;
	}

	private String patientID;

	public String getPatientID() {
		return patientID;
	}

	public void setPatientID(String patientID) {
		this.patientID = patientID;
	}

	private void savePatID() {
		ExternalContext externalContext = FacesContext.getCurrentInstance().getExternalContext();
		HttpServletRequest request = (HttpServletRequest) externalContext.getRequest();
		HttpSession session = request.getSession();
		session.setAttribute("extPatSearch", patientID);
	}

	public void removeFromSession() {
		ExternalContext externalContext = FacesContext.getCurrentInstance().getExternalContext();
		HttpServletRequest request = (HttpServletRequest) externalContext.getRequest();
		request.getSession().setAttribute("extPatSearch", null);
	}
}
