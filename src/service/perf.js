const start = performance.now(),
      isOn = process.env.NODE_ENV === "development";
let lastStart = null;

global.perf = {
  // May look like: ⌚ #3 takes 508.315ms, delta 73.030ms
  time( label ) {
    isOn && console.log( `⌚ ${ label } takes ${ ( performance.now() -  start ).toFixed( 3 ) }ms,`
      + ( lastStart !== null ? ` delta ${ ( performance.now() -  lastStart ).toFixed( 3 ) }ms` : `` ) );
    lastStart = performance.now();
  },
  // ⌛ readSuite(/home/sheiko/.config/puppetry/project-demo/todomvc.json) takes 2.775 ms
  processSync( label, func ) {
    if ( !isOn ) {
      return func();
    }
    const start = performance.now(),
          retval = func(); 
    console.log( `⌛ ${ label } takes` , ( performance.now() -  start ).toFixed( 3 ), "ms" );
    return retval;
  },

  async process( label, func ) {
    if ( !isOn ) {
      return await func();
    }
    const start = performance.now(),
          retval = await func(); 
    console.log( `⌛ ${ label } takes` , ( performance.now() -  start ).toFixed( 3 ), "ms" );
    return retval;
  }
};
