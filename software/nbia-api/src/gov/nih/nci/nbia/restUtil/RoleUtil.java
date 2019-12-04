package gov.nih.nci.nbia.restUtil;

import gov.nih.nci.nbia.util.SiteData;

import java.util.List;
public class RoleUtil {
	private List<String> roles;
	private long created;
	public long getCreated() {
		return created;
	}
	public void setCreated(long created) {
		this.created = created;
	}
	public List<String> getRoles() {
		return roles;
	}
	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
	
	
}
