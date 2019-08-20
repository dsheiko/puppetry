import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { DIR_SCREENSHOTS } from "constant";
import { millisecondsToStr } from "service/utils";
import { Icon } from "antd";
import { readdir } from "service/io";
import { join } from "path";
import fs from "fs";

let counter = 0;

export class ReportBody extends AbstractComponent {

  static propTypes = {
    action: PropTypes.shape({
      setApp: PropTypes.func.isRequired
    }),
    details: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string.isRequired
  }

  state = {
    details: {}
  };

// details format
//  {
//    "Suite title (react-html5-form-RWD.spec.js)":
//      "Group title": [
//        {
//          duration: 1764
//          failureMessages: ""
//          location: null
//          numPassingAsserts: 0
//          status: "passed"
//          suite: "Suite title"
//          title: "Test case title"
//        },
//        ..
//      ]
//  }

  parseTile( rawTitle ) {
    const re = /^(.*) \{(.*)\}$/,
          res = rawTitle.match( re );
    if ( res === null ) {
      return { title: rawTitle, id: "" };
    }
    return { title: res[ 1 ], id: res[ 2 ] };
  }

  getScreenshotDir( id ) {
    return join( this.props.projectDirectory, DIR_SCREENSHOTS, id );
  }


  async componentDidMount() {
    const { details, screenshotDirs, selector } = this.props;
    let screenshotInx = 0;
    this.props.action.cleanLightbox();

//    console.log( 1, selector.findTestCaseByCommandId( "nmajnyew656" ) );
//    const fls = await readdir( join( this.props.projectDirectory, "snapshots", "actual" ) );
//    console.log(fls);


    for ( let suiteKey of Object.keys( details ) ) {
      for ( let describeKey of Object.keys( details[ suiteKey ]) ) {
        for ( let inx in details[ suiteKey ][ describeKey ] ) {
          const spec = details[ suiteKey ][ describeKey ][ inx ],
                { title, id } = this.parseTile( spec.title ),
                screenshotDir = this.getScreenshotDir( id ),
                // Screenshots per test case
                screenshotFiles = fs.existsSync( screenshotDir )
                  ?  await readdir( screenshotDir )
                  : [],
                screenshots = screenshotFiles.map( file => ({
                  src: join( screenshotDir, file ) ,
                  file,
                  inx: screenshotInx++
                }));


          screenshots && this.props.action.addLightboxImages( screenshots );

          Object.assign( details[ suiteKey ][ describeKey ][ inx ], {
              title,
              id,
              screenshots
          });
        }
      }
    }
    console.log(details);
    this.setState({ details });
  }

  onClickImg = ( e, inx ) => {
    e.preventDefault();
    this.props.action.setApp({ appLightbox: inx });
  }

  renderLine( spec ) {
    const screenshotDir = this.getScreenshotDir( spec.id );
    return ( <div
      key={ `k${ counter++ }` }
      className="test-report__it">
      <If exp={ spec.status === "passed" }>
        <Icon
          className="test-report__ok"
          type="check" theme="outlined" fill="#52c41a" width="16" height="16" />
      </If>
      <If exp={ spec.status !== "passed" }>
        <Icon
          className="test-report__fail"
          type="close" theme="outlined" fill="#eb2f96" width="16" height="16" />
      </If>
      { " " }<span className="test-report__it__title">{ spec.title }
        { " " }({ millisecondsToStr( spec.duration ) })
      </span>

      <If exp={ spec.status !== "passed" && spec.failureMessages }>
        <div  className="test-report__it__exception">{ spec.failureMessages }</div>
      </If>

      <If exp={ spec.screenshots }>
      <div className="screenshot-thumb-container">
      { spec.screenshots.map( ( item, inx ) => ( <figure key={ inx } >
        <img
          onClick={ ( e ) => this.onClickImg( e, item.inx ) }
          src={ item.src } className="screenshot-thumb"
          title={ item.file }
          alt={ item.file } />
        </figure> ) ) }
      </div>
      </If>


    </div> );
  }

  render() {
    const { details } = this.state;

    return (<ErrorBoundary>

          <div className="bottom-line">
            { Object.keys( details ).map( suiteKey => ( <div key={ `k${ counter++ }` } className="test-report__suite">
              { suiteKey }
              {  Object.keys( details[ suiteKey ]).map( describeKey => ( <div
                key={ `k${ counter++ }` }
                className="test-report__describe">
                { describeKey }
                { details[ suiteKey ][ describeKey ].map( spec => this.renderLine( spec ) ) }
              </div> ) ) }
            </div> ) ) }
          </div>
    </ErrorBoundary> );
  }
}
