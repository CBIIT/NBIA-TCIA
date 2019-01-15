import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloaderDownloadComponent } from './downloader-download.component';
import { CommonService } from '../../image-search/services/common.service';
import { PersistenceService } from '../../common/services/persistence.service';
import { CookieService } from 'angular2-cookie/core';
import { HttpModule } from '@angular/http';
import * as http from 'http';
import { MenuService } from '@app/common/services/menu.service';

describe( 'DownloaderDownloadComponent', () => {
    let component: DownloaderDownloadComponent;
    let fixture: ComponentFixture<DownloaderDownloadComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [DownloaderDownloadComponent],
            imports: [HttpModule],
            providers: [CommonService, PersistenceService, CookieService, MenuService]
        } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( DownloaderDownloadComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should be created', () => {
        expect( component ).toBeTruthy();
    } );
} );
