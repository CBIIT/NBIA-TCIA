package gov.nih.nci.nbia.restUtil;
import java.io.Serializable;
import org.apache.commons.jcs.JCS;
import org.apache.commons.jcs.access.CacheAccess;
import org.apache.commons.jcs.access.exception.CacheException;

public class PatientResultSetCache {
	
	private CacheAccess<String, PatientSearchSummary> cache;
    private static PatientResultSetCache instance;
    private static int checkedOut = 0;
    private static int resultSetsAdded = 0;
    
    private PatientResultSetCache() {
		try {
			cache = JCS.getInstance( "default" );
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
    public static PatientResultSetCache getInstance()
    {
        synchronized (PatientResultSetCache.class)
        {
            if (instance == null)
            {
                instance = new PatientResultSetCache();
            }
        }

        synchronized (instance)
        {
            instance.checkedOut++;
        }

        return instance;
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
		  cache.remove(key);
          cache.put(key, value);
	}
	
	public void clearCache() {
		cache.clear();
		System.out.println("cache cleared");
	}
}
