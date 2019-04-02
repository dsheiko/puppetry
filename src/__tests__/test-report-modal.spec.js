import { updateLauncherArgs } from "../component/Modal/TestReportModal";

const FIX_SWITCHER1 = `--start-maximized`,
      FIX_SWITCHER2 = `--start-fullscreen`,
      FIX_SWITCHER3 = `--ignore-certificate-errors`;

describe( "TestReportModal", () => {

  describe( "updateLauncherArgs", () => {

    it( "adds switcher on empty string", () => {
      const res = updateLauncherArgs( ``, FIX_SWITCHER1, true );
      expect( res ).toBe( FIX_SWITCHER1 );
    });

    it( "removes switcher on empty string", () => {
      const res = updateLauncherArgs( ``, FIX_SWITCHER1, false );
      expect( res ).toBe( "" );
    });

    it( "adds second switcher", () => {
      let res = updateLauncherArgs( ``, FIX_SWITCHER1, true );
      res = updateLauncherArgs( res, FIX_SWITCHER2, true );
      expect( res ).toBe( FIX_SWITCHER1 + " " + FIX_SWITCHER2 );
    });

    it( "removes first switcher", () => {
      let res = updateLauncherArgs( ``, FIX_SWITCHER1, true );
      res = updateLauncherArgs( res, FIX_SWITCHER2, true );
      res = updateLauncherArgs( res, FIX_SWITCHER1, false );
      expect( res ).toBe( FIX_SWITCHER2 );
    });

    it( "removes second switcher", () => {
      let res = updateLauncherArgs( ``, FIX_SWITCHER1, true );
      res = updateLauncherArgs( res, FIX_SWITCHER2, true );
      res = updateLauncherArgs( res, FIX_SWITCHER2, false );
      expect( res ).toBe( FIX_SWITCHER1 );
    });

    it( "removes second switcher", () => {
      let res = updateLauncherArgs( ``, FIX_SWITCHER1, true );
      res = updateLauncherArgs( res, FIX_SWITCHER2, true );
      res = updateLauncherArgs( res, FIX_SWITCHER3, true );
      res = updateLauncherArgs( res, FIX_SWITCHER2, false );
      expect( res ).toBe( FIX_SWITCHER1 + " " + FIX_SWITCHER3 );
    });


  });


});
