// -------------------------------------------------------------------------------------------
// ------------  The parent component of the left side criteria selecting components  --------
// -------------------------------------------------------------------------------------------

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/constants';
import { QuerySectionService } from '../services/query-section.service';
import { PreferencesService } from '@app/preferences/preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from '@app/admin-common/services/common.service';
import { Properties } from '@assets/properties';
import { DynamicQueryCriteriaService } from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';
import { CriteriaSelectionMenuService } from '@app/criteria-selection-menu/criteria-selection-menu.service';
import { UtilService } from '@app/admin-common/services/util.service';


@Component( {
    selector: 'nbia-query-section',
    templateUrl: './query-section.component.html',
    styleUrls: ['./query-section.component.scss']
} )

export class QuerySectionComponent implements OnInit, OnDestroy{
    /**
     * If this component is used by perform QC we need to show the QC status section.
     * If this component is used by approve-deletions, do not show the QC status section.
     * This value is set by the parent html.
     */
    @Input() currentTool;

    /**
     * Show or hide the entire left query section.
     */
    show = true;

    currentTab = Properties.DEFAULT_SEARCH_TAB; // @TODO Convert the other places where this is used to use the Conts.

    currentFont;
    consts = Consts;
    properties = Properties;

    temp;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor( private querySectionService: QuerySectionService, private preferencesService: PreferencesService,
                 private criteriaSelectionMenuService: CriteriaSelectionMenuService, private commonService: CommonService,
                 private utilService: UtilService, private dynamicQueryCriteriaService: DynamicQueryCriteriaService) {
    }

   async ngOnInit() {
        this.preferencesService.setFontSizePreferencesEmitter.pipe( takeUntil( this.ngUnsubscribe ) ).subscribe(
            data => {
                this.currentFont = data;
            } );

        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();

        // Show the correct default tab
        this.onTabClick(this.currentTab);

        // @TODO explain why this is being done in this location
        let requiredCriteriaData = undefined;
        while( requiredCriteriaData === undefined){
            await this.utilService.sleep( Consts.waitTime );
            requiredCriteriaData = this.criteriaSelectionMenuService.getRequiredCriteriaData();
        }
        for( let requiredCriteria of requiredCriteriaData){
            this.dynamicQueryCriteriaService.addWidget( requiredCriteria );
        }


   }

    onCloserOpenerClick(  ){
        this.show = (! this.show);
    }

    onTabClick(i){

/* We will only have one type of Search (tab) visible at a time.
        this.currentTab = i;
        this.querySectionService.setSearchType(this.currentTab);
*/

    }

    onAddCriteriaClick(){
        this.commonService.showCriteriaSelectionMenu( true );
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
