var jsonfile = require('jsonfile');
var R = require('ramda');
var main = './AllCards-x.json';
var fs = require('fs');
var _ = require('lodash');
var keys = [];
var denormalized;
var lengthArray = [];
jsonfile.readFile(main, function (err, obj) {
    var keys = R.keys(obj);
    var cards = R.values(obj);
    var imgSrc = [];
    jsonfile.readFile('./AllSets-x.json', function (err, sets) {
        var setsVal = R.values(sets);
        var counterOfFailed = 0;
        // cycle through all cards
        var _loop_1 = function(card) {
            var printings = obj[card].printings;
            // cycle through printings
            var newPrintings = R.map(function (ed) {
                var index = R.findIndex(R.propEq('name', obj[card].name))(sets[ed].cards);
                var cardInSet = sets[ed].cards[index];
                if (obj[card].name === 'Declaration in Stone') {
                    console.log(cardInSet);
                }
                if (cardInSet) {
                    var mci = sets[ed].magicCardsInfoCode || ed.toLowerCase();
                    var mciNumber = undefined;
                    mciNumber = cardInSet.mciNumber || cardInSet.number;
                    if (mci === 'mps')
                        mci = 'mpskld';
                    if (mciNumber && mciNumber.lastIndexOf('/'))
                        mciNumber = mciNumber.slice(mciNumber.lastIndexOf('/') + 1);
                    if (mciNumber) {
                        if (obj[card].name === 'Declaration in Stone')
                            console.log(mci + '/' + mciNumber);
                        return mci + '/' + mciNumber;
                    }
                    else {
                        counterOfFailed++;
                        //console.log(sets[ed].cards[index].name)
                        return 'false';
                    }
                }
                else
                    return 'false';
            }, printings);
            imgSrc.push(newPrintings);
        };
        for (var card in obj) {
            _loop_1(card);
        }
        console.log(counterOfFailed);
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
        console.log(newData['15891']);
        jsonfile.writeFile('server-cards.json', newData, function (err) {
            console.log(newData.length);
            console.error(err);
        });
    });
});
