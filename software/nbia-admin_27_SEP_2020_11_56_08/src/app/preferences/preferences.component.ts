import { Component, OnDestroy, OnInit } from '@angular/core';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'nbia-preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.scss']
} )
export class PreferencesComponent implements OnInit, OnDestroy{
    showPreferences = false;
    defaultFont = '2';
    selectedFontSize;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor( private preferencesService: PreferencesService ) {
    }

    ngOnInit() {
        this.selectedFontSize = { options: this.defaultFont };

        // Display the PPreferences div
        this.preferencesService.showPreferencesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.showPreferences = data;
            } );
    }

     ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onOkayClick(){
        this.preferencesService.setFontSize( this.selectedFontSize.options);
        this.showPreferences = false;
    }
    onCancelClick(){
        this.showPreferences = false;
    }
}
