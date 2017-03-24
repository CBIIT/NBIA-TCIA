package gov.nih.nci.nbia.ldapService;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;

import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;

import gov.nih.nci.nbia.security.NCIAUser;
import gov.nih.nci.nbia.util.NCIAConfig;

public class UserLdapService {
	private LdapTemplate lt;

	public void setLdapTemplate(LdapTemplate ldapTemplate) {
		this.lt = ldapTemplate;
	}

	public List getUserGroupInfo(String loginName) {
		String mailAttrName = NCIAConfig.getLDAPMailAttrName();
		String memberOfAttrName = NCIAConfig.getLDAPMemberOfAttrName();
		SearchControls sc = new SearchControls();
		//sc.setReturningAttributes(new String[] { "cn", "mail", "isMemberOf" });
		sc.setReturningAttributes(new String[] { "cn", mailAttrName, memberOfAttrName});
		sc.setSearchScope(SearchControls.SUBTREE_SCOPE);

		AndFilter filter = new AndFilter();
		filter.and(new EqualsFilter("objectclass", "inetOrgPerson"));
		filter.and(new EqualsFilter("cn", loginName));

		return lt.search("", filter.encode(), sc, new PersonAttributesMapper());
	}

	//// Using filter:
	//// (&(objectClass=posixGroup)
	//// (objectclass=groupOfUniqueNames)
	//// (uniqueMember=cn=" +
	//// loginName+",ou=users,dc=cancerimagingarchive,dc=net))
	// public List<String> getAllGroupsOfAUser(String loginName){
	// AndFilter filter = new AndFilter();
	// filter.and(new EqualsFilter("objectclass","groupOfUniqueNames"));
	// filter.and(new
	//// EqualsFilter("uniqueMember","cn="+loginName+",ou=users,dc=cancerimagingarchive,dc=net"));
	//// return lt.search("",
	//// "(&(objectClass=posixGroup)(objectclass=groupOfUniqueNames)(uniqueMember=cn="
	//// + loginName+",ou=users,dc=cancerimagingarchive,dc=net))",
	// return lt.search("", filter.encode(),
	// new AttributesMapper() {
	// public Object mapFromAttributes(Attributes attrs)
	// throws NamingException {
	// return attrs.get("cn").get();
	// }
	// });
	//
	// }

	private class PersonAttributesMapper implements AttributesMapper {
		public Object mapFromAttributes(Attributes attrs) throws NamingException {
			NCIAUser nciaUser = new NCIAUser();
			List<String> groups = new ArrayList<String>();
//			Attribute memberOf = attrs.get("isMemberOf");
			Attribute memberOf = attrs.get(NCIAConfig.getLDAPMemberOfAttrName());
			
			if (memberOf != null) {
				Enumeration vals = memberOf.getAll();
				while (vals.hasMoreElements()) {
					groups.add(((String) vals.nextElement()).split(",")[0].split("=")[1]);
				}
			}
			nciaUser.setGroups(groups);
			nciaUser.setLoginName((String) attrs.get("cn").get());
//			nciaUser.setEmail((String) attrs.get("mail").get());
			nciaUser.setEmail((String) attrs.get(NCIAConfig.getLDAPMailAttrName()).get());
			return nciaUser;
		}
	}
}
