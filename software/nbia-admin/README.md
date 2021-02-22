# nbia-admin

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4300/`. The app will automatically reload if you change any of the source files.


## TODO
* Make sure all names and IDs use the sequenceNumber
- Add to Dynamic widget:
---
- Calendar
- [X] In the builder
- [X] In the cleaner
- [X] In the widget
- [ ] changing the date with Apply checked does NOT update
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
