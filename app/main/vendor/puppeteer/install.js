/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function( puppeteerCwd, { handleDone, handleProgress, handleError }) {

  const downloadHost = process.env.PUPPETEER_DOWNLOAD_HOST || process.env.npm_config_puppeteer_download_host
    || process.env.npm_package_config_puppeteer_download_host;
  const { join } = require('path');
  const puppeteer = require( join( puppeteerCwd, './index' ) );
  const browserFetcher = puppeteer.createBrowserFetcher({ host: downloadHost });

  const revision = process.env.PUPPETEER_CHROMIUM_REVISION || process.env.npm_config_puppeteer_chromium_revision
    || process.env.npm_package_config_puppeteer_chromium_revision || require( join( puppeteerCwd, './package.json' ) )
      .puppeteer.chromium_revision;

  const revisionInfo = browserFetcher.revisionInfo(revision);

  // Do nothing if the revision is already downloaded.
//  if (revisionInfo.local) {
//    generateProtocolTypesIfNecessary(false /* updated */);
//    return;
//  }

  // Override current environment proxy settings with npm configuration, if any.
  const NPM_HTTPS_PROXY = process.env.npm_config_https_proxy || process.env.npm_config_proxy;
  const NPM_HTTP_PROXY = process.env.npm_config_http_proxy || process.env.npm_config_proxy;
  const NPM_NO_PROXY = process.env.npm_config_no_proxy;

  if (NPM_HTTPS_PROXY)
    process.env.HTTPS_PROXY = NPM_HTTPS_PROXY;
  if (NPM_HTTP_PROXY)
    process.env.HTTP_PROXY = NPM_HTTP_PROXY;
  if (NPM_NO_PROXY)
    process.env.NO_PROXY = NPM_NO_PROXY;

  browserFetcher.download(revisionInfo.revision, onProgress)
      .then(() => browserFetcher.localRevisions())
      .then(onSuccess)
      .catch(onError);

  /**
   * @param {!Array<string>}
   * @return {!Promise}
   */
  function onSuccess(localRevisions) {
    handleDone( revisionInfo );
    localRevisions = localRevisions.filter(revision => revision !== revisionInfo.revision);
    // Remove previous chromium revisions.
    const cleanupOldVersions = localRevisions.map(revision => browserFetcher.remove(revision));
    return Promise.all([...cleanupOldVersions, generateProtocolTypesIfNecessary(true /* updated */)]);
  }

  /**
   * @param {!Error} error
   */
  function onError(error) {
    handleError( error );
    process.exit(1);
  }

  let lastPercentage = 0;
  function onProgress(downloadedBytes, totalBytes) {
    const percentage = Math.floor( downloadedBytes / totalBytes * 100 );
    lastPercentage < percentage && handleProgress({
      downloadedBytes: toMegabytes( downloadedBytes ),
      totalBytes: toMegabytes( totalBytes ),
      progress: percentage
    });

    lastPercentage = percentage;
  }

  function toMegabytes(bytes) {
    const mb = bytes / 1024 / 1024;
    return `${Math.round(mb * 10) / 10} Mb`;
  }

  function generateProtocolTypesIfNecessary(updated) {
    const fs = require('fs'),
          path = require('path');
    if (!fs.existsSync(path.join( puppeteerCwd, 'utils', 'protocol-types-generator')))
      return;
    if (!updated && fs.existsSync(path.join( puppeteerCwd, 'lib', 'protocol.d.ts')))
      return;
    return require( join( puppeteerCwd, './utils/protocol-types-generator' ));
  }

};