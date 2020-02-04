import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Globals} from '../conf/globals'

@Injectable()
export class UgMemberService {

    constructor(private http: HttpClient, private globals: Globals) { }
	
	getUgUsers(groupName: string) {
		console.log("group name2=" + groupName);
		var serviceUrl = this.globals.serviceUrl +'getUserListForUserGroup';
		var params = '?groupName='+ groupName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.get(serviceUrl + params, {headers: headers});
    }	

}