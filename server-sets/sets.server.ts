/// <reference path="./../typings/modules/ramda/index.d.ts" />

// tsc cards.server.ts && node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096 --stack_size=4096 cards.server.js

var jsonfile = require('jsonfile');
var R = require('ramda');
var cards = './server-cards.json';
var sets = './AllSets-x.json';
var fs = require('fs');
//var main = JSON.parse(fs.readFileSync('./AllCards-x.json', 'utf8'));
//var sets = JSON.parse(fs.readFileSync('./AllSets', 'utf8'));

var keys = [];
var denormalized;
var lengthArray = [];
jsonfile.readFile(cards, function (err, cards) {
	jsonfile.readFile(sets, function (err, sets) {
		let cardsVal = R.values(cards);
		let newData = sets;

		//console.log(cardsVal);
		for (let set in sets) {
			let setCards = sets[set].cards;
			let setCardsIds = [];
			for (let card in setCards) {
				let name = setCards[card].name;
				// console.log(setCards[card].name)
				let index = R.findIndex(R.propEq('name', name))(cardsVal);
				// console.log(index)
				setCardsIds.push(index);
			}
			newData[set].cards = setCardsIds;
			console.log(set, ' completed')
		}
		jsonfile.writeFile('server-sets.json', newData, function (err) {
			console.log(newData.length)
			console.error(err)
		});
	});
});


/*
jsonfile.readFile(cards, function (err, obj) {
	const keys = R.keys(obj);
	const cards = R.values(obj);
	let imgSrc = [];

		jsonfile.readFile('./AllSets-x.json', function (err, sets) {

		let setsVal = R.values(sets);

		for (let card in obj) {
			let printings = obj[card].printings;
			let newPrintings = R.map(function (ed) {
				let index = R.findIndex(R.propEq('name', obj[card].name))(sets[ed].cards);
				if (sets[ed].cards[index].number) {
					let mci = sets[ed].magicCardsInfoCode || ed.toLowerCase();
					return mci + '/' + sets[ed].cards[index].number
				} else
					return 'false'
			}, printings)
			imgSrc.push(newPrintings);
		}
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
*/




