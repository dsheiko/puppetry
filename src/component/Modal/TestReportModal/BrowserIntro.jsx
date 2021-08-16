import React from "react";
import AbstractComponent from "component/AbstractComponent";

export class BrowserIntro extends AbstractComponent {

  render() {
    const { product } = this.props;


    return (
      <div className="browser-intro">

        { product === "headless" ? <p><a
          onClick={ this.onExtClick }
          href="https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md">
        Headless Chromium</a>{ "" } allows running
        { " " }<a
          onClick={ this.onExtClick }
          href="https://en.wikipedia.org/wiki/Chromium_(web_browser)">Chromium</a>
        { " " } in a headless/server environment.
        In this mode the test will run considerably faster.</p>
          : null }

        { product === "chromium" ? <p><a
          onClick={ this.onExtClick }
          href="https://en.wikipedia.org/wiki/Chromium_(web_browser)">
        Chromium</a>{ "" } is an open-source web browser, which is used as basis
        for Google Chrome browser.
        Puppetry downloads and uses a specific version of Chromium
        so its API is guaranteed to work out of the box.</p>
          : null }


        { product === "chrome" ? <p><a
          onClick={ this.onExtClick }
          href="https://www.google.com/chrome/">
        Google Chrome</a>{ "" } is a cross-platform web browser developed by Google.</p>
          : null }

        { product === "firefox" ? <p><a
          onClick={ this.onExtClick }
          href="https://www.mozilla.org/en-US/firefox/">
        Mozilla Firefox</a>{ "" } is a free and open-source web browser developed by the Mozilla Foundation.</p>
          : null }


        { product === "connect" ? <div>
          <p>There are some cases when we need to connect to a running instance of Chrome instead of
        starting a new one. For example to bypass reCaptcha we can solve it manually in
        Chrome and then run the tests on it. </p>
          <p>In order to connect we need to start Chrome in command-line with remote-debugging-port
        parameter.</p><p>E.g.: <code>google-chrome --remote-debugging-port=9222</code></p>
          <p>Next we navigate in the started browser to <code>http://127.0.0.1:9222/json/version</code>.
        On the page we can see a JSON object. We shell copy/paste the value
        of <code>webSocketDebuggerUrl</code> property to the input field below.</p>
        </div>
          : null }


      </div>
    );
  }

}