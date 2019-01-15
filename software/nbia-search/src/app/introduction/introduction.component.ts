import { Component, OnDestroy, OnInit } from '@angular/core';
import { PersistenceService } from '@app/common/services/persistence.service';
import { UtilService } from '@app/common/services/util.service';
import { Properties } from '@assets/properties';
import { CommonService } from '@app/image-search/services/common.service';

import { Subject } from 'rxjs';
import { MenuService } from '@app/common/services/menu.service';
import { MenuItems } from '@app/consts';

@Component( {
    selector: 'nbia-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss']
} )
export class IntroductionComponent implements OnInit, OnDestroy{

    showIntro = true;
    doNotShowIntroChecked = true;

    mainTitle = 'INTRO';

    pageCount = 8;
    pageIndex = 0;

    /**
     * We use setCurrentItem( MenuItems.HIDE_ALL) to hide the main screen while the Introduction is showing,
     * currentMenuItem will be used to restore the original setting.
     */
    currentMenuItem: MenuItems;

    logoImage = '';

    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor( private commonService: CommonService, private persistenceService: PersistenceService,
                 private utilService: UtilService, private menuService: MenuService ) {


        this.showIntro = this.persistenceService.get( this.persistenceService.Field.SHOW_INTRO );
        if( this.utilService.isNullOrUndefined( this.showIntro ) ){
            this.showIntro = Properties.SHOW_INTRO_DEFAULT;
            this.persistenceService.put( this.persistenceService.Field.SHOW_INTRO, this.showIntro );
        }
        this.doNotShowIntroChecked = !this.showIntro;

        if( this.showIntro ){
            this.displayIntroduction();
        }
    }

    ngOnInit() {
        this.commonService.showIntroEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
            () => {
                this.displayIntroduction();
                this.logoImage = 'assets/' + Properties.BRAND_DIR + '/' + Properties.BRAND + '/logo.png';
            }
        )
    }

    displayIntroduction() {
        this.showIntro = true;
    }

    onCloseClick() {
        this.showIntro = false;
    }

    onPreviousClick() {
        this.pageIndex--;
        if( this.pageIndex < 0 ){
            this.pageIndex = this.pageCount - 1;
        }
    }

    onNextClick() {
        this.pageIndex++;
        if( this.pageIndex >= this.pageCount ){
            this.pageIndex = 0;
        }
    }

    onDontShowAgainCheckboxClick( checked ) {
        this.persistenceService.put( this.persistenceService.Field.SHOW_INTRO, !checked );
        this.doNotShowIntroChecked = checked;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
