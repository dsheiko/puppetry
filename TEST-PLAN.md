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



# Suite

## S1 Overview
Open at least 2 projects