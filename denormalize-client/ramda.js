/// <reference path="./typings/modules/ramda/index.d.ts" />
var jsonfile = require('jsonfile');
var R = require('ramda');
var main = './AllCards.json';
var scheme = './denormalized-cards.json';
var file = '/tmp/denormalized.json';
var keys = [];
var denormalized;
var lengthArray = [];
jsonfile.readFile(scheme, function (err, obj) {
    keys = R.keys(obj);
    console.log(keys);
});
jsonfile.readFile(main, function (err, obj) {
    var keys = R.keys(obj);
    var cards = R.values(obj);
    for (var i = 0; i < keys.length; i++) {
        lengthArray.push(i);
    }
    denormalized = {
        name: R.zipObj(lengthArray, R.pluck("name")(cards)),
        type: R.zipObj(lengthArray, R.pluck("type")(cards)),
        types: R.zipObj(lengthArray, R.pluck("types")(cards)),
        colors: R.zipObj(lengthArray, R.pluck("colors")(cards)),
        text: R.zipObj(lengthArray, R.pluck("text")(cards)),
        power: R.zipObj(lengthArray, R.pluck("power")(cards)),
        toughness: R.zipObj(lengthArray, R.pluck("toughness")(cards)),
        cmc: R.zipObj(lengthArray, R.pluck("cmc")(cards)),
        manacost: R.zipObj(lengthArray, R.pluck("manacost")(cards)),
        loyalty: R.zipObj(lengthArray, R.pluck("loyalty")(cards))
    };
    jsonfile.writeFile('denormalized.json', denormalized, function (err) {
        console.log(denormalized.name.length);
        console.error(err);
    });
});
