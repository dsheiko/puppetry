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
- G4.1.2 app data directory is shown
- G4.1.2 click on cancel closes window
- G4.1.2 click on X closes window
- G4.1.2 click on save updates project name
