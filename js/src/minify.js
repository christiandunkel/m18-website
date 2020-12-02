'use strict';

/* 
 * =======
 * MODULES
 * =======
 */

const _ = {};
_.fs   = require('fs');
_.path = require('path');

// npm modules
_.uglify = require('uglify-js');



/*
 * =========
 * CONSTANTS
 * =========
 */
    
const INPUT_PATH = _.path.join(__dirname, 'app.js');
const OUTPUT_PATH = _.path.join(__dirname, '..', 'app.min.js');



/*
 * ================
 * PUBLIC FUNCTIONS
 * ================
 */
            
if (!_.fs.existsSync(INPUT_PATH) || !_.fs.statSync(INPUT_PATH).isFile()) {
    console.error(`Failed, because the input file path does not point to a valid file: ${INPUT_PATH}`);
    process.exit();
}

if (_.fs.existsSync(OUTPUT_PATH)) {
    _.fs.unlinkSync(OUTPUT_PATH);
}

const file_content = _.fs.readFileSync(INPUT_PATH).toString();
    
// minify the JavaScript script
const minified = _.uglify.minify(file_content, {
    compress : {},
    mangle : {},
    output : {
        ast : false,
        code : true
    }
});

// check if the minification was successful
if (minified.error) {
    console.error(`Uglify discovered an error on line "${_.path.basename(options.input[i])}:${minified.error.line}:${minified.error.pos}" that states: "${minified.error}"`);
    process.exit();
}

console.log(`\nSuccessfully minified the JavaScript script`,
            `\n  From: ${INPUT_PATH}`,
            `\n  To: ${OUTPUT_PATH}`,
            `\n`);
_.fs.writeFileSync(OUTPUT_PATH, minified.code, 'utf8');