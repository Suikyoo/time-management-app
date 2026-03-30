#Todo




- General Styling
## - Modal w/ Day View Component ( on hold per date)
## - Create form needs to be component-ized

- ensure template-task cleanup when deleting one or the other (
    implement it on the logic level, not the database level 
    in order for you to use hooks to sync up not only the database 
    but also the fetched interface data by the application
)


### (I'm satisfied with the program at this point)

- Week View Tab

each cell should be made to be an empty cell then tasks are above them with absolute positioning

--------------------------------------------------
                    view
--------------------------------------------------
           |                view
           |_____________________________________
           |                view
           |_____________________________________
    view   |                view
           |_____________________________________
           |                view
           |_____________________________________
           |                view



## componentize the creation forms for cleaner code #/
## afterwards, create the creatio form for the week view 
## the week view has it's dedicated week_tasks table as well as WeeklyTaskTarget and other counterpart to entities like TaskTarget, Tasks, and TaskTemplate(weekTemplate inherits from this)

## [day]/create must have only duration field after name, description, color as you already have the start time

-----------------
## weekly task template does not work, also it needs to only input duration
## where it is(timestart) is dictated by where the user clicks

## need to create an edit form
