import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { DIR_SCREENSHOTS, DIR_SNAPSHOTS } from "constant";
import { millisecondsToStr } from "service/utils";
import { Icon } from "antd";
import { readdir } from "service/io";
import { join, basename } from "path";
import fs from "fs";
import recursive from "recursive-readdir";
import { Thumbnail } from "./Thumbnail";

let counter = 0,
    screenshotInx = 0;

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
      return { title: rawTitle, testId: "" };
    }
    return { title: res[ 1 ], testId: res[ 2 ] };
  }

  /**
   * Find all screenshots belonging to a given test case
   * @param {string} testId
   * @returns {Array}
   */
  getScreenshotsByTest( testId ) {
    const { selector } = this.props,
          commands = selector.findCommandsByTestId( testId );

    return Object.values( commands )
      .filter( command => ( command.method === "screenshot" && command.id in this.screenhotMap ) )
      .map( command => ({
        src: this.screenhotMap[ command.id ],
        title: command.params.name,
        inx: screenshotInx++
      }));
  }

  /**
   * Read screenshot dir recursevly and create map id => src
   * @returns {Object} - { id => src, .. }
   */
  async getScreenshoptMap() {
    const SCREENSHOT_PATH = join( this.props.projectDirectory, DIR_SCREENSHOTS ),
          files = await recursive( SCREENSHOT_PATH );

    return files.reduce(( carry, filepath ) => {
        const filename = basename( filepath ),
              [ id ] = filename.split( "." );
        carry[ id ] = filepath;
        return carry;
      }, {});
  }


   getSnapshotsByTest( testId ) {
    const { selector } = this.props,
          commands = selector.findCommandsByTestId( testId );

    return Object.values( commands )
      .filter( command => ( command.method === "assertScreenshot" && command.id in this.snapshotMap ) )
      .map( command => ({
        expected: {
          src: this.snapshotMap[ command.id ].expected,
          title: command.params.name,
          inx: screenshotInx++
        },
        actual: {
          src: this.snapshotMap[ command.id ].actual,
          title: command.params.name,
          inx: screenshotInx++
        },
        diff: {
          src: this.snapshotMap[ command.id ].diff,
          title: command.params.name,
          inx: screenshotInx++
        }
      }));
  }

  async getSnapshotMap() {
    const EXPECTED_PATH = join( this.props.projectDirectory, DIR_SNAPSHOTS, "expected" ),
          ACTUAL_PATH = join( this.props.projectDirectory, DIR_SNAPSHOTS, "actual" ),
          DIFF_PATH = join( this.props.projectDirectory, DIR_SNAPSHOTS, "diff" ),
          files = await readdir( EXPECTED_PATH );

    return files.reduce(( carry, expectedFilename ) => {
      const [ id ] = expectedFilename.split( "." ),
            actual = join( ACTUAL_PATH, expectedFilename ),
            diff = join( DIFF_PATH, expectedFilename ),
            expected = join( EXPECTED_PATH, expectedFilename );

      if ( fs.existsSync( actual ) && fs.existsSync( diff ) ) {
        this.props.action.addLightboxImages([ expected, actual, diff ]);
        carry[ id ] = {
          expected,
          actual,
          diff
        };
      }
      return carry;
    }, {});
  }


  async componentDidMount() {
    const { details, screenshotDirs, selector } = this.props;
    this.screenhotMap = await this.getScreenshoptMap();
    this.snapshotMap = await this.getSnapshotMap();

    this.props.action.cleanLightbox();

    // extend details with screenshots bopund to lightbox
    for ( let suiteKey of Object.keys( details ) ) {
      for ( let describeKey of Object.keys( details[ suiteKey ]) ) {
        for ( let inx in details[ suiteKey ][ describeKey ] ) {
          const spec = details[ suiteKey ][ describeKey ][ inx ],
                { title, testId } = this.parseTile( spec.title ),
                screenshots = this.getScreenshotsByTest( testId ),
                snapshots = spec.status === "passed" ? [] : this.getSnapshotsByTest( testId );

          screenshots && this.props.action.addLightboxImages( screenshots.map( item => item.src ) );

          Object.assign( details[ suiteKey ][ describeKey ][ inx ], {
              title,
              testId,
              screenshots,
              snapshots
          });
        }
      }
    }


    this.setState({ details });
  }

  onClickImg = ( e, inx ) => {
    e.preventDefault();
    this.props.action.setApp({ appLightbox: inx });
  }

  renderLine( spec ) {

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

      { spec.screenshots && <div className="thumb-container screenshot-thumb-container">
        { spec.screenshots.map( ( item, inx ) => ( <Thumbnail
          key={ inx } item={ item } onClickImg={ this.onClickImg } /> ) ) }
        </div>
      }


      { spec.snapshots && spec.snapshots.map( ( item, inx ) => ( <div
        key={ inx } className="thumb-container snapshot-thumb-container">
        <div>
          <h4>Expected</h4>
          <Thumbnail item={ item.expected } onClickImg={ this.onClickImg } />
        </div>
        <div>
          <h4>Actual</h4>
          <Thumbnail item={ item.actual } onClickImg={ this.onClickImg } />
        </div>
        <div>
          <h4>Diff</h4>
          <Thumbnail item={ item.diff } onClickImg={ this.onClickImg } />
        </div>
      </div> ) ) }


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
