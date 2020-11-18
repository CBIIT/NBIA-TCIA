package gov.nih.nci.nbia.excellDao;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileLocDao 
{	
	private Map<String, ArrayList<String>> fileNameMap = new HashMap<String, ArrayList<String>>();
    
	public static void main(String[] args) 
	{	//testing code
		FileLocDao  fld= new FileLocDao();
		fld.getDataLocation("3.0");	
	}
	

	void readCsvFile(String filePath) {	
		BufferedReader reader;
		try {
			reader = new BufferedReader(new FileReader(filePath));
			String line = reader.readLine();
			while (line != null) {
				String [] row = line.split(",");
				fileNameMap.computeIfAbsent(row[0], k -> new ArrayList<>()).add(row[1]);
				// read next line
				line = reader.readLine();
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
		
	//Testing code
	public List getDataLocation(String uid) {
		//testing code
		String filename = "/usr/local/tomcat-7.0.105/nbia-data/DataSourceForDevCM.csv";		

		readCsvFile(filename);
//		System.out.println("!!filename="+filename + " uid="+uid);
		List<String> list = fileNameMap.get(uid);

		return list;
	}
	
	public List getDataLocation(String uid, String dataSource) {
		String filename = "/usr/local/tomcat-7.0.105/nbia-data/DataSourceForDevCM.csv";
		if (dataSource != null)
			filename = dataSource;		

		readCsvFile(filename);
//		System.out.println("!!filename="+filename + " uid="+uid);
		List<String> list = fileNameMap.get(uid);

		return list;
	}	
}


