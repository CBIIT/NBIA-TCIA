import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GroupComponent } from './group/group.component';
import { PeComponent } from './pe/pe.component';
import { PgComponent } from './pg/pg.component';
import { PgRoleComponent } from './pgRole/pgRole.component';
import { UserComponent } from './user/user.component';
import { LoadingDisplayService } from './common/components/loading-display/loading-display.service';
import { LoadingDisplayComponent } from './common/components/loading-display/loading-display.component';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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

import { AddNewLinePipe } from './addNewLine.pipe';
import { Globals } from './conf/globals';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PgMemberList } from './pg/pgmemberlist';
import { PgMemberService } from './pg/pgmemberservice';
import { UgMemberList } from './group/ugmemberlist';
import { UgMemberService } from './group/ugmemberservice';
import { ConfigService } from './configs/configservice';
import { UserToGroupComponent } from './userToGroup/userToGroup.component';
export function initSharedConfig(configService: ConfigService) {
    return () => configService.loadSharedConfig();
  }

@NgModule({ 
    declarations: [
        AppComponent,
        GroupComponent,
        PeComponent,
        PgComponent,
        PgRoleComponent,
        UserComponent,
        LoadingDisplayComponent,
        AddNewLinePipe,
        PgMemberList,
        UgMemberList,
        UserToGroupComponent
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
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
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initSharedConfig,
            deps: [ConfigService],
            multi: true
          },
        Globals, LoadingDisplayService, 
        PgMemberService, UgMemberService, 
        ConfirmationService, 
        provideHttpClient(withInterceptorsFromDi())
    ] 
})
export class AppModule { }
