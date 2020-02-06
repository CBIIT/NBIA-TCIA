import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbiaUatComponent } from './nbia-uat/nbia-uat.component';
import { GroupComponent } from './group/group.component';
import { PeComponent } from './pe/pe.component';
import { PgComponent } from './pg/pg.component';
import { PgRoleComponent } from './pgRole/pgRole.component';
import { UserComponent } from './user/user.component';
import { LoadingDisplayService } from './common/components/loading-display/loading-display.service';
import { LoadingDisplayComponent } from './common/components/loading-display/loading-display.component';

import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { AddNewLine } from './addNewLine.pipe';
import { Globals } from './conf/globals';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PgMemberList } from './pg/pgmemberlist';
import { PgMemberService } from './pg/pgmemberservice';
import { UgMemberList } from './group/ugmemberlist';
import { UgMemberService } from './group/ugmemberservice';

@NgModule({
  declarations: [
    AppComponent,
    NbiaUatComponent,
    GroupComponent,
    PeComponent,
    PgComponent,
    PgRoleComponent,
    UserComponent,
	LoadingDisplayComponent,
	AddNewLine,
	PgMemberList,
	UgMemberList	
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule,
	ButtonModule,
	CheckboxModule,
	ConfirmDialogModule,
	DialogModule,
	DropdownModule,
	DynamicDialogModule,
	InputTextModule,
	MessagesModule,
	MessageModule,
	MultiSelectModule,
	TableModule,
	TabViewModule,
	TooltipModule,
    FormsModule,
    BrowserAnimationsModule	
  ],
	entryComponents: [
		PgMemberList,
		UgMemberList
	],  
  providers: [Globals, LoadingDisplayService, PgMemberService, UgMemberService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
