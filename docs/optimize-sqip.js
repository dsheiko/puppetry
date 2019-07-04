const { default: sqip } = require( 'sqip' );
const  { resolve } = require ( 'path' );

;(async () => {
  try {
    // Process whole folder with default settings
    const folderResults = await sqip({
      input: resolve(__dirname, 'assets/img/puppetry-welcome-620.png'),
      output: resolve(__dirname, 'assets/sqip/puppetry-welcome-620.svg'),
      plugins: [
        {
          name: 'sqip-plugin-primitive',
          options: {
            numberOfPrimitives: 16,
            mode: 1,
          },
        },
        `sqip-plugin-svgo`,
      ]
    })
    console.log(folderResults)
  } catch (err) {
    console.log('Something went wrong generating the SQIP previews')
    console.error(err)
  }
})()