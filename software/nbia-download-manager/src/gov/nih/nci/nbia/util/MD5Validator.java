package gov.nih.nci.nbia.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;


public class MD5Validator {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	
	public static String verifyCheckSum(String location) {
		boolean allMatch = true;
		StringBuffer sb = new StringBuffer();

		String line = "";
		String splitBy = ",";

		String fileName = location + File.separator + "md5hashes.csv";

		File f = new File(fileName);
		if (f.exists()) {
			try {
				// parsing a CSV file into BufferedReader class constructor
				BufferedReader br = new BufferedReader(new FileReader(fileName));

				int lc = 0;
				while ((line = br.readLine()) != null) // returns a Boolean value
				{
					if (lc == 0) {
						++lc;
					} else {
						String[] hashInfo = line.split(splitBy); // use comma as separator
						// System.out.println("series instance uid =" + seriesInfo[seriesUidColumnNum]);
						String imageName = hashInfo[0];
						String md5Hash = hashInfo[1];

						//System.out.println("filename=" + imageName + "  md5Hash=" + md5Hash);
						++lc;
						if (isChecksumMatch(location + File.separator + imageName, md5Hash)) {
//							System.out.println(" checksum matches\n");
							continue;
						} else {
							sb.append("checksum mismatch on " + location + File.separator + imageName + "\n");
//							System.out.println("checksum mismatch on " + location + File.separator + imageName);
							allMatch = false;
						}

					}
				}
				br.close();

			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			sb.append("Didn't find md5hashes.csv in " + location +"\n");
		}
		return sb.toString();
	}
	
	private static boolean isChecksumMatch(String fileName, String recordedSum) {
		File file = new File(fileName);
//		System.out.println("calculated checksum= "+ digest(file)+ " recorded checksum="+ recordedSum);
		String checksum = digest(file);
		if (checksum.equals(recordedSum)) {
//			System.out.println("new checksum="+checksum+" match with recorded");
			return true;
		}
		else {
//			System.out.println("@@@@@@@@@@@@@new checksum="+checksum+" does not match with recorded");
			return false;			
		}
	}
	
	private static String digest(File file) {
		String result;
		BufferedInputStream bis = null;
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			bis = new BufferedInputStream(new FileInputStream(file));
			byte[] buffer = new byte[8192];
			int n;
			while ((n = bis.read(buffer)) != -1)
				messageDigest.update(buffer, 0, n);
			byte[] hashed = messageDigest.digest();
			result = String.format("%032x", new BigInteger(1, hashed));
		} catch (Exception ex) {
			result = "";
		} finally {
			try {
				bis.close();
			} catch (Exception ignore) {
			}
		}
		return result;
	}		
}
