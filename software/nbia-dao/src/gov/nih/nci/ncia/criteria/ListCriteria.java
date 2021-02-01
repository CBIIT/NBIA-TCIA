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
* Revision 1.16  2006/12/13 14:04:14  dietrich
* Grid enhancement
*
* Revision 1.15  2006/09/27 20:46:27  panq
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
import java.util.List;
import java.util.Iterator;


/**
 * @author Prashant Shah/Ajay Gupta - NCICB/SAIC
 *
 *
 *
 */
public class ListCriteria extends MultipleValuePersistentCriteria implements QCSearchCriteria
 {
    private List<String> listObjects;
    private String queryField;
    private String booleanOperator;

    /**
     *
     */
    public ListCriteria() {
    }

    /**
     * @return Returns the listValue.
     */
    public List<String> getlistObjects() {
        return listObjects;
    }

    protected List<String> getMultipleValues() {
        return getlistObjects();
    }

    /**
     * 
     */
    public void setlistObjects(List listObjects) {
        for (Iterator iter = listObjects.iterator(); iter.hasNext();) {
            Object thisObj = iter.next();

            if (thisObj instanceof String) {
                getCreatelistObjects().add((String) thisObj);
            }
        }
    }

    private List<String> getCreatelistObjects() {
        if (listObjects == null) {
            listObjects = new ArrayList<String>();
        }

        return listObjects;
    }

    public List getListValue() {
        return listObjects;
    }

    public void setListValue(String listValue) {
        this.getCreatelistObjects().add(listValue);
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {
        setListValue(attr.getAttributeValue());
    }

    public void removeList(String listToRemove) {
        listObjects.remove(listToRemove);
    }

	public String getQueryField() {
		return queryField;
	}

	public void setQueryField(String queryField) {
		this.queryField = queryField;
	}

	public String getBooleanOperator() {
		return booleanOperator;
	}

	public void setBooleanOperator(String booleanOperator) {
		this.booleanOperator = booleanOperator;
	}

}
