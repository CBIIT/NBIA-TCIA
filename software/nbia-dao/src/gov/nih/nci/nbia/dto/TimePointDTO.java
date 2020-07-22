package gov.nih.nci.nbia.dto;
import java.util.Map;
public class TimePointDTO {
	private Map maxTimepoints;
	private Map minTimepoints;
	public Map getMaxTimepoints() {
		return maxTimepoints;
	}
	public void setMaxTimepoints(Map maxTimepoints) {
		this.maxTimepoints = maxTimepoints;
	}
	public Map getMinTimepoints() {
		return minTimepoints;
	}
	public void setMinTimepoints(Map minTimepoints) {
		this.minTimepoints = minTimepoints;
	}
	

}
