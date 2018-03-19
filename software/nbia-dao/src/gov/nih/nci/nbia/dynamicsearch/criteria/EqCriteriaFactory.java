/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dynamicsearch.criteria;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

public class EqCriteriaFactory implements CriteriaFactory {

	public Criterion constructCriteria(String fieldName, String value, String fieldType)
	throws Exception
	{
		System.out.println("fieldname---------"+fieldName);
		if (fieldType.equalsIgnoreCase("java.lang.String"))
		{
			if (value.equalsIgnoreCase("Not Populated (NULL)") || value.equalsIgnoreCase("NULL"))
			{
				return Restrictions.isNull(fieldName);
			}
			if ((fieldName.indexOf("SOPInstanceUID")>1)||
				(fieldName.indexOf("acquisitionDatetime")>1)||
				(fieldName.indexOf("SOPClassUID")>1)||
				(fieldName.indexOf("instanceNumber")>1)||	
				(fieldName.indexOf("contentDate")>1)||
				(fieldName.indexOf("contentTime")>1)||
				(fieldName.indexOf("imageType")>1)||
				(fieldName.indexOf("acquisitionDate")>1)||
				(fieldName.indexOf("acquisitionTime")>1)||
				(fieldName.indexOf("acquisitionNumber")>1)||
				(fieldName.indexOf("lossyImageCompression")>1)||
				(fieldName.indexOf("imageOrientationPatient")>1)||
				(fieldName.indexOf("pixelSpacing")>1)||
				(fieldName.indexOf("imagePositionPatient")>1)||
				(fieldName.indexOf("sliceLocation")>1)||
				(fieldName.indexOf("contrastBolusAgent")>1)||
				(fieldName.indexOf("SOPClassUID")>1)||
				(fieldName.indexOf("patientPosition")>1)||
				(fieldName.indexOf("sourceToDetectorDistance")>1)||
				(fieldName.indexOf("sourceSubjectDistance")>1)||
				(fieldName.indexOf("focalSpotSize")>1)||
				(fieldName.indexOf("storageMediaFileSetUID")>1)||
				(fieldName.indexOf("acquisitionDatetime")>1)||
				(fieldName.indexOf("imageComments")>1)||
				(fieldName.indexOf("imageLaterality")>1)||
				(fieldName.indexOf("acquisitionMatrix")>1)||
				(fieldName.indexOf("columns")>1)||
				(fieldName.indexOf("rows")>1)||
				(fieldName.indexOf("usFrameNum")>1)||
				(fieldName.indexOf("usColorDataPresent")>1))
			{
				System.out.println("foundit");
				return Restrictions.eq(fieldName, value);
			}
			return Restrictions.eq(fieldName, value).ignoreCase();
		}
		else
		{
			return Restrictions.eq(fieldName, 
					               ConstructorGenerator.getConstructor(fieldType).newInstance(value));
		}	
	}
}