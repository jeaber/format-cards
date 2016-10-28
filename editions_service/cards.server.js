/// <reference path="./../typings/modules/ramda/index.d.ts" />
var jsonfile = require('jsonfile');
var R = require('ramda');
var main = './AllSets.json';
var keys = [];
var denormalized;
var lengthArray = [];
var shortArray = [], fullArray = [];
jsonfile.readFile(main, function (err, obj) {
    var keys = R.keys(obj);
    var sets = R.values(obj);
    for (var i = 0; i < keys.length; i++) {
        lengthArray.push(i);
        shortArray.push('short');
        fullArray.push('full');
    }
    //console.log(R.pluck("magicCardsInfoCode", sets));
    var shortVals = R.pluck("magicCardsInfoCode")(sets);
    var fullVals = R.pluck("name")(sets);
    for (var i = 0; i < shortVals.length; i++) {
        if (!shortVals[i]) {
            shortVals[i] = keys[i].toLowerCase();
        }
    }
    // var sObj = R.zip(shortArray, shortVals);
    // var fObj = R.zip(fullArray, fullVals);
    var bothObj = R.zip(shortVals, fullVals);
    bothObj = bothObj.map(function (x) {
        return {
            short: x[0],
            full: x[1]
        };
    });
    var newData = R.zipObj(keys, bothObj);
    //console.log(fObj, fullArray.length, fullVals.length);
    console.log(newData);
    jsonfile.writeFile('editionsMap.json', newData, function (err) {
        console.error(err);
    });
});
