# nbia-admin

## TODO
- [ ] Checkbox don't clear the query at top
- [ ] Update pager when query changes (it changes if you click it) NOW I can't reproduce. Revisit.
  
- [ ] Calendar unchecking apply did not remove from display query - check on searching query
- [ ] Calendar clear does not clear apply checkbox
- [ ] Calendar Clear puts in today & yesterday, but does not enable Apply
- [ ] Calendar top collapsed date
- [ ] Calendar Top clear does not clear apply checkbox  
- [ ] Calendar allow only one when there are two inputs
- [X] Clean up grey at the top left  
- [X] Number Inputs
- [X] Unchecking apply check boxes does not remove the criteria from the query
- [X] Fix AND in Search Display query
- [X] A switch to show api query instead of Display Query
- [X] Radio Ignore
- [X] Master clear does not work on single line radio buttons
- [X] A little more space horizontally for lists - update the truncating pipe
- [X] Calendar prompt, if too long can cause wrap

- [ ] Persist Page length choice


- [X] Make Cine Mode text selectable
- [ ] Clean up Cine mode scss
- [ ] Disable user inputs while search is running
- [ ] Select all of this page.  Reword to unselect when appropriate
- [ ] Make sure all names (Labels) and IDs use the sequenceNumber
- [ ] Move enum WIDGET_TYPE to its own file
- [ ] Clean up this page, it is displayed on Github website. 
- [ ] Search Error handling
- [ ] Rework reaction to 401
- [ ] Rework reaction to 500 ApiService.getPerformQcSearch

- [X] Display Query Clear button

- [X] Calendar clear
- [X] Radio buttons don't trigger a search
- [X] Calendar if allow only one, do we need "Before" & "After"
- [X] Select All/Select these XX should not have a dropdown if there is only one page of data
- [X] Select All/Just this page
- [X] Move "Getting dicom data" and graphic up to cine mode heading
- [X] Add Dynamic test flags to commit hook .pl
- [X] Consolidate config & properties settings for Dynamic search.  At the bottom of both files.
- [X] Apply checkbox label (for)
- [X] Move Apply checkbox label right
- [X] When logging in update the access token from the URL if there is one. We would only be logging in if that token is bad.
- [X] After User logs in - re-run getAdvancedQCCriteria rest call
- [X] Need default And/Or for required criteria (It's And)
- [X] Show "Wait" screen while search is running
- [X] Fix sequenceNumbers
- [X] Need All/Any included in the query - Can server do this yet? we don't need this (yet)
- [X] Text input clear needs to update query
---
### Add to Dynamic widget:

- Calendar
- [X] In the builder
- [X] In the cleaner
- [X] In the widget
- [ ] changing the date with Apply checked does NOT update
- [ ] Clear does not work right
---
- Single checkbox
- [x] In the builder
- [X] In the cleaner
- [X] In the widget
---
- Single checkbox default
- [X] In the builder
- [X] In the cleaner
- [X] In the widget
---
- Initial height for lists
- [ ] In the builder
- [ ] In the cleaner
- [ ] In the widget
---
- One line, two or three radio buttons
- [X] In the builder
- [X] In the cleaner
- [X] In the widget
---
- One line, two or three radio buttons Include choice in heading when collapsed.
- [X] In the builder
- [X] In the cleaner
- [X] In the widget
---
- Number input
- Can have "apply" checkbox with no text
- [x] In the builder
- [X] In the cleaner
- [x] In the widget
---
- Number input default
- Can have "apply" checkbox with no text
- [X] In the builder
- [X] In the cleaner
- [x] In the widget
---
- Number input limit high
- Can have apply checkbox with no text
- [X] In the builder
- [X] In the cleaner
- [x] In the widget
---
- Number input limit Low
- Can have apply checkbox with no text
- [X] In the builder
- [X] In the cleaner
- [x] In the widget
---
- All / Any
- [X] In the builder
- [X] In the cleaner Default for no choice case
- [X] In the widget
---


## Dynamic query - query building notes

If there were 3 items in the list it would be:
criteriaType3=seriesUID& inputType3=list&value3=DATA
criteriaType4=seriesUID& inputType4=list&value4=DATA
criteriaType5=seriesUID& inputType5=list&value5=DATA
 
So when I went to grab parameter #5 there would be two types, one a list and one a startsWith.  It would be a tangled mess on the server side.  If the client could just send me back the two items I sent it, in the initial example with an incrementing number then I could dynamically write any HQL I wanted without having a care in the world what the client was doing. Completely decoupled. Like sending a program a hook or a callback.
 
1.       criteriaType with the incrementing number, I probably could figure out how to discover it by the subheading, but I want to decouple the view from the logic.
2.       inputType with the number, FYI there are four possible values {list, startsWith, contains, and date}.  It should not matter to you though since you will just parrot back what I send.  Once again it could be figured out, but why not decouple, that way I can change what the user sees without changing code.  I will expect the comma separated values to be sent similar to simple search with each value sent independently, no reason to complicate things.
3.       value remains as is.
4.       boolean with the incrementing number.  This is the boolean the user has chosen.
