//
// global constants
//
// globals.ts
import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
//export var serviceUrl: string="http://ncias-d1342-v.nci.nih.gov:8080/nbia-api/services/v3/";  
	serviceUrl = "http://localhost:8080/nbia-api/services/v3/";  
	accessToken = "d4a5d1ac-9630-42d2-8eb7-8379573ce504";
	wikiBaseUrl = "";
//export var wikiContextSensitiveHelpUrl="https://wiki.cancerimagingarchive.net/display/NBIA/TCIA+Current+Help+Topics#TCIACurrentHelpTopics";
	wikiUrlSubSection = "User+Administration+Tool+Guide#UserAdministrationToolGuide"
	manageUserWiki = this.wikiUrlSubSection + "-ManagingUsers";
	managePGWiki = this.wikiUrlSubSection + "-ManagingProtectionGroups";
	manageGroupWiki = this.wikiUrlSubSection + "-ManagingUserGroups";
	managePEWiki = this.wikiUrlSubSection + "-ManagingProtectionElements";
	userAuthorizationWiki = this.wikiUrlSubSection + "-AuthorizingProtectionGroups";
	userAuthorizationWithGroupWiki = this.wikiUrlSubSection + "-AuthorizingUserGroups";
}