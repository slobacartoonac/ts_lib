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
		['perica','perjanica', 0.56],
		['trapezoid','gorgonzola', 1.4],
		['gorgonzola','trapezoid', 1.34],
		['otorinolaringologija','tra', 1.38],
		['mislilac','florida', 1.04],
		['fore','froe', 0.52],
		['froe','fore', 0.52],
		['marica','perica', 0.48],
		['perica','milica', 0.85],
		['marica','milica', 0.53],
		['perica','perica', 0],
		['peirca','perica', 0.33],
		['peica','perica', 0.61],
		['perica','peica', 0.74],
		['oeri','perica', 0.333],
		['oeric','perica', 0.266],
		['oerica','perica', 0.222],
		['oriica','perica', 0.5],
	]
		for(let [first, second, expect] of tests){
			let val = getWordWeightedDifference(first as string, second as string)
			assert.ok(Math.abs(val- (expect as number))<0.03,first+' '+second + ' e: '+ expect+' v: '+val)
		}
	})
})

