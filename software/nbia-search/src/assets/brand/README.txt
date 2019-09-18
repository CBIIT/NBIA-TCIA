Branding files are in directories within the assets/brand directory. Each subdirectory represents one brand.
Which brand directory that is used is determined by the content of the text file assets/brand/currentBrand, it should contain the name of a directory within assets/brand.
If there is no assets/brand/currentBrand file, or its contents don't point to a valid directory, the default brand "nbia" will be used.
If there are any files missing from the brand directory named in assets/brand/currentBrand, the file from the default directory will be used.
If you only want to change one aspect of a brand, only include that file, the default directory versions will be used for the others.

Branding consists of:
1) logo.png:  A logo (41 pixels high)
2) footer.html: a snippet of html that is at the bottom. If included, %HOST_NAME% will be replaced with the server hostname and %VERSION% will be replaced with the client version number (see #6).
3) newAccountUrl.txt:  Url for "New account" button on login screen.
4) accountHelpUrl.txt:  Url for "Account help" button on login screen.
5) downloaderUrl.txt:  Url for "Get Data Retriever" button in Download popup.
6) versionSuffix.txt:  An optional string which will be appended to the version number, if the version number is included in the footer.
7) customMenu.json:  The top horizontal menu. Look at the default (nbia) for an example.
    It is a JSON array, each top level object represents one top level menu item:
    "entryTitle": The text of the top level menu item.
    "menuData": "target" within "menuData" is the URL of the top level menu item if you don't use a dropdown menu for this top level item.
    "menuDataDropdown": an array of dropdown menu items:
        "menuText": the text for the dropdown menu item.
        "target": the URL for the dropdown menu item.

Example:
[
    {
        "entryTitle": "Home",
        "menuData": {
            "target": "http://www.cancerimagingarchive.net"
        }
    },
    {
        "entryTitle": "News",
        "menuData": {
            "target": "http://www.cancerimagingarchive.net/news/"
        }
    },
    {
        "entryTitle": "About Us",
        "menuDataDropdown": [
            {
                "menuText": "About The Cancer Imaging Archive (TCIA)",
                "target": "http://www.cancerimagingarchive.net/about-the-cancer-imaging-archive-tcia"
            },
            {
                "menuText": "About the Cancer Imaging Program (CIP)",
                "target": "http://www.cancerimagingarchive.net/about-the-cancer-imaging-program-cip/"
            },
            {
                "menuText": "About the University of Arkansas for Medical Sciences (UAMS)",
                "target": "http://www.cancerimagingarchive.net/about-the-university-of-arkansas-for-medical-sciences-uams/"
            }
        ]
    },
...


