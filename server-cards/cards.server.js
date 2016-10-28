/// <reference path="./../typings/modules/ramda/index.d.ts" />
// tsc cards.server.ts && node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096 --stack_size=4096 cards.server.js
var jsonfile = require('jsonfile');
var R = require('ramda');
var main = './AllCards-x.json';
var fs = require('fs');
//var main = JSON.parse(fs.readFileSync('./AllCards-x.json', 'utf8'));
//var sets = JSON.parse(fs.readFileSync('./AllSets', 'utf8'));
var keys = [];
var denormalized;
var lengthArray = [];
jsonfile.readFile(main, function (err, obj) {
    var keys = R.keys(obj);
    var cards = R.values(obj);
    var imgSrc = [];
    jsonfile.readFile('./AllSets-x.json', function (err, sets) {
        var setsVal = R.values(sets);
        var _loop_1 = function(card) {
            var printings = obj[card].printings;
            var newPrintings = R.map(function (ed) {
                var index = R.findIndex(R.propEq('name', obj[card].name))(sets[ed].cards);
                if (sets[ed].cards[index].number) {
                    var mci = sets[ed].magicCardsInfoCode || ed.toLowerCase();
                    return mci + '/' + sets[ed].cards[index].number;
                }
                else
                    return 'false';
            }, printings);
            imgSrc.push(newPrintings);
        };
        for (var card in obj) {
            _loop_1(card);
        }
        imgSrc = R.map(function (images) {
            return R.filter(function (x) { return (x !== 'false' && R.match(/undefined/, x)); }, images);
        }, imgSrc);
        //	console.log(imgSrc, imgSrc.length, keys.length)
        for (var i = 0; i < keys.length; i++) {
            lengthArray.push(i);
        }
        var counter = 0;
        var newCards = R.map(function (card) {
            card['imgSrc'] = imgSrc[counter];
            counter++;
            return card;
        }, cards);
        var newData = R.zipObj(lengthArray, newCards);
        //console.log(cards)
        /*			jsonfile.writeFile('card-server.json', newData, function (err) {
                        // console.log(denormalized.name.length)
                        console.error(err)
                    })*/
        jsonfile.writeFile('server-cards.json', newData, function (err) {
            console.log(newData.length);
            console.error(err);
        });
    });
});
