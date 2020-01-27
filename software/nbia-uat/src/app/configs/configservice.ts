import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Config} from './config';
import {Globals} from '../conf/globals'

@Injectable({
    providedIn: 'root'
})
export class ConfigService{
   config: Config[];

private result: Object;
 	constructor(private http: HttpClient, private globals: Globals) {
	  //this.globals.accessToken = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0].split('=')[1]; 
	}
   
	getConfigParams() {
		var serviceUrl = this.globals.serviceUrl +'getConfigParams';	
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});
//		console.log("url="+serviceUrl + " accessToken=" + this.globals.accessToken);
//		if(this.globals.accessToken) {
//			headers.append('Authorization', 'Bearer ' + this.globals.accessToken);      
//		}
		
		return this.http.get(serviceUrl, { headers: headers });			
    }
	
	getWikiUrlParam() {
		var serviceUrl = this.globals.serviceUrl +'getConfigParams';	
//		var headers = new HttpHeaders();
//		if(this.globals.accessToken) {
//			headers.append('Authorization', 'Bearer ' + this.globals.accessToken);      
//		}
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});
		return this.http.get(serviceUrl, {headers: headers}).toPromise()
                    // .then(res => <Config[]> res.json())
                    .then(data => { return data[0].paramValue; });  			
    }
	
}

