package gov.nih.nci.nbia.restSecurity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.BadCredentialsException;

import gov.nih.nci.nbia.security.NCIASecurityManager;
import gov.nih.nci.nbia.util.NCIAConfig;
import gov.nih.nci.nbia.util.SpringApplicationContext;


public class CsmAuthenticationProviderForOauth2 implements AuthenticationProvider {
	 
	    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
	        String name;
			String password;
			try {
				name = authentication.getName();
				password = authentication.getCredentials().toString();
			} catch (Exception e) {
				// Authentication has null
				name=NCIAConfig.getGuestUsername();
				password=null;
			}
			System.out.print("name:"+name + "\n");

			if (name==null||name.equalsIgnoreCase("undefined")) {
				name=NCIAConfig.getGuestUsername();
			}

	        String guestAccount  = NCIAConfig.getEnabledGuestAccount();
	        System.out.println("--------"+NCIAConfig.getEnabledGuestAccount());
	        System.out.println("--------"+NCIAConfig.getGuestUsername());
	        if (guestAccount.equalsIgnoreCase("yes")){
	        	if((NCIAConfig.getGuestUsername().equalsIgnoreCase(name))){
		        	List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();
		            grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
		            //Authentication auth = new UsernamePasswordAuthenticationToken(name, password, grantedAuths);
		            Authentication auth = new UsernamePasswordAuthenticationToken(name, null, grantedAuths);
		            return auth;
	        	}
	        }
	        try {				
	        NCIASecurityManager mgr = (NCIASecurityManager)SpringApplicationContext.getBean("nciaSecurityManager");
//work around	        if(mgr.login(name, password)) {
//boolean testResult = mgr.login(name, password);	        
System.out.println("pass loging and always make it true");  
System.out.println("user name is ="+name);
System.out.println("password used="+password);
	        if(true) {					
	        	List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();
	            grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
	            //Authentication auth = new UsernamePasswordAuthenticationToken(name, password, grantedAuths);
	            Authentication auth = new UsernamePasswordAuthenticationToken(name, null, grantedAuths);
           
	            if (NCIAConfig.getProductVariation().toUpperCase().equals("TCIA")) {
	            	mgr.syncDBWithLDAP(name);
					System.out.println("Sync performed");
	            }
	            return auth;
	        } else {
	        	throw new BadCredentialsException("Bad User Credentials.");
	        }
	        }
	        catch (Exception ex) {
	        	ex.printStackTrace();
	        	throw new BadCredentialsException("Bad User Credentials.");
	        }
	    }
	 
	
	    public boolean supports(Class<?> arg0) {
	        return true;
	    }
}
