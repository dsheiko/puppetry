import { justify } from "service/assert";

export const debug = {
  template: () => {
    return justify( `
// Stop execution of JavaScript, and calls (if available) the debugging function.
await bs.page.evaluate(() => {
  debugger;
});` );
  },

  toLabel: () => ``,
  commonly: "stop execution and call DevTools",

  description: `Stops execution of JavaScript, and calls (if available) the
[debugging function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger).
During test scenarios may happen many things - DOM changes, pages load. It makes hard to figure out why some test
assertions fail in some particular moment.  You can use this tool to set a breakpoint. Test flow will stop as
soon as it reaches this point. So you will be able to examine the page state with DevTools.

NOTE: This command makes sense only if you set Puppetry to run tests in browser (F6)`,
  params: []
};
