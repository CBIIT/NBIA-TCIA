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
import java.util.Collection;
import java.util.Iterator;



public class SpeciesCriteria extends MultipleValuePersistentCriteria
    implements Serializable {
    private Collection<String> speciesObjects;

    /**
     *
     */
    public SpeciesCriteria() {
    }

    /**
     * @return Returns the collectionValue.
     */
    public Collection<String> getSpeciesObjects() {
        return speciesObjects;
    }

    protected Collection<String> getMultipleValues() {
        return getSpeciesObjects();
    }

    /**
     * 
     */
    public void setSpeciesObjects(Collection getSpeciesObjects) {
        for (Iterator iter = getSpeciesObjects.iterator(); iter.hasNext();) {
            Object thisObj = iter.next();

            if (thisObj instanceof String) {
            	getCreateSpeciesObjects().add((String) thisObj);
            }
        }
    }

    private Collection<String> getCreateSpeciesObjects() {
        if (speciesObjects == null) {
        	speciesObjects = new ArrayList<String>();
        }

        return speciesObjects;
    }

    public Collection getSpeciesValue() {
        return speciesObjects;
    }

    public void setSpeciesValue(String speciesValue) {
        this.getCreateSpeciesObjects().add(speciesValue);
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {
        setSpeciesValue(attr.getAttributeValue());
    }

    public void removeSpecies(String speciesToRemove) {
        speciesObjects.remove(speciesToRemove);
    }

}
