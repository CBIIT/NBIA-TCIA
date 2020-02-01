/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.dto;

public class ImageDTO2  implements Comparable<ImageDTO2>{
	private String SOPInstanceUID;
	private String fileName;
	private Long dicomSize;
	private String project;
	private String site;
	private String ssg;
	private int frameNum;
	private Integer instanceNumber;
	private Integer acquisitionNumber;
	private String newFilename;
	public ImageDTO2(String SOPInstanceUID, String fileName, Long dicomSize, String project, String site, String ssg, int frameNum, Integer instanceNumber, Integer acquisitionNumber){
		this.SOPInstanceUID = SOPInstanceUID;
		this.fileName = fileName;
		this.dicomSize = dicomSize;
		this.project = project;
		this.site = site;
		this.ssg = ssg;
		this.frameNum = frameNum;
		this.instanceNumber=instanceNumber;
		this.acquisitionNumber=acquisitionNumber;
	}
	
	public ImageDTO2(String SOPInstanceUID, String fileName, Long dicomSize, String project, String site, String ssg, String frameNum, Integer instanceNumber, Integer acquisitionNumber){
		this.SOPInstanceUID = SOPInstanceUID;
		this.fileName = fileName;
		this.dicomSize = dicomSize;
		this.project = project;
		this.site = site;
		this.ssg = ssg;
		if (frameNum == null){
			this.frameNum = 0;
		}
		else {
			this.frameNum = Integer.parseInt(frameNum);
		}
		this.instanceNumber=instanceNumber;
		this.acquisitionNumber=acquisitionNumber;
	}
	public String getSOPInstanceUID() {
		return SOPInstanceUID;
	}

	public String getFileName() {
		return fileName;
	}

	public Long getDicomSize() {
		return dicomSize;
	}

	public String getProject() {
		return project;
	}

	public String getSite() {
		return site;
	}

	public String getSsg() {
		return ssg;
	}

	public int getFrameNum() {
		return frameNum;
	}

	public Integer getInstanceNumber() {
		return instanceNumber;
	}

	public void setInstanceNumber(Integer instanceNumber) {
		this.instanceNumber = instanceNumber;
	}

	public Integer getAcquisitionNumber() {
		return acquisitionNumber;
	}

	public void setAcquisitionNumber(Integer acquisitionNumber) {
		this.acquisitionNumber = acquisitionNumber;
	}

    public String getNewFilename() {
		return newFilename;
	}

	public void setNewFilename(String newFilename) {
		this.newFilename = newFilename;
	}

	/**
     * Used to sort.
     *
     * @param o
     */
    public int compareTo(ImageDTO2 o) {
        Integer otherInstanceNumber = o.getInstanceNumber();
        Integer acquisitionNumber = this.getInstanceNumber();
        Integer otherAcquisitionNumber= o.getInstanceNumber();
        
        if (acquisitionNumber == null) {
        	return compareInstanceNumber(otherInstanceNumber);
        }

        if (otherAcquisitionNumber == null) {
            return 1;
        }
        
        if (acquisitionNumber.compareTo(otherAcquisitionNumber)==0) {
        	return compareInstanceNumber(otherInstanceNumber);
        }
        return acquisitionNumber.compareTo(otherAcquisitionNumber);
    }

    private int compareInstanceNumber(Integer otherInstanceNumber) {
        if (instanceNumber == null) {
            return -1;
        }

        if (otherInstanceNumber == null) {
            return 1;
        }

        return instanceNumber.compareTo(otherInstanceNumber);
    }
}
