import {Component, Input} from 'angular2/core';
import {UserComponent} from "./user.component"
import {PgComponent} from "./pg.component"
import {GroupComponent} from "./group.component"
import {PgRoleComponent} from "./pgRole.component"
import {TabView} from 'primeng/primeng';
import {TabPanel} from 'primeng/primeng';
import myGlobals = require('./conf/globals');

@Component({
    selector: 'my-app',
    template: `
	<!-- For NBIA Instance
	<table width="100%" 
       border="0" 
       cellspacing="0" 
       cellpadding="0"
       class="hdrBG" align="center" >
  <tr>
	  <td align="left">
      <a href="http://www.cancer.gov">
        <img alt="National Cancer Institute" 
             src="app/images/white-ncilogo.gif"
             border="0"/>
      </a>
    </td>
    <td align="right">
      <a href="http://www.cancer.gov">
        <img alt="U.S. National Institutes of Health"
             src="app/images/white-nihtext.gif" border="0"/>
		<img alt="www.cancer.gov"
             src="app/images/white-nciurl.gif" border="0"/>             
      </a>
    </td>
	   
	</tr>
	<tr>
	<td bgcolor="#4C5D87">
     <img src="app/images/Logo-NCIA.jpg" alt="Logo"/>
   </td>
	<td bgcolor="#4C5D87" valign="bottom" align="right">              
		<span class="fontSize24 TextShadow blue mediumFont dispBlock" >User Authorization Tool&nbsp;&nbsp;</span>
    </td> 
  </tr>
</table>
-->

		<!--div class="ContentSideSections">
		<div class="Content100 overHidden TextShadow">
			<span class="fontSize30 TextShadow orange mediumFont marginBottom20 dispBlock">NBIA Authorization Page</span>
			<span class="defaultText dispTable">This tool grants the user's access to NBIA data collection.</span>
		</div>
	</div-->
	

<header id="branding" role="banner">
	<div id="header_content">
		<div class="header_content-inner">
			<div class="header_content-content clearfix">
				<div class="header_logo header_logo_image">
					<a href="http://www.cancerimagingarchive.net"
						title="The Cancer Imaging Archive (TCIA)" class="tb-image-logo"><img
						src="app/images/tcia/tcia_logo2.png"
						alt="The Cancer Imaging Archive (TCIA)" width="202"
						data-image-2x="app/images/tcia/tcia_logo@2x.png"></a>
				</div>
				<!-- .tbc_header_logo (end) -->
				<div class="header-addon">
					<span class="fontSize24 TextShadow blue mediumFont dispBlock" >User Authorization Tool&nbsp;</span>
					<div class="social-media">
						<div class="themeblvd-contact-bar">
							<ul class="social-media-color">
								<li><a
									href="https://groups.google.com/forum/#!forum/tcia-announcements"
									title="Email" class="email" target="_blank">Email</a></li>
								<li><a
									href="https://www.facebook.com/The.Cancer.Imaging.Archive"
									title="Facebook" class="facebook" target="_blank">Facebook</a></li>
								<li><a
									href="http://www.linkedin.com/groups/Cancer-Imaging-Archive-TCIA-4371904"
									title="Linkedin" class="linkedin" target="_blank">Linkedin</a></li>
								<li><a href="http://twitter.com/TCIA_News" title="Twitter"
									class="twitter" target="_blank">Twitter</a></li>
							</ul>
							<div class="clear"></div>
						</div>
						<!-- .themeblvd-contact-bar (end) -->
					</div>
					<!-- .social-media (end) -->
				</div>
				<!-- .header-addon (end) -->
			</div>
			<!-- .header_content-content (end) -->
		</div>
		<!-- .header_content-inner (end) -->
	</div>
	<!-- .content (end) -->
</header>   

	<p-tabView>
    <p-tabPanel header="User">
		<user (addUser)="pushNewUser($event)"></user>
	</p-tabPanel>
    <p-tabPanel header="Protection Group">
        <pg></pg>
    </p-tabPanel>
    <p-tabPanel header="User Group">
	   <group></group>
    </p-tabPanel>	
    <p-tabPanel header="User Authorization">
	   <pgRole [addedUser]="addedUser"></pgRole>
    </p-tabPanel>	
	`,
	directives: [UserComponent,PgComponent,GroupComponent,PgRoleComponent,TabView,TabPanel]
})


export class AppComponent {	
	private addedUser: any;
	
	constructor() {
	  myGlobals.accessToken = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0].split('=')[1]; 
//uncomment the below statement when check in!!! Comment it out for using it for hot deployment with gulp in development setting
	  myGlobals.serviceUrl = window.location.protocol +"//"+ window.location.host+"/nbia-api/services/v3/"; 

    }
	
	private pushNewUser(loginName) {
		this.addedUser = loginName;
    }
}
