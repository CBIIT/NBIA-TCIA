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
* Revision 1.28  2006/12/13 14:04:14  dietrich
* Grid enhancement
*
* Revision 1.27  2006/09/27 20:46:27  panq
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
import java.util.List;


/**
 * @author Prashant Shah - NCICB/SAIC
 */
public class ImageSliceThickness extends MultipleValuePersistentCriteria
                                 implements Serializable, 
                                            RangeCriteria {
	
    protected RangeData rangeData = new RangeData();

    /**
     * No enforcement of legal relationships between from and to is done here....
     * 
     * Values must include a space with something after it (like 'mm')
     */
    public ImageSliceThickness(String imageSliceThickFrom,
        String imageSliceThickFromValue, String imageSliceThickTo,
        String imageSliceThickToValue) {
        rangeData.setFromOperator(imageSliceThickFrom);
        rangeData.setFromValue(imageSliceThickFromValue.substring(0,
                imageSliceThickFromValue.indexOf(' ')));

        if ((imageSliceThickTo != null) && !imageSliceThickTo.equals("")) {
            rangeData.setToOperator(imageSliceThickTo);
            rangeData.setToValue(imageSliceThickToValue.substring(0,
                    imageSliceThickToValue.indexOf(' ')));
        }
    }

    public ImageSliceThickness() {
    }

    public boolean isEmpty() {
        return rangeData.isEmpty();
    }

    public String getDisplayValue() {
        return rangeData.getDisplayValue();
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {
        rangeData.addValueFromQueryAttribute(attr);
    }

    protected List<String> getMultipleValues() {
        return rangeData.getMultipleValues();
    }

    public RangeData getRangeData() {
        return rangeData;
    }

    protected Collection<String> getOrderedRangeValues() {
        Collection<String> attrList = new ArrayList<String>();
        attrList.add(rangeData.getFromOperator());
        attrList.add(String.valueOf(rangeData.getFromValue()));

        if (rangeData.getToOperator() != null) {
            attrList.add(rangeData.getToOperator());
            attrList.add(String.valueOf(rangeData.getToValue()));
        }

        return attrList;
    }
}
