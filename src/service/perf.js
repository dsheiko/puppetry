const start = performance.now();
let lastStart = null;

global.perf = {
  // May look like: ⌚ #3 takes 508.315ms, delta 73.030ms
  time( label ) {
    console.log( `⌚ ${ label } takes ${ ( performance.now() -  start ).toFixed( 3 ) }ms,`
      + ( lastStart !== null ? ` delta ${ ( performance.now() -  lastStart ).toFixed( 3 ) }ms` : `` ) );
    lastStart = performance.now();
  },
  // ⌛ readSuite(/home/sheiko/.config/puppetry/project-demo/todomvc.json) takes 2.775 ms
  async process( label, func ) {
    const start = performance.now();
    await func(); 
    console.log( `⌛ ${ label } takes` , ( performance.now() -  start ).toFixed( 3 ), "ms" );
  }
};
