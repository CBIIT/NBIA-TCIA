# Nbia

## Wish list for future versions
* Progress bars
* "*Any or All*" functionality for Anatomical Site

## Build
 For production build:
 ng build   --base-href '.'  --output-path nbia-search
 The build artifacts will be stored in the `nbia-search/` directory.  

#### Tomcat deploy
Copy the `nbia-search` directory to Tomcat's `webapps` directory.

## TODO
 #### access tokens
- [ ] Persist refresh token and token lifespan with access token
- [ ] Add Refresh token and token lifespan to url for data-admin
- [ ] Bring up login screen if refresh token does not work
- [ ] ApiServerService.setToken "t" does not have refreshToken or life span if logging in by refreshing the page Line 573

* Color of "And" in Display query
