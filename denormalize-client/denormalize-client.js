var jsonfile = require('jsonfile');
var R = require('ramda');
var main = './AllCards-x.json';
//var scheme = './denormalized-cards.json';
var file = '/tmp/denormalized.json';
//var keys = [];
var denormalized;
var lengthArray = [];
/*jsonfile.readFile(scheme, function (err, obj) {
    keys = R.keys(obj);
    console.log(keys);
});*/

//var firebase = "./../../server/firebase";
var database = require("./../../server/firebase").firebase.database();

jsonfile.readFile(main, function (err, obj) {
    var keys = R.keys(obj);
    var cards = R.values(obj);
    var price;
    for (var i = 0; i < keys.length; i++) {
        lengthArray.push(i);
    }
    database.ref('/cardkingdom/').once('value', function (dataSnapshot) {
        var obj = dataSnapshot.val();
        console.log(obj);
/*        for (var i = 0; i < lengthArray; i++) { // roll over all cards 17000+
            for (var j = 0; j < obj.data.length; j++) { // roll over all edition prices
                var editionPrice = {};
                editionPrice[obj[i].data[j].edition] = obj[i].data[j].inventory[1][2];
                price[i].push(editionPrice);

            }
        }*/
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
            console.log('done: ', denormalized.name.length);
            console.error(err);

            var dataRef = database.ref('/denormalized/');
            //inventory.created = new Date(inventory.created).toISOString();
            //console.log(inventory.created)
            /*            dataRef.set(denormalized, () => {
                            console.log('success setting /cards-denormalized');
                        });*/
        });
    });

});
