module.exports = async( cwd, targetFiles ) => {
  const { runCLI } = require( "jest-cli/build/cli" ),
        options = {
          projects: [ cwd ],
          _: targetFiles,
          silent: true,
          // Shall disable output, but instead switch to stderr
          // https://github.com/facebook/jest/issues/5064
          json: true,
          showConfig: false
        };
  return await runCLI( options, options.projects );
};