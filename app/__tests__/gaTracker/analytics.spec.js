import UaBeacon from "../../../jest-pkg/lib/BrowserSession/GaTracking/UaBeacon.js";


function uri( search ) {
  return `https://www.google-analytics.com/collect?` + search;
}
function getBeacon( search ) {
  const beacon = new UaBeacon( uri( search ) );
  return beacon.toJSON();
}

describe( "Analytics.js", () => {

  it( "validates URL", () => {
    expect( UaBeacon.validateUrl( uri( "v=1" ) ) ).toBe( true );
  });

   it( "resolves PageView", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1907993446&t=pageview&cu=EUR&_s=1&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&an=Puppetry&_u=SCCAiEIpB~&jid=1500140113&gjid=537148945&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&z=1669737607` );
     expect( b.type ).toBe( "pageview" );
  });


  it( "resolves Event", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1932430201&t=event&cu=EUR&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Videos&ea=play&el=Fall%20Campaign&ev=fall.mp4&an=Puppetry&_u=SCCAiEIpB~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&z=419321751` );
     expect( b.type ).toBe( "event" );
     expect( b.data.category ).toBe( "Videos" );
     expect( b.data.action ).toBe( "play" );
     expect( b.data.label ).toBe( "Fall Campaign" );
     expect( b.data.value ).toBe( "fall.mp4" );
     expect( b.data.nonInteractive ).toBe( false );
  });

   it( "resolves Social", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1932430201&t=social&cu=EUR&_s=3&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&sn=Facebook&sa=like&st=https%3A%2F%2Fpuppetry.app&an=Puppetry&_u=SCCAiEIpB~&jid=1578641456&gjid=1586619277&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&z=1266737405` );

     expect( b.type ).toBe( "social" );
     expect( b.data.network ).toBe( "Facebook" );
     expect( b.data.action ).toBe( "like" );
     expect( b.data.target ).toBe( "https://puppetry.app" );
  });

  it( "resolves Screen", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1932430201&t=screenview&cu=EUR&_s=5&cd=Home&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&an=Puppetry&_u=SCCAiEIpB~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&z=1599037290` );
     expect( b.type ).toBe( "screenview" );
     expect( b.data.screenName ).toBe( "Home" );
     expect( b.data.appName ).toBe( "Puppetry" );
  });

  it( "resolves Timing", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1932430201&t=timing&cu=EUR&_s=6&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&utc=JS%20Dependencies&utv=load&utt=3549&an=Puppetry&_u=SCCAiEIpB~&jid=2119543212&gjid=492820543&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&z=308608825` );
     expect( b.type ).toBe( "timing" );
     expect( b.data.name ).toBe( "load" );
     expect( b.data.value ).toBe( "3549" );
     expect( b.data.category ).toBe( "JS Dependencies" );
  });

   it( "resolves Exception", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1932430201&t=exception&cu=EUR&_s=7&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&an=Puppetry&exd=Demo%20exception%20thrown&exf=0&_u=SCCAiEIpB~&jid=1663803060&gjid=384692644&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&z=647165236` );
     expect( b.type ).toBe( "exception" );
     expect( b.data.description ).toBe( "Demo exception thrown" );
     expect( b.data.fatal ).toBe( false );
  });

  it( "resolves EC:Impression", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1768778434&t=event&cu=EUR&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=Impression&el=YouTube%20Organic%20T-Shirt&an=Puppetry&_u=SCCAiEIpB~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&il1nm=Search%20Results&il1pi1id=P12345&il1pi1nm=Android%20Warhol%20T-Shirt&il1pi1ca=Apparel%2FT-Shirts&il1pi1br=Google&il1pi1va=black&il1pi1ps=1&il1pi1pr=30&il1pi2id=P67890&il1pi2nm=YouTube%20Organic%20T-Shirt&il1pi2ca=Apparel%2FT-Shirts&il1pi2br=YouTube&il1pi2va=gray&il1pi2ps=2&il1pi2pr=40&z=587316289` ),
    ec = b.ec.impressions;
    expect( ec.length ).toBe( 2 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:click", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1685962690&t=event&cu=EUR&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=click&el=Results&an=Puppetry&_u=SCCAiEIpB~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&pal=Search%20Results&pa=click&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1ca=Apparel&pr1br=Google&pr1va=black&pr1ps=1&pr1qt=1&pr1pr=30&pr1cc=SUMMER&pr2id=P12346&pr2nm=Android%20Warhol%20T-Shirt2&pr2ca=Apparel&pr2br=Google&pr2va=black&pr2ps=2&pr2qt=1&pr2pr=40&pr2cc=SUMMER&z=2048458374` ),
    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "click" );
    expect( ec.length ).toBe( 2 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:detail", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1314221121&t=event&ni=1&cu=EUR&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=details&el=Android%20Warhol%20T-Shirt&an=Puppetry&_u=SCCAiEIpB~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&pa=detail&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1ca=Apparel&pr1br=Google&pr1va=black&z=1572974078` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "detail" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:add-to-cart", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1314221121&t=event&cu=EUR&_s=3&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=add%20to%20cart&el=Android%20Warhol%20T-Shirt&an=Puppetry&_u=SCCAiEIpB~&jid=242874937&gjid=40439738&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&pa=add&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1ca=Apparel&pr1br=Google&pr1va=black&pr1pr=30&pr1qt=1&z=1903611763` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "add" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:remove-from-cart", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1314221121&t=event&cu=EUR&_s=4&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=remove%20from%20cart&el=Android%20Warhol%20T-Shirt&an=Puppetry&_u=SCCAiEIpB~&jid=1180020925&gjid=7778234&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&pa=remove&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1ca=Apparel&pr1br=Google&pr1va=black&pr1pr=30&pr1qt=1&z=1174859514` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "remove" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:checkout", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=182919622&t=event&cu=EUR&_s=3&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=payment&el=Android%20Warhol%20T-Shirt&an=Puppetry&_u=SCCAiEIpB~&jid=1789355176&gjid=1527648374&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&cos=1&col=Visa&pa=checkout&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1ca=Apparel&pr1br=Google&pr1va=black&pr1pr=30&pr1qt=1&z=1671951770` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "checkout" );
    expect( b.ec.action.data.step ).toBe( "1" );
    expect( b.ec.action.data.option ).toBe( "Visa" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:transaction", () => {
     const b = getBeacon( `v=1&_v=j79d&aip=1&a=182919622&t=event&cu=EUR&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=transaction&el=Android%20Warhol%20T-Shirt&an=Puppetry&_u=SCCAiEIpB~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&ti=T12345&ta=Google%20Store%20-%20Online&tr=37.39&tt=2.85&ts=5.34&tcc=SUMMER2013&pal=LIST&cos=STEP&col=OPTION&pa=purchase&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1ca=Apparel&pr1br=Google&pr1va=black&pr1pr=30&pr1qt=1&z=1490864492` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "purchase" );
    expect( b.ec.action.data.id ).toBe( "T12345" );
    expect( b.ec.action.data.affiliation ).toBe( "Google Store - Online" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
  });

  it( "resolves EC:refund", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=182919622&t=event&cu=EUR&_s=4&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=refund&el=Android%20Warhol%20T-Shirt&an=Puppetry&_u=SCCAiMIpBAAAAE~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&ti=T12345&pa=refund&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1ca=Apparel&pr1br=Google&pr1va=black&pr1pr=30&pr1qt=1&z=1828273441` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "refund" );
    expect( b.ec.action.data.id ).toBe( "T12345" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:Measuring Internal Promotions", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=882509165&t=event&cu=EUR&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fanalytics.html&ul=en-us&de=UTF-8&dt=analytics.js%20demo&sd=24-bit&sr=1920x1080&vp=1335x436&je=0&ec=Ecommerce&ea=add%20promo&el=Summer%20Sale&an=Puppetry&_u=SCCAiEIpB~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&promoa=click&promo1id=PROMO_1234&promo1nm=Summer%20Sale&promo1cr=summer_banner2&promo1ps=banner_slot1&z=222505769` ),

    ec = b.ec.promotions;
    expect( b.data.action ).toBe( "add promo" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "PROMO_1234" );
  });


});