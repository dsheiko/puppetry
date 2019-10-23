import UaBeacon from "../../../jest-pkg/lib/BrowserSession/GaTracking/UaBeacon.js";


function uri( search ) {
  return `https://www.google-analytics.com/collect?` + search;
}
function getBeacon( search ) {
  const beacon = new UaBeacon( uri( search ) );
  return beacon.toJSON();
}

describe( "GTM", () => {

  it( "validates URL", () => {
    expect( UaBeacon.validateUrl( uri( "v=1" ) ) ).toBe( true );
  });

   it( "resolves PageView", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=779495658&t=pageview&_s=1&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&_u=CCCAAUIh~&jid=1448834564&gjid=2096549641&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&gtm=2ouaa0&z=1769573863` );
     console.log(b);
     expect( b.type ).toBe( "pageview" );
  });

  it( "resolves Event", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=779495658&t=event&_s=4&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=Videos&ea=play&el=Fall%20Campaign&_u=CCCAAUIh~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&gtm=2ouaa0&z=1805495683` );
     expect( b.type ).toBe( "event" );
     expect( b.data.category ).toBe( "Videos" );
     expect( b.data.action ).toBe( "play" );
     expect( b.data.label ).toBe( "Fall Campaign" );
     expect( b.data.nonInteractive ).toBe( false );
  });

  it( "resolves Screen", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=779495658&t=screenview&_s=3&cd=Home&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&an=Puppetry&_u=CCCAAUIh~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&gtm=2ouaa0&z=1792088871` );
     expect( b.type ).toBe( "screenview" );
     expect( b.data.screenName ).toBe( "Home" );
     expect( b.data.appName ).toBe( "Puppetry" );
  });

  it( "resolves Timing", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=779495658&t=timing&_s=5&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&utc=JS%20Dependencies&utv=load&utl=Label&utt=3549&_u=CCCAAUIh~&jid=1142389297&gjid=1080577739&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&gtm=2ouaa0&z=47706914` );
     expect( b.type ).toBe( "timing" );
     expect( b.data.name ).toBe( "load" );
     expect( b.data.value ).toBe( "3549" );
     expect( b.data.category ).toBe( "JS Dependencies" );
  });

   it( "resolves Exception", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=779495658&t=exception&_s=6&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&exd=Demo%20exception%20thrown&exf=0&_u=CCCAAUIh~&jid=454099263&gjid=1078155062&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&gtm=2ouaa0&z=336446802` );
     expect( b.type ).toBe( "exception" );
     expect( b.data.description ).toBe( "Demo exception thrown" );
     expect( b.data.fatal ).toBe( false );
  });

  it( "resolves EC:Impression", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=795422402&t=event&ni=1&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=engagement&ea=view_item_list&_u=SCCAAUIr~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&linkid=linkEcClick&gtm=2ouaa0&il1nm=Search%20Results&il1pi1id=P12345&il1pi1nm=Android%20Warhol%20T-Shirt&il1pi1br=Google&il1pi1ca=Apparel%2FT-Shirts&il1pi1va=Black&il1pi1qt=2&il1pi1pr=30&il1pi1ps=1&il1pi2id=P67890&il1pi2nm=Flame%20challenge%20TShirt&il1pi2br=MyBrand&il1pi2ca=Apparel%2FT-Shirts&il1pi2va=Red&il1pi2qt=1&il1pi2pr=40&il1pi2ps=2&z=1834425230` ),
    ec = b.ec.impressions;
    expect( ec.length ).toBe( 2 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:click", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=795422402&t=event&_s=4&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=engagement&ea=select_content&el=product&_u=SCCAAUIr~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&linkid=linkEcClick&gtm=2ouaa0&pal=Search%20Results&pa=click&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1br=Google&pr1ca=Apparel%2FT-Shirts&pr1va=Black&pr1qt=2&pr1pr=2&pr1ps=1&z=1355286131` ),
    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "click" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:detail", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=795422402&t=event&ni=1&_s=5&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=engagement&ea=view_item&_u=SCCAAUIr~&jid=1052039686&gjid=2071487700&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&linkid=linkEcClick&gtm=2ouaa0&pal=Search%20Results&pa=detail&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1br=Google&pr1ca=Apparel%2FT-Shirts&pr1va=Black&pr1qt=2&pr1pr=2.0&pr1ps=1&z=12928434` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "detail" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:add-to-cart", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=795422402&t=event&_s=6&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=ecommerce&ea=add_to_cart&_u=SCCAAUIr~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&linkid=linkEcClick&gtm=2ouaa0&pa=add&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1br=Google&pr1ca=Apparel%2FT-Shirts&pr1va=Black&pr1qt=2&pr1pr=2.0&pr1ps=1&z=526832935` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "add" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:remove-from-cart", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=795422402&t=event&_s=7&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=ecommerce&ea=remove_from_cart&_u=SCCAAUIr~&jid=793322965&gjid=1661364846&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&linkid=linkEcClick&gtm=2ouaa0&pa=remove&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1br=Google&pr1ca=Apparel%2FT-Shirts&pr1va=Black&pr1qt=2&pr1pr=2.0&pr1ps=1&z=1826946038` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "remove" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:checkout", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=795422402&t=event&_s=9&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=ecommerce&ea=checkout_progress&_u=SCCAAUIr~&jid=1797152078&gjid=1581916332&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&linkid=linkEcClick&gtm=2ouaa0&pa=checkout&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1br=Google&pr1ca=Apparel%2FT-Shirts&pr1va=Black&pr1qt=2&pr1pr=2.0&pr1ps=1&z=6407419` ),

    ec = b.ec.products;
    expect( b.data.action ).toBe( "checkout_progress" );
    expect( b.ec.action.name ).toBe( "checkout" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:transaction", () => {
     const b = getBeacon( `v=1&_v=j79d&aip=1&a=795422402&t=event&cu=EUR&_s=10&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=ecommerce&ea=purchase&ev=23&_u=SCCAAUIr~&jid=1285731315&gjid=792315259&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&linkid=linkEcClick&gtm=2ouaa0&pa=purchase&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1br=Google&pr1ca=Apparel%2FT-Shirts&pr1va=Black&pr1qt=2&pr1pr=2.0&pr1ps=1&ti=24.031608523954162&ta=Google%20online%20store&tr=23.07&tt=1.24&ts=0&z=166858510` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "purchase" );
    expect( b.ec.action.data.id ).toBe( "24.031608523954162" );
    expect( b.ec.action.data.affiliation ).toBe( "Google online store" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
  });

  it( "resolves EC:refund", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1199929199&t=event&_s=4&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=ecommerce&ea=refund&_u=SCCAAUIr~&jid=1015102282&gjid=1540982870&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&gtm=2ouaa0&ti=24.031608523954162&pa=refund&z=1716733302` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "refund" );
    expect( b.ec.action.data.id ).toBe( "24.031608523954162" );
  });

  it( "resolves EC:partial refund", () => {
    const b = getBeacon( `v=1&_v=j79d&aip=1&a=1199929199&t=event&cu=USD&_s=5&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=ecommerce&ea=refund&ev=23&_u=SCCAAUIr~&jid=1728455424&gjid=987527692&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&gtm=2ouaa0&ti=24.031608523954162&ta=Google%20online%20store&tr=23.07&tt=1.24&ts=0&pa=refund&pr1id=P12345&pr1nm=Android%20Warhol%20T-Shirt&pr1br=Google&pr1ca=Apparel%2FT-Shirts&pr1va=Black&pr1qt=2&pr1pr=2.0&pr1ps=1&z=840428907` ),

    ec = b.ec.products;
    expect( b.ec.action.name ).toBe( "refund" );
    expect( b.ec.action.data.id ).toBe( "24.031608523954162" );
    expect( b.ec.action.data.revenue ).toBe( "23.07" );
    expect( b.ec.currency ).toBe( "USD" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "P12345" );
    expect( ec[ 0 ].name ).toBe( "Android Warhol T-Shirt" );
  });

  it( "resolves EC:Measure promotion impressions", () => {
     const b = getBeacon( `v=1&_v=j79d&aip=1&a=1199929199&t=event&ni=1&_s=2&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=engagement&ea=view_promotion&_u=SCCAAUIr~&jid=&gjid=&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&gtm=2ouaa0&promo1id=PROMO_1234&promo1nm=Summer%20Sale&z=1434272898` ),
    ec = b.ec.promotions;
    expect( b.data.action ).toBe( "view_promotion" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "PROMO_1234" );
  });

  it( "resolves EC:Measure promotion clicks", () => {
     const b = getBeacon( `v=1&_v=j79d&aip=1&a=1199929199&t=event&_s=3&dl=http%3A%2F%2F127.0.0.1%2Fdemo%2Fgtm.html&ul=en-us&de=UTF-8&dt=GTM%20demo&sd=24-bit&sr=1920x1080&vp=1320x436&je=0&ec=engagement&ea=select_content&_u=SCCAAUIr~&jid=1438296039&gjid=1275095996&cid=314438285.1558702157&tid=UA-129292661-3&_gid=1383428716.1571729438&_r=1&gtm=2ouaa0&promo1id=PROMO_1234&promo1nm=Summer%20Sale&promoa=click&z=1517955132` ),
    ec = b.ec.promotions;
    expect( b.data.action ).toBe( "select_content" );
    expect( ec.length ).toBe( 1 );
    expect( ec[ 0 ].id ).toBe( "PROMO_1234" );
  });

});