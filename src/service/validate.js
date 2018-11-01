import Schema from "validate";
import { ValidationError } from "error";

const DISABLE_STRIP = { strip: false },
      STRING_REQ = {
        type: String,
        required: true
      },

      storeSuite = new Schema({
        title: STRING_REQ,
        targets: { type: Object },
        groups: {
          type: Object
        }
      }, DISABLE_STRIP ),

      storeAppProject = new Schema({
        files: {
          type: Array
        }
      }, DISABLE_STRIP ),

      storeApp = new Schema({
        loading: { type: Boolean },
        newProjectModal: { type: Boolean },
        openProjectModal: { type: Boolean },
        saveSuiteAsModal: { type: Boolean },
        closeAppModal: { type: Boolean },
        newSuiteModal: { type: Boolean },
        confirmDeleteModal: { type: Boolean },
        exportProjectModal: { type: Boolean },
        testReportModal: { type: Boolean },
        project: storeAppProject
      }, DISABLE_STRIP ),

      storeProject = new Schema({
        name: { type: String },
        panels: { type: Array },
        groups: { type: Object },
        projectDirectory: { type: String }
      }, DISABLE_STRIP ),

      schemas = {
        suite: new Schema({
          title: STRING_REQ,
          targets: {
            type: Object,
            required: false
          },
          groups: {
            type: Array,
            required: true,
            each: {
              title: STRING_REQ
            }
          }
        }, DISABLE_STRIP ),

        store: new Schema({
          app: storeApp,
          project: storeApp,
          suite: storeSuite
        }, DISABLE_STRIP ),

        updateAppOptions: storeApp,

        updateProjectOptions: storeProject,

        errorOptions: new Schema({
          visible: { type: Boolean, required: true },
          message: STRING_REQ,
          description: STRING_REQ
        }, DISABLE_STRIP ),

        updateSuiteOptions: new Schema({
          title: { type: String },
          modified: { type: Boolean },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        addTargetOptions: new Schema({
          target: { type: String },
          selector: { type: String },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        swapTargetOptions: new Schema({
          sourceInx: { type: Number, required: true },
          targetInx: { type: Number, required: true }
        }, DISABLE_STRIP ),

        updateTargetOptions: new Schema({
          id: STRING_REQ,
          target: { type: String },
          selector: { type: String },
          editing: { type: Boolean }

        }, DISABLE_STRIP ),

        addGroupOptions: new Schema({
          title: { type: String },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        swapGroupOptions: new Schema({
          sourceInx: { type: Number, required: true },
          targetInx: { type: Number, required: true }
        }, DISABLE_STRIP ),

        updateGroupOptions: new Schema({
          id: STRING_REQ,
          title: { type: String },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        removeOptions: new Schema({
          id: STRING_REQ
        }, DISABLE_STRIP ),

        addTestOptions: new Schema({
          groupId: STRING_REQ,
          title: { type: String },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        swapTestOptions: new Schema({
          sourceInx: { type: Number, required: true },
          targetInx: { type: Number, required: true },
          groupId: STRING_REQ
        }, DISABLE_STRIP ),

        updateTestOptions: new Schema({
          id: STRING_REQ,
          groupId: STRING_REQ,
          title: { type: String },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        removeTestOptions: new Schema({
          groupId: STRING_REQ,
          id: STRING_REQ
        }, DISABLE_STRIP ),

        addCommandOptions: new Schema({
          groupId: STRING_REQ,
          testId: STRING_REQ,
          target: { type: String },
          method: { type: String },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        swapCommandOptions: new Schema({
          sourceInx: { type: Number, required: true },
          targetInx: { type: Number, required: true },
          groupId: STRING_REQ,
          testId: STRING_REQ
        }, DISABLE_STRIP ),

        updateCommandOptions: new Schema({
          id: STRING_REQ,
          groupId: STRING_REQ,
          testId: STRING_REQ,
          target: { type: String },
          method: { type: String },
          editing: { type: Boolean }
        }, DISABLE_STRIP ),

        removeCommandOptions: new Schema({
          groupId: STRING_REQ,
          testId: STRING_REQ,
          id: STRING_REQ
        }, DISABLE_STRIP ),


        appTabKey: new Schema({
          value: STRING_REQ
        }, DISABLE_STRIP )

      };

export function validate( target, json ) {
  const data = { ...json },
        errors = schemas[ target ].validate( data );
  if ( !errors.length ) {
    return json;
  }
  const msg = errors.map( err => err.message ).join( "\n" );
  throw new ValidationError( msg );
}

/**
 * Validate lib doesn't provide methods for plain type, only for objects, so we trick it
 * @param {Schema} target
 * @param {*} value - plain type
 * @returns {*}
 */
export function validatePlain( target, value ) {
  validate( target, { value });
  return value;
}