export const isMac = process.platform === "darwin";
export const ostr = ( kbd ) => {
        if ( !isMac ) {
          return kbd;
        }
        return kbd.replace( "Ctrl", "⌘" );
      };