

module.exports = async function ( puppeteerCwd, { handleDone, handleProgress, handleError }, product ) {

  // const compileTypeScriptIfRequired = require( join( puppeteerCwd, './typescript-if-required' ));
  // await compileTypeScriptIfRequired();

  const os = require("os"),
    https = require("https"),
    { join } = require("path"),
    puppeteer = require(join(puppeteerCwd, './lib/cjs/puppeteer/node.js')).default,
    { PUPPETEER_REVISIONS } = require(join(puppeteerCwd, './lib/cjs/puppeteer/revisions.js')),
    { PuppeteerNode } = require(join(puppeteerCwd, './lib/cjs/puppeteer/node/Puppeteer.js'));

  const supportedProducts = {
    chrome: 'Chromium',
    firefox: 'Firefox Nightly',
  };
  

  async function downloadBrowser () {
    const downloadHost =
      process.env.PUPPETEER_DOWNLOAD_HOST ||
      process.env.npm_config_puppeteer_download_host ||
      process.env.npm_package_config_puppeteer_download_host;
    // const product =
    //   process.env.PUPPETEER_PRODUCT ||
    //   process.env.npm_config_puppeteer_product ||
    //   process.env.npm_package_config_puppeteer_product ||
    //   'chrome';
    const downloadPath =
      process.env.PUPPETEER_DOWNLOAD_PATH ||
      process.env.npm_config_puppeteer_download_path ||
      process.env.npm_package_config_puppeteer_download_path;
    const browserFetcher = (puppeteer).createBrowserFetcher({
      product,
      host: downloadHost,
      path: downloadPath,
    });
    const revision = await getRevision();
    await fetchBinary(revision);

    function getRevision () {
      if (product === 'chrome') {
        return (
          process.env.PUPPETEER_CHROMIUM_REVISION ||
          process.env.npm_config_puppeteer_chromium_revision ||
          PUPPETEER_REVISIONS.chromium
        );
      } else if (product === 'firefox') {
        (puppeteer)._preferredRevision =
          PUPPETEER_REVISIONS.firefox;
        return getFirefoxNightlyVersion().catch((error) => {
          console.error(error);
          process.exit(1);
        });
      } else {
        throw new Error(`Unsupported product ${ product }`);
      }
    }

    function fetchBinary (revision) {
      const revisionInfo = browserFetcher.revisionInfo(revision);

      // Override current environment proxy settings with npm configuration, if any.
      const NPM_HTTPS_PROXY =
        process.env.npm_config_https_proxy || process.env.npm_config_proxy;
      const NPM_HTTP_PROXY =
        process.env.npm_config_http_proxy || process.env.npm_config_proxy;
      const NPM_NO_PROXY = process.env.npm_config_no_proxy;

      if (NPM_HTTPS_PROXY) process.env.HTTPS_PROXY = NPM_HTTPS_PROXY;
      if (NPM_HTTP_PROXY) process.env.HTTP_PROXY = NPM_HTTP_PROXY;
      if (NPM_NO_PROXY) process.env.NO_PROXY = NPM_NO_PROXY;

      function onSuccess (localRevisions) {
        localRevisions = localRevisions.filter(
          (revision) => revision !== revisionInfo.revision
        );
        const cleanupOldVersions = localRevisions.map((revision) =>
          browserFetcher.remove(revision)
        );
        Promise.all([ ...cleanupOldVersions ]);
        handleDone(revisionInfo);
      }

      function onError (error) {
        console.error(
          `ERROR: Failed to set up ${ supportedProducts[ product ] } r${ revision }! Set "PUPPETEER_SKIP_DOWNLOAD" env variable to skip download.`
        );
        console.error(error);
        handleError(error);
      }

      let progressBar = null;
      let lastDownloadedBytes = 0;


      let lastPercentage = 0;
      function onProgress (downloadedBytes, totalBytes) {
        const percentage = Math.floor(downloadedBytes / totalBytes * 100);
        lastPercentage < percentage && handleProgress({
          downloadedBytes: toMegabytes(downloadedBytes),
          totalBytes: toMegabytes(totalBytes),
          progress: percentage
        });
        lastPercentage = percentage;
      }

      return browserFetcher
        .download(revisionInfo.revision, onProgress)
        .then(() => browserFetcher.localRevisions())
        .then(onSuccess)
        .catch(onError);
    }

    function toMegabytes (bytes) {
      const mb = bytes / 1024 / 1024;
      return `${ Math.round(mb * 10) / 10 } Mb`;
    }

    function getFirefoxNightlyVersion () {
      const firefoxVersions =
        'https://product-details.mozilla.org/1.0/firefox_versions.json';

      const promise = new Promise((resolve, reject) => {
        let data = '';
        https
          .get(firefoxVersions, (r) => {
            if (r.statusCode >= 400)
              return reject(new Error(`Got status code ${ r.statusCode }`));
            r.on('data', (chunk) => {
              data += chunk;
            });
            r.on('end', () => {
              try {
                const versions = JSON.parse(data);
                return resolve(versions.FIREFOX_NIGHTLY);
              } catch {
                return reject(new Error('Firefox version not found'));
              }
            });
          })
          .on('error', reject);
      });
      return promise;
    }
  }

  downloadBrowser();

};