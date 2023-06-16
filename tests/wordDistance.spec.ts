import assert from 'assert'
import 'mocha'
import {getKeyboardDistance, getWordWeightedDifference} from '../src'

describe('Keyboard distance', function () {
	it('keyboard distance should be 0, 0, 1, 2 one row', function () {
		assert.equal(getKeyboardDistance('a', 'a'), 0)
		assert.equal(getKeyboardDistance('a', 'A'), 0)
		assert.equal(getKeyboardDistance('a', 's'), 1)
		assert.equal(getKeyboardDistance('a', 'd'), 2)
	})
	it('keyboard distance cross row', function () {
		assert.equal(getKeyboardDistance('a', 'q'), 1.5)
		assert.equal(getKeyboardDistance('s', 'z'), 1.5)
		assert.equal(getKeyboardDistance('z', 's'), 1.5)
		assert.equal(getKeyboardDistance('w', 'z'), 2)
		assert.equal(getKeyboardDistance('t', 'c'), 3)
		assert.equal(getKeyboardDistance('b', 't'), 3)
	})
})


describe('wordWeightedDistance', function () {
	it('distance one row', function () {
		assert.equal(getWordWeightedDifference('a', 'a'), 0)
		assert.equal(getWordWeightedDifference('a', 'A'), 0.1)
		assert.equal(getWordWeightedDifference('a', 's'), 2 - 2/3)
		assert.equal(getWordWeightedDifference('a', 'd'), 2 - 1/2)
	})

	it('distance multiple letters', function () {

		const tests = [['wow','zow', 0.33],
		['tom','ton', 0.44],
		['perica','perjanica', 0.35],
		['trapezoid','gorgonzola', 1.27],
		['gorgonzola','trapezoid', 1.269],
		['otorinolaringologija','tra', 1.38],
		['mislilac','florida', 1.04],
		['fore','froe', 0.52],
		['froe','fore', 0.52],
		['marica','perica', 0.48],
		['perica','milica', 0.85],
		['marica','milica', 0.53],
		['perica','perica', 0],
		['peirca','perica', 0.33],
		['peica','perica', 0.2],
		['peica','perice', 0.52],
		['perica','peica', 0.55],
		['oeri','perica', 0.333],
		['oeric','perica', 0.266],
		['oerica','perica', 0.222],
		['oriica','perica', 0.33],
		['perica','dzigerica', 0.85],
	]
		for(let [first, second, expect] of tests){
			let val = getWordWeightedDifference(first as string, second as string)
			assert.ok(Math.abs(val- (expect as number))<0.03,first+' '+second + ' e: '+ expect+' v: '+val)
		}
	})

	it('distance multiple letters test extra', function () {

		const tests = [
		['o','Motor', 0.933],
		['ot','Motor', 0.46],
		['oto','Motor', 0.31],
		['otor','Motor', 0.23],
		['omo','Motor', 0.62],
		['omot','Motor', 0.47],
		['omoto','Motor', 0.37],
		['omotor','Motor', 0.37],
	]
		for(let [first, second, expect] of tests){
			let val = getWordWeightedDifference(first as string, second as string)
			assert.ok(Math.abs(val- (expect as number))<0.03,first+' '+second + ' e: '+ expect+' v: '+val)
		}
	})
})

