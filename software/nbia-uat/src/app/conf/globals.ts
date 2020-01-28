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
	manageUserWiki = "-ManagingUsers";
	managePGWiki = "-ManagingProtectionGroups";
	manageGroupWiki = "-ManagingUserGroups";
//export var managePEWiki = "-ManagingPE";
	managePEWiki = "-ManagingProtectionElements";
	userAuthorizationWiki = "-AddingProtectionGroupsandAssigningRoles";
}