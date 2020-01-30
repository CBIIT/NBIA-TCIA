import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Globals} from '../conf/globals'

@Injectable()
export class PgMemberService {

    constructor(private http: HttpClient, private globals: Globals) { }
	
	getPgUsers(pgName: string) {
//		console.log("pg name2=" + pgName);
		var serviceUrl = this.globals.serviceUrl +'getUserListForPG';
		var params = '?PGName='+ pgName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.get(serviceUrl + params, {headers: headers});
    }	

}