import { SELECT } from "../../constants";
import { justify } from "service/assert";
import USKeyboardLayout from "vendor/puppeteer/USKeyboardLayout";

const keyNames = Object.keys( USKeyboardLayout ),
      // Checklist https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
      modifiers = Object.keys({
        "Shift": { "keyCode": 16, "key": "Shift", "code": "ShiftLeft", "location": 1 },
        "Control": { "keyCode": 17, "key": "Control", "code": "ControlLeft", "location": 1 },
        "Alt": { "keyCode": 18, "key": "Alt", "code": "AltLeft", "location": 1 },
        "Meta": { "keyCode": 91, "key": "Meta", "code": "MetaLeft", "location": 1 },
        "ShiftLeft": { "keyCode": 16, "code": "ShiftLeft", "key": "Shift", "location": 1 },
        "ShiftRight": { "keyCode": 16, "code": "ShiftRight", "key": "Shift", "location": 2 },
        "ControlLeft": { "keyCode": 17, "code": "ControlLeft", "key": "Control", "location": 1 },
        "ControlRight": { "keyCode": 17, "code": "ControlRight", "key": "Control", "location": 2 },
        "AltLeft": { "keyCode": 18, "code": "AltLeft", "key": "Alt", "location": 1 },
        "AltRight": { "keyCode": 18, "code": "AltRight", "key": "Alt", "location": 2 },
        "MetaLeft": { "keyCode": 91, "code": "MetaLeft", "key": "Meta", "location": 1 },
        "MetaRight": { "keyCode": 92, "code": "MetaRight", "key": "Meta", "location": 2 }
      }).reduce( ( carry, key ) => {
        carry.push({ value: key, description: key });
        return carry;
      }, [{ value: "", description: "<none>" }]),

      WHAT_MODIFIER_IS = `Modifiers are special keys which are used to generate special characters or `
            + `cause special actions when used in combination with other keys. E.g. Shift-Ctrl-Alt`,

      modifierPress = ( key, action ) => key ? `await bs.page.keyboard.${ action }( "${ key }" );` + "\n" : "";

export const press = {
  template: ({ params }) => {
    const { key, modifierKey1, modifierKey2, modifierKey3 } = params,
          renderModifiers = ( action ) => {
            return [ modifierKey1, modifierKey2, modifierKey3 ]
              .map( key => modifierPress( key, action ) ).join( "" );
          };
    return justify( `
// Emulate key press
${ renderModifiers( "down" ) }
await bs.page.keyboard.press( "${ key }" );
${ renderModifiers( "up" ) }` );
  },

  description: `Emulates pressing on a key, optinally with modifiers such as ⇧, ⌥, alt, control, ⌘`,

  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.key",
          inputStyle: { maxWidth: 160 },
          control: SELECT,
          label: "Main key to press",
          tooltip: ``,
          placeholder: "",
          initialValue: "",
          options: keyNames,
          rules: [{
            required: true,
            message: "Key required"
          }]
        }
      ]
    },

    {
      collapsed: true,
      description: WHAT_MODIFIER_IS,
      tooltip: "",
      fields: [

        {
          name: "params.modifierKey1",
          inputStyle: { maxWidth: 160 },
          control: SELECT,
          label: "Modifier Key 1",
          tooltip: ``,
          placeholder: "",
          initialValue: "",
          options: modifiers
        },

        {
          name: "params.modifierKey2",
          inputStyle: { maxWidth: 160 },
          control: SELECT,
          label: "Modifier Key 2",
          tooltip: ``,
          placeholder: "",
          initialValue: "",
          options: modifiers
        },

        {
          name: "params.modifierKey3",
          inputStyle: { maxWidth: 160 },
          control: SELECT,
          label: "Modifier Key 3",
          tooltip: ``,
          placeholder: "",
          initialValue: "",
          options: modifiers
        }

      ]
    }


  ]
};
