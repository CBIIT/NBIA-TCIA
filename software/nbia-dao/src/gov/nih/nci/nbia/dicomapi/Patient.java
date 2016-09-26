/*  Copyright   2010 - IEETA
 *
 *  This file is part of Dicoogle.
 *
 *  Author: Luís A. Bastião Silva <bastiao@ua.pt>
 *
 *  Dicoogle is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Dicoogle is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Dicoogle.  If not, see <http://www.gnu.org/licenses/>.
 */
package gov.nih.nci.nbia.dicomapi;

import java.util.ArrayList;
import java.util.Hashtable;

/**
 *
 * @author Luís A. Bastião Silva <bastiao@ua.pt>
 */
public class Patient
{
    private String PatientID ;
    private String PatientName ;
    private String PatientSex ;
    private String PatientBirthDate;
    


    private ArrayList<Study> studies = new ArrayList<Study>() ;
    private Hashtable<String, Study> studiesHash = new Hashtable<String, Study>();

    public Patient(String PatientID, String PatientName)
    {
        this.PatientName = PatientName ;
        this.PatientID = PatientID ; 
    }
    public Patient(String PatientID)
    {
        this.PatientID = PatientID ;
        
    }

    /**
     * Add new Study to Patient
     * @param s
     */
    public void addStudy(Study s)
    {

        if (this.studiesHash.containsKey(s.getStudyInstanceUID()))
        {
            /** 
             * The studie exists, so it will take the series and add the series
             */

            Study es = this.studiesHash.get(s.getStudyInstanceUID()) ; 

            for (Serie e: s.getSeries())
            {
                es.addSerie(e) ; 
            }
            
           
        }
        else
        {
            this.getStudies().add(s);
            this.studiesHash.put(s.getStudyInstanceUID(), s);
        }

    }

    /**
     * Get the Study with StudyInstanceUID. If it exists
     * will be returned. Otherwise a null is returned
     * @return s Stydy Result
     */
    public Study getStudy(String instaceUID)
    {

        Study s = null ;

        return null ;
    }


    public String toString()
    {
        String result = "";
        result += "PatientID: " + this.getPatientID() ;
        if (this.getPatientName()!=null)
            result = "PatientName: " + this.getPatientName() + "\n";
        if (this.getPatientSex() != null)
            result = "PatientSax: " + this.getPatientSex() + "\n";
        
        // XXX Study + Series 

        return result ; 
    }

    /**
     * @return the PatientID
     */
    public String getPatientID() {
        return PatientID;
    }

    /**
     * @param PatientID the PatientID to set
     */
    public void setPatientID(String PatientID) {
        this.PatientID = PatientID;
    }

    /**
     * @return the PatientName
     */
    public String getPatientName() {
        return PatientName;
    }

    /**
     * @param PatientName the PatientName to set
     */
    public void setPatientName(String PatientName) {
        this.PatientName = PatientName;
    }

    /**
     * @return the PatientSex
     */
    public String getPatientSex() {
        return PatientSex;
    }

    /**
     * @param PatientSex the PatientSex to set
     */
    public void setPatientSex(String PatientSex) {
        this.PatientSex = PatientSex;
    }

    /**
     * @return the studies
     */
    public ArrayList<Study> getStudies() {
        return studies;
    }

    /**
     * @return the PatientBirthDate
     */
    public String getPatientBirthDate() {
        return PatientBirthDate;
    }

    /**
     * @param PatientBirthDate the PatientBirthDate to set
     */
    public void setPatientBirthDate(String PatientBirthDate) {
        this.PatientBirthDate = PatientBirthDate;
    }


}
