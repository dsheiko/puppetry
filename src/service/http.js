import log from "electron-log";
import { notification } from "antd";
import semver from "semver";
import { remote } from "electron";

notification.config({
  placement: "bottomRight"
});

export function getDateString() {
  const now = new Date();
  return `${ now.getFullYear() }-${ now.getMonth() }-${ now.getDate() }`;
}

export async function checkNewVersion( lastCheckedVersion ) {
  const currentVersion = remote.app.getVersion(),
        compareVersion = lastCheckedVersion || currentVersion;

  try {
    const rsp = await fetch( "https://raw.githubusercontent.com/dsheiko/puppetry/master/package.json" ),
          pkg = await rsp.json();

    if ( !semver.lt( compareVersion, pkg.version ) ) {
      return;
    }
    notification.open({
      message: "New Version Available",
      description: `There is a new version (${ pkg.version }) available for download!`
        + ` You can update by visiting https://github.com/dsheiko/puppetry.`
    });
  } catch ( e ) {
    log.warn( `Renderer process: http.checkNewVersion: ${ e }` );
  }
}