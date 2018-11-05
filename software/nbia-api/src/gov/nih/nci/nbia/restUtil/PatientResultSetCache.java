package gov.nih.nci.nbia.restUtil;
import java.io.Serializable;
import org.apache.commons.jcs.JCS;
import org.apache.commons.jcs.access.CacheAccess;
import org.apache.commons.jcs.access.exception.CacheException;

public class PatientResultSetCache {
	
	private CacheAccess<String, PatientSearchSummary> cache;
	
	public PatientResultSetCache() {
		try {
			cache = JCS.getInstance( "default" );
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public PatientSearchSummary getPatientSearchSummary(String key) {
		try {

		return cache.get(key);
		}
        catch ( Exception e ) 
        {
            e.printStackTrace();
        }
		return null;
	}

	public void putPatientPatientSearchSummary(String key, PatientSearchSummary value) {
          cache.put(key, value);
	}
}
