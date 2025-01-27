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
* Revision 1.1  2007/08/05 21:44:38  bauerd
* Initial Check in of reorganized components
*
* Revision 1.3  2006/09/27 20:46:27  panq
* Reformated with Sun Java Code Style and added a header for holding CVS history.
*
*/
package gov.nih.nci.ncia.criteria;


import gov.nih.nci.nbia.querystorage.QueryAttributeWrapper;
import gov.nih.nci.nbia.util.CrossDatabaseUtil;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


public class DescriptionCriteria extends PersistentCriteria {
    private static final long serialVersionUID = 1L;
    private String searchString;
    private static Logger logger = LogManager.getLogger(DescriptionCriteria.class);

    /**
     * @return Returns the seaerch string.
     */
    public String getSearchString() {
        return searchString;
    }

    /**
     * @param from The search string to set.
     */
    public void setSearchString(String searchString) {
        this.searchString= searchString;
    }

    @Override
    public boolean isEmpty() {

        if (searchString == null) {
        	return true;
        } else {
        	return false;
        }
    }

    @Override
    public String getDisplayValue() {
    	if (searchString != null ){
    		return searchString;
    	}
        return "";
    }

    @Override
    public String getDisplayName() {

        return "Description";
    }

    public List<QueryAttributeWrapper> getQueryAttributes() {
    	List<QueryAttributeWrapper> attrList = new ArrayList<QueryAttributeWrapper>();
    	String searchString = null;
      int subAttrName = 1;

        // Create a wrapper for each of the criteria's values

        QueryAttributeWrapper attr = new QueryAttributeWrapper();
        attr.setCriteriaClassName(getClass().getName());
        attr.setSubAttributeName(String.valueOf(subAttrName++));
        attr.setAttributeValue(searchString);
        attrList.add(attr);

        return attrList;
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {

    	try {
    		if (attr.getSubAttributeName().equals("1")) {
    			searchString = attr.getAttributeValue();
    		}
    	}
    	catch (Exception ex) {
    		logger.error("error in description search", ex);
    	}
    }
}
