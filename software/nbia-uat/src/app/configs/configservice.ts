import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Config} from './config';
import {Globals} from '../conf/globals'

@Injectable({
    providedIn: 'root'
})
export class ConfigService{
   config: Config[];
   private sharedConfig: any;

	private result: Object;
 	constructor(private http: HttpClient, private globals: Globals) {
	  //this.globals.accessToken = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')[0].split('=')[1]; 
	}

	async loadSharedConfig(): Promise<any> {

		//const env = this.resolveEnv(); // "dev" or "prod"
		//const configFile = `/assets/config.${env}.json`;
	
		return await this.http.get('assets/shared-config.json')
		.toPromise().then(data => {
			this.sharedConfig = data;
			console.log('shared-config loaded', this.sharedConfig);
		}).catch( err => { console.error( 'could not load shared-config ', err);
			this.sharedConfig ={};
		}
		);
	}
	getSharedConfig(key: string): any {
		return this.sharedConfig?.[key];
	}

	getAllSharedConfig(): any {
		return this.sharedConfig;
	}
   
	getConfigParams() {
		var serviceUrl = this.globals.serviceUrl +'getConfigParams';	
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});
		
		return this.http.get(serviceUrl, { headers: headers });			
    }
	
	getWikiUrlParam() {
		var serviceUrl = this.globals.serviceUrl +'getConfigParams';	
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});
		return this.http.get(serviceUrl, {headers: headers}).toPromise()
                    // .then(res => <Config[]> res.json())
                    .then(data => { return data[0].paramValue; });  			
    }
	
	getUserAthorParam() {
		var serviceUrl = this.globals.serviceUrl +'getConfigParams';	
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});
		return this.http.get(serviceUrl, {headers: headers}).toPromise()
                    // .then(res => <Config[]> res.json())
                    .then(data => { return (data[2].paramValue=="true"); });  			
    }	
	
	getSerVerHostName() {
		var serviceUrl = (this.globals.serviceUrl).slice(0, -3) +'hostName';
		var headers = new HttpHeaders( {
            'Content-Type': 'application/x-www-form-urlencoded'
        } );
		
		let options = {
            headers: headers,
            method: 'get',
            responseType: 'text' as 'text'
        };

        return this.http.get(serviceUrl, options);  
	}
}

