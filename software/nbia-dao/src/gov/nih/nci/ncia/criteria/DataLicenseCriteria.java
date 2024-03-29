/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
* $Id$
*
* $Log: not supported by cvs2svn $
* Revision 1.2  2007/08/14 16:53:47  bauerd
* Removed the repopulate logic and cleaned up the class files
*
* Revision 1.1  2007/08/07 12:05:15  bauerd
* *** empty log message ***
*
* Revision 1.1  2007/08/05 21:44:38  bauerd
* Initial Check in of reorganized components
*
* Revision 1.12  2006/12/13 14:04:14  dietrich
* Grid enhancement
*
* Revision 1.11  2006/09/27 20:46:27  panq
* Reformated with Sun Java Code Style and added a header for holding CVS history.
*
*/
/*
 * Created on Jul 24, 2005
 *
 *
 *
 */
package gov.nih.nci.ncia.criteria;

import gov.nih.nci.nbia.querystorage.QueryAttributeWrapper;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;


/**
 * @author Q. PAN - NCICBIIT/Leidos/Ellumen
 *
 *
 *
 */
public class DataLicenseCriteria extends SingleValuePersistentCriteria
    implements Serializable {

	private static final long serialVersionUID = 1L;
 


    private String excludeCommercial;

    //Constructor
    public DataLicenseCriteria() {
    	super();
    }
	/**
	 */
	public DataLicenseCriteria(String excludeCommercial) {
		super();
		this.excludeCommercial = excludeCommercial;
	}

	public String getExcludeCommercial() {
		return excludeCommercial;
	}
	public void setExcludeCommercial(String excludeCommercial) {
		if (excludeCommercial != null) {
			this.excludeCommercial = excludeCommercial.toUpperCase();
		}
	}

	public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {
		setExcludeCommercial(attr.getAttributeValue());
	}

	public String getSingleValue() {
		return excludeCommercial;
	}
}
