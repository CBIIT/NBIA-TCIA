import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {PgRole} from './pgRole';
import {Globals} from '../conf/globals'
//import {SelectItem} from 'primeng/components/api/selectitem';



@Injectable({
    providedIn: 'root'
})
export class PgRoleService {

	constructor(private http: HttpClient, private globals: Globals) {}

	getUserNames() {
		var serviceUrl = this.globals.serviceUrl +'getUserNameList';
		var params = '?format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.get(serviceUrl + params,{headers: headers});                    
		//		.toPromise()
		//		.then(res => <SelectItem[]> res.json())
		//		.then(data => { return data; })
		//		.catch(this.handleError)
		//.pipe(
		//	catchError(this.handleError('getUserNames', []))
		//); 					
    }

//	private handleError (error: any) {
//		// In a real world app, we might send the error to remote logging infrastructure
//		let errMsg = error.message || 'Server error';
//		console.error(errMsg); 
//		return Promise.reject(errMsg);
//	}

	getPgRolesForUser(selectedUserName: string) {
		var serviceUrl = this.globals.serviceUrl +'getAllPGsWithRolesForUser';
		var params = '?loginName=' + selectedUserName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
//        return this.http.get(serviceUrl + params,{headers: headers})
//                    .toPromise()
//                    .then(res => <PgRole[]> res.json())
//                    .then(data => { return data; }); 
//		if (selectedUserName === undefined) 
//			return [];
//		else	
			return this.http.get(serviceUrl + params,{headers: headers});
			//.map((res) => <PgRole[]> res.json());
	}
	
	getAllRoles() {
		var serviceUrl = this.globals.serviceUrl +'getRoleList';
		var params = '?format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
        return this.http.get(serviceUrl + params,{headers: headers});
         //           .toPromise()
         //           .then(res => <SelectItem[]> res.json())
         //           .then(data => { return data; }); 
	}
	
	getAvailablePGs(loginName: string){
		var serviceUrl = this.globals.serviceUrl +'getAvailablePGsForUser';
		var params = '?loginName='+ loginName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.get(serviceUrl + params,{headers: headers});
//		.pipe(
//			catchError(this.handleError('getAvailablePGs', []))
//		); 	
		//		.toPromise()
		//		.then(res => <SelectItem[]> res.json())
		//		.then(data => { return data; })
		//		.catch(this.handleError); 	
	}
/*
	getAvailableRoles(loginName: string, pgName:string) {
		var serviceUrl = this.globals.serviceUrl +'getAvailablePEsForPG';
		var params = '?PGName='+ pgName + '&format=json';
		var headers = new Headers();
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}
		
		return this.http.get(serviceUrl + params,{headers: headers})                    
				.toPromise()
				.then(res => <SelectItem[]> res.json())
				.then(data => { return data; })
				.catch(this.handleError); 	
	}
*/

	addNewPgRoleForUser(loginName: string, pgName: String, roleNames: string[])	{
		var serviceUrl = this.globals.serviceUrl +'assignUserToPGWithRoles';
		var params = '?loginName=' + loginName + '&PGName=' + pgName+ '&roleNames='+roleNames.join(",");
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());	
	}
	
	modifyRolesOfUserForPG(loginName: string, pgName: String, roleNames: string[])	{
		var serviceUrl = this.globals.serviceUrl +'modifyRolesOfUserForPG';
		var params = '?loginName=' + loginName + '&PGName=' + pgName+ '&roleNames='+roleNames.join(",");
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());	
	}
	
	removeUserFromPG(loginName: string, pgName: string) {
		var serviceUrl = this.globals.serviceUrl +'removeUserFromPG';
		var params = '?loginName=' + loginName + '&PGName=' + pgName;
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
		//this.log(`${operation} failed: ${error.message}`);

		// Let the app keep running by returning an empty result.
		return of(result as T);
	  };
	}
*/	
}
