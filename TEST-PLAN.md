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

## G3	Create project
Click `Create a project` in the main menu

### G3.1 Modal window

- G3.1.1 User cannot proceed with empty project location
- G3.1.2 Confirmation when selected directory is not empty
- G3.1.3 User cannot proceed with empty project name
- G3.1.4 User cannot proceed with empty suite name
- G3.1.5 Modal can be closed

### G3.2 Main menu state
- G3.2.1 `Top`: all enabled
- G3.2.2 `File/Git Menu`: enabled only `Initialize` and `Clone`

### G3.3 App panel
- G3.3.1 `Panel` shows suite tab, with targets, test cases and options tabs

### G3.4 Toolbar
- G3.4.1 `Toolbar` has project title and edit link

### G3.5 Project Explorer
- G3.5.1 `Project Explorer` is visible, contains the project

## G4 Edit project
Click edit link next to project title in the toolbar

### G4.1 Modal window
- G4.1.1 User cannot proceed with empty project name
- G4.1.2 Project location is shown
- G4.1.3 app data directory is shown
- G4.1.4 click on cancel closes window
- G4.1.5 click on X closes window
- G4.1.6 click on save updates project name




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
