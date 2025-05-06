import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { User } from './user';
import {Globals} from '../conf/globals'

@Injectable({
    providedIn: 'root'
})
export class UserService {

	constructor(private http: HttpClient, private globals: Globals) {}

	getUsers() {
		//alert(this.globals.accessToken);
		var serviceUrl = this.globals.serviceUrl +'getUserList?format=json';	
//		var headers = new HttpHeaders();
		var headers = 
			new HttpHeaders({'Content-type': 'application/json',
			'Authorization': 'Bearer '+ this.globals.accessToken});
//		if(this.globals.accessToken) {
//			headers.append('Authorization', 'Bearer ' + this.globals.accessToken); 
//			headers.append('Content-Type', 'application/json');
//		}

        return this.http.get(serviceUrl,{headers: headers});
       //             .toPromise()
       //             .then(res => <User[]> res.json())
       //             .then(data => { return data; }); 
    }

	addNewUser(user: User) {
		var serviceUrl = this.globals.serviceUrl +'createUser';
		var params = '?loginName=' + user.loginName + '&email=' + user.email + '&active=' + user.active;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});
		
		
		//var headers = new HttpHeaders();
		//headers.append('Content-Type', 'application/x-www-form-urlencoded');
		//if(this.globals.accessToken) {
		//	headers.append('Authorization', 'Bearer ' + this.globals.accessToken);      
		//}
		
		return this.http.post(serviceUrl + params,
			params, {headers: headers});
			//.map(res => res.json());
	}
	
	modifyExistingUser(user: User) {
		var active; 
		if (user.active == '1' || user.active == 'true' )
				active = 'true';
		else active = 'false';
		console.log("onEditSave2: loginName=" + user.loginName +" email=" + user.email + " active=" + active);
		var serviceUrl = this.globals.serviceUrl +'modifyUser';
		var params = '?loginName=' + user.loginName + '&email=' + user.email + '&active=' + active;
		var headers = 
			new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
			'Authorization': 'Bearer '+ this.globals.accessToken});		
//		var headers = new HttpHeaders(); 
//		headers.append('Content-Type', 'application/x-www-form-urlencoded');
//		if(this.globals.accessToken) {
//			headers.append('Authorization', 'Bearer ' + this.globals.accessToken);      
//		}			

		return this.http.post(serviceUrl + params,
			params, {headers:headers});
			//.map(res => res.json());
	}
}
