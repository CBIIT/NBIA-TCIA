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
 * @author Prashant Shah - NCICB/SAIC
 *
 *
 *
 */
public class PatientSexCriteria extends MultipleValuePersistentCriteria
    implements Serializable {
    private Collection<String> patientSexObjects;

    //Constructor
    public PatientSexCriteria() {
    }

    // getters and setters to add moadility values to 
    // Collection
    /**
     * @return Returns the patientSexObjects.
     */
    public Collection<String> getPatientSexObjects() {
        return patientSexObjects;
    }

    protected Collection<String> getMultipleValues() {
        return getPatientSexObjects();
    }

    /**
     * @param patientSexObjects The patientSexObjects to set.
     */
    public void setPatientSexObjects(Collection patientSexObjects) {
        for (Iterator iter = patientSexObjects.iterator(); iter.hasNext();) {
            Object thisObj = iter.next();

            if (thisObj instanceof String) {
                getCreatePatientSexObjects().add((String) thisObj);
            }
        }
    }

    private Collection<String> getCreatePatientSexObjects() {
        if (patientSexObjects == null) {
            patientSexObjects = new ArrayList<String>();
        }

        return patientSexObjects;
    }

    public void setPatientSexValue(String modalityValue) {
        this.getCreatePatientSexObjects().add(modalityValue);
    }

    public void addValueFromQueryAttribute(QueryAttributeWrapper attr) {
        setPatientSexValue(attr.getAttributeValue());
    }

}
