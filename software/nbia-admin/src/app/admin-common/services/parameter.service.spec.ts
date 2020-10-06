import { TestBed } from '@angular/core/testing';

import { ParameterService } from './parameter.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'ParameterService', () => {
    beforeEach( () =>
        TestBed.configureTestingModule( {
            imports: [RouterTestingModule, HttpClientModule],
        } )
    );

    it( 'should be created', () => {
        const service: ParameterService = TestBed.get( ParameterService );
        expect( service ).toBeTruthy();
    } );
} );
