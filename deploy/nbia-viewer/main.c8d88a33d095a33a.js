(self["webpackChunknbia_viewer"] = self["webpackChunknbia_viewer"] || []).push([["main"],{

/***/ 6401:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _app_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component.html?ngResource */ 3383);
/* harmony import */ var _app_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component.scss?ngResource */ 9595);
/* harmony import */ var _app_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_app_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let AppComponent = class AppComponent {
  constructor() {
    this.title = 'nbia';
  }
};
AppComponent = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.Component)({
  selector: 'nbia-root',
  template: _app_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
  styles: [(_app_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default())]
})], AppComponent);


/***/ }),

/***/ 8629:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 6401);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ngx-cookie-service */ 8859);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _nbia_thumbnail_viewer_nbia_thumbnail_viewer_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nbia-thumbnail-viewer/nbia-thumbnail-viewer.component */ 7373);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var _services_util_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/util.service */ 9193);
/* harmony import */ var _services_server_access_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/server-access.service */ 452);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _pager_pager_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pager/pager.component */ 165);
/* harmony import */ var _services_common_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/common.service */ 5731);
/* harmony import */ var _images_per_page_images_per_page_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./images-per-page/images-per-page.component */ 5737);
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./footer/footer.component */ 6515);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};














const appRoutes = [{
  path: '',
  component: _nbia_thumbnail_viewer_nbia_thumbnail_viewer_component__WEBPACK_IMPORTED_MODULE_1__.NbiaThumbnailViewerComponent
}];
let AppModule = class AppModule {};
AppModule = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.NgModule)({
  declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent, _nbia_thumbnail_viewer_nbia_thumbnail_viewer_component__WEBPACK_IMPORTED_MODULE_1__.NbiaThumbnailViewerComponent, _pager_pager_component__WEBPACK_IMPORTED_MODULE_4__.PagerComponent, _images_per_page_images_per_page_component__WEBPACK_IMPORTED_MODULE_6__.ImagesPerPageComponent, _footer_footer_component__WEBPACK_IMPORTED_MODULE_7__.FooterComponent],
  imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__.BrowserModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule.forRoot(appRoutes)],
  providers: [ngx_cookie_service__WEBPACK_IMPORTED_MODULE_13__.CookieService, _services_util_service__WEBPACK_IMPORTED_MODULE_2__.UtilService, _services_server_access_service__WEBPACK_IMPORTED_MODULE_3__.ServerAccessService, _services_common_service__WEBPACK_IMPORTED_MODULE_5__.CommonService],
  bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent]
})], AppModule);


/***/ }),

/***/ 6515:
/*!********************************************!*\
  !*** ./src/app/footer/footer.component.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FooterComponent: () => (/* binding */ FooterComponent)
/* harmony export */ });
/* harmony import */ var _footer_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./footer.component.html?ngResource */ 2811);
/* harmony import */ var _footer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./footer.component.scss?ngResource */ 9652);
/* harmony import */ var _footer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_footer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let FooterComponent = class FooterComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ctorParameters = () => [];
};
FooterComponent = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.Component)({
  selector: 'nbia-footer',
  template: _footer_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
  styles: [(_footer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default())]
})], FooterComponent);


/***/ }),

/***/ 5737:
/*!**************************************************************!*\
  !*** ./src/app/images-per-page/images-per-page.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImagesPerPageComponent: () => (/* binding */ ImagesPerPageComponent)
/* harmony export */ });
/* harmony import */ var _images_per_page_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./images-per-page.component.html?ngResource */ 8098);
/* harmony import */ var _images_per_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images-per-page.component.scss?ngResource */ 5677);
/* harmony import */ var _images_per_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_images_per_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.scss?ngResource */ 1514);
/* harmony import */ var _nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _services_common_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/common.service */ 5731);
/* harmony import */ var _assets_properties__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/properties */ 5100);
/* harmony import */ var _services_util_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/util.service */ 9193);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};







let ImagesPerPageComponent = class ImagesPerPageComponent {
  constructor(commonService, utilService) {
    this.commonService = commonService;
    this.utilService = utilService;
    this.haveData = false;
  }
  ngOnInit() {
    this.commonService.haveAllDataEmitter.subscribe(data => {
      this.haveData = data;
    });
    this.initImagesPerPage();
  }
  onChangeMinimumMatchedStudies() {
    this.commonService.setImagesPerPage(this.imagesPerPage);
  }
  initImagesPerPage() {
    this.imagesPerPage = this.commonService.getPersistedValue('imagesPerPage'); // FIXME this needs to be a const
    if (this.utilService.isNullOrUndefined(this.imagesPerPage)) {
      this.imagesPerPage = _assets_properties__WEBPACK_IMPORTED_MODULE_4__.Properties.IMAGES_PER_PAGE_CHOICE_DEFAULT;
    }
    this.commonService.setImagesPerPage(this.imagesPerPage);
  }
  static #_ = this.ctorParameters = () => [{
    type: _services_common_service__WEBPACK_IMPORTED_MODULE_3__.CommonService
  }, {
    type: _services_util_service__WEBPACK_IMPORTED_MODULE_5__.UtilService
  }];
};
ImagesPerPageComponent = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
  selector: 'nbia-images-per-page',
  template: _images_per_page_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
  styles: [(_images_per_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default()), (_nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], ImagesPerPageComponent);


/***/ }),

/***/ 7373:
/*!**************************************************************************!*\
  !*** ./src/app/nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NbiaThumbnailViewerComponent: () => (/* binding */ NbiaThumbnailViewerComponent)
/* harmony export */ });
/* harmony import */ var _home_aj_Development_NBIA_TCIA_software_nbia_viewer_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var _nbia_thumbnail_viewer_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nbia-thumbnail-viewer.component.html?ngResource */ 1096);
/* harmony import */ var _nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nbia-thumbnail-viewer.component.scss?ngResource */ 1514);
/* harmony import */ var _nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-cookie-service */ 8859);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _assets_properties__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../assets/properties */ 5100);
/* harmony import */ var _services_util_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/util.service */ 9193);
/* harmony import */ var _services_server_access_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/server-access.service */ 452);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var rxjs_internal_Subject__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/internal/Subject */ 2513);
/* harmony import */ var _services_common_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/common.service */ 5731);
/* harmony import */ var _services_configuration_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/configuration.service */ 2670);

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};












let NbiaThumbnailViewerComponent = class NbiaThumbnailViewerComponent {
  constructor(cookieService, utilService, route, serverAccessService, titleService, commonService, configurationService) {
    this.cookieService = cookieService;
    this.utilService = utilService;
    this.route = route;
    this.serverAccessService = serverAccessService;
    this.titleService = titleService;
    this.commonService = commonService;
    this.configurationService = configurationService;
    // The images for the top right -/+ buttons. These change in response to the mouse and being disabled.
    this.zoomOutImgSrc = 'assets/images/zoom_out_dark.png';
    this.zoomInImgSrc = 'assets/images/zoom_in_dark.png';
    // The array of all the jpg images.
    // This may change, to handle a large number of images, we may go back to the server for each page.
    this.images = [];
    this.currentPage = 0;
    // The first image of the current page.
    this.firstImage = 0;
    // The number of images displayed in each row.
    this.columns = _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.VIEWER_COLUMNS_DEFAULT;
    // Minimum width of a column in pixels.
    this.columnSize = 130;
    // For the over all left and right margins
    this.marginOffset = 14;
    // Absolute maximum number of images per row.
    // If this is greater than 12 things will break.  The container will need to be modified for greater than 12.
    this.columnLimit = 12;
    this.haveError = false;
    this.errorMessage0 = '';
    this.errorMessage1 = '';
    this.errorMessage2 = '';
    this.haveData = false;
    // For HTML access
    this.properties = _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties;
    // Used when retrieving the DICOM image
    this.currentViewImageIndex = -1;
    // Used to display the Series Description at the top of the display.
    this.description = '';
    // Just for testing
    this.temp = 'Dog';
    this.ngUnsubscribe = new rxjs_internal_Subject__WEBPACK_IMPORTED_MODULE_8__.Subject();
    this.titleService.setTitle(_assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.TITLE);
    // This will set: DEFAULT_USER, DEFAULT_PASSWORD and DEFAULT_SECRET.
    // These will only be used if the we have been called from nbia-search, the user is the guest, and the access token has expired.
    this.configurationService.initConfiguration();
    // Get persisted user preference for viewer columns.
    this.columns = this.commonService.getPersistedValue('viewerColumns');
    // If there is no persisted user preference for viewer columns, use the default
    if (this.utilService.isNullOrUndefined(this.columns)) {
      this.columns = _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.VIEWER_COLUMNS_DEFAULT;
      this.commonService.setPersistedValue('viewerColumns', this.columns);
    }
    this.userRequestedColumnCount = this.columns;
  }
  ngOnInit() {
    var _this = this;
    // Get description passed in the URL
    this.description = this.route.snapshot.queryParams['thumbnailDescription'];
    // To determining the maximum number of images that can fit in one row
    this.innerWidth = window.innerWidth;
    // For determining the height of the image grid, so it fits correctly between the heading and footer.
    this.innerHeight = (window.innerHeight - (50 + 50)).toString() + 'px'; // FIXME - make these constants
    if (this.columns > this.getMaxColumns(window.innerWidth)) {
      this.columns = this.getMaxColumns(window.innerWidth);
    }
    this.currentMaxColumns = this.getMaxColumns(this.innerWidth);
    // If no description was provided in the url, make sure the description is empty.
    if (this.utilService.isNullOrUndefinedOrEmpty(this.description) || this.description === 'null') {
      this.description = '';
    }
    // When the page changes.
    this.commonService.currentPageEmitter.subscribe(data => {
      this.currentPage = data;
      this.updatePage();
    });
    // When the number of images per page changes.
    this.commonService.imagesPerPageEmitter.subscribe(data => {
      this.imagesPerPage = data;
      this.updatePage();
    }, err => {
      console.error('imagesPerPageEmitter imagesPerPage ERROR: ', err);
    });
    // Receives the jpg image array.
    this.serverAccessService.getImagesResultsEmitter.subscribe(data => {
      this.images = data;
      this.mouseOver = new Array(this.images.length);
    }, err => {
      this.reactToError('Failed to get Images', err['status'].toString(), err['statusText']);
    });
    // //////////////////////////////////////////////////////////////
    // Error emitter subscribes
    //
    // Will likely get one of two errors:
    //   Authorization 401 - expired token
    //   Internal Server error 500 - Could be missing jpg.
    //       we may change return code for missing jpg from 500 on the server side.
    // Calling serverAccessService.getImages can possibly trigger either of two error emitters.
    //  getThumbnailsEmitter
    //  getImageDrillDownDataErrorEmitter
    // 401 - expired token
    // 500 - Could be missing jpg, we may change return code from 500 to something else from the server side.
    // This getThumbnails called after getImageDrillDownData, so we are not likely to get a 401,
    // we would have got the 401 earlier in getImageDrillDownData.
    // If we do get an error here, it is likely a 500 Server error because the thumbnail image was missing on the server,
    // this will be handled by serverAccessService.getImages
    this.serverAccessService.getThumbnailsEmitter.subscribe(data => {
      if (data.status !== 500) {
        console.error('Error getThumbnails: ', data['statusText']);
      }
    });
    // This is our first server call, if there is going to be an Authorization error (401) it will happen here or in getDicomImageErrorEmitter.
    this.serverAccessService.getImageDrillDownDataErrorEmitter.subscribe( /*#__PURE__*/function () {
      var _ref = (0,_home_aj_Development_NBIA_TCIA_software_nbia_viewer_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (data) {
        let currentError = {};
        // Authorization - bad access token error
        if (data.status === 401) {
          console.log('MHL Authorization - bad access token error');
          // User is guest try to get a new token
          if (_this.isGuest()) {
            console.log('MHL Cookie says user is guest.  Try to get a new token.');
            let token;
            _this.serverAccessService.getNewGuestServerAccessToken().subscribe(tokenData => {
              token = tokenData['access_token'];
              _this.setNewToken(token);
              // We have a new token, try getImages again.
              // FIXME If there is a 401 error with a new token, we will loop endlessly!
              _this.serverAccessService.getImages();
            }, err => {
              currentError = err;
              token = null;
            });
            while (token === undefined) {
              yield _this.utilService.sleep(50);
            }
            if (token === null) {
              _this.reactToError('Guest Authentication retry failed', currentError['status'].toString(), currentError['statusText']);
            }
          } // End isGuest
          else {
            _this.reactToError('Expired login', data['status'].toString(), data['statusText']);
          }
        } // End of 401
        // An error that is NOT 401
        else {
          _this.reactToError('Failed to get thumbnail images', data['status'].toString(), data['statusText']);
        }
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    // When this.onOpenImageClick calls serverAccessService.downLoadDicomImageFile,
    this.serverAccessService.getDicomImageErrorEmitter.subscribe( /*#__PURE__*/function () {
      var _ref2 = (0,_home_aj_Development_NBIA_TCIA_software_nbia_viewer_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (data) {
        let currentError = {};
        // Authorization - bad access token error
        if (data.status === 401) {
          // User is guest try to get a new token
          if (_this.isGuest()) {
            let token;
            _this.serverAccessService.getNewGuestServerAccessToken().subscribe(tokenData => {
              token = tokenData['access_token'];
              _this.setNewToken(token);
              // We have a new token, try getImages again.
              // FIXME If there is a 401 error with a new token, we will loop endlessly!
              _this.onOpenImageClick(_this.currentViewImageIndex);
            }, err => {
              currentError = err;
              token = null;
            });
            while (token === undefined) {
              yield _this.utilService.sleep(50);
            }
            if (token === null) {
              _this.reactToError('getDicomImage Guest Authentication retry failed', currentError['status'].toString(), currentError['statusText']);
            }
          } // End isGuest
          else {
            _this.reactToError('getDicomImage Expired login', data['status'].toString(), data['statusText']);
          }
        } // End of 401
        else {
          _this.reactToError('Failed to get Dicom Images', data['status'].toString(), data['statusText']);
        }
      });
      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    this.commonService.haveAllDataEmitter.subscribe(data => {
      this.haveData = data;
    });
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.IMAGE_LOAD_MODE === _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.LOAD_ALL) {
      this.serverAccessService.getImages();
    }
  } // End ngOnInit
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = (window.innerHeight - (50 + 50)).toString() + 'px'; // FIXME
    this.currentMaxColumns = this.getMaxColumns(this.innerWidth);
    if (this.columns > this.currentMaxColumns) {
      this.columns = this.currentMaxColumns;
    }
    if (this.columns < this.currentMaxColumns && this.columns < this.userRequestedColumnCount) {
      this.columns++;
    }
  }
  onRadioClick(i) {
    _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.IMAGE_LOAD_MODE = i;
  }
  getMaxColumns(winWidth) {
    let res = Math.ceil((winWidth - this.marginOffset) / this.columnSize - 1);
    if (res > this.columnLimit) {
      res = this.columnLimit;
    }
    return res;
  }
  onMinusClick() {
    if (this.columns < this.getMaxColumns(this.innerWidth)) {
      this.columns++;
      this.userRequestedColumnCount = this.columns;
      this.commonService.setPersistedValue('viewerColumns', this.columns);
    }
    if (this.columns >= this.getMaxColumns(this.innerWidth)) {
      this.onZoomOutMouseOver();
    }
  }
  onPlusClick() {
    if (this.columns > 1) {
      this.columns--;
      this.userRequestedColumnCount = this.columns;
      this.commonService.setPersistedValue('viewerColumns', this.columns);
    }
    if (this.columns <= 1) {
      this.onZoomInMouseOver();
    }
  }
  updatePage() {
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.IMAGE_LOAD_MODE === _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.LOAD_ALL) {
      this.firstImage = this.currentPage * this.imagesPerPage;
    } else {
      this.firstImage = 0;
    }
  }
  reactToError(whatFailed, errorNum, errorText) {
    console.error('Error( ' + whatFailed + ', ' + errorNum + ', ' + errorText + ')');
    this.haveError = true;
    this.errorMessage0 = whatFailed;
    // this.errorMessage1 = errorNum;
    this.errorMessage2 = errorText;
  }
  getToken() {
    return this.commonService.getPersistedValue('at');
  }
  setNewToken(token) {
    this.commonService.setPersistedValue('at', token);
    this.serverAccessService.setToken(token);
  }
  isGuest() {
    let g = this.commonService.getPersistedValue('guest');
    if (this.utilService.isNullOrUndefined(g)) {
      return true;
    }
    return this.utilService.isTrue(g);
  }
  onOpenImageClick(i) {
    // We keep this value in case the call to get the image fails due to error 401, and the user is guest,
    // we can get a new token and try again.
    this.currentViewImageIndex = i;
    this.serverAccessService.downLoadDicomImageFile(this.images[i].seriesInstanceUid, this.images[i].sopInstanceUid, this.images[i].studyInstanceUid);
  }
  onMouseOver(i) {
    this.mouseOver[i] = true;
  }
  onMouseOut(i) {
    this.mouseOver[i] = false;
  }
  onZoomOutMouseOver() {
    if (this.columns >= this.currentMaxColumns) {
      this.zoomOutImgSrc = 'assets/images/zoom_out_dark.png';
    } else {
      this.zoomOutImgSrc = 'assets/images/zoom_out_white.png';
    }
  }
  onZoomOutMouseOut() {
    this.zoomOutImgSrc = 'assets/images/zoom_out_dark.png';
  }
  onZoomInMouseOver() {
    if (this.columns > 1) {
      this.zoomInImgSrc = 'assets/images/zoom_in_white.png';
    } else {
      this.zoomInImgSrc = 'assets/images/zoom_in_dark.png';
    }
  }
  onZoomInMouseOut() {
    this.zoomInImgSrc = 'assets/images/zoom_in_dark.png';
  }
  ngOnDestroy() {}
  static #_ = this.ctorParameters = () => [{
    type: ngx_cookie_service__WEBPACK_IMPORTED_MODULE_9__.CookieService
  }, {
    type: _services_util_service__WEBPACK_IMPORTED_MODULE_4__.UtilService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute
  }, {
    type: _services_server_access_service__WEBPACK_IMPORTED_MODULE_5__.ServerAccessService
  }, {
    type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_11__.Title
  }, {
    type: _services_common_service__WEBPACK_IMPORTED_MODULE_6__.CommonService
  }, {
    type: _services_configuration_service__WEBPACK_IMPORTED_MODULE_7__.ConfigurationService
  }];
  static #_2 = this.propDecorators = {
    onResize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_12__.HostListener,
      args: ['window:resize', ['$event']]
    }]
  };
};
NbiaThumbnailViewerComponent = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_12__.Component)({
  selector: 'nbia-nbia-thumbnail-viewer',
  template: _nbia_thumbnail_viewer_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], NbiaThumbnailViewerComponent);


/***/ }),

/***/ 165:
/*!******************************************!*\
  !*** ./src/app/pager/pager.component.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PagerComponent: () => (/* binding */ PagerComponent)
/* harmony export */ });
/* harmony import */ var _pager_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pager.component.html?ngResource */ 8954);
/* harmony import */ var _pager_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pager.component.scss?ngResource */ 7148);
/* harmony import */ var _pager_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pager_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.scss?ngResource */ 1514);
/* harmony import */ var _nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _assets_properties__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../assets/properties */ 5100);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 2513);
/* harmony import */ var _services_util_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/util.service */ 9193);
/* harmony import */ var _services_common_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/common.service */ 5731);
/* harmony import */ var _services_server_access_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/server-access.service */ 452);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};









let PagerComponent = class PagerComponent {
  constructor(util, commonService, serverAccessService) {
    this.util = util;
    this.commonService = commonService;
    this.serverAccessService = serverAccessService;
    /**
     * Total number of results (not pages).
     */
    this.totalCount = 0;
    /**
     * An array representing each button, this currently just holds the text for the button (which is just the index plus one).
     * @type {Array}
     */
    this.buttons = [];
    /**
     * The currently visible page, when this value changes, it is emitted by a call to commonService.updateCurrentSearchResultsPage or<br>
     * commonService.updateCurrentCartPage.
     * @type {number}
     */
    this.currentPage = 0;
    /**
     * How many "Number" buttons to show if there are more than Properties.MAX_PAGER_BUTTONS pages.
     * @type {number}
     */
    this.maxButtonsToShow = _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.MAX_PAGER_BUTTONS;
    /**
     * If there are more than Properties.MAX_PAGER_BUTTONS pages, the visible number buttons will scroll.<br>
     * This is the first (left most) visible button.  Zero is the first page.
     * @type {number}
     */
    this.buttonShowOffset = 0;
    /**
     * @TODO explain
     * @type {number}
     */
    this.direction = 0;
    this.haveData = false;
    this.ngUnsubscribe = new rxjs__WEBPACK_IMPORTED_MODULE_7__.Subject();
  }
  ngOnInit() {
    this.commonService.haveAllDataEmitter.subscribe(data => {
      this.haveData = data;
    });
    this.commonService.imageCountEmitter.subscribe(data => {
      this.totalCount = data;
      this.pageCount = Math.ceil(this.totalCount / this.countPerPage);
      this.setButtons();
    });
    this.countPerPage = this.commonService.imagesPerPageEmitter.subscribe(data => {
      this.countPerPage = +data;
      this.pageCount = Math.ceil(this.totalCount / this.countPerPage);
      this.setButtons();
      if (_assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.IMAGE_LOAD_MODE === _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.LOAD_ONE_PAGE) {
        this.serverAccessService.getImages(this.currentPage);
      }
    });
    if (this.util.isNullOrUndefined(this.countPerPage)) {
      this.countPerPage = _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.IMAGES_PER_PAGE_CHOICE_DEFAULT;
    }
    /*
                 // When the total number of rows changes.
                this.commonService.cartCountEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
                    data => {
                        this.totalCount = data;
                        this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                        this.currentPage = 0;
                        this.onClick( this.currentPage );
                        this.setButtons();
                    }
                );
                 // When the number of rows per page changes.
                this.commonService.cartsPerPageEmitter.takeUntil( this.ngUnsubscribe ).subscribe(
                    data => {
                        this.countPerPage = data;
                        this.pageCount = Math.ceil( this.totalCount / this.countPerPage );
                        // Go back to first page
                        this.currentPage = 0;
                        this.onClick( this.currentPage );
                        this.setButtons();
                    }
                );
     */
    /////////////////
  }
  /**
   * Initialize the buttons with their correct numbers - called when row count, or rows per page changes.
   */
  setButtons() {
    this.buttons = [];
    for (let f = 0; f < this.pageCount; f++) {
      this.buttons[f] = f;
    }
  }
  /**
   * Called when a number button is clicked, also called by:<br>
   * <ul>
   *     <li>onGoFirstClickClick()</li>
   *     <li>onGoPreviousClick()</li>
   *     <li>onGoNextClick()</li>
   *     <li>onGoLastClick()</li>
   * </ul>
   *
   * @param pageNum  The page to display.
   */
  onClick(pageNum) {
    this.currentPage = pageNum;
    this.commonService.setCurrentPage(this.currentPage);
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.IMAGE_LOAD_MODE === _assets_properties__WEBPACK_IMPORTED_MODULE_3__.Properties.LOAD_ONE_PAGE) {
      this.serverAccessService.getImages(this.currentPage);
    }
  }
  onGoFirstClickClick() {
    this.buttonShowOffset = 0;
    this.onClick(0);
  }
  onGoPreviousClick() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
    if (this.currentPage < this.buttonShowOffset) {
      this.buttonShowOffset--;
    }
    this.onClick(this.currentPage);
  }
  onGoNextClick() {
    if (this.currentPage < this.pageCount - 1) {
      this.currentPage++;
    }
    if (this.currentPage > this.buttonShowOffset + this.maxButtonsToShow - 1) {
      this.buttonShowOffset++;
    }
    this.onClick(this.currentPage);
  }
  onGoLastClick() {
    this.buttonShowOffset = this.pageCount - this.maxButtonsToShow;
    this.onClick(this.pageCount - 1);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
  static #_ = this.ctorParameters = () => [{
    type: _services_util_service__WEBPACK_IMPORTED_MODULE_4__.UtilService
  }, {
    type: _services_common_service__WEBPACK_IMPORTED_MODULE_5__.CommonService
  }, {
    type: _services_server_access_service__WEBPACK_IMPORTED_MODULE_6__.ServerAccessService
  }];
  static #_2 = this.propDecorators = {
    displayDataType: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_8__.Input
    }]
  };
};
PagerComponent = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
  selector: 'nbia-pager',
  template: _pager_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
  styles: [(_pager_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default()), (_nbia_thumbnail_viewer_nbia_thumbnail_viewer_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], PagerComponent);


/***/ }),

/***/ 5731:
/*!********************************************!*\
  !*** ./src/app/services/common.service.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommonService: () => (/* binding */ CommonService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _assets_properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../assets/properties */ 5100);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-cookie-service */ 8859);
/* harmony import */ var _util_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.service */ 9193);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let CommonService = class CommonService {
  constructor(cookieService, utilService) {
    this.cookieService = cookieService;
    this.utilService = utilService;
    this.imagesPerPageEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.imagesPerPage = _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.IMAGES_PER_PAGE_CHOICE_DEFAULT;
    this.currentPageEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.currentPage = 0;
    this.imageCountEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.imageCount = 0;
    this.haveAllDataEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.haveAllData = false;
    if (this.cookieService.get(_assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.COOKIE_NAME) == null || this.cookieService.get(_assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.COOKIE_NAME) == "") {
      this.cookieData = {};
    } else {
      this.cookieData = JSON.parse(this.cookieService.get(_assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.COOKIE_NAME));
    }
  }
  setHaveAllData(haveIt) {
    this.haveAllData = haveIt;
    this.haveAllDataEmitter.emit(haveIt);
  }
  getHaveAllData(haveIt) {
    return this.haveAllData;
  }
  setImagesPerPage(i) {
    this.imagesPerPageEmitter.emit(i);
    this.setPersistedValue('imagesPerPage', i);
    this.imagesPerPage = i;
  }
  getImagesPerPage() {
    return this.imagesPerPage;
  }
  setCurrentPage(p) {
    this.currentPageEmitter.emit(p);
    this.currentPage = p;
  }
  getCurrentPage() {
    return this.currentPage;
  }
  setImageCount(c) {
    this.imageCountEmitter.emit(c);
    this.imageCount = c;
  }
  getImageCount() {
    return this.imageCount;
  }
  getPersistedValue(key) {
    // todo: clean this up
    // temporary fix for retreiving access token from local storage rather than cookie
    if (key == 'at') {
      return localStorage.getItem('at');
    }
    if (!this.utilService.isNullOrUndefinedOrEmpty(this.cookieData)) {
      try {
        return this.cookieData[key];
      } catch (e) {
        console.error('Error parsing persisted data: ', e.message);
        return '';
      }
    }
  }
  setPersistedValue(key, value) {
    this.cookieData[key] = value;
    this.cookieService.set(_assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.COOKIE_NAME, JSON.stringify(this.cookieData));
  }
  static #_ = this.ctorParameters = () => [{
    type: ngx_cookie_service__WEBPACK_IMPORTED_MODULE_3__.CookieService
  }, {
    type: _util_service__WEBPACK_IMPORTED_MODULE_1__.UtilService
  }];
};
CommonService = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable)({
  providedIn: 'root'
})], CommonService);


/***/ }),

/***/ 2670:
/*!***************************************************!*\
  !*** ./src/app/services/configuration.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigurationService: () => (/* binding */ ConfigurationService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _assets_properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../assets/properties */ 5100);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var _util_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.service */ 9193);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let ConfigurationService = class ConfigurationService {
  constructor(httpClient, utilService) {
    this.httpClient = httpClient;
    this.utilService = utilService;
  }
  initConfiguration() {
    this.readTextFile('assets/' + _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.CONFIG_FILE).subscribe(data => {
      this.parseConfig(data);
      _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.CONFIG_COMPLETE = true;
    }, err => {
      if (err.status === 404) {
        console.error('Could not find CONFIG_FILE file "' + 'assets/' + _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.CONFIG_FILE);
      }
      console.error('Could not access CONFIG_FILE file! ', err.status);
      _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.CONFIG_COMPLETE = true;
    });
  }
  readTextFile(file) {
    return this.httpClient.get(file, {
      responseType: 'text'
    });
  }
  parseConfig(data) {
    let config = data.replace(/\r\n/g, '\r').replace(/\n/g, '\r').split(/\r/);
    for (let line of config) {
      if (line.match('^\s*#')) {} else {
        if (line.includes('=')) {
          let value = line.replace(/.*?=\s*/, '');
          let key = line.replace(/\s*?=.*$/, '');
          key = key.replace(/^\s*/, '');
          if (key === 'DEFAULT_USER') {
            if (!this.utilService.isNullOrUndefinedOrEmpty(value)) {
              _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.DEFAULT_USER = value;
            }
          }
          if (key === 'DEFAULT_PASSWORD') {
            if (!this.utilService.isNullOrUndefinedOrEmpty(value)) {
              _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.DEFAULT_PASSWORD = value;
            }
          }
          if (key === 'DEFAULT_SECRET') {
            if (!this.utilService.isNullOrUndefinedOrEmpty(value)) {
              _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.DEFAULT_SECRET = value;
            }
          }
          if (key === 'DEFAULT_CLIENT_ID') {
            if (!this.utilService.isNullOrUndefinedOrEmpty(value)) {
              _assets_properties__WEBPACK_IMPORTED_MODULE_0__.Properties.DEFAULT_CLIENT_ID = value;
            }
          }
        }
      }
    }
  }
  static #_ = this.ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient
  }, {
    type: _util_service__WEBPACK_IMPORTED_MODULE_1__.UtilService
  }];
};
ConfigurationService = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Injectable)({
  providedIn: 'root'
})], ConfigurationService);


/***/ }),

/***/ 452:
/*!***************************************************!*\
  !*** ./src/app/services/server-access.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerAccessService: () => (/* binding */ ServerAccessService)
/* harmony export */ });
/* harmony import */ var _home_aj_Development_NBIA_TCIA_software_nbia_viewer_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 1670);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 4860);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _assets_properties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/properties */ 5100);
/* harmony import */ var _util_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.service */ 9193);
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common.service */ 5731);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 4148);

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};








let ServerAccessService = class ServerAccessService {
  constructor(httpClient, sanitizer, utilService, commonService, route, router) {
    this.httpClient = httpClient;
    this.sanitizer = sanitizer;
    this.utilService = utilService;
    this.commonService = commonService;
    this.route = route;
    this.router = router;
    this.getImagesResultsEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.getThumbnailsEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.getImageDrillDownDataErrorEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.getDicomImageErrorEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.API_SERVER_URL = '';
    this.images = [];
    this.getThumbnailErrorCount = 0;
    this.tokenRefreshCycleRunning = false;
    this.loading = true;
    this.API_SERVER_URL = location.origin.toString();
    this.seriesId = this.route.snapshot.queryParams['thumbnailSeries'];
    this.token = this.commonService.getPersistedValue('at');
    this.initToken();
  }
  /**
   * If page has a value, only that page of images is downloaded.
   * We get the current number of images per page from commonService.getImagesPerPage().
   *
   * @param page
   */
  /**
   * If page has a value, only that page of images is downloaded.
   * If page & imageNumber have value, get just one image.
   *
   * We get the current number of images per page from commonService.getImagesPerPage().
    * @param page
   * @param imageNumber
   */
  getImages(page, imageNumber) {
    var _this = this;
    return (0,_home_aj_Development_NBIA_TCIA_software_nbia_viewer_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.loading = true;
      _this.images = [];
      let len = 99999999;
      _this.getImageDrillDownData().subscribe(data => {
        len = data.length;
        _this.commonService.setImageCount(len);
        _this.first = 0;
        _this.last = len - 1;
        if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.IMAGE_LOAD_MODE === _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.LOAD_ONE_PAGE) {
          if (!_this.utilService.isNullOrUndefined(page)) {
            _this.commonService.setCurrentPage(page);
          } else {
            page = 0;
          }
          _this.first = +_this.commonService.getCurrentPage() * +_this.commonService.getImagesPerPage();
          _this.last = _this.first + +_this.commonService.getImagesPerPage() - 1;
          if (_this.last > len) {
            _this.last = len - 1;
          }
        }
        for (let i = _this.first; i <= _this.last; i++) {
          _this.getThumbnails(data[i]['seriesInstanceUid'], data[i]['sopInstanceUid']).subscribe(thumbnailData => {
            _this.images.push({
              'thumbnailImage': _this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(thumbnailData)),
              'seriesInstanceUid': data[i]['seriesInstanceUid'],
              'sopInstanceUid': data[i]['sopInstanceUid'],
              'studyInstanceUid': data[i]['studyInstanceUid'],
              'seq': i
            });
          },
          // If we could not get the thumbnail from the server,
          // we still want to display the frame with the "View Image" button
          // because the DICOM image may still there.
          thumbnailError => {
            console.log('ThumbnailError: ', thumbnailError);
            // We need this count when we are waiting for all the images (by count) to arrive before moving on
            _this.getThumbnailErrorCount++;
            // Add a "we can't find it" image.
            _this.images.push({
              'thumbnailImage': 'assets/images/image_not_found.png',
              'seriesInstanceUid': data[i]['seriesInstanceUid'],
              'sopInstanceUid': data[i]['sopInstanceUid'],
              'studyInstanceUid': data[i]['studyInstanceUid'],
              'seq': i
            });
            // this.getThumbnailsEmitter.emit( thumbnailError );
          });
        }

        _this.loading = false;
      }, err => {
        _this.loading = false;
        _this.getImageDrillDownDataErrorEmitter.emit(err);
      });
      // Wait until we have all the images.
      _this.commonService.setHaveAllData(false);
      if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.IMAGE_LOAD_MODE === _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.LOAD_ALL) {
        while (_this.images.length + _this.getThumbnailErrorCount < len) {
          yield _this.utilService.sleep(_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.WAIT_TIME);
        }
      } else {
        while (_this.loading || _this.images.length + _this.getThumbnailErrorCount < _this.last - _this.first) {
          yield _this.utilService.sleep(_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.WAIT_TIME);
        }
      }
      _this.commonService.setHaveAllData(true);
      // Sort by seq here - need to sort, they may not have arrived from the server in the order they where requested.
      _this.images.sort((row1, row2) => row1.seq - row2.seq);
      _this.getImagesResultsEmitter.emit(_this.images);
    })();
  }
  getImageDrillDownData() {
    let query = 'list=' + this.seriesId;
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEBUG_CURL) {
      let curl = ' curl -H \'Authorization:Bearer  ' + this.getToken() + '\' -k \'' + this.API_SERVER_URL + '/nbia-api/services/getImageDrillDown\' -d \'' + query + '\'';
      console.log('doPost: ', curl);
    }
    let imageDrillDownUrl = this.API_SERVER_URL + '/nbia-api/services/getImageDrillDown';
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this.getToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.post(imageDrillDownUrl, query, options);
  }
  getThumbnails(seriesUid, objectId) {
    let post_url = this.API_SERVER_URL + '/nbia-api/services/getThumbnail';
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer  ' + this.getToken()
    });
    let data = 'seriesUID=' + seriesUid + '&objectUID=' + objectId;
    let dataTemp = 'seriesUID=' + this.seriesId + '&objectUID=' + objectId;
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEBUG_CURL) {
      let curl = 'curl -H \'Authorization:Bearer ' + this.getToken() + '\' -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
      console.log('doGet: ' + curl);
    }
    let options = {
      headers: headers,
      method: 'post',
      responseType: 'blob'
    };
    return this.httpClient.post(post_url, data, options);
  }
  downLoadDicomImageFile(seriesUID, objectUID, studyUID) {
    this.getDicomImage(seriesUID, objectUID, studyUID).subscribe(data => {
      let dicomFile = new Blob([data], {
        type: 'application/dicom'
      });
      // TODO in the download popup, it says 'from: blob:'  see if we can change this.
      let url = window.URL.createObjectURL(dicomFile);
      window.open(url);
    }, err => {
      console.error('Error downloading DICOM: ', err);
      this.getDicomImageErrorEmitter.emit(err);
    });
  }
  getDicomImage(seriesUID, objectUID, studyUID) {
    let post_url = this.API_SERVER_URL + '/nbia-api/services/getWado';
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer  ' + this.getToken()
    });
    let data = 'seriesUID=' + seriesUID + '&objectUID=' + objectUID + '&studyUID=' + studyUID + '&requestType=WADO';
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEBUG_CURL) {
      let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
      console.log('doGet: ' + curl);
    }
    let options = {
      headers: headers,
      method: 'post',
      responseType: 'blob'
    };
    return this.httpClient.post(post_url, data, options);
  }
  /**
   * Requests an Access token from the API server, Using the guest settings (Viewer never has the users name & password).
   *
   * @returns {Observable<any>}
   */
  getNewGuestServerAccessToken() {
    console.log('MHL getNewGuestServerAccessToken');
    let post_url = this.API_SERVER_URL + '/nbia-api/oauth/token';
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let data = 'username=' + _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEFAULT_USER + '&password=' + _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEFAULT_PASSWORD + '&client_id=' + _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEFAULT_CLIENT_ID + '=' + _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEFAULT_SECRET + '&grant_type=password';
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEBUG_CURL) {
      let curl = 'curl -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
      console.log('getNewGuestServerAccessToken: ' + curl);
    }
    let options = {
      headers: headers,
      method: 'post'
    };
    return this.httpClient.post(post_url, data, options);
  }
  /**
   *
   * @param t
   */
  initToken() {
    // Get access token
    let tokens = this.route.snapshot.queryParams['accessToken'];
    if (tokens !== undefined) {
      tokens = tokens.split(':');
      this.token = tokens[0];
      this.refreshToken = tokens[1];
      this.expiresIn = tokens[2];
      this.startRefreshTokenCycle();
      //  this.setToken( this.token );
      /*               this.accessTokenService.setRefreshToken( this.refreshToken );
                     this.accessTokenService.setExpiresIn( this.expiresIn );
                                 this.accessTokenService.startRefreshTokenCycle();
      */
    }
    /*
            if( this.route.snapshot.queryParams['token'] !== undefined ){
                this.setToken( this.route.snapshot.queryParams['token'] );
                console.log( 'MHL Using URL token: ', this.token );
            }else if( this.route.snapshot.queryParams['token'] !== undefined ){
                this.setToken( this.route.snapshot.queryParams['token'] );
                console.log( 'MHL Using Cookie token: ', this.token );
            }else{
                // Put login here
                console.log( 'MHL Using NO TOKEN' );
            }
    */
  }

  startRefreshTokenCycle() {
    let tempCounter = 0;
    if (!this.tokenRefreshCycleRunning) {
      //   console.log('MHL startRefreshTokenCycle');
      this.tokenRefreshCycleRunning = true;
      let cycleTimeSeconds = this.expiresIn - _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.TOKEN_REFRESH_TIME_MARGIN;
      setInterval(() => {
        //  console.log('MHL refresh[' + cycleTimeSeconds + ']: ' + new Date() + '  ' + tempCounter++);
        this.getAccessTokenWithRefresh(this.getRefreshToken());
      }, this.getExpiresIn() * 1000);
    }
  }
  /**
   * Gets an Access token from the server using a refresh token
   * @param user
   * @param password
   */
  getAccessTokenWithRefresh(refreshToken) {
    let post_url = this.API_SERVER_URL + '/nbia-api/oauth/token';
    let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let data = 'client_id=' + _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEFAULT_CLIENT_ID + '&client_secret=' + _assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEFAULT_SECRET + '&grant_type=refresh_token&refresh_token=' + refreshToken;
    if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.DEBUG_CURL) {
      let curl = 'curl  -v -d  \'' + data + '\' ' + ' -X POST -k \'' + post_url + '\'';
      console.log('getAccessToken: ' + curl);
    }
    let options = {
      headers: headers,
      method: 'post'
    };
    this.httpClient.post(post_url, data, options).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.timeout)(_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.HTTP_TIMEOUT)).subscribe(accessTokenData => {
      this.setToken(accessTokenData['access_token']);
      this.setRefreshToken(accessTokenData['refresh_token']);
      this.setExpiresIn(accessTokenData['expires_in']);
      // If the token was passed to us in the URL, we need to update that URL when the token changes (so refreshing the page won't keep prompting for login).
      if (_assets_properties__WEBPACK_IMPORTED_MODULE_1__.Properties.HAVE_URL_TOKEN) {
        this.appendAQueryParam(this.getToken() + ':' + this.getRefreshToken() + ':' + this.getExpiresIn());
      }
    }, err => {
      console.error('Get new token with refresh token error: ', err);
      // @FIXME Inform user
    });
  }
  /**
   * Updates the URL at the top of the browser with a new token string.
   *
   * @param tokenString Access token: refresh token: token life span in seconds
   */
  appendAQueryParam(tokenString) {
    let urlTree = this.router.createUrlTree([], {
      queryParams: {
        accessToken: tokenString
      },
      queryParamsHandling: "merge",
      preserveFragment: true
    });
    this.router.navigateByUrl(urlTree);
  }
  setToken(t) {
    this.token = t;
  }
  getToken() {
    return this.token;
  }
  setRefreshToken(token) {
    this.refreshToken = token;
  }
  getRefreshToken() {
    return this.refreshToken;
  }
  setExpiresIn(expIn) {
    this.expiresIn = expIn;
  }
  getExpiresIn() {
    return this.expiresIn;
  }
  static #_ = this.ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClient
  }, {
    type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__.DomSanitizer
  }, {
    type: _util_service__WEBPACK_IMPORTED_MODULE_2__.UtilService
  }, {
    type: _common_service__WEBPACK_IMPORTED_MODULE_3__.CommonService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_8__.ActivatedRoute
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_8__.Router
  }];
};
ServerAccessService = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Injectable)({
  providedIn: 'root'
})], ServerAccessService);


/***/ }),

/***/ 9193:
/*!******************************************!*\
  !*** ./src/app/services/util.service.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UtilService: () => (/* binding */ UtilService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let UtilService = class UtilService {
  constructor() {}
  isNullOrUndefined(val) {
    let res = false;
    if (val == null) {
      res = true;
    }
    if (val === null) {
      res = true;
    }
    if (typeof val === 'undefined') {
      res = true;
    }
    return res;
  }
  /**
   * A number or a boolean will return Empty (true)
   * @param obj
   * @returns {boolean}
   */
  isEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
  isNullOrUndefinedOrEmpty(val) {
    if (this.isNullOrUndefined(val)) {
      return true;
    }
    return this.isEmpty(val);
  }
  isTrue(value) {
    if (this.isNullOrUndefined(value)) {
      return false;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    let val = '' + value.toUpperCase();
    return val === 'TRUE' || val === 'YES' || val === 'ON' || val === '1';
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  static #_ = this.ctorParameters = () => [];
};
UtilService = __decorate([(0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.Injectable)({
  providedIn: 'root'
})], UtilService);


/***/ }),

/***/ 5100:
/*!**********************************!*\
  !*** ./src/assets/properties.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Properties: () => (/* binding */ Properties)
/* harmony export */ });
let Properties = {
  // 06_NOV_2020
  // VERSION: '1.0.67',
  // 15_MAY_2021
  VERSION: '1.0.67c',
  TITLE: 'Image Viewer',
  VIEWER_COLUMNS_DEFAULT: 5,
  COOKIE_NAME: 'NBIA_data',
  WAIT_TIME: 50,
  DEBUG_CURL: true,
  DEBUG: false,
  LOAD_ALL: 0,
  LOAD_ONE_PAGE: 1,
  LOAD_ONE_IMAGE: 2,
  IMAGE_LOAD_MODE: 1,
  DEFAULT_USER: 'nbia_guest',
  DEFAULT_PASSWORD: 'test',
  DEFAULT_SECRET: '',
  DEFAULT_CLIENT_ID: 'nbia-stage',
  // This is a flag that is set to true by the ConfigurationService when all the configuration file settings have been set.
  // It used to determine if it is okay to start using the configured settings yet.
  CONFIG_COMPLETE: false,
  // The "CONFIG_FILE" is within the /assets directory
  CONFIG_FILE: 'configuration',
  HTTP_TIMEOUT: 120000,
  HAVE_URL_TOKEN: true,
  /*  How many numbered page buttons between the arrow buttons  */
  MAX_PAGER_BUTTONS: 6,
  IMAGES_PER_PAGE_CHOICE_DEFAULT: 200,
  // How many seconds before token end of life to refresh the token
  TOKEN_REFRESH_TIME_MARGIN: 60
};

/***/ }),

/***/ 553:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
  production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

/***/ }),

/***/ 4913:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ 4737);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 8629);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 553);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
  (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
(0,_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_3__.platformBrowserDynamic)().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.log(err));

/***/ }),

/***/ 9595:
/*!***********************************************!*\
  !*** ./src/app/app.component.scss?ngResource ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 2487);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ 1386);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 9652:
/*!*********************************************************!*\
  !*** ./src/app/footer/footer.component.scss?ngResource ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 2487);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 1386);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.footer-div {
  padding: 0;
  margin-top: 3px;
  height: 38px;
}

.per-page-span {
  margin-top: 3px;
}

.pager-span {
  float: right;
}

.footer-row {
  padding: 0;
  margin: 0;
}`, "",{"version":3,"sources":["webpack://./src/app/footer/footer.component.scss"],"names":[],"mappings":"AAEA;EACI,UAAA;EACA,eAAA;EACA,YAAA;AADJ;;AAKA;EACI,eAAA;AAFJ;;AAMA;EACI,YAAA;AAHJ;;AAOA;EACI,UAAA;EACA,SAAA;AAJJ","sourcesContent":["$footer_height: 38;\n\n.footer-div{\n    padding: 0;\n    margin-top: 3px;\n    height: 0px + $footer_height;\n}\n\n\n.per-page-span{\n    margin-top: 3px;\n}\n\n\n.pager-span{\n    float:right;\n\n}\n\n.footer-row{\n    padding: 0;\n    margin: 0;\n}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 5677:
/*!***************************************************************************!*\
  !*** ./src/app/images-per-page/images-per-page.component.scss?ngResource ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 2487);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 1386);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.number-spinner {
  color: #6b6b6b;
  background-color: #ffffff;
  padding-left: 10px;
  margin-top: 3px;
  height: 24px;
  width: 60px;
}

.images-per-page-span {
  color: #6b6b6b;
  background-color: #ffffff;
  border: solid #8c8c8c 1px;
  border-radius: 4px;
  padding: 7px 7px 8px;
  margin-top: 0;
  height: 44px;
  font-size: 12pt;
  font-style: normal;
  font-weight: normal;
}`, "",{"version":3,"sources":["webpack://./src/app/images-per-page/images-per-page.component.scss","webpack://./src/app/app.component.scss"],"names":[],"mappings":"AAEA;EACI,cCWgB;EDVhB,yBCSgB;EDPhB,kBAAA;EACA,eAAA;EACA,YAAA;EACA,WAAA;AAFJ;;AAKA;EACI,cCCgB;EDAhB,yBCDgB;EDEhB,yBAAA;EACA,kBAAA;EAEA,oBAAA;EACA,aAAA;EACA,YAAA;EAEA,eAAA;EACA,kBAAA;EACA,mBAAA;AAJJ","sourcesContent":["@import '../app.component.scss';\n\n.number-spinner{\n    color: $button_foreground;\n    background-color: $button_background;\n\n    padding-left: 10px;\n    margin-top: 3px;\n    height: 24px;\n    width: 60px;\n}\n\n.images-per-page-span{\n    color: $button_foreground;\n    background-color: $button_background;\n    border: solid #8c8c8c 1px;\n    border-radius: 4px;\n\n    padding: 7px 7px 8px;\n    margin-top: 0;\n    height: 44px;\n\n    font-size: 12pt;\n    font-style: normal;\n    font-weight: normal;\n}\n","\n$image_frame_margin: 4;\n$outer_margin: 7;\n$border_thickness: 2;\n\n$image_number_left: 2;\n$image_number_top: 2;\n$image_number_font_size: 18;\n\n$disabled_button_background: #aaaaaa;\n$hover_button_background: #286090;\n\n$page_number_background: #ddd;\n$button_background: #ffffff;\n$button_foreground: #6b6b6b;\n$button_background_hover: #e6e6e6;\n\n$image_border: #286090;\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 1514:
/*!***************************************************************************************!*\
  !*** ./src/app/nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.scss?ngResource ***!
  \***************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 2487);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 1386);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.heading-cell {
  height: 48px;
}

/* Series Description, Image count, and Zoom buttons. */
.heading-label {
  color: #6b6b6b;
  background-color: #ffffff;
  border: solid #6b6b6b 1px;
  border-radius: 5px;
  padding: 4px 8px 4px 8px;
  margin-top: 10px;
  font-size: 16pt;
}

.loading-label {
  color: #fff;
  background-color: #337ab7;
  border: solid #337ab7 1px;
  border-radius: 5px;
  padding: 4px 8px 4px 8px;
  margin-top: 10px;
  font-size: 16pt;
}

.busy {
  cursor: progress;
}

.image-grid-row {
  margin-left: 1px;
  width: 100%;
}

.image-grid {
  padding-top: 2px;
  overflow-y: scroll;
}

.grid-button-icon {
  height: 24px;
}

.zoom-button {
  color: #6b6b6b;
  background-color: #ffffff;
  border: solid #6b6b6b 1px;
  border-radius: 5px;
  margin-top: -7px;
  margin-left: 2px;
  margin-right: 2px;
  height: 37px;
}

.zoom-button:disabled {
  background-color: #aaaaaa;
}

.zoom-button[disabled]:hover {
  background-color: #aaaaaa;
}

.zoom-button:hover {
  background-color: #6b6b6b;
}

.plus-minus {
  float: right;
}

.clicker {
  cursor: pointer;
}

.parent-image-div {
  border: #286090 solid 2px;
  border-radius: 4px;
  box-shadow: 0 0 2px 2px rgba(40, 96, 144, 0.3);
  padding: 4px;
}

.topImage {
  padding: 0;
  margin-bottom: 14px;
}

.parentImageMouseOver {
  cursor: pointer;
}

.image {
  max-height: 100%;
  max-width: 100%;
  top: 4px;
  left: 4px;
}

.image-mouseover {
  z-index: 0;
  margin-left: 9px;
  margin-top: 6px;
  height: calc(100% - 12px);
  position: absolute;
  top: 0;
}

.open-image-img {
  z-index: 2;
  opacity: 0.75;
}

.image-number-span {
  z-index: 0;
  margin-left: 14px;
  width: 100%;
  position: absolute;
  top: 2px;
  left: 0px;
}

.image-numberMouseOver {
  z-index: 3;
  opacity: 1;
  font-weight: 900;
}

.image-number {
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  margin-left: 2px;
  cursor: default;
  font-size: 18pt;
  font-weight: 900;
}

.hide-element {
  display: none;
}

.col-nbia-1 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 100%;
  float: left;
}

.col-nbia-2 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 50%;
  float: left;
}

.col-nbia-3 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 33.3333333333%;
  float: left;
}

.col-nbia-4 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 25%;
  float: left;
}

.col-nbia-5 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 20%;
  float: left;
}

.col-nbia-6 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 16.6666666667%;
  float: left;
}

.col-nbia-7 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 14.2857142857%;
  float: left;
}

.col-nbia-8 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 12.5%;
  float: left;
}

.col-nbia-9 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 11.1111111111%;
  float: left;
}

.col-nbia-10 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 10%;
  float: left;
}

.col-nbia-11 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 9.0909090909%;
  float: left;
}

.col-nbia-12 {
  padding-right: 7px;
  padding-left: 7px;
  min-height: 1px;
  position: relative;
  width: 8.3333333333%;
  float: left;
}`, "",{"version":3,"sources":["webpack://./src/app/nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.scss","webpack://./src/app/app.component.scss"],"names":[],"mappings":"AAEA;EACI,YAAA;AADJ;;AAIA,uDAAA;AACA;EACI,cCMgB;EDLhB,yBCIgB;EDHhB,yBAAA;EACA,kBAAA;EACA,wBAAA;EACA,gBAAA;EACA,eAAA;AADJ;;AAGA;EACI,WAAA;EACA,yBAAA;EACA,yBAAA;EACA,kBAAA;EACA,wBAAA;EACA,gBAAA;EACA,eAAA;AAAJ;;AAEA;EACI,gBAAA;AACJ;;AAEA;EACI,gBAAA;EACA,WAAA;AACJ;;AAEA;EACI,gBAAA;EACA,kBAAA;AACJ;;AAEA;EACI,YAAA;AACJ;;AAEA;EACI,cC9BgB;ED+BhB,yBChCgB;EDiChB,yBAAA;EACA,kBAAA;EACA,gBAAA;EACA,gBAAA;EACA,iBAAA;EACA,YAAA;AACJ;;AAEA;EACI,yBC9CyB;AD+C7B;;AAEA;EACI,yBClDyB;ADmD7B;;AAEA;EACI,yBCjDgB;ADkDpB;;AAEA;EACI,YAAA;AACJ;;AAEA;EACI,eAAA;AACJ;;AAEA;EACI,yBAAA;EACA,kBAAA;EACA,8CAAA;EACA,YAAA;AACJ;;AAGA;EACI,UAAA;EACA,mBAAA;AAAJ;;AAGA;EACI,eAAA;AAAJ;;AAGA;EACI,gBAAA;EACA,eAAA;EACA,QAAA;EACA,SAAA;AAAJ;;AAGA;EACI,UAAA;EACA,gBAAA;EACA,eAAA;EACA,yBAAA;EACA,kBAAA;EACA,MAAA;AAAJ;;AAGA;EACI,UAAA;EACA,aAAA;AAAJ;;AAGA;EACI,UAAA;EACA,iBAAA;EACA,WAAA;EACA,kBAAA;EACA,QAAA;EACA,SAAA;AAAJ;;AAGA;EACI,UAAA;EACA,UAAA;EACA,gBAAA;AAAJ;;AAGA;EACI,8BAAA;EACA,8BAAA;EACA,gCAAA;EACA,gBAAA;EACA,eAAA;EACA,eAAA;EACA,gBAAA;AAAJ;;AAGA;EACI,aAAA;AAAJ;;AAcA;EARI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,WAAA;EACA,WAAA;AAFJ;;AASA;EAZI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;AAOJ;;AAIA;EAhBI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,qBAAA;EACA,WAAA;AAgBJ;;AADA;EApBI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;AAyBJ;;AANA;EAxBI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;AAkCJ;;AAXA;EA5BI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,qBAAA;EACA,WAAA;AA2CJ;;AAhBA;EAhCI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,qBAAA;EACA,WAAA;AAoDJ;;AArBA;EApCI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,YAAA;EACA,WAAA;AA6DJ;;AA1BA;EAxCI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,qBAAA;EACA,WAAA;AAsEJ;;AA/BA;EA5CI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;AA+EJ;;AApCA;EAhDI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,oBAAA;EACA,WAAA;AAwFJ;;AAzCA;EApDI,kBAAA;EACA,iBAAA;EACA,eAAA;EACA,kBAAA;EACA,oBAAA;EACA,WAAA;AAiGJ","sourcesContent":["@import '../app.component.scss';\n\n.heading-cell {\n    height: 48px;\n}\n\n/* Series Description, Image count, and Zoom buttons. */\n.heading-label {\n    color: $button_foreground;\n    background-color: $button_background;\n    border: solid  $button_foreground 1px;\n    border-radius: 5px;\n    padding: 4px 8px 4px 8px;\n    margin-top: 10px;\n    font-size: 16pt;\n}\n.loading-label {\n    color: #fff;\n    background-color: #337ab7;\n    border: solid  #337ab7 1px;\n    border-radius: 5px;\n    padding: 4px 8px 4px 8px;\n    margin-top: 10px;\n    font-size: 16pt;\n}\n.busy{\n    cursor: progress;\n}\n\n.image-grid-row {\n    margin-left: 1px;\n    width: 100%;\n}\n\n.image-grid {\n    padding-top: 2px;\n    overflow-y: scroll;\n}\n\n.grid-button-icon {\n    height: 24px;\n}\n\n.zoom-button {\n    color: $button_foreground;\n    background-color: $button_background;\n    border: solid  $button_foreground 1px;\n    border-radius: 5px;\n    margin-top: -7px;\n    margin-left: 2px;\n    margin-right: 2px;\n    height: 37px;\n}\n\n.zoom-button:disabled {\n    background-color: $disabled_button_background;\n}\n\n.zoom-button[disabled]:hover {\n    background-color: $disabled_button_background;\n}\n\n.zoom-button:hover {\n    background-color: $button_foreground;\n}\n\n.plus-minus {\n    float: right;\n}\n\n.clicker {\n    cursor: pointer;\n}\n\n.parent-image-div {\n    border: $image_border solid (0px + $border_thickness);\n    border-radius: 4px;\n    box-shadow: 0 0 2px 2px rgba(40, 96, 144, 0.3);\n    padding: 0px + $image_frame_margin;\n}\n\n// So the horizontal margins match the vertical ( which is set in @mixin category )\n.topImage {\n    padding: 0;\n    margin-bottom: 2px * $outer_margin;\n}\n\n.parentImageMouseOver {\n    cursor: pointer;\n}\n\n.image {\n    max-height: 100%;\n    max-width: 100%;\n    top: 0px + $image_frame_margin;\n    left: 0px + $image_frame_margin;\n}\n\n.image-mouseover {\n    z-index: 0;\n    margin-left: 0px + $outer_margin  +  $border_thickness;\n    margin-top: 0px +  $image_frame_margin  + $border_thickness;\n    height: calc(100% - #{ (0px + ( (2 * $border_thickness) + (2 * $image_frame_margin )) ) });\n    position: absolute;\n    top: 0;\n}\n\n.open-image-img {\n    z-index: 2;\n    opacity: 0.75;\n}\n\n.image-number-span {\n    z-index: 0;\n    margin-left: 10px + $image_frame_margin;\n    width: 100%;\n    position: absolute;\n    top: 0px + $image_number_top;\n    left: 0px;\n}\n\n.image-numberMouseOver {\n    z-index: 3;\n    opacity: 1;\n    font-weight: 900;\n}\n\n.image-number {\n    -webkit-text-fill-color: white;\n    -webkit-text-stroke-width: 1px;\n    -webkit-text-stroke-color: black;\n    margin-left: 0px + $image_number_left;\n    cursor: default;\n    font-size: 0pt + $image_number_font_size;\n    font-weight: 900;\n}\n\n.hide-element {\n    display: none;\n}\n\n// =================================================================\n\n@mixin category( $numberOfColumns ) {\n    padding-right: 0px + $outer_margin;\n    padding-left: 0px + $outer_margin;\n    min-height: 1px;\n    position: relative;\n    width: 100% / $numberOfColumns;\n    float: left;\n}\n\n.col-nbia-1 {\n    @include category(1);\n}\n\n.col-nbia-2 {\n    @include category(2);\n}\n\n.col-nbia-3 {\n    @include category(3);\n}\n\n.col-nbia-4 {\n    @include category(4);\n}\n\n.col-nbia-5 {\n    @include category(5);\n}\n\n.col-nbia-6 {\n    @include category(6);\n}\n\n.col-nbia-7 {\n    @include category(7);\n}\n\n.col-nbia-8 {\n    @include category(8);\n}\n\n.col-nbia-9 {\n    @include category(9);\n}\n\n.col-nbia-10 {\n    @include category(10);\n}\n\n.col-nbia-11 {\n    @include category(11);\n}\n\n.col-nbia-12 {\n    @include category(12);\n}\n","\n$image_frame_margin: 4;\n$outer_margin: 7;\n$border_thickness: 2;\n\n$image_number_left: 2;\n$image_number_top: 2;\n$image_number_font_size: 18;\n\n$disabled_button_background: #aaaaaa;\n$hover_button_background: #286090;\n\n$page_number_background: #ddd;\n$button_background: #ffffff;\n$button_foreground: #6b6b6b;\n$button_background_hover: #e6e6e6;\n\n$image_border: #286090;\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 7148:
/*!*******************************************************!*\
  !*** ./src/app/pager/pager.component.scss?ngResource ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 2487);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 1386);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.pager-font {
  font-size: 12pt;
}

.pager-button {
  color: #6b6b6b;
  background-color: #ffffff;
  border: solid #8c8c8c 1px;
}

.pager-number {
  color: #6b6b6b;
  background-color: #ddd;
  cursor: default;
  border: solid #8c8c8c 1px;
}

.pager-button:hover {
  background-color: #e6e6e6;
}

.pager-parent-div {
  padding: 2px;
  margin: 0;
  margin-top: -2px;
  border-radius: 5px;
}

.selected:hover, .selected {
  background-color: #6b6b6b;
  color: #ffffff;
}

.hide-button {
  display: none;
}`, "",{"version":3,"sources":["webpack://./src/app/pager/pager.component.scss","webpack://./src/app/app.component.scss"],"names":[],"mappings":"AAEA;EACI,eAAA;AADJ;;AAIA;EACI,cCOgB;EDNhB,yBCKgB;EDJhB,yBAAA;AADJ;;AAKA;EACI,cAAA;EACA,sBCHqB;EDIrB,eAAA;EACA,yBAAA;AAFJ;;AAMA;EAEI,yBCRsB;ADI1B;;AAOA;EACI,YAAA;EACA,SAAA;EACA,gBAAA;EACA,kBAAA;AAJJ;;AAOA;EACI,yBCpBgB;EDqBhB,cCtBgB;ADkBpB;;AAQA;EACI,aAAA;AALJ","sourcesContent":["@import '../app.component.scss';\n\n.pager-font {\n    font-size: 12pt;\n}\n\n.pager-button {\n    color: $button_foreground;\n    background-color: $button_background;\n    border: solid #8c8c8c 1px;\n\n}\n\n.pager-number {\n    color: $button_foreground;\n    background-color: $page_number_background;\n    cursor: default;\n    border: solid #8c8c8c 1px;\n\n}\n\n.pager-button:hover {\n    //   color: $button_background;\n    background-color: $button_background_hover;\n}\n\n.pager-parent-div {\n    padding: 2px;\n    margin: 0;\n    margin-top: -2px;\n    border-radius: 5px;\n}\n\n.selected:hover, .selected {\n    background-color: $button_foreground;\n    color: $button_background;\n\n}\n\n.hide-button {\n    display: none;\n}\n\n","\n$image_frame_margin: 4;\n$outer_margin: 7;\n$border_thickness: 2;\n\n$image_number_left: 2;\n$image_number_top: 2;\n$image_number_font_size: 18;\n\n$disabled_button_background: #aaaaaa;\n$hover_button_background: #286090;\n\n$page_number_background: #ddd;\n$button_background: #ffffff;\n$button_foreground: #6b6b6b;\n$button_background_hover: #e6e6e6;\n\n$image_border: #286090;\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 3383:
/*!***********************************************!*\
  !*** ./src/app/app.component.html?ngResource ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = "<router-outlet></router-outlet>\n";

/***/ }),

/***/ 2811:
/*!*********************************************************!*\
  !*** ./src/app/footer/footer.component.html?ngResource ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<!-- ----------  Container for the Pager & the Images per page number input  --------- -->\n\n<div class=\"container-fluid footer-div\">\n    <span class=\"row footer-row\">\n\n        <span class=\"col-md-6\">\n            <span  class=\"pager-span\" >\n                <nbia-pager></nbia-pager>\n            </span>\n        </span>\n\n        <span class=\"col-md-6 per-page-span\">\n            <nbia-images-per-page></nbia-images-per-page>\n        </span>\n    </span>\n\n</div>\n";

/***/ }),

/***/ 8098:
/*!***************************************************************************!*\
  !*** ./src/app/images-per-page/images-per-page.component.html?ngResource ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<!-- ---------- Images Per Page  number input used in the Footer.  ---------- -->\n\n<span\n        class=\"images-per-page-span\"\n>\n    Images per page:&nbsp;&nbsp;\n    <input\n            type=\"number\"\n            class=\"number-spinner\"\n            min=\"1\"\n            [ngClass]=\"{\n                'busy': ! haveData\n            }\"\n            [(ngModel)]=\"imagesPerPage\"\n            (change)=\"onChangeMinimumMatchedStudies()\"\n    >\n</span>\n\n\n";

/***/ }),

/***/ 1096:
/*!***************************************************************************************!*\
  !*** ./src/app/nbia-thumbnail-viewer/nbia-thumbnail-viewer.component.html?ngResource ***!
  \***************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<!-- ----------  The scrolling grid of images  ---------- -->\n\n\n<!-- -----  Error display.  TODO need useful user friendly messages here.  ----- -->\n<h2 *ngIf=\"haveError\">\n    <div *ngIf=\"errorMessage0.length > 0 \" class=\"label label-danger\">\n        {{errorMessage0}}\n        <br>\n    </div>\n    <div *ngIf=\"errorMessage1.length > 0 \" class=\"label label-danger\">\n        {{errorMessage1}}\n        <br>\n    </div>\n    <div *ngIf=\"errorMessage2.length > 0 \" class=\"label label-danger\">\n        {{errorMessage2}}\n    </div>\n</h2>\n\n\n<!-- -----  Heading row with Series Description, Image count, Plus and Minus button.  ----- -->\n<div *ngIf=\"! haveError\" class=\"container-fluid\"\n     [ngClass]=\"{\n                  'busy': ! haveData\n                  }\"\n>\n\n    <div class=\"row\">\n\n        <div class=\"panel-heading col-md-8  heading-cell\"\n             [ngClass]=\"{\n             'busy': ! haveData\n         }\"\n        >\n            <span\n                *ngIf=\"( description.length > 0) && haveData\"\n                class=\"heading-label\"\n                [ngClass]=\"{\n                    'busy': ! haveData\n                }\"\n\n            >\n                {{description}}\n            </span>\n\n<!--\n\n            <span class=\"heading-label\">\n                <label for=\"r0\">&nbsp;All&nbsp;</label>\n                <input type=\"radio\" name=\"imageLoadPick\" id=\"r0\" (click)=\"onRadioClick(0)\">\n                <label for=\"r1\">&nbsp;&nbsp;One page&nbsp;</label>\n                <input type=\"radio\" name=\"imageLoadPick\" id=\"r1\" (click)=\"onRadioClick(1)\">\n                <label for=\"r2\">&nbsp;&nbsp;One image&nbsp;</label>\n                <input type=\"radio\" name=\"imageLoadPick\" id=\"r2\" (click)=\"onRadioClick(2)\">\n                &nbsp;{{properties.IMAGE_LOAD_MODE}}\n            </span>\n\n-->\n\n            <span\n                *ngIf=\"! haveData\"\n                class=\"loading-label\"\n            >\n                Loading Images\n            </span>\n        </div>\n\n        <!-- Image count -->\n        <span class=\"panel-heading heading-cell col-md-2\">\n            <span class=\"heading-label\">\n                Images: {{commonService.getImageCount()}}\n            </span>\n        </span>\n\n\n        <!-- Plus & Minus buttons -->\n        <div class=\"panel-heading col-md-2 heading-cell\">\n            <span class=\"plus-minus\">\n\n                <button\n                    (mouseover)=\"onZoomOutMouseOver()\"\n                    (mouseout)=\"onZoomOutMouseOut()\"\n                    class=\"btn btn-default zoom-button\"\n                    [disabled]=\"columns >= currentMaxColumns\"\n                    (click)=\"onMinusClick()\"\n                >\n                    <img [src]=\"zoomOutImgSrc\" class=\"grid-button-icon\"/>\n                </button>\n\n                <button\n                    (mouseover)=\"onZoomInMouseOver()\"\n                    (mouseout)=\"onZoomInMouseOut()\"\n                    class=\"btn btn-default zoom-button\"\n                    [disabled]=\"columns < 2\"\n                    (click)=\"onPlusClick()\"\n                >\n                    <img [src]=\"zoomInImgSrc\" class=\"grid-button-icon\"/>\n\n                </button>\n            </span>\n        </div>\n    </div>\n</div>\n\n\n<!-- -----  Scrolling grid of images  ----- -->\n<div *ngIf=\"! haveError\" class=\"container-fluid image-grid\"\n     [style.height]=\"innerHeight\"\n>\n\n    <!-- -----  Images  ----- -->\n    <div class=\"row image-grid-row\"\n         [ngClass]=\"{\n             'busy': ! haveData\n         }\"\n    >\n        <!-- Loop through images for just this page. -->\n        <span\n            *ngFor=\"let image of images.slice(firstImage, firstImage + imagesPerPage); let i=index\"\n            class=\"topImage\"\n            [ngClass]=\"{\n                  'col-nbia-1': columns === 1,\n                  'col-nbia-2': columns === 2,\n                  'col-nbia-3': columns === 3,\n                  'col-nbia-4': columns === 4,\n                  'col-nbia-5': columns === 5,\n                  'col-nbia-6': columns === 6,\n                  'col-nbia-7': columns === 7,\n                  'col-nbia-8': columns === 8,\n                  'col-nbia-9': columns === 9,\n                  'col-nbia-10': columns === 10,\n                  'col-nbia-11': columns === 11,\n                  'col-nbia-12': columns === 12,\n                  'busy': ! haveData\n             }\"\n        >\n\n            <div class=\"parent-image-div\"\n                 [ngClass]=\"{\n                    'parentImageMouseOver': mouseOver[i + firstImage],\n                    'busy': ! haveData\n                }\"\n                 (mouseover)=\"onMouseOver(i + firstImage)\"\n                 (mouseleave)=\"onMouseOut(i  + firstImage)\"\n                 (mouseout)=\"onMouseOut(i + firstImage)\"\n                 (click)=\"onOpenImageClick(i + firstImage)\"\n            >\n\n                    <!-- The Image -->\n                    <img\n                        class=\"image \"\n                        [ngClass]=\"{\n                            'image-mouseover': mouseOver[i + firstImage],\n                            'busy': ! haveData\n                        }\"\n                        [src]=image.thumbnailImage\n                    >\n\n                    <span class=\"image-number-span\">\n                        <span\n                            class=\"image-number\"\n                            [ngClass]=\"{\n                                    'image-numberMouseOver': mouseOver[i + firstImage],\n                                    'busy': ! haveData\n                            }\"\n                        >\n\n                            <span *ngIf=\"properties.IMAGE_LOAD_MODE === properties.LOAD_ALL && haveData\">\n                                {{i + 1  + firstImage}}\n                            </span>\n                            <span *ngIf=\"properties.IMAGE_LOAD_MODE !== properties.LOAD_ALL && haveData\">\n                                {{i + 1 + currentPage * imagesPerPage}}\n                            </span>\n                        </span>\n                    </span>\n\n\n                <!-- The transparent \"Open Image\" Image -->\n                    <img\n                        [ngClass]=\"{\n                            'hide-element':! mouseOver[i + firstImage],\n                            'busy': ! haveData\n                        }\"\n                        class=\"image open-image-img\"\n                        src=\"assets/images/open_image_02.png\"\n                    >\n            </div>\n        </span>\n    </div>\n</div>\n<div *ngIf=\"! haveError\">\n    <nbia-footer\n            [ngClass]=\"{\n                    'busy': ! haveData\n                }\"\n    ></nbia-footer>\n</div>\n";

/***/ }),

/***/ 8954:
/*!*******************************************************!*\
  !*** ./src/app/pager/pager.component.html?ngResource ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<!-- ----------  The page changer used by Search results & Cart screen.  ---------- -->\n\n\n<!-- If more than one, add s for plural. -->\n{{pageCount}} Page<span *ngIf=\"pageCount > 1\">s</span> &nbsp;\n<div\n        class=\"btn-group pager-parent-div\"\n        [ngClass]=\"{\n            'busy': ! haveData\n        }\"\n        role=\"group\" aria-label=\"...\">\n\n    <!-- Go to first page -->\n    <button\n            [disabled]=\" currentPage === 0 \"\n            type=\"button\"\n            class=\"btn btn-default  pager-font pager-button \"\n            [ngClass]=\"{\n            'busy': ! haveData\n        }\"\n            title=\"First\"\n            (click)=\"onGoFirstClickClick()\"\n    >\n        <span>&lt;&lt;</span>\n    </button>\n\n\n    <!-- Go to previous page -->\n    <button\n            [disabled]=\" currentPage === 0 \"\n            type=\"button\"\n            class=\"btn btn-default  pager-font pager-button\"\n            [ngClass]=\"{\n                'busy': ! haveData\n            }\"\n            title=\"Previous\"\n            (click)=\"onGoPreviousClick()\"\n    >\n        <span>&lt;</span>\n    </button>\n\n\n    <!-- Go to a specific page -->\n    <button\n            *ngFor=\"let i of buttons\"\n            type=\"button\"\n            class=\"btn btn-default  pager-font pager-button\"\n            [ngClass]=\"{\n                'selected': currentPage == i,\n                'hide-button':( (i < buttonShowOffset) || (i - buttonShowOffset >=  maxButtonsToShow) ),\n                       'busy': ! haveData\n            }\"\n            (click)=\"onClick(i)\"\n    >\n        {{i + 1}}\n    </button>\n\n    <!-- Display page number -->\n    <!--\n        <span\n            class=\"btn btn-default  pager-font pager-number\"\n        >\n            {{currentPage + 1}}\n        </span>\n    -->\n\n\n    <!-- Go to next page -->\n    <button\n            [disabled]=\" currentPage === buttons.length - 1 \"\n            type=\"button\"\n            class=\"btn btn-default  pager-font  pager-button\"\n            [ngClass]=\"{\n                'busy': ! haveData\n            }\"\n            title=\"Next\"\n            (click)=\"onGoNextClick()\"\n    >\n        <span>&gt;</span>\n    </button>\n\n\n    <!-- Go to last page -->\n    <button\n            [disabled]=\" currentPage === buttons.length - 1 \"\n\n            type=\"button\"\n            class=\"btn btn-default  pager-font pager-button\"\n            [ngClass]=\"{\n                'busy': ! haveData\n            }\"\n            title=\"Last\"\n            (click)=\"onGoLastClick()\"\n    >\n        <span>&gt;&gt;</span>\n    </button>\n\n</div>\n";

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4913)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.c8d88a33d095a33a.js.map