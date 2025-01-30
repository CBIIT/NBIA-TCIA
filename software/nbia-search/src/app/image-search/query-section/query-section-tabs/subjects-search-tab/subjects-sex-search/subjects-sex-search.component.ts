import { Component, OnDestroy, OnInit } from '@angular/core';
import { Consts } from '@app/consts';
import { CommonService } from '@app/image-search/services/common.service';
import { UtilService } from '@app/common/services/util.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { ParameterService } from '@app/common/services/parameter.service';

@Component({
  selector: 'nbia-subjects-sex-search',
  templateUrl: './subjects-sex-search.component.html',
  styleUrls: ['../../../../../app.component.scss', '../subjects-search-tab.component.scss']
})
export class SubjectsSexSearchComponent implements OnInit, OnDestroy {
    sexApplySelection = 0;
    sexApply = false;

    // Object to track selected states
    selectedSex = {
      male: false,
      female: false,
      null: false
    };
  
    // Array to store selected options
    selectedOptions: string[] = [];

  /**
   * The list used by the HTML.
   */
  criteriaList;

  /**
   * For hide or show this group of criteria when the arrows next to the heading are clicked.
   */
  showPatientSex =false;

  /**
   * Used to clean up subscribes on the way out to prevent memory leak.
   * @type {Subject<boolean>}
   */
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private commonService: CommonService, private utilService: UtilService,
    private initMonitorService: InitMonitorService, private queryUrlService: QueryUrlService,
    private parameterService: ParameterService) {
  }

  ngOnInit() {


    // Called when the "Clear" button on the left side of the Display query at the top.
    this.commonService.resetAllSimpleSearchEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      () => {
        this.selectedSex = { male: false, female: false, null: false };
        this.initMonitorService.setPatientSexInit(true);
      }
    );

     // Called when a query included in the URL contained patient sex.
    this.parameterService.parameterPatientSexEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      data => {
        // Deal with trailing (wrong) comma
        data = (<any>data).replace( /,$/, '' );

        // Data can be multiple values, comma separated
        let criteriaListforSex = (<any>data).split( /\s*,\s*/ );

        if(criteriaListforSex.length > 0){
          this.commonService.setHaveUserInput( false );
          for (let i = 0; i < criteriaListforSex.length; i++) {
            if (criteriaListforSex[i] === 'M') { 
              this.selectedSex.male = true;   
            } else if (criteriaListforSex[i] === 'F') {
              this.selectedSex.female = true;
            } else if (criteriaListforSex[i] === 'null') {
              this.selectedSex.null = true;
            }
          }
        }   
      }
    );

    // Get persisted ShowPatientSex value.  Used to show, or collapse this category of criteria in the UI.
    this.showPatientSex = this.commonService.getCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_PATIENTSEX);
    if (this.utilService.isNullOrUndefined(this.showPatientSex)) {
      this.showPatientSex = Consts.SHOW_CRITERIA_QUERY_PATIENTSEX_DEFAULT;
      this.commonService.setCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_PATIENTSEX, this.showPatientSex);
    }

    //this.initMonitorService.setPatientSexInit(true);
  }


  /**
   * Hides or shows this group of criteria when the arrows next to the heading are clicked.
   *
   * @param show
   */
  onShowPatientSexClick(show: boolean) {
    this.showPatientSex = show;
    this.commonService.setCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_PATIENTSEX, this.showPatientSex);
  }

  onApplySexApplyChecked(status) {
    let criteriaForQuery: string[] = [];
    this.commonService.setHaveUserInput(true);
    this.sexApply = status;

    // This category's data for the query, the 0th element is always the category name.
    criteriaForQuery.push(Consts.PATIENT_SEX_CRITERIA);
    if (status) {
     } else {
      this.queryUrlService.clear(this.queryUrlService.PATIENT_SEX);
    }
    this.commonService.updateQuery(criteriaForQuery);
  }

  // Method to update selected options dynamically
  onSelectionChange(selected, checked): void {
    this.commonService.setHaveUserInput( true );
    // object.entries in the future
    // Update selected options
    if(checked){
      this.selectedSex[selected] = true;
      this.selectedOptions.push(selected.charAt(0).toUpperCase() + selected.slice(1));
    }else{
      this.selectedSex[selected] = false;
      this.selectedOptions.splice(this.selectedOptions.indexOf(selected.charAt(0).toUpperCase() + selected.slice(1)), 1);
    }
   // this.selectedOptions = Object.entries(this.selectedSex)
   //   .filter((key) => selected) // Include only checked options
   //   .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize options
    
    let criteriaForQuery: string[] = [];
    criteriaForQuery.push(Consts.PATIENT_SEX_CRITERIA);
    criteriaForQuery = criteriaForQuery.concat(this.selectedOptions);
    this.commonService.updateQuery(criteriaForQuery);

    this.queryUrlService.update( this.queryUrlService.PATIENT_SEX, this.selectedOptions.join( ',' ) );  
  }

  // Method to reset selections
  resetSelections(): void {
    this.selectedSex = { male: false, female: false, null: false };
    this.selectedOptions = [];
    this.commonService.setHaveUserInput( true );
    let criteriaForQuery: string[] = [];
    criteriaForQuery.push(Consts.PATIENT_SEX_CRITERIA);
    this.commonService.updateQuery(criteriaForQuery);
    this.queryUrlService.clear( this.queryUrlService.PATIENT_SEX );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
