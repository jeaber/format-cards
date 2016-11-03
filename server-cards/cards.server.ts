/// <reference path="./../typings/modules/ramda/index.d.ts" />

// tsc cards.server.ts && node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096 --stack_size=4096 cards.server.js

var jsonfile = require('jsonfile');
var R = require('ramda');
var main = './AllCards-x.json';
var fs = require('fs')
//var main = JSON.parse(fs.readFileSync('./AllCards-x.json', 'utf8'));
//var sets = JSON.parse(fs.readFileSync('./AllSets', 'utf8'));

var keys = [];
var denormalized;
var lengthArray = [];

jsonfile.readFile(main, function (err, obj) {
	const keys = R.keys(obj);
	const cards = R.values(obj);
	let imgSrc = [];

		jsonfile.readFile('./AllSets-x.json', function (err, sets) {

		let setsVal = R.values(sets);
		let counterOfFailed = 0;
		// cycle through all cards
		for (let card in obj) {
			let printings = obj[card].printings;
			// cycle through printings
			let newPrintings = R.map(function (ed) {
				let index = R.findIndex(R.propEq('name', obj[card].name))(sets[ed].cards);
				let cardInSet = sets[ed].cards[index];
				if (obj[card].name === 'Declaration in Stone') {
					console.log(cardInSet)
				}

				if (cardInSet) {
					let mci = sets[ed].magicCardsInfoCode || ed.toLowerCase();
					let mciNumber = undefined;
					mciNumber = cardInSet.mciNumber || cardInSet.number;
					if (mciNumber && mciNumber.lastIndexOf('/'))
						mciNumber = mciNumber.slice(mciNumber.lastIndexOf('/')+1)
					if (mciNumber) {
						if (obj[card].name === 'Declaration in Stone')
							console.log(mci + '/' + mciNumber)
						return mci + '/' + mciNumber
					}

					else {
						counterOfFailed++;
						//console.log(sets[ed].cards[index].name)
						return 'false'
					}
				} else
					return 'false'
			}, printings)
			imgSrc.push(newPrintings);
		}
		console.log(counterOfFailed)
		imgSrc = R.map(function (images) {
			return R.filter(x => (x !== 'false' && R.match(/undefined/, x)), images)
		}, imgSrc)
		//	console.log(imgSrc, imgSrc.length, keys.length)

		for (var i = 0; i < keys.length; i++) {
			lengthArray.push(i);
		}
		var counter = 0;
		var newCards = R.map(function (card) {
			card['imgSrc'] = imgSrc[counter];
			counter++;
			return card
		}, cards);
		var newData = R.zipObj(lengthArray, newCards)
		//console.log(cards)
		/*			jsonfile.writeFile('card-server.json', newData, function (err) {
						// console.log(denormalized.name.length)
						console.error(err)
					})*/
		console.log(newData['15891'])
		jsonfile.writeFile('server-cards.json', newData, function (err) {
			console.log(newData.length)
			console.error(err)
		});
	});
});


