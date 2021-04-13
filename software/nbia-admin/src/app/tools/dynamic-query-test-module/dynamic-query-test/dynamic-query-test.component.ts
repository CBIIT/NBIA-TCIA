import {Component, OnDestroy, OnInit} from '@angular/core';
import {Consts} from '@app/constants';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PreferencesService} from '@app/preferences/preferences.service';
import {DynamicQueryCriteriaService} from '@app/tools/query-section-module/dynamic-query-criteria/dynamic-query-criteria.service';

@Component({
    selector: 'nbia-dynamic-query-test',
    templateUrl: './dynamic-query-test.component.html',
    styleUrls: ['./dynamic-query-test.component.scss']
})
export class DynamicQueryTestComponent implements OnInit, OnDestroy {
    currentTool = Consts.TOOL_DYNAMIC_SEARCH_TEST;
    currentFont;

    // For showing the JSON
    getDynamicMultiChoiceList;
    getDynamicMultiChoiceList1;
    getDynamicSingleChoiceList;
    getDynamicSingleChoiceCheckbox;
    getDynamicSmallTextInput;
    getDynamicLargeTextInput;
    getDynamicWidget;
    getDynamicWidget1;

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(private preferencesService: PreferencesService, private dynamicQueryCriteriaService: DynamicQueryCriteriaService) {
    }

    ngOnInit() {
        // Get font size
        this.preferencesService.setFontSizePreferencesEmitter
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data) => {
                this.currentFont = data;
            });
        // Get the initial value
        this.currentFont = this.preferencesService.getFontSize();

        this.dynamicQueryCriteriaService.addWidgetEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            async data => {
               this.getDynamicWidget =  data;
            });

    }


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
