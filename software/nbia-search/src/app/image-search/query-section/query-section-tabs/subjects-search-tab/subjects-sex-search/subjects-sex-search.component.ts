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

  sexRadioLabels = ['All', 'Female', 'Male', 'None'];
  sexApply = false;
  sexApplySelection = 0;

  /**
   * The list used by the HTML.
   */
  criteriaList;

  /**
   * For hide or show this group of criteria when the arrows next to the heading are clicked.
   */
  showCriteriaList;

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
        this.sexApply = false;
        this.sexApplySelection = 0;
        this.initMonitorService.setSexInit(true);
      }
    );

    this.parameterService.parameterPatientSexEmitter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      data => {
        this.sexApplySelection = Number(data);
        this.onApplySexApplyChecked(true)
        this.commonService.setHaveUserInput(false);

      }
    );

    // Get persisted showCriteriaList value.  Used to show, or collapse this category of criteria in the UI.
    this.showCriteriaList = this.commonService.getCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_PATIENTSEX);
    if (this.utilService.isNullOrUndefined(this.showCriteriaList)) {
      this.showCriteriaList = Consts.SHOW_CRITERIA_QUERY_PATIENTSEX_DEFAULT;
      this.commonService.setCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_PATIENTSEX, this.showCriteriaList);
    }

    this.initMonitorService.setSexInit(true);
  }


  /**
   * Hides or shows this group of criteria when the arrows next to the heading are clicked.
   *
   * @param show
   */
  onShowCriteriaListClick(show: boolean) {
    this.showCriteriaList = show;
    this.commonService.setCriteriaQueryShow(Consts.SHOW_CRITERIA_QUERY_PATIENTSEX, this.showCriteriaList);
  }

  onSexRadioChange(value) {
    this.sexApplySelection = value;
    if (value === 0) {
      this.sexApply = false;
    } else {
      this.sexApply = true;
    }
    this.onApplySexApplyChecked(this.sexApply);
  }

  onApplySexApplyChecked(status) {
    let criteriaForQuery: string[] = [];
    this.commonService.setHaveUserInput(true);
    this.sexApply = status;

    // This category's data for the query, the 0th element is always the category name.
    criteriaForQuery.push(Consts.PATIENTSEX_CRITERIA);
    if (status) {
      criteriaForQuery.push(this.sexRadioLabels[this.sexApplySelection]);
      this.queryUrlService.update(this.queryUrlService.PATIENT_SEX, this.sexRadioLabels[this.sexApplySelection]);
    } else {
      this.queryUrlService.clear(this.queryUrlService.PATIENT_SEX);
    }
    this.commonService.updateQuery(criteriaForQuery);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
