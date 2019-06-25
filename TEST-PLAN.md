# PUPPETRY TEST PLAN

# General

## G1 Initial state
Start up a clean state *(by closing all projects in Project explorer)*
Prerequisite:
- NPM dependencies are installed

### G1.1 Main menu state
- G1.1.1 `Top`: enabled only File and Settings
- G1.1.2 `File Menu`: enabled only New Project, Open Project, Exit, Git - Clone

### G1.2 App panel
- G1.2.1 `Panel` shows `Welcome page`

### G1.3 Toolbar
- G1.3.1 `Toolbar` has no project title
- G1.3.2 `Toolbar` has resize icon - it is functional
- G1.3.3 `Toolbar` has help icon - it is functional
- G1.3.4 `Toolbar` has close icon - it is functional

### G1.4 Footer
- G1.4.1 `Footer` has copyright info - show the current year
- G1.4.2 `Footer` has author page link - it's functional
- G1.4.3 `Footer` has social icons - they are functional

## G2	Welcome page

- G2.1.1 Click on `demo project` link – opens demo project
- G2.1.2 Click on `Create a new one` link – the same as via main menu



# Project

## P1	Create project
Click `Create a project` in the main menu

### P1.1 Modal window

- P1.1.1 User cannot proceed with empty project location
- P1.1.2 Confirmation when selected directory is not empty
- P1.1.3 User cannot proceed with empty project name
- P1.1.4 User cannot proceed with empty suite name
- P1.1.5 Modal can be closed
- P1.1.6 Available by hotkey `Ctrl-Shift-N`

### P1.2 Main menu state
- P1.2.1 `Top`: all enabled
- P1.2.2 `File/Git Menu`: enabled only `Initialize` and `Clone`

### P1.3 App panel
- P1.3.1 `Panel` shows suite tab, with targets, test cases and options tabs

### P1.4 Toolbar
- P1.4.1 `Toolbar` has project title and edit link

### P1.5 Project Explorer
- P1.5.1 `Project Explorer` is visible, contains the project

## P2 Edit project
Click edit link next to project title in the toolbar

### P2.1 Modal window
- P2.1.1 User cannot proceed with empty project name
- P2.1.2 Project location is shown
- P2.1.3 app data directory is shown
- P2.1.4 click on cancel closes window
- P2.1.5 click on X closes window
- P2.1.6 click on save updates project name

## P3	Open project
Click `Open a project` in the main menu
### P3.1 Modal window

- P3.1.1 User cannot proceed with empty project location
- P3.1.2 Cancel close window
- P3.1.3 X close window
- P3.1.4 Available by hotkey `Ctrl-Shift-O`

## P4	Save project as...
Click `Save project as` in the main menu
### P4.1 Modal window

- P4.1.1 User cannot proceed with empty project location
- P4.1.2 Cancel close window
- P4.1.3 X close window



# Project Explorer

## X1 Overview
Open at least 2 projects

## X1.1 Projects
- X1.1.1 - all recently open projects available
- X1.1.2 - single click on project changes focus
- X1.1.3 - double click on project opens the project and it's first suite (unless the stored one in web-storage exists)
- X1.1.4 - right click shows up context menu
- X1.1.5 - context menu shows `OPEN` when target project isn't active one
- X1.1.6 - context menu `OPEN` opens a project
- X1.1.7 - context menu shows `Remove from the list`

## X1.2 Context menu `Remove from the list`
- X1.2.1 - when more than one project in the list, focused not active one - simply removes it from the list
- X1.2.2 - when more than one project in the list, focused active one - removes it and opens the next one
- X1.2.3 - when the only project in the list - loads clean state


# Snippets
Open `Snippets` in the main menu

## B1 App panel
- B1.1.1 - adds tab Snippets

## B2 Targets

## B2.1 Add
- B2.1.1 - user cannot proceed with invalid target name (shall be uppercase, underscore)
- B2.1.2 - user cannot proceed with empty locator
- B2.1.3 - if user provides an existing target name, it changes for unique name on submit
- B2.1.4 - user can submit by press ENTER

## B2.2 Edit
- B2.2.1 - user cannot proceed with invalid target name (shall be uppercase, underscore)
- B2.2.2 - user cannot proceed with empty locator
- B2.2.3 - if user provides an existing target name, it changes for unique name on submit
- B2.2.4 - user can submit by press ENTER
- B2.2.5 - user can edit from context menu

## B2.3 Edit as CSV
- B2.3.1 - user can change locators
- B2.3.2 - user can change targets
- B2.3.3 - user can change order of pairs
- B2.3.4 - user can proceed with empty value


## B2.4 Remove from actions
- B2.4.1 - on removing confirmation shown
- B2.4.2 - user can remove record

## B2.5 Remove from context menu
- B2.5.1 - on removing confirmation shown
- B2.5.2 - user can remove record

## B2.6 Move (Drag'n'Drop)
- B2.6.1 - user can move record up
- B2.6.2 - user can move record down

## B2.7 Insert from expandable menu
- B2.7.1 - user can insert a record after a focused one

## B2.8 Insert from context menu
- B2.8.1 - user can insert a record after a focused one

## B2.9 Clone from expandable menu
- B2.9.1 - user can clone a focused record

## B2.10 Clone from context menu
- B2.10.1 - user can clone a focused record

## B2.11 Copy/paste from context menu
- B2.11.1 - user can copy a focused record
- B2.11.2 - user can paste copied  record after a focused one

## B2.12 Copy/paste from expandable menu
- B2.12.1 - user can copy a focused record
- B2.12.2 - user can paste copied  record after a focused one

## B3 Snippets

## B3.1 Add
- B3.1.1 - user cannot proceed with empty title
- B3.1.2 - after creation suite is expanded
- B3.1.3 - user can submit by press ENTER

## B3.2 Edit
- B3.2.1 - user cannot proceed with empty title
- B3.2.2 - user can submit by press ENTER
- B3.2.3 - user can edit from context menu


## B3.4 Remove from actions
- B3.4.1 - on removing confirmation shown
- B3.4.2 - user can remove record

## B3.5 Remove from context menu
- B3.5.1 - on removing confirmation shown
- B3.5.2 - user can remove record

## B3.6 Move (Drag'n'Drop)
- B3.6.1 - user can move record up
- B3.6.2 - user can move record down

## B3.7 Insert from expandable menu
- B3.7.1 - user can insert a record after a focused one

## B3.8 Insert from context menu
- B3.8.1 - user can insert a record after a focused one

## B3.9 Clone from expandable menu
- B3.9.1 - user can clone a focused record

## B3.10 Clone from context menu
- B3.10.1 - user can clone a focused record

## B3.11 Copy/paste from context menu
- B3.11.1 - user can copy a focused record
- B3.11.2 - user can paste copied  record after a focused one

## B3.12 Copy/paste from expandable menu
- B3.12.1 - user can copy a focused record
- B3.12.2 - user can paste copied  record after a focused one



# Suite

## S1 Open suite from Project Explorer
User double click on on a suite file
- P1.1 Suite is loaded

## S2 Open suite from main menu
click on File / Open Suite
- P1.1 Suite is loaded

### S2.1 Modal window
- S2.1.1 Title: Open Suite
- S2.1.2 User can select a suite from the list
- S2.1.3 click on X closes window
- S2.1.4 click on suite loads a suite


## S3 Save Suite
open a suite

### S3.1 By main menu
click on File / Save Suite

- S3.1.1 modify test cases, save suite, reload page, suite shall stay changed

### S3.2 By hotkey
press Ctrl-S

- S3.2.1 modify test cases, save suite, reload page, suite shall stay changed

## S4 Save Suite as ...

### S4.1 Modal window
- S2.1.1 Title: Open Suite As
- S2.1.2 User cannot proceed with empty suite filename
- S2.1.3 click on Close closes window
- S2.1.4 click on X closes window
- S2.1.5 click Save creates a new suite file (visible in Project Explorer)

## S5 Create suite
Click on File / Create suite or Ctrl-N

### S5.1 Modal window
- S5.1.1 Title: New Suite
- S5.1.2 User cannot proceed with empty suite title
- S5.1.3 User cannot proceed with invalid  suite filename
- S5.1.4 click on Close closes window
- S5.1.5 click on X closes window
- S5.1.6 click Save creates a new suite file (visible in Project Explorer)

## S6 Overview
- S6.1 Suite panel tab contains suite file name
- S6.1 Suite panel tab provided with an icon, which has tooltip with suite title
- S6.1 Suite panel has panes: Targets, Test Cases. Options


# Suite Options

## SO1 Options Pane

- ST1.1 - user cannot proceed with empty suite title
- ST1.2 - user cannot proceed with empty or string for timeout
- ST1.3 - on click Save changed saved

# Suite Targets

## ST1 Targets Pane

## ST1.1 Add
- ST1.1.1 - user cannot proceed with invalid target name (shall be uppercase, underscore)
- ST1.1.2 - user cannot proceed with empty locator
- ST1.1.3 - if user provides an existing target name, it changes for unique name on submit
- ST1.1.4 - user can submit by press ENTER

## ST1.2 Edit
- ST1.2.1 - user cannot proceed with invalid target name (shall be uppercase, underscore)
- ST1.2.2 - user cannot proceed with empty locator
- ST1.2.3 - if user provides an existing target name, it changes for unique name on submit
- ST1.2.4 - user can submit by press ENTER
- ST1.2.5 - user can edit from context menu

## ST1.3 Edit as CSV
- ST1.3.1 - user can change locators
- ST1.3.2 - user can change targets
- ST1.3.3 - user can change order of pairs
- ST1.3.4 - user can proceed with empty value


## ST1.4 Remove from actions
- ST1.4.1 - on removing confirmation shown
- ST1.4.2 - user can remove record

## ST1.5 Remove from context menu
- ST1.5.1 - on removing confirmation shown
- ST1.5.2 - user can remove record

## ST1.6 Move (Drag'n'Drop)
- ST1.6.1 - user can move record up
- ST1.6.2 - user can move record down

## ST1.7 Insert from expandable menu
- ST1.7.1 - user can insert a record after a focused one

## ST1.8 Insert from context menu
- ST1.8.1 - user can insert a record after a focused one

## ST1.9 Clone from expandable menu
- ST1.9.1 - user can clone a focused record

## ST1.10 Clone from context menu
- ST1.10.1 - user can clone a focused record

## ST1.11 Copy/paste from context menu
- ST1.11.1 - user can copy a focused record
- ST1.11.2 - user can paste copied  record after a focused one

## ST1.12 Copy/paste from expandable menu
- ST1.12.1 - user can copy a focused record
- ST1.12.2 - user can paste copied  record after a focused one


# Suite Groups

## SG1 Groups Table

## SG1.1 Add
- SG1.1.1 - user cannot proceed with empty title
- SG1.1.2 - after creation group is expanded
- SG1.1.3 - user can submit by press ENTER

## SG1.2 Edit
- SG1.2.1 - user cannot proceed with empty title
- SG1.2.2 - user can submit by press ENTER
- SG1.2.3 - user can edit from context menu


## SG1.4 Remove from actions
- SG1.4.1 - on removing confirmation shown
- SG1.4.2 - user can remove record

## SG1.5 Remove from context menu
- SG1.5.1 - on removing confirmation shown
- SG1.5.2 - user can remove record

## SG1.6 Move (Drag'n'Drop)
- SG1.6.1 - user can move record up
- SG1.6.2 - user can move record down

## SG1.7 Insert from expandable menu
- SG1.7.1 - user can insert a record after a focused one

## SG1.8 Insert from context menu
- SG1.8.1 - user can insert a record after a focused one

## SG1.9 Clone from expandable menu
- SG1.9.1 - user can clone a focused record

## SG1.10 Clone from context menu
- SG1.10.1 - user can clone a focused record

## SG1.11 Copy/paste from context menu
- SG1.11.1 - user can copy a focused record
- SG1.11.2 - user can paste copied  record after a focused one

## SG1.12 Copy/paste from expandable menu
- SG1.12.1 - user can copy a focused record
- SG1.12.2 - user can paste copied  record after a focused one


# Suite Test Cases

## SC1 Test Case Table

## SC1.1 Add
- SC1.1.1 - user cannot proceed with empty title
- SC1.1.2 - after creation test case is expanded
- SC1.1.3 - user can submit by press ENTER

## SC1.2 Edit
- SC1.2.1 - user cannot proceed with empty title
- SC1.2.2 - user can submit by press ENTER
- SC1.2.3 - user can edit from context menu


## SC1.4 Remove from actions
- SC1.4.1 - on removing confirmation shown
- SC1.4.2 - user can remove record

## SC1.5 Remove from context menu
- SC1.5.1 - on removing confirmation shown
- SC1.5.2 - user can remove record

## SC1.6 Move (Drag'n'Drop)
- SC1.6.1 - user can move record up
- SC1.6.2 - user can move record down

## SC1.7 Insert from expandable menu
- SC1.7.1 - user can insert a record after a focused one

## SC1.8 Insert from context menu
- SC1.8.1 - user can insert a record after a focused one

## SC1.9 Clone from expandable menu
- SC1.9.1 - user can clone a focused record

## SC1.10 Clone from context menu
- SC1.10.1 - user can clone a focused record

## SC1.11 Copy/paste from context menu
- SC1.11.1 - user can copy a focused record
- SC1.11.2 - user can paste copied  record after a focused one

## SC1.12 Copy/paste from expandable menu
- SC1.12.1 - user can copy a focused record
- SC1.12.2 - user can paste copied  record after a focused one


# Suite Test Steps

## SS1 Test Step Table

## SS1.1 Add
- SS1.1.1 - user cannot proceed with non-existing target
- SS1.1.2 - user cannot proceed with non-existing method
- SS1.1.3 - modal closes on Cancel
- SS1.1.4 - modal closes on X

## SS1.2 Edit
- SS1.2.1 - user cannot proceed with non-existing target
- SS1.2.2 - user cannot proceed with non-existing method


## SS1.4 Remove from actions
- SS1.4.1 - on removing confirmation shown
- SS1.4.2 - user can remove record

## SS1.5 Remove from context menu
- SS1.5.1 - on removing confirmation shown
- SS1.5.2 - user can remove record

## SS1.6 Move (Drag'n'Drop)
- SS1.6.1 - user can move record up
- SS1.6.2 - user can move record down

## SS1.7 Insert from expandable menu
- SS1.7.1 - user can insert a record after a focused one

## SS1.8 Insert from context menu
- SS1.8.1 - user can insert a record after a focused one

## SS1.9 Clone from expandable menu
- SS1.9.1 - user can clone a focused record

## SS1.10 Clone from context menu
- SS1.10.1 - user can clone a focused record

## SS1.11 Copy/paste from context menu
- SS1.11.1 - user can copy a focused record
- SS1.11.2 - user can paste copied  record after a focused one

## SS1.12 Copy/paste from expandable menu
- SS1.12.1 - user can copy a focused record
- SS1.12.2 - user can paste copied  record after a focused one

## SS1.13 Insert from expandable menu
- SS1.13.1 - user can insert a record after a focused one

## SS1.14 Insert from context menu
- SS1.14.1 - user can insert a record after a focused one


# Settings / Template Variables

## SEV1 Template Variable Table

## SEV1.1 Add
- SEV1.1.1 - user cannot proceed with invalid name (shall be uppercase, underscore)
- SEV1.1.2 - user cannot proceed with empty value
- SEV1.1.3 - if user provides an existing variable name, it changes for unique name on submit
- SEV1.1.4 - user can submit by press ENTER
- SEV1.1.5 - variable added in one env, appears in all others

## SEV1.2 Edit
- SEV1.2.1 - user cannot proceed with invalid name (shall be uppercase, underscore)
- SEV1.2.2 - user cannot proceed with empty value
- SEV1.2.3 - if user provides an existing variable name, it changes for unique name on submit
- SEV1.2.4 - user can submit by press ENTER
- SEV1.2.5 - user can edit from context menu
- SEV1.2.6 - variable value changed in one env, doen't affect variable values in others


## SEV1.4 Remove from actions
- SEV1.4.1 - on removing confirmation shown
- SEV1.4.2 - user can remove record

## SEV1.5 Remove from context menu
- SEV1.5.1 - on removing confirmation shown
- SEV1.5.2 - user can remove record

## SEV1.6 Move (Drag'n'Drop)
- SEV1.6.1 - user can move record up
- SEV1.6.2 - user can move record down

## SEV1.7 Insert from expandable menu
- SEV1.7.1 - user can insert a record after a focused one

## SEV1.8 Insert from context menu
- SEV1.8.1 - user can insert a record after a focused one

## SEV1.9 Clone from expandable menu
- SEV1.9.1 - user can clone a focused record

## SEV1.10 Clone from context menu
- SEV1.10.1 - user can clone a focused record

## SEV1.11 Copy/paste from context menu
- SEV1.11.1 - user can copy a focused record
- SEV1.11.2 - user can paste copied  record after a focused one

## SEV1.12 Copy/paste from expandable menu
- SEV1.12.1 - user can copy a focused record
- SEV1.12.2 - user can paste copied  record after a focused one


## SEV2 Environments

## SEV2.1 Change environment
- SEV2.1.1 - user changes env, and the tables updates showing variables values corresponding to the selected env

## SEV2.2 Edit environments
- SEV2.2.1 - click in Edit link and edit modal shows up
- SEV2.2.2 - modal closes on click X
- SEV2.2.3 - modal closes on click Close
- SEV2.2.4 - user cannot proceed with empty env name
- SEV2.2.5 - user can add env
- SEV2.2.6 - user can remove env
- SEV2.2.7 - user can navigate table via pagination