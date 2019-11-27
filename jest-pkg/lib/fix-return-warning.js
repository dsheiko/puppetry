const realDescribe = describe;

describe = (( name, fn ) => {
  realDescribe( name, () => { fn(); } );
});
