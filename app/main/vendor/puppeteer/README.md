# Installer implementaiton

During NPM install when using programmatically the post-install scripts of dependencies isn't called.
As there is such for Puppeteer (to install Chromium) we have to run it manually.
We also want reporting progress, error and done states. Thus we tune a bit Puppeteers embedded script `install.js`

```js
function (puppeteerCwd, { handleDone, handleProgress, handleError }) {
  // .. functionality from the script

  // Report process
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

  function onSuccess (localRevisions) {
    // ...
    handleDone(revisionInfo);
  }

  function onError (error) {
    handleError(error);
  }
}
```