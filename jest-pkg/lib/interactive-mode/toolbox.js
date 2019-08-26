
document.body.insertAdjacentHTML( "beforebegin",
  '<div class="__PUPPETRY_toolbox">'
  + '<button id="__PUPPETRY_next" class="__PUPPETRY_toolbox_btn">Next</button>'
  + '</div>' );

const CONTAINER = document.querySelector( ".__PUPPETRY_toolbox" ),
      NEXT_BTN = document.querySelector( "#__PUPPETRY_next" );

let counter = 1;

  NEXT_BTN.addEventListener( "click", ( e ) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.dataset.puppetryBp = counter;
  }, false );