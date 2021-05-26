package gov.nih.nci.nbia.util;

import gov.nih.nci.nbia.util.SiteData;

import java.util.*;
public class CollectionSiteUtil {
	
    private static Map<String, String> collectionSiteMap = new HashMap<String, String>();

	public static List<String> getUserSiteData(List<SiteData> collectionSites){
		List<String> returnValue=new ArrayList<String>();
		for (SiteData collectionsite:collectionSites) {
			String collection=collectionsite.getCollectionSite();
			String collectionTruncated=collectionsite.getCollection().substring(0, Math.min(collectionsite.getCollection().length(), 24));
			String site=collectionsite.getSiteName();
			String collectionSiteTruncated=collectionTruncated+collectionsite.getDelimiter()+site;
			returnValue.add(collectionSiteTruncated);
			if (!collectionSiteMap.containsKey(collectionSiteTruncated)) {
				collectionSiteMap.put(collectionSiteTruncated, collectionsite.getCollectionSite());
			}
		}
        return returnValue;
	}
	public static String getOriginalCollectionSite(String collectionSiteTruncated) {
		return collectionSiteMap.get(collectionSiteTruncated);
	}
	public static List<String> getOriginalCollectionSites(List<String>  collectionSitesTruncated){
		List<String> returnValue=new ArrayList<String>();
		for (String collectionSiteTruncated : collectionSitesTruncated) {
			if (collectionSiteTruncated!=null) {
				String collectionSite = collectionSiteMap.get(collectionSiteTruncated);
				if (collectionSite!=null) {
					returnValue.add(collectionSite);
				}
				
			}
		}
		
		return returnValue;
	}
}
