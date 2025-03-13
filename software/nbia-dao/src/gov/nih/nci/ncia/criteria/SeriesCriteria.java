/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
* $Id: SeriesIdCriteria.java 4417 2008-04-18 20:43:12Z saksass $
*
* $Log: not supported by cvs2svn $
* Revision 1.1  2007/08/07 12:05:15  bauerd
* *** empty log message ***
*
* Revision 1.1  2007/08/05 21:44:38  bauerd
* Initial Check in of reorganized components
*
* Revision 1.7  2006/09/27 20:46:27  panq
* Reformated with Sun Java Code Style and added a header for holding CVS history.
*
*/
/*
 * Created on September 6, 2005
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
 * @author Q. Pan - NCICB/SAIC
 *
 *
 *
 */
public class SeriesCriteria extends MultipleValuePersistentCriteria implements Serializable  {
    /**
     *
     */
    private Collection<String> seriesIdObjects;

    //Constructor
    public SeriesCriteria() {
    }

    
    /**
     * @return Returns the seriesIdObjects.
     */
    public Collection<String> getSeriesIdObjects() {
        return seriesIdObjects;
    }
    
    protected Collection<String> getMultipleValues() {
        return getSeriesIdObjects();
    }


    /**
     * 
     */
    public void setSeriesIdObjects(Collection seriesIdObjects) {
        for (Iterator iter = seriesIdObjects.iterator(); iter.hasNext();) {
            Object thisObj = iter.next();

            if (thisObj instanceof String) {
            	getCreateSeriesIdObjects().add((String) thisObj);
            }
        }
    }

    private Collection<String> getCreateSeriesIdObjects() {
        if (seriesIdObjects == null) {
        	seriesIdObjects = new ArrayList<String>();
        }

        return seriesIdObjects;
    }

    public Collection getCollectionValue() {
        return seriesIdObjects;
    }

    public void setCollectionValue(String collectionValue) {
        this.getCreateSeriesIdObjects().add(collectionValue);
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {
        setCollectionValue(attr.getAttributeValue());
    }

    public void removeCollection(String collectionToRemove) {
    	seriesIdObjects.remove(collectionToRemove);
    }
    
    public String getDisplayName() {
        return "Series ID(s)";
    }
}
