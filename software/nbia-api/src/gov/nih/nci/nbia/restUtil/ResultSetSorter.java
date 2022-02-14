package gov.nih.nci.nbia.restUtil;

import java.util.List;
import java.util.ArrayList;
import gov.nih.nci.nbia.searchresult.PatientSearchResultWithModilityAndBodyPart;
import java.util.Comparator;
import java.util.Collections;

public class ResultSetSorter {
	

	public List<PatientSearchResultWithModilityAndBodyPart> sort2(List<PatientSearchResultWithModilityAndBodyPart> input, String sortField, String sortDirection){
		List<PatientSearchResultWithModilityAndBodyPart> 
		
		copy = new ArrayList<PatientSearchResultWithModilityAndBodyPart>();
       
		copy.addAll(input);
        Comparator comp= null;
        if (sortField.equalsIgnoreCase("collection")) {
        	comp=new PSRMBCollectionCompare();
        }
        if (sortField.equalsIgnoreCase("subject")) {
        	comp=new PSRMBSubjectCompare();
        }
        if (sortField.equalsIgnoreCase("study")) {
        	comp=new PSRMBStudyCompare();
        }
        if (sortField.equalsIgnoreCase("series")) {
        	comp=new PSRMBSeriesCompare();
        }
        if (sortField.equalsIgnoreCase("totalNumberOfSeries")) {
        	comp=new PSRMBTotalSeriesCompare();
        }
        if (sortField.equalsIgnoreCase("totalNumberOfStudies")) {
        	comp=new PSRMBTotalStudiesCompare();
        }
        if (comp==null) {
        	comp=new PSRMBCollectionCompare();
        }
        if (sortDirection==null) {
        	sortDirection="ascending";
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
			PatientSearchResultWithModilityAndBodyPart p1=(PatientSearchResultWithModilityAndBodyPart)o1;
			PatientSearchResultWithModilityAndBodyPart p2=(PatientSearchResultWithModilityAndBodyPart)o2;
			return p1.getProject().compareToIgnoreCase(p2.getProject());
		}
		
	}
	private class PSRMBSubjectCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			PatientSearchResultWithModilityAndBodyPart p1=(PatientSearchResultWithModilityAndBodyPart)o1;
			PatientSearchResultWithModilityAndBodyPart p2=(PatientSearchResultWithModilityAndBodyPart)o2;
			return p1.getSubjectId().compareToIgnoreCase(p2.getSubjectId());
		}
		
	}
	private class PSRMBStudyCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			PatientSearchResultWithModilityAndBodyPart p1=(PatientSearchResultWithModilityAndBodyPart)o1;
			PatientSearchResultWithModilityAndBodyPart p2=(PatientSearchResultWithModilityAndBodyPart)o2;
			if (p1.computeFilteredNumberOfStudies()>p2.computeFilteredNumberOfStudies()) return 1;
			if (p1.computeFilteredNumberOfStudies()<p2.computeFilteredNumberOfStudies()) return -1;
			return 0;
		}
		
	}
	private class PSRMBSeriesCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			PatientSearchResultWithModilityAndBodyPart p1=(PatientSearchResultWithModilityAndBodyPart)o1;
			PatientSearchResultWithModilityAndBodyPart p2=(PatientSearchResultWithModilityAndBodyPart)o2;
			if (p1.computeFilteredNumberOfSeries()>p2.computeFilteredNumberOfSeries()) return 1;
			if (p1.computeFilteredNumberOfSeries()<p2.computeFilteredNumberOfSeries()) return -1;
			return 0;
		}
		
	}
	private class PSRMBTotalSeriesCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			PatientSearchResultWithModilityAndBodyPart p1=(PatientSearchResultWithModilityAndBodyPart)o1;
			PatientSearchResultWithModilityAndBodyPart p2=(PatientSearchResultWithModilityAndBodyPart)o2;
			if (p1.getTotalNumberOfSeries()>p2.getTotalNumberOfSeries()) return 1;
			if (p1.getTotalNumberOfSeries()<p2.getTotalNumberOfSeries()) return -1;
			return 0;
		}
		
	}
	private class PSRMBTotalStudiesCompare implements Comparator{
		
		public int compare(Object o1, Object o2)
		{
			System.out.println("totalStudyCompare");
			PatientSearchResultWithModilityAndBodyPart p1=(PatientSearchResultWithModilityAndBodyPart)o1;
			PatientSearchResultWithModilityAndBodyPart p2=(PatientSearchResultWithModilityAndBodyPart)o2;
			if (p1.getTotalNumberOfStudies()>p2.getTotalNumberOfStudies()) return 1;
			if (p1.getTotalNumberOfStudies()<p2.getTotalNumberOfStudies()) return -1;
			return 0;
		}
		
	}
}
