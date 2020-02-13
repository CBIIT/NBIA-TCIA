/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.domain.operation;

import java.util.Map;

import gov.nih.nci.nbia.internaldomain.TrialDataProvenance;

public interface SiteOperationInterface {
	public Object validate(Map numbers) throws Exception;
	public TrialDataProvenance getTdp();
	public void setTdp(TrialDataProvenance tdp);
	}

