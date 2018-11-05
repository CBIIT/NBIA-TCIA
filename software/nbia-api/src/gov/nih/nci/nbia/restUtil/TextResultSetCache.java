package gov.nih.nci.nbia.restUtil;
import java.io.Serializable;
import org.apache.commons.jcs.JCS;
import org.apache.commons.jcs.access.CacheAccess;
import org.apache.commons.jcs.access.exception.CacheException;

public class TextResultSetCache {
	
	private CacheAccess<String, TextSearchSummary> cache;
	
	public TextResultSetCache() {
		try {
			cache = JCS.getInstance( "default" );
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public TextSearchSummary getPatientSearchSummary(String key) {
		try {

		return cache.get(key);
		}
        catch ( Exception e ) 
        {
            e.printStackTrace();
        }
		return null;
	}

	public void putPatientPatientSearchSummary(String key, TextSearchSummary value) {
          cache.put(key, value);
	}
}
