/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.internaldomain;

import java.util.Collection;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
	/**
	* Data (chosen by the image submitter) to describe the clinical trial and site from which the image and related data originated.	**/
public class TrialDataProvenance  implements Serializable
{

	/**
	* One or more characters used to identify, name, or characterize the nature, properties, or contents of a thing.	**/
	private Integer id;
	/**
	* Retrieves the value of id attribute
	* @return id
	**/

	public Integer getId(){
		return id;
	}

	/**
	* Sets the value of id attribute
	**/

	public void setId(Integer id){
		this.id = id;
	}

		/**
	* An name chosen by the image submitter to identify the collection that the image is a part of.	**/
	private String project;
	/**
	* Retrieves the value of project attribute
	* @return project
	**/

	public String getProject(){
		return project;
	}

	/**
	* Sets the value of project attribute
	**/

	public void setProject(String project){
		this.project = project;
	}


	/**
	* An associated gov.nih.nci.ncia.domain.GeneralImage object's collection
	**/

	private Collection<GeneralImage> generalImageCollection;
	/**
	* Retrieves the value of generalImageCollection attribute
	* @return generalImageCollection
	**/

	public Collection<GeneralImage> getGeneralImageCollection(){
		return generalImageCollection;
	}

	/**
	* Sets the value of generalImageCollection attribute
	**/

	public void setGeneralImageCollection(Collection<GeneralImage> generalImageCollection){
		this.generalImageCollection = generalImageCollection;
	}

	/**
	* An associated gov.nih.nci.ncia.domain.Patient object's collection
	**/

	private Collection<Patient> patientCollection;
	/**
	* Retrieves the value of patientCollection attribute
	* @return patientCollection
	**/

	public Collection<Patient> getPatientCollection(){
		return patientCollection;
	}

	/**
	* Sets the value of patientCollection attribute
	**/

	public void setPatientCollection(Collection<Patient> patientCollection){
		this.patientCollection = patientCollection;
	}

	
	/**
	* An associated gov.nih.nci.ncia.domain.GeneralSeries object's collection
	**/

	private Collection<Site> siteCollection;
	/**
	* Retreives the value of siteCollection attribue
	* @return siteCollection
	**/

	public Collection<Site> getSiteCollection(){
		return siteCollection;
	}

	/**
	* Sets the value of siteCollection attribue
	**/

	public void setSiteCollection(Collection<Site> siteCollection){
		this.siteCollection = siteCollection;
	}
	
	/**
	* Compares <code>obj</code> to it self and returns true if they both are same
	*
	* @param obj
	**/
	public boolean equals(Object obj)
	{
		if(obj instanceof TrialDataProvenance)
		{
			TrialDataProvenance c =(TrialDataProvenance)obj;
			if(getId() != null && getId().equals(c.getId()))
				return true;
		}
		return false;
	}

	/**
	* Returns hash code for the primary key of the object
	**/
	public int hashCode()
	{
		if(getId() != null)
			return getId().hashCode();
		return 0;
	}

}