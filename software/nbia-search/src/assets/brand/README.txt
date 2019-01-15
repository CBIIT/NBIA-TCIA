Branding files are in directories with in the assets/brand directory. Each subdirectory represents one brand.  Which brand directory that is used, is deterind by the content of the text file  assets/brand/currentBrand, it should contain the name of a dirctory within assets/brand. if there is no  assets/brand/currentBrand file, or it's content s don't point to a valid directory, the default "nbia" will be used.
If there are any files missing from the brand directory named in assets/brand/currentBrand, the file from the default directory will be used.  If you only want to change one aspect of a brand, only include only that file, the default directory versions will be used for the others.

Branding consists of:
1) logo.png:  A logo (41 pixels high)
2) footer.html: a snippit of html that is at the bottom. If included, %VERSION% will be replaced with the client version.
3) customMenu.json:  The top horizontal menu. Look at the default (nbia) for syntax.
4) newAccountUrl.txt:  Url for "New account" button on login screen.
5) accountHelpUrl.txt:  Url for "Account help" button on login screen.
