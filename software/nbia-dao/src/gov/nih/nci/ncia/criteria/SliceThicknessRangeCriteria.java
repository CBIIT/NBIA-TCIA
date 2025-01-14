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


public class SliceThicknessRangeCriteria extends PersistentCriteria {
    private static final long serialVersionUID = 1L;
    private String from;
    private String to;
    private static Logger logger = LogManager.getLogger(SliceThicknessRangeCriteria.class);

    /**
     * @return Returns the from.
     */
    public String getFrom() {
        return from;
    }

    /**
     * @param from The from to set.
     */
    public void setFrom(String from) {
        this.from = from;
    }

    /**
     * @return Returns the to.
     */
    public String getTo() {
        return to;
    }

    /**
     * @param to The to to set.
     */
    public void setTo(String to) {
        this.to = to;
    }

    @Override
    public boolean isEmpty() {

        if (from == null && to == null) {
        	return true;
        } else {
        	return false;
        }
    }

    @Override
    public String getDisplayValue() {
    	if (from != null && to != null){
    		return from + " ~ " + to;
    	}
        return "";
    }

    @Override
    public String getDisplayName() {

        return "Slice Thickness Range";
    }

    public List<QueryAttributeWrapper> getQueryAttributes() {
    	List<QueryAttributeWrapper> attrList = new ArrayList<QueryAttributeWrapper>();
    	String fromString = null;
        String toString = null;
        int subAttrName = 1;

        // Create a wrapper for each of the criteria's values

        QueryAttributeWrapper attr = new QueryAttributeWrapper();
        attr.setCriteriaClassName(getClass().getName());
        attr.setSubAttributeName(String.valueOf(subAttrName++));
        attr.setAttributeValue(from);
        attrList.add(attr);

        QueryAttributeWrapper attr2 = new QueryAttributeWrapper();
        attr2.setCriteriaClassName(getClass().getName());
        attr2.setSubAttributeName(String.valueOf(subAttrName++));
        attr2.setAttributeValue(to);
        attrList.add(attr2);
        return attrList;
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {

    	try {
    		if (attr.getSubAttributeName().equals("1")) {
    			from = attr.getAttributeValue();
    		} else if (attr.getSubAttributeName().equals("2")) {
    			to = attr.getAttributeValue();
    		}
    	}
    	catch (Exception ex) {
    		logger.error("error in parsing slice thickness range", ex);
    	}
    }
}
