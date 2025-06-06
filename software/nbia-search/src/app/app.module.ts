import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxSliderModule } from "@angular-slider/ngx-slider";

import { AppComponent } from './app.component';
import { ImageSearchComponent } from './image-search/image-search.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { DataSectionComponent } from './image-search/data-section/data-section.component';
import { QuerySectionComponent } from './image-search/query-section/query-section.component';
import { HeaderComponent } from './header/header.component';
import { QuerySectionTabsComponent } from './image-search/query-section/query-section-tabs/query-section-tabs.component';
import { QueryBuilderComponent } from './image-search/query-section/query-section-tabs/query-builder/query-builder.component';
import { TextQueryComponent } from './image-search/query-section/query-section-tabs/text-search/text-search.component';
import { SimpleSearchComponent } from './image-search/query-section/query-section-tabs/simple-search/simple-search.component';

import { DisplayQuerySimpleSearchComponent } from './image-search/data-section/display-query/display-query-simple-search/display-query-simple-search.component';
import { DataSectionTabsComponent } from './image-search/data-section/data-section-tabs/data-section-tabs.component';
import { SearchResultsComponent } from './image-search/data-section/data-section-tabs/search-results/search-results.component';
import { SummaryComponent } from './image-search/data-section/data-section-tabs/summary/summary.component';
import { SearchResultsColumnSelectorComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-column-selector/search-results-column-selector.component';
import { SearchResultsTableComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-table/search-results-table.component';
import { TopRightButtonGroupComponent } from './image-search/data-section/data-section-tabs/search-results/top-right-button-group/top-right-button-group.component';
import { CollectionQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/collection-query/collection-query.component';
import { ImageModalityQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/image-modality-query/image-modality-query.component';
import { SubjectIdQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/subject-id-query/subject-id-query.component';
import { CommonService } from './image-search/services/common.service';
import { ResultsPerPageComponent } from './common/components/results-per-page/results-per-page.component';
import { SearchResultsPagerComponent } from './common/components/search-results-pager/search-results-pager.component';
import { AnatomicalSiteQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/anatomical-site-query/anatomical-site-query.component';
import { DateRangeQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/date-range-query/date-range-query.component';
import { PieChartCollectionsComponent } from './image-search/data-section/data-section-tabs/summary/pie-charts/pie-chart-collections/pie-chart-collections.component';
import { PieChartImageModalityComponent } from './image-search/data-section/data-section-tabs/summary/pie-charts/pie-chart-image-modality/pie-chart-image-modality.component';
import { PieChartAnatomicalSiteComponent } from './image-search/data-section/data-section-tabs/summary/pie-charts/pie-chart-anatomical-site/pie-chart-anatomical-site.component';
import { CartService } from './common/services/cart.service';
import { MenuService } from './common/services/menu.service';
import { ApiServerService } from './image-search/services/api-server.service';
import { CookieService } from 'ngx-cookie-service';
import { TestComponent } from './image-search/data-section/data-section-tabs/test/test/test.component';
import { SearchResultsSortService } from './image-search/data-section/data-section-tabs/search-results/search-results-sort.service';
import { PersistenceService } from './common/services/persistence.service';
import { SeriesCartSelectorComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-table/cart-selectors/series-cart-selector/series-cart-selector.component';
import { SubjectCartSelectorComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-table/cart-selectors/subject-cart-selector/subject-cart-selector.component';
import { StudiesCartSelectorComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-table/cart-selectors/studies-cart-selector/studies-cart-selector.component';
import { CartButtonGroupComponent } from './cart/cart-button-group/cart-button-group.component';
import { ShortenPipe } from './common/pipes/shorten.pipe';
import { CartSortService } from './cart/cart-sort.service';
import { NbiaClientComponent } from './nbia-client/nbia-client.component';
import { DisplayFormatPipe } from './common/pipes/display-format.pipe';
import { ToMbGbPipe } from './common/pipes/to-mb-gb.pipe';
import { DisplayQueryQueryBuilderComponent } from './image-search/data-section/display-query/display-query-query-builder/display-query-query-builder.component';
import { DisplayQueryTextSearchComponent } from './image-search/data-section/display-query/display-query-text-search/display-query-text-search.component';
import { ShortenRightPipe } from './common/pipes/shorten-right.pipe';
import { DownloaderDownloadComponent } from './cart/downloader-download/downloader-download.component';
import { MinimumMatchedStudiesComponent } from './image-search/query-section/query-section-tabs/simple-search/minimum-matched-studies/minimum-matched-studies.component';
import { LoadingDisplayComponent } from './common/components/loading-display/loading-display.component';
import { LoadingDisplayService } from './common/components/loading-display/loading-display.service';
import { CartDeleteComponent } from './cart/cart-delete/cart-delete.component';
import { SubjectStudyDetailsComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-table/subject-study-details/subject-study-details.component';
import { SeriesDetailsComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-table/subject-study-details/series-details/series-details.component';
import { FeedbackButtonComponent } from './feedback-and-legacy-buttons/feedback-button/feedback-button.component';
import { LegacyAppButtonComponent } from './feedback-and-legacy-buttons/legacy-app-button/legacy-app-button.component';
import { ListSearchComponent } from './image-search/query-section/query-section-tabs/list-search/list-search.component';
import { SaveSharedListComponent } from './cart/save-shared-list/save-shared-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ParameterService } from '@app/common/services/parameter.service';
import { InitMonitorService } from '@app/common/services/init-monitor.service';
import { QueryUrlComponent } from './image-search/query-url/query-url.component';
import { QueryUrlService } from '@app/image-search/query-url/query-url.service';
import { SeriesSearchComponent } from './image-search/query-section/query-section-tabs/series-search/series-search.component';
import { SubjectSearchComponent } from './image-search/query-section/query-section-tabs/subject-search/subject-search.component';
import { StudySearchComponent } from './image-search/query-section/query-section-tabs/study-search/study-search.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MissingCriteriaComponent } from './image-search/data-section/data-section-tabs/search-results/missing-criteria/missing-criteria.component';
import { DicomDataComponent } from './image-search/data-section/data-section-tabs/search-results/search-results-table/subject-study-details/series-details/dicom-data/dicom-data.component';
import { AlertBoxComponent } from './common/components/alert-box/alert-box.component';
import { AlertBoxService } from '@app/common/components/alert-box/alert-box.service';
import { HistoryLogService } from '@app/common/services/history-log.service';
import { SaveCartComponent } from './cart/save-cart/save-cart.component';
import { CollectionDescriptionsService } from '@app/common/services/collection-descriptions.service';
import { ToolTipComponent } from './common/components/tool-tip/tool-tip.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { HttpClientModule } from '@angular/common/http';
import { UtilService } from '@app/common/services/util.service';
import { DescriptionPopupComponent } from './image-search/data-section/data-section-tabs/summary/pie-charts/description-popup/description-popup.component';
import { WindowRefService } from '@app/common/services/window-ref.service';
import { FooterComponent } from './footer/footer.component';
import { FeedbackAndLegacyButtonsComponent } from './feedback-and-legacy-buttons/feedback-and-legacy-buttons.component';
import { ApplicationMenuComponent } from './application-menu/application-menu.component';
import { TextSearchExplanationComponent } from './image-search/query-section/query-section-tabs/text-search/text-search-explanation/text-search-explanation.component';
import { SpeciesQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/species-query/species-query.component';
import { PhantomQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/phantom-query/phantom-query.component';
import { ThirdPartyQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/third-party-query/third-party-query.component';
import { ThirdPartyExplanationComponent } from './image-search/query-section/query-section-tabs/simple-search/third-party-query/third-party-explanation/third-party-explanation.component';
import { OhifViewerService } from '@app/image-search/services/ohif-viewer.service';
import { AppRoutingModule } from '@app/app-routing.module';
import { BannerComponent } from './banner/banner.component';
import { ConfigurationService } from '@app/common/services/configuration.service';
import { DaysFromBaselineComponent } from './image-search/query-section/query-section-tabs/simple-search/days-from-baseline/days-from-baseline.component';
import { CommercialUseComponent } from './image-search/query-section/query-section-tabs/simple-search/commercial-use/commercial-use.component';
import { UniversalMenuComponent } from './header/universal-menu/universal-menu.component';
import { ClinicalTimePointsExplanationComponent } from './image-search/query-section/query-section-tabs/simple-search/days-from-baseline/clinical-time-points-explination/clinical-time-points-explanation.component';
import { GeneralSearchTabComponent } from './image-search/query-section/query-section-tabs/general-search-tab/general-search-tab.component';
import { ImagesSearchTabComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-search-tab.component';
import { SubjectsSearchTabComponent } from './image-search/query-section/query-section-tabs/subjects-search-tab/subjects-search-tab.component';
import { SubjectsSexSearchComponent } from './image-search/query-section/query-section-tabs/subjects-search-tab/subjects-sex-search/subjects-sex-search.component';
import { SubjectsAgeSearchComponent } from './image-search/query-section/query-section-tabs/subjects-search-tab/subjects-age-search/subjects-age-search.component';
import { SubjectsAgeExplanationComponent } from './image-search/query-section/query-section-tabs/subjects-search-tab/subjects-age-search/subjects-age-explanation/subjects-age-explanation.component';
import { SubjectsHeightSearchComponent } from './image-search/query-section/query-section-tabs/subjects-search-tab/subjects-height-search/subjects-height-search.component';    
import { SubjectsWeightSearchComponent } from './image-search/query-section/query-section-tabs/subjects-search-tab/subjects-weight-search/subjects-weight-search.component';
import { ImagesDesciptionSearchComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-desciption-search/images-desciption-search.component';
import { ImagesManufacturerSearchComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-manufacturer-search/images-manufacturer-search.component';
import { ImagesPixelSpacingSearchComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-pixel-spacing-search/images-pixel-spacing-search.component';
import { ImagesSliceThicknessSearchComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-slice-thickness-search/images-slice-thickness-search.component';
import { ImagesSliceThicknessExplanationComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-slice-thickness-search/images-slice-thickness-explanation/images-slice-thickness-explanation.component'; 
import { ImagesPixelSpacingExplanationComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-pixel-spacing-search/images-pixel-spacing-explanation/images-pixel-spacing-explanation.component';
import { ImagesDescriptionExplanationComponent } from './image-search/query-section/query-section-tabs/images-search-tab/images-desciption-search/images-description-explanation/images-description-explanation.component';
import { MinimumMatchedStudiesExplanationComponent } from './image-search/query-section/query-section-tabs/simple-search/minimum-matched-studies/minimum-matched-studies-explanation/minimum-matched-studies-explanation.component';    
import { SubjectIdExplanationComponent } from './image-search/query-section/query-section-tabs/simple-search/subject-id-query/subject-id-explanation/subject-id-explanation.component'; 
import { PhantomQueryExplanationComponent } from './image-search/query-section/query-section-tabs/simple-search/phantom-query/phantom-query-explanation/phantom-query-explanation.component';   
import { CollectionProgramQueryComponent } from './image-search/query-section/query-section-tabs/simple-search/collection-program-query/collection-program-query.component';
import { MatIconModule } from '@angular/material/icon';
import { CollectionProgramQueryExplanationComponent } from './image-search/query-section/query-section-tabs/simple-search/collection-program-query/collection-program-query-explanation/collection-program-query-explanation.component';

/*
const appRoutes: Routes = [
    { path: '', component: NbiaClientComponent },
    // The following are for backwards compatibility.
    { path: 'login.jsf', component: NbiaClientComponent },
    { path: 'ncia/login.jsf', component: NbiaClientComponent },
    { path: 'search', component: NbiaClientComponent },
    { path: 'externalLinks.jsf', component: NbiaClientComponent },
    { path: 'ncia/externalLinks.jsf', component: NbiaClientComponent },
    { path: 'externalPatientSearch.jsf', component: NbiaClientComponent },
    { path: 'ncia/externalPatientSearch.jsf', component: NbiaClientComponent }
];
*/
export function initSharedConfig(configService: ConfigurationService) {
    return () => configService.loadSharedConfig();
  }

@NgModule( {
    declarations: [
        AppComponent,
        ImageSearchComponent,
        LoginComponent,
        CartComponent,
        DataSectionComponent,
        QuerySectionComponent,
        HeaderComponent,
        QuerySectionTabsComponent,
        QueryBuilderComponent,
        TextQueryComponent,
        SimpleSearchComponent,
        GeneralSearchTabComponent,
        ImagesSearchTabComponent,
        SubjectsSearchTabComponent,
        SubjectsSexSearchComponent,
        SubjectsAgeSearchComponent,
        SubjectsAgeExplanationComponent,
        // SubjectsHeightSearchComponent,
        // SubjectsWeightSearchComponent,
        ImagesDesciptionSearchComponent,
        ImagesManufacturerSearchComponent,
        ImagesPixelSpacingSearchComponent,
        ImagesSliceThicknessSearchComponent,
        DisplayQuerySimpleSearchComponent,
        DataSectionTabsComponent,
        SearchResultsComponent,
        SummaryComponent,
        SearchResultsColumnSelectorComponent,
        SearchResultsTableComponent,
        TopRightButtonGroupComponent,
        CollectionQueryComponent,
        ImageModalityQueryComponent,
        SubjectIdQueryComponent,
        ResultsPerPageComponent,
        SearchResultsPagerComponent,
        AnatomicalSiteQueryComponent,
        DateRangeQueryComponent,
        PieChartCollectionsComponent,
        PieChartImageModalityComponent,
        PieChartAnatomicalSiteComponent,
        TestComponent,
        SeriesCartSelectorComponent,
        SubjectCartSelectorComponent,
        StudiesCartSelectorComponent,
        CartButtonGroupComponent,
        ShortenPipe,
        NbiaClientComponent,
        DisplayFormatPipe,
        ToMbGbPipe,
        DisplayQueryQueryBuilderComponent,
        DisplayQueryTextSearchComponent,
        ShortenRightPipe,
        DownloaderDownloadComponent,
        MinimumMatchedStudiesComponent,
        LoadingDisplayComponent,
        FeedbackButtonComponent,
        CartDeleteComponent,
        SubjectStudyDetailsComponent,
        SeriesDetailsComponent,
        LegacyAppButtonComponent,
        ListSearchComponent,
        SaveSharedListComponent,
        QueryUrlComponent,
        SeriesSearchComponent,
        SubjectSearchComponent,
        StudySearchComponent,
        MissingCriteriaComponent,
        DicomDataComponent,
        AlertBoxComponent,
        SaveCartComponent,
        ToolTipComponent,
        IntroductionComponent,
        DescriptionPopupComponent,
        FooterComponent,
        FeedbackAndLegacyButtonsComponent,
        ApplicationMenuComponent,
        TextSearchExplanationComponent,
        SpeciesQueryComponent,
        PhantomQueryComponent,
        ThirdPartyQueryComponent,
        ThirdPartyExplanationComponent,
        BannerComponent,
        DaysFromBaselineComponent,
        CommercialUseComponent,
        UniversalMenuComponent,
        ClinicalTimePointsExplanationComponent,
        ImagesSliceThicknessExplanationComponent,
        ImagesPixelSpacingExplanationComponent,
        ImagesDescriptionExplanationComponent,
        MinimumMatchedStudiesExplanationComponent,
        SubjectIdExplanationComponent,
        PhantomQueryExplanationComponent,
        CollectionProgramQueryComponent,
        CollectionProgramQueryExplanationComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatIconModule,
        NgxSliderModule,
        ClipboardModule,

    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initSharedConfig,
            deps: [ConfigurationService],
            multi: true
          },
        CookieService],
    bootstrap: [AppComponent]
} )
export class AppModule{
}
