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
 * <p>The dicom tag view popup browser window worked historically
 * by opening the new browser window with javascript, then using
 * a hidden form.... the target was changed with javascript to the
 * new window and a command action fired off to load the dicom tag
 * info for the new page to use.  This doesn't appear to work
 * with ICEfaces.  Looks like iceSubmit() js method doesn't care at
 * all about the target attribute of a form.
 *
 * <p>So..... just open the new browser window, point it to the
 * page... and here is the page load action so all the dicom tag
 * info is loaded in time to be displayed.
 */
public class ExternalPubSearchPopulatorMgBean {

	public void populate() {

	AnonymousLoginBean anonymousLoginBean = BeanManager.getAnonymousLoginBean();
	try {
		anonymousLoginBean.externalBypassLogin(collectionName);
	}
    catch (Exception e) {
        e.printStackTrace();
    }
	}

	private String collectionName;

	public String getCollectionName() {
		return collectionName;
	}
	public void setCollectionName(String collectionName) {
		this.collectionName = collectionName;
	}
}
