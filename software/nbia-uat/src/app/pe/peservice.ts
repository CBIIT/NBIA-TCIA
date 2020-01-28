import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Globals} from '../conf/globals'
import {Pe} from './pe';

@Injectable({
    providedIn: 'root'
})
export class PeService {

    constructor(private http: HttpClient, private globals: Globals) {}
	
	getPes() {
		var serviceUrl = this.globals.serviceUrl +'getPEList?format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		

        return this.http.get(serviceUrl,{headers: headers}); 
    }
	
	addNewPe(pe: Pe) {
		var serviceUrl = this.globals.serviceUrl +'createCollectionSite';
		var params = '?collection=' + pe.collection + '&site='+pe.site;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
	}
}
