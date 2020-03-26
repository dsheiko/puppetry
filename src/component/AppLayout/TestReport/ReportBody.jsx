/*eslint jsx-a11y/no-static-element-interactions: 0*/
import React from "react";
import PropTypes from "prop-types";
import AbstractComponent from "component/AbstractComponent";
import ErrorBoundary from "component/ErrorBoundary";
import If from "component/Global/If";
import { DIR_SCREENSHOTS, DIR_SNAPSHOTS, DIR_REPORTS } from "constant";
import { millisecondsToStr, result } from "service/utils";
import { Button } from "antd";
import { readdir } from "service/io";
import { join, basename } from "path";
import fs from "fs";
import recursive from "recursive-readdir";
import { Thumbnail } from "./Thumbnail";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

let counter = 0;

export class ReportBody extends AbstractComponent {

  static propTypes = {
    action: PropTypes.shape({
      setApp: PropTypes.func.isRequired,
      setLightboxIndex: PropTypes.func.isRequired
    }),
    details: PropTypes.object.isRequired,
    projectDirectory: PropTypes.string.isRequired
  }

  screenshotInx = 0;

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

  stripTpl( str ) {
    return str.replace( /\{\{.+\}\}/, "" );
  }

  /**
   * Find all screenshots belonging to a given test case
   * @param {string} testId
   * @returns {lightboxImage[]}
   */
  getScreenshotsByTest( testId ) {
    const { selector } = this.props,
          commandsObj = selector.findCommandsByTestId( testId );
    if ( typeof commandsObj === "undefined" || commandsObj === null ) {
      return [];
    }
    const commands = Object.values( commandsObj ),

          suiteScreenshots = commands
            .filter( command => (  command.method === "screenshot" && command.id in this.screenhotMap ) )
            .reduce( ( carry, command ) => {
              this.screenhotMap[ command.id ].forEach( src => {
                carry.push({
                  src,
                  caption: this.stripTpl( command.params.name ),
                  inx: this.screenshotInx++
                });
              });
              return carry;
            }, []),
          refScreenshots = commands
            .filter( command => (  command.ref && command.id in this.screenhotMap ) )
            .reduce( ( carry, command ) => {
              this.screenhotMap[ command.id ].forEach( src => {
                carry.push({
                  src,
                  caption: "Screenshot",
                  inx: this.screenshotInx++
                });
              });
              return carry;
            }, []);

    return suiteScreenshots.concat( refScreenshots );
  }

  /**
   * Read screenshot/reports dir recursevly and create map id => src
   * @param {String} dir
   * @returns {Object} - { id => src, .. }
   */
  async getAssetMap( dir ) {
    try {
      const dirPath = join( this.props.projectDirectory, dir ),
            files = await recursive( dirPath );

      return files.reduce( ( carry, filepath ) => {
        const filename = basename( filepath ),
              [ id ] = filename.split( "." ),
              newFilepath = ( dir === DIR_REPORTS ) ? filepath : `${ filepath }?${ Date.now() }`;
        carry[ id ] = result( carry, id, []);
        carry[ id ].push( newFilepath );
        return carry;
      }, {});
    } catch ( e ) {
      // e.g. nothing found
      return {};
    }
  }

  /**
   *
   * @param {String} testId
   * @returns {ScreenshotDTO[]}
   */
  getReportsByTest( testId ) {
    const { selector } = this.props,
          commandsObj = selector.findCommandsByTestId( testId );
    if ( typeof commandsObj === "undefined" || commandsObj === null ) {
      return [];
    }
    return Object.values( commandsObj )
      .filter( command => ( command.method === "assertPerformanceAssetWeight" && command.id in this.reportMap ) )
      .reduce( ( carry, command ) => {
        return carry.concat( this.reportMap[ command.id ]);
      }, []);
  }

  /**
   *
   * @param {String} testId
   * @returns {SnapshotDTO[]}
   */
  getSnapshotsByTest( testId ) {
    const { selector } = this.props,
          commandsObj = selector.findCommandsByTestId( testId );
    if ( typeof commandsObj === "undefined" || commandsObj === null ) {
      return [];
    }
    return Object.values( commandsObj )
      .filter( command => ( command.method === "assertScreenshot" && command.id in this.snapshotMap ) )
      .map( command => {
        const dto = this.snapshotMap[ command.id ],
              caption = this.stripTpl( command.params.name );

        return {
          expected: {
            src: dto.expected,
            caption,
            inx: this.screenshotInx++
          },
          actual: {
            src: dto.actual,
            caption,
            inx: this.screenshotInx++
          },
          diff: {
            src: dto.diff,
            caption,
            inx: this.screenshotInx++
          }
        };
      });
  }

  async getSnapshotMap() {
    try {
      const EXPECTED_PATH = join( this.props.projectDirectory, DIR_SNAPSHOTS, "expected" ),
            ACTUAL_PATH = join( this.props.projectDirectory, DIR_SNAPSHOTS, "actual" ),
            DIFF_PATH = join( this.props.projectDirectory, DIR_SNAPSHOTS, "diff" ),
            files = await readdir( EXPECTED_PATH );

      return files.reduce( ( carry, expectedFilename ) => {
        const [ id ] = expectedFilename.split( "." ),
              actual = join( ACTUAL_PATH, expectedFilename ),
              diff = join( DIFF_PATH, expectedFilename ),
              expected = join( EXPECTED_PATH, expectedFilename );

        if ( fs.existsSync( actual ) && fs.existsSync( expected ) ) {
          carry[ id ] = {
            expected: `${ expected }?${ Date.now() }`,
            actual: `${ actual }?${ Date.now() }`,
            diff: fs.existsSync( diff ) ? `${ diff }?${ Date.now() }` : null
          };
        }
        return carry;
      }, {});
    } catch ( e ) {
      // e.g. snapshot directories not found
      return {};
    }
  }


  async componentDidMount() {
    const { details } = this.props;

    this.screenshotInx = 0;

    this.props.action.cleanLightbox();

    this.screenhotMap = await this.getAssetMap( DIR_SCREENSHOTS );
    this.reportMap = await this.getAssetMap( DIR_REPORTS );

    this.snapshotMap = await this.getSnapshotMap();


    // extend details with screenshots bopund to lightbox
    for ( let suiteKey of Object.keys( details ) ) {
      for ( let describeKey of Object.keys( details[ suiteKey ]) ) {
        for ( let inx in details[ suiteKey ][ describeKey ]) {
          const spec = details[ suiteKey ][ describeKey ][ inx ],
                { title, testId } = this.parseTile( spec.title ),
                screenshots = this.getScreenshotsByTest( testId ),
                snapshots = spec.status === "passed" ? [] : this.getSnapshotsByTest( testId ),
                reports = this.getReportsByTest( testId );

          Object.assign( details[ suiteKey ][ describeKey ][ inx ], {
            title,
            testId,
            screenshots,
            snapshots,
            reports
          });
        }
      }
    }
    this.pupulateLightbox( details );
    this.setState({ details });
  }

  /**
   *
   * @typedef {Object} lightboxImage
   * @property {String} src
   * @property {String} caption
   * @property {Number} inx
   */

  /**
   * Detals come from props and extended with matching screenshots, snapshots
   * let's traverse it and extract images for Lightbox
   * @param {Object} details
   * @returns {undefined}
   */
  pupulateLightbox( details ) {
    /**
     * @type lightboxImage[]
     */
    let images = [];
    for ( let suiteKey of Object.keys( details ) ) {
      for ( let describeKey of Object.keys( details[ suiteKey ]) ) {
        for ( let inx in details[ suiteKey ][ describeKey ]) {
          const { screenshots, snapshots } = details[ suiteKey ][ describeKey ][ inx ];
          images = images.concat( screenshots );
          snapshots.forEach( snapshot => {
            images.push( snapshot.expected );
            images.push( snapshot.actual );
            snapshot.diff && images.push( snapshot.diff );
          });
        }
      }
    }
    this.props.action.setLightboxImages( images );
  }

  renderLine( spec ) {
    return ( <div
      key={ `k${ counter++ }` }
      className="test-report__it">
      <If exp={ spec.status === "passed" }>
        <CheckOutlined
          className="test-report__ok"
          fill="#52c41a" width="16" height="16" />
      </If>
      <If exp={ spec.status !== "passed" }>
        <CloseOutlined
          className="test-report__fail"
          fill="#eb2f96" width="16" height="16" />
      </If>
      { " " }<span className="test-report__it__title">{ spec.title }
        { " " }({ millisecondsToStr( spec.duration ) })
      </span>

      <If exp={ spec.status !== "passed" && spec.failureMessages }>
        <div  className="test-report__it__exception">{ spec.failureMessages }</div>
      </If>

      { spec.reports && <div className="thumb-container screenshot-thumb-container">
        { spec.reports.map( ( reportPath, inx ) => ( <Button
          key={ inx }
          onClick={ ( e ) => this.download( reportPath, e ) }>Download performance report</Button> ) ) }
      </div>
      }

      { spec.screenshots && <div className="thumb-container screenshot-thumb-container">
        { spec.screenshots.map( ( item, inx ) => ( <Thumbnail
          key={ inx } item={ item } action={ this.props.action } /> ) ) }
      </div>
      }


      { spec.snapshots && spec.snapshots.map( ( item, inx ) => ( <div
        key={ inx } className="thumb-container snapshot-thumb-container">
        <div>
          <h4>Expected</h4>
          <Thumbnail item={ item.expected }  action={ this.props.action } />
        </div>
        <div>
          <h4>Actual</h4>
          <Thumbnail item={ item.actual }  action={ this.props.action } />
        </div>
        { item.diff.src && <div>
          <h4>Diff</h4>
          <Thumbnail item={ item.diff }  action={ this.props.action } />
        </div> }
      </div> ) ) }


    </div> );
  }

  render() {
    const { details } = this.state;

    return ( <ErrorBoundary>

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
