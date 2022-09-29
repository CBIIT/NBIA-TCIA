package gov.nih.nci.nbia.internaldomain;

public class Site {
	/**
	* An attribute to allow serialization of the domain objects
	*/
	private static final long serialVersionUID = 1234567890L;
	

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
	* A numerical identifier chosen by the image submitter to identify the clinical trial site from which the image originated.	**/
	private String dpSiteId;
	/**
	* Retrieves the value of dpSiteId attribute
	* @return dpSiteId
	**/

	public String getDpSiteId(){
		return dpSiteId;
	}

	/**
	* Sets the value of dpSiteId attribute
	**/

	public void setDpSiteId(String dpSiteId){
		this.dpSiteId = dpSiteId;
	}

		/**
	* A name chosen by the image submitter to identify the clinical trial site from which the image originated.	**/
	private String dpSiteName;
	/**
	* Retrieves the value of dpSiteName attribute
	* @return dpSiteName
	**/

	public String getDpSiteName(){
		return dpSiteName;
	}

	/**
	* Sets the value of dpSiteName attribute
	**/

	public void setDpSiteName(String dpSiteName){
		this.dpSiteName = dpSiteName;
	}
	
	private TrialDataProvenance trialDataProvenance;
	
	
     

	public TrialDataProvenance getTrialDataProvenance() {
		return trialDataProvenance;
	}

	public void setTrialDataProvenance(TrialDataProvenance trialDataProvenance) {
		this.trialDataProvenance = trialDataProvenance;
	}
	
	private License license;
	
	

	public License getLicense() {
		return license;
	}

	public void setLicense(License license) {
		this.license = license;
	}

	/**
	* Compares <code>obj</code> to it self and returns true if they both are same
	*
	* @param obj
	**/
	public boolean equals(Object obj)
	{
		if(obj instanceof Site)
		{
			Site c =(Site)obj;
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
