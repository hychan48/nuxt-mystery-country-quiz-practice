/**
yarn add mocha -D

package.json
  "imports": {
    "##/*": {
      "default": "./*"
    },
  },
  "type": "module",

  jsconfig.json
  {
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "##/*": ["./*"]
    }
  },
  "exclude": ["node_modules", ".nuxt", "dist"]
}



*/
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const assert = require('assert');
// const {describe,it} = require('mocha');
import assert from 'node:assert';
import { describe, it} from 'mocha';
/*
1.
yarn add mocha @babel/polyfill @babel/register @babel/preset-env babel-plugin-module-resolver --dev
yarn add @babel/core --dev
2.
-r @babel/register -r babel-plugin-module-resolver

3.
.babelrc
{

  "presets": ["@babel/preset-env"],
  "plugins": [
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "test": "./test",
        "underscore": "lodash",

        "~": "./"
      }
    }]
  ]

}
test specific timeout
this.timeout(500);//500ms
*/
/**
 * Should put this somewhere safe
 * todo filepath needs to be initialized as well...
 * @param fileName .json
 * @param data will automatically be changed
 */
import fs from 'node:fs';
function writeToFile(fileName,data,space=2){
  const sFileName = /\./.test(fileName) ? fileName : fileName + '.json';
  const filePath = `dev/${sFileName}`
  fs.writeFileSync(filePath,
    typeof data === 'string' ? data :JSON.stringify(data,null,+space)
  );
}
import countBy from 'lodash.countby'
describe('dataTransformer', function(){

  /**
   * Mystery country is
   * Continent
   * FL, LL
   * Landmass (ignore for now)
   */
  const aRows = JSON.parse(fs.readFileSync("dev/jet_punk_countries_by_region.json"));
  const Headers = ["Europe","Asia","Africa",'North America','South America',"Oceania"];
  it('Mystery Country', function(){
    //assert.strictEqual(1,1);//require assert
    // console.log(aRows);
    let outRows = [];
    for (let i = 0; i < aRows.length; i++) {
      const row = aRows[i];

      //lazy parse and add
      for (let j = 0; j < Headers.length; j++) {
        const headerKey = Headers[j];
        const countryJ = row[headerKey];
        if(countryJ){
          /* format */
          // outRows.push(countryJ)

          outRows.push({
            country:countryJ,
            continent:headerKey,
            firstLetter:countryJ[0].toLowerCase(),
            lastLetter:countryJ[countryJ.length - 1],

            //todo maybe do count of firstLetter and lastLetter
          })
        }

      }

    }
    /* add count of firstLetter and lastLetter */

      const itemCountByKeys = ["firstLetter","lastLetter"];
      for (let i = 0; i < itemCountByKeys.length; i++) {
        const itemCountByKey = itemCountByKeys[i];
        let itemCountBy = countBy(outRows, itemCountByKey);
        outRows.forEach(val =>{
          val[itemCountByKey + 'Count'] = itemCountBy[val[itemCountByKey]]
        })
        // console.log(itemCountBy);
      }
      // console.log(outRows);



    // console.log(outRows);
    writeToFile('mysteryCountryFormat.json', outRows)
    console.log(outRows.length);//missing 10 countries

    /* assert length */
    assert.strictEqual(outRows.length,196);


  });

});
