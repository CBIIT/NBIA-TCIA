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
    }

//	private handleError (error: any) {
//		// In a real world app, we might send the error to remote logging infrastructure
//		let errMsg = error.message || 'Server error';
//		console.error(errMsg); 
//		return Promise.reject(errMsg);
//	}



	getGroupsForUser(selectedUserName: string) {
		var serviceUrl = this.globals.serviceUrl +'getAllGroupsForUser';
		var params = '?loginName=' + selectedUserName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
			
			return this.http.get(serviceUrl + params,{headers: headers});
	}

	getPgRolesForUser(selectedUserName: string) {
		var serviceUrl = this.globals.serviceUrl +'getAllPGsWithRolesForUser';
		var params = '?loginName=' + selectedUserName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
			
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
	}
	
	getAvailableGroups(loginName: string){
		var serviceUrl = this.globals.serviceUrl +'getAvailableGroupsForUser';
		var params = '?loginName='+ loginName + '&format=json';
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.get(serviceUrl + params,{headers: headers});
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

	addNewGroupForUser(loginName: string, groupNames: string[])	{
		var serviceUrl = this.globals.serviceUrl +'assignUserToGroups';
		var params = '?loginName=' + loginName + '&groupNames='+groupNames.join(",");
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());	
	}

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
	
	removeUserFromGroup(loginName: string, groupName: String) {
		var serviceUrl = this.globals.serviceUrl +'removeUserFromGroup';
		var params = '?loginName=' + loginName + '&groupName=' + groupName;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
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
