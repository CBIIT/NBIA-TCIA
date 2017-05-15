import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Group} from '../../app/groups/group';
import {Group} from '../../app/groups/group';
import myGlobals = require('../../app/conf/globals');
import {Headers} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import {SelectItem} from 'primeng/components/api/selectitem';

@Injectable()
export class GroupService {
	
    constructor(private http: Http) {}

	getGroups() {
		var serviceUrl = myGlobals.serviceUrl +'getAllGroupsWithPGs';
		var params = '?format=json';
		var headers = new Headers();
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}

        return this.http.get(serviceUrl + params, {headers: headers})
                    .toPromise()
                    .then(res => <Group[]> res.json())
                    .then(data => { return data; }); 
					
    }
	
	getAvailablePgs(pgName: string) {
		var serviceUrl = myGlobals.serviceUrl +'getAvailablePGsForGroup';
		var params = '?groupName='+ pgName + '&format=json';
		var headers = new Headers();
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}		
		return this.http.get(serviceUrl + params, {headers: headers})                    
				.toPromise()
				.then(res => <SelectItem[]> res.json())
				.then(data => { return data; })
				.catch(this.handleError); 
    }

	getIncludedPgs(pgName: string) {
		var serviceUrl = myGlobals.serviceUrl +'getIncludedPGsForGroup';
		var params = '?GroupName='+ pgName + '&format=json';
		var headers = new Headers();
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}
		
		return this.http.get(serviceUrl + params, {headers: headers})                    
				.toPromise()
				.then(res => <SelectItem[]> res.json())
				.then(data => { return data; })
				.catch(this.handleError); 
    }	

	private handleError (error: any) {
		// In a real world app, we might send the error to remote logging infrastructure
		let errMsg = error.message || 'Server error';
		console.error(errMsg); // log to console instead
		return Promise.reject(errMsg);
	}
	
	getAllRoles() {
		var serviceUrl = myGlobals.serviceUrl +'getRoleList';
		var params = '?format=json';
		var headers = new Headers();
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}
		
        return this.http.get(serviceUrl + params,{headers: headers})
                    .toPromise()
                    .then(res => <SelectItem[]> res.json())
                    .then(data => { return data; }); 
	}	
	
	addNewPgRoleForGroup(groupName: string, pgName: String, roleNames: string)	{
		var serviceUrl = myGlobals.serviceUrl +'assignGroupToPGWithRoles';
		var params = '?groupName=' + groupName + '&PGName=' + pgName+ '&roleNames='+roleNames);
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}
		return this.http.post(serviceUrl + params,
			params, {headers: headers}).map(res => res.json());	
	}

	removeGroupFromPG(groupName: string, pgName: String) {
		var serviceUrl = myGlobals.serviceUrl +'removeGroupFromPG';
		var params = '?groupName=' + groupName + '&PGName=' + pgName;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}		
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers}).map(res => res.json());		
	}
	
	modifyRolesOfGroupForPG(groupName: string, pgName: String, roleNames: string[])	{
		var serviceUrl = myGlobals.serviceUrl +'modifyRolesOfGroupForPG';
		var params = '?groupName=' + groupName + '&PGName=' + pgName+ '&roleNames='+roleNames.join(",");
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers}).map(res => res.json());	
	}	
	
	deleteSelectGroup(group: Group) {	
		var serviceUrl = myGlobals.serviceUrl +'deleteGroup';
		var params = '?GroupName=' + group.userGroup;
		var headers = new Headers(); 
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		if(myGlobals.accessToken) {
			headers.append('Authorization', 'Bearer ' + myGlobals.accessToken);      
		}		
		return this.http.post(serviceUrl + params,
			params, {headers: headers}).map(res => res.json());
	}		
}
