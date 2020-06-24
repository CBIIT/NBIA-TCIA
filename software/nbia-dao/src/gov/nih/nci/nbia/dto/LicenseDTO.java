/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dto;

import gov.nih.nci.nbia.internaldomain.License;

public class LicenseDTO {
	
	private String longName;
	private Integer id;
	private String shortName;
	private String licenseURL;
	private String licenseText;
	private String commercialUse;
	
   public String getLongName() {
		return longName;
	}
	public void setLongName(String longName) {
		this.longName = longName;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		shortName = shortName;
	}
	public String getLicenseURL() {
		return licenseURL;
	}
	public void setLicenseURL(String licenseURL) {
		this.licenseURL = licenseURL;
	}
	public String getLicenseText() {
		return licenseText;
	}
	public void setLicenseText(String licenseText) {
		this.licenseText = licenseText;
	}
	public String getCommercialUse() {
		return commercialUse;
	}
	public void setCommercialUse(String commercialUse) {
		this.commercialUse = commercialUse;
	}
   public LicenseDTO() {}
   public LicenseDTO(License license) {
	   this.commercialUse=license.getCommercialUse();
	   this.id=license.getId();
	   this.licenseText=license.getLicenseText();
	   this.longName=license.getLongName();
	   this.shortName=license.getShortName();
	   this.licenseURL=license.getUrl();
   }
   public License getLicense() {
	   License returnValue=new License();
	   returnValue.setCommercialUse(commercialUse);
	   returnValue.setId(id);
	   returnValue.setLicenseText(licenseText);
	   returnValue.setShortName(shortName);
	   returnValue.setLongName(longName);
	   returnValue.setUrl(licenseURL);
	   
	   return returnValue;
   }

}
