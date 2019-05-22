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
public class PhantomCriteria extends SingleValuePersistentCriteria
    implements Serializable {

	private static final long serialVersionUID = 1L;
 
	public final static String PhantomOnly = "0";
	public final static String ExcludePhantom = "1";
	public final static String Everything = "2";

    private String qcSubjectOption;

    //Constructor
    public PhantomCriteria() {
    	super();
    }
	/**
	 */
	public PhantomCriteria(String qcSubjectOption) {
		super();
		this.qcSubjectOption = qcSubjectOption;
	}

	public String getQcSubjectOption() {
		return qcSubjectOption;
	}
	public void setQcSubjectOption(String qcSubjectOption) {
		if (qcSubjectOption != null) {
			this.qcSubjectOption = qcSubjectOption.toUpperCase();
		}
	}

	public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {
		setQcSubjectOption(attr.getAttributeValue());
	}

	public String getSingleValue() {
		return qcSubjectOption;
	}
}
