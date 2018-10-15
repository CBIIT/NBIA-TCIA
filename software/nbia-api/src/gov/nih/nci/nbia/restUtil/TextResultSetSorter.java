package gov.nih.nci.nbia.restUtil;

import java.util.List;
import java.util.ArrayList;
import gov.nih.nci.nbia.textsupport.PatientTextSearchResult;
import java.util.Comparator;
import java.util.Collections;

public class TextResultSetSorter {
	

	public List<PatientTextSearchResult> sort2(List<PatientTextSearchResult> input, String sortField, String sortDirection){
		List<PatientTextSearchResult> 
		
		copy = new ArrayList<PatientTextSearchResult>();
       
		copy.addAll(input);
        Comparator comp= null;
        if (sortField.equalsIgnoreCase("collection")) {
        	comp=new PSRMBCollectionCompare();
        }
        if (sortField.equalsIgnoreCase("subject")) {
        	comp=new PSRMBSubjectCompare();
        }
        if (sortField.equalsIgnoreCase("hit")) {
        	comp=new PSRMBHitCompare();
        }
        if (sortDirection.equalsIgnoreCase("ascending")) {
            Collections.sort(copy, comp);
        } else {
        	Collections.sort(copy, comp.reversed());
        }
        return copy;
	}
	//Collection ID, Subject ID, Studies count, and Series count.
	private class PSRMBCollectionCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			PatientTextSearchResult p1=(PatientTextSearchResult)o1;
			PatientTextSearchResult p2=(PatientTextSearchResult)o2;
			return p1.getProject().compareToIgnoreCase(p2.getProject());
		}
		
	}
	private class PSRMBSubjectCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			PatientTextSearchResult p1=(PatientTextSearchResult)o1;
			PatientTextSearchResult p2=(PatientTextSearchResult)o2;
			return p1.getSubjectId().compareToIgnoreCase(p2.getSubjectId());
		}
		
	}
	private class PSRMBHitCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			try {
				PatientTextSearchResult p1=(PatientTextSearchResult)o1;
				PatientTextSearchResult p2=(PatientTextSearchResult)o2;
				return p1.getProject().compareToIgnoreCase(p2.getProject());
			} catch (Exception e) {
				e.printStackTrace();
			}
			return -1;
		}
		
	}

}