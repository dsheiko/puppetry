import { isDirEmpty } from "../../service/io";
import { join } from "path";

const EMPTY_DIR = join( __dirname, "..", "__fixtures", "empty-dir" ),
      NONEMPTY_DIR = join( __dirname, "..", "__fixtures", "nonempty-dir" );

describe( "service/io", () => {


  describe( "isDirEmpty", () => {

    it( "detects empty dir", () => {
      expect( isDirEmpty( EMPTY_DIR ) ).toBe( true );
    });

    it( "detects non-existing dir", () => {
      expect( isDirEmpty( "____non-existing" ) ).toBe( true );
    });

    it( "detects non-empty dir", () => {
      expect( isDirEmpty( NONEMPTY_DIR ) ).toBe( false );
    });

  });
});
