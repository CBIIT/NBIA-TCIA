package gov.nih.nci.nbia.searchresult;

public class SeriesAndModality {
	private Integer seriesId;
	private String modality;
	public Integer getSeriesId() {
		return seriesId;
	}
	public void setSeriesId(Integer seriesId) {
		this.seriesId = seriesId;
	}
	public String getModality() {
		return modality;
	}
	public void setModality(String modality) {
		this.modality = modality;
	}
	public SeriesAndModality(Integer seriesId, String modality) {
		super();
		this.seriesId = seriesId;
		this.modality = modality;
	}
	

}
