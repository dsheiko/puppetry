const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
 
imagemin(['assets/img/*.{jpg,png}'], {
    destination: 'assets/img/build/',
    plugins: [
        imageminWebp({quality: 100})
    ]
}).then(( files ) => {
    console.log('Images optimized', files.length );
});