import {Injectable} from 'angular2/core';
import {Headers} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import {Http, Response} from 'angular2/http';
import myGlobals = require('../../app/conf/globals');

@Injectable()
export class ConfigService{
   config: Config[];

private result: Object;
 	constructor(private http: Http) {
	  myGlobals.accessToken = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0].split('=')[1]; 
	}
   
	getConfigParams() {
		var serviceUrl = myGlobals.serviceUrl +'getConfigParams';	
		var headers = new Headers();
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}
		
		return this.http.get(serviceUrl, {headers: headers}).toPromise()
                     .then(res => <Config[]> res.json())
                    .then(data => { return data; });  			
    }
	
	getWikiUrlParam() {
		var serviceUrl = myGlobals.serviceUrl +'getConfigParams';	
		var headers = new Headers();
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}
		
		return this.http.get(serviceUrl, {headers: headers}).toPromise()
                     .then(res => <Config[]> res.json())
                    .then(data => { return data[0].paramValue; });  			
    }
	
}

export interface Config {
  paramName: string;
  paramValue: string;
}

