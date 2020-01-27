import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
//import {catchError, map} from 'rxjs/operators';
//import {Observable, of} from 'rxjs';
import {Group} from './group';
//import {SelectItem} from 'primeng/components/api/selectitem';
import {Globals} from '../conf/globals'


@Injectable({
    providedIn: 'root'
})
export class GroupService {
	
    constructor(private http: HttpClient, private globals: Globals) {}

	getGroups() {
		var serviceUrl = this.globals.serviceUrl +'getAllGroupsWithPGs';
		var params = '?format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});	

        return this.http.get(serviceUrl + params, {headers: headers});
        //            .toPromise()
        //            .then(res => <Group[]> res.json())
        //            .then(data => { return data; }); 
					
    }
	
	getAvailablePgs(pgName: string) {
		var serviceUrl = this.globals.serviceUrl +'getAvailablePGsForGroup';
		var params = '?groupName='+ pgName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.get(serviceUrl + params, {headers: headers});
//				.pipe(
//					catchError(this.handleError('getAvailablePgs', []))
//				); 	
		//		.toPromise()
		//		.then(res => <SelectItem[]> res.json())
		//		.then(data => { return data; })
		//		.catch(this.handleError); 
    }

	getIncludedPgs(pgName: string) {
		var serviceUrl = this.globals.serviceUrl +'getIncludedPGsForGroup';
		var params = '?GroupName='+ pgName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});	
		
		return this.http.get(serviceUrl + params, {headers: headers});
//					.pipe(
//						catchError(this.handleError('getIncludedPgs', []))
//				); 	
		//		.toPromise()
		//		.then(res => <SelectItem[]> res.json())
		//		.then(data => { return data; })
		//		.catch(this.handleError); 
    }	

//	private handleError (error: any) {
//		// In a real world app, we might send the error to remote logging infrastructure
//		let errMsg = error.message || 'Server error';
//		console.error(errMsg); // log to console instead
//		return Promise.reject(errMsg);
//	}
	
	getAllRoles() {
		var serviceUrl = this.globals.serviceUrl +'getRoleList';
		var params = '?format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});	
		
        return this.http.get(serviceUrl + params,{headers: headers});
        //            .toPromise()
        //            .then(res => <SelectItem[]> res.json())
        //            .then(data => { return data; }); 
	}	
	
	addNewPgRoleForGroup(groupName: string, pgName: String, roleNames: string)	{
		var serviceUrl = this.globals.serviceUrl +'assignGroupToPGWithRoles';
		var params = '?groupName=' + groupName + '&PGName=' + pgName+ '&roleNames='+roleNames;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});	
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());	
	}

	removeGroupFromPG(groupName: string, pgName: String) {
		var serviceUrl = this.globals.serviceUrl +'removeGroupFromPG';
		var params = '?groupName=' + groupName + '&PGName=' + pgName;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});	
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());		
	}
	
	modifyRolesOfGroupForPG(groupName: string, pgName: String, roleNames: string[])	{
		var serviceUrl = this.globals.serviceUrl +'modifyRolesOfGroupForPG';
		var params = '?groupName=' + groupName + '&PGName=' + pgName+ '&roleNames='+roleNames.join(",");
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});	
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());	
	}	
	
	deleteSelectGroup(group: Group) {	
		var serviceUrl = this.globals.serviceUrl +'deleteGroup';
		var params = '?GroupName=' + group.userGroup;
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
/*	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {

		// TODO: send the error to remote logging infrastructure
		console.error(error); // log to console instead

		// TODO: better job of transforming error for user consumption
		//is.log(`${operation} failed: ${error.message}`);

		// Let the app keep running by returning an empty result.
		return of(result as T);
	  };
	}
*/	
}
