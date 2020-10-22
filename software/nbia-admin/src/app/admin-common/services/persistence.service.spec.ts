import { TestBed } from '@angular/core/testing';

import { PersistenceService } from './persistence.service';
import { CookieService } from 'angular2-cookie';

describe( 'PersistenceService', () => {
    beforeEach( () =>
        TestBed.configureTestingModule( {
            providers: [CookieService],
        } )
    );

    it( 'should be created', () => {
        const service: PersistenceService = TestBed.get( PersistenceService );
        expect( service ).toBeTruthy();
    } );
} );
