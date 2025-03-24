import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Pg} from './pg';

import {Globals} from '../conf/globals'


@Injectable({
    providedIn: 'root'
})
export class PgService {
	
    constructor(private http: HttpClient, private globals: Globals) {}

	getPgs() {
		var serviceUrl = this.globals.serviceUrl +'getAllPGsWithPEs';
		var params = '?format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		

        return this.http.get(serviceUrl + params, {headers: headers});
        //            .toPromise()
        //            .then(res => <Pg[]> res.json())
        //           .then(data => { return data; }); 
    }
	
	getAvailablePes(pgName: string) {
		var serviceUrl = this.globals.serviceUrl +'getAvailablePEsForPG';
		var params = '?PGName='+ pgName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.get(serviceUrl + params, {headers: headers});
//		.pipe(
//			catchError(this.handleError('getAvailablePes', []))
//		); 				
		//		.toPromise()
		//		.then(res => <SelectItem[]> res.json())
		//		.then(data => { return data; })
		//		.catch(this.handleError); 
    }
	
	getIncludedPes(pgName: string) {
		var serviceUrl = this.globals.serviceUrl +'getIncludedPEsForPG';
		var params = '?PGName='+ pgName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.get(serviceUrl + params, {headers: headers});
//		.pipe(
//			catchError(this.handleError('getIncludedPes', []))
//		); 		
		//		.toPromise()
		//		.then(res => <SelectItem[]> res.json())
		//		.then(data => { return data; })
		//		.catch(this.handleError); 
    }	

//	private handleError (error: any) {
		// In a real world app, we might send the error to remote logging infrastructure
//		let errMsg = error.message || 'Server error';
//		console.error(errMsg); // log to console instead
//		return Promise.reject(errMsg);
//	}
  
	addNewPg(pg: Pg) {
		var serviceUrl = this.globals.serviceUrl +'createProtecionGroup';
		var params = '?PGName=' + pg.dataGroup + '&description='+pg.description;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());
	}
	
	modifyExistingPg(pg: Pg) {
		var serviceUrl = this.globals.serviceUrl +'modifyProtecionGroup';
		var params = '?PGName=' + pg.dataGroup + '&description='+pg.description;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());
	}
	
	addPEsToExistingPg(pg: Pg, pes: string) {
		var serviceUrl = this.globals.serviceUrl +'assignPEsToPG';
		var params = '?PGName=' + pg.dataGroup + '&PENames='+pes;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());	
	}
	
	removePEsFromPg(pg: Pg, pes: string) {
		var serviceUrl = this.globals.serviceUrl +'deassignPEsFromPG';
		var params = '?PGName=' + pg.dataGroup + '&PENames='+pes;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());	
	}
	
	deleteSelectPg(pg: Pg) {
	//need deassign PE from PG first???
	
		var serviceUrl = this.globals.serviceUrl +'deleteProtecionGroup';
		var params = '?PGName=' + pg.dataGroup;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());
	}
	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
//	private handleError<T> (operation = 'operation', result?: T) {
//	  return (error: any): Observable<T> => {

		// TODO: send the error to remote logging infrastructure
//		console.error(error); // log to console instead

		// TODO: better job of transforming error for user consumption
		//is.log(`${operation} failed: ${error.message}`);

		// Let the app keep running by returning an empty result.
//		return of(result as T);
//	  };
//	}	
}
