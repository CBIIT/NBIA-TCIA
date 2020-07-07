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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;


public class TimePointCriteria extends PersistentCriteria {
    private static final long serialVersionUID = 1L;
    private Integer fromDay;
    private Integer toDay;
    private static Logger logger = Logger.getLogger(TimePointCriteria.class);

  
    public Integer getFromDay() {
		return fromDay;
	}

	public void setFromDay(Integer fromDay) {
		this.fromDay = fromDay;
	}

	public Integer getToDay() {
		return toDay;
	}

	public void setToDay(Integer toDay) {
		this.toDay = toDay;
	}

	@Override
    public boolean isEmpty() {

        if (fromDay == null && toDay == null) {
        	return true;
        } else {
        	return false;
        }
    }

    @Override
    public String getDisplayValue() {
    	if (fromDay != null && toDay != null){
    		 SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
    		return fromDay+ " ~ " + toDay;
    	}
        return "";
    }

    @Override
    public String getDisplayName() {

        return "Days Available on NCIA";
    }

    public List<QueryAttributeWrapper> getQueryAttributes() {
    	List<QueryAttributeWrapper> attrList = new ArrayList<QueryAttributeWrapper>();
    	String fromDayString = null;
        String toDayString = null;
        int subAttrName = 1;
        SimpleDateFormat sdf = CrossDatabaseUtil.getDatabaseSpecificDatePattern();

		if (fromDay != null) {
		    fromDayString = fromDay.toString();
		}

		if (toDay != null) {
		    toDayString = toDay.toString();
		}
        // Create a wrapper for each of the criteria's values

        QueryAttributeWrapper attr = new QueryAttributeWrapper();
        attr.setCriteriaClassName(getClass().getName());
        attr.setSubAttributeName(String.valueOf(subAttrName++));
        attr.setAttributeValue(fromDayString);
        attrList.add(attr);

        QueryAttributeWrapper attr2 = new QueryAttributeWrapper();
        attr2.setCriteriaClassName(getClass().getName());
        attr2.setSubAttributeName(String.valueOf(subAttrName++));
        attr2.setAttributeValue(toDayString);
        attrList.add(attr2);
        return attrList;
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {

    	try {
    		if (attr.getSubAttributeName().equals("1")) {
    			fromDay = Integer.valueOf(attr.getAttributeValue());
    		} else if (attr.getSubAttributeName().equals("2")) {
    			toDay = Integer.valueOf(attr.getAttributeValue());
    		}
    	}
    	catch (Exception ex) {
    		logger.error("error in parsing date in database", ex);
    	}
    }
}
