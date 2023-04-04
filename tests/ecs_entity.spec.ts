var assert = require('assert')
import { EntityManager } from '../src/index'
import 'mocha'

describe('EntityManager by entity', function () {
	it('should create entity, delete entity, overide entity', function () {
		var manager = new EntityManager()
		var a = manager.create()
		assert.equal(a.generation(), 0)
		assert.equal(a.index(), 0)
		var b = manager.create()
		assert.equal(b.generation(), 0)
		assert.equal(b.index(), 1)
		a.destroy()
		assert.ok(!a.alive())
		assert.ok(b.alive())
		var c = manager.create()
		assert.equal(c.generation(), 1)
		assert.equal(c.index(), 0)
		assert.ok(!a.alive())
	})

	it('it should add component, find component, run function, remove component', function () {
		class Component {
			a: number
			constructor(a: number){
				this.a = a
			}
			f(){
				this.a++
			}
		}
		var manager = new EntityManager()
		var entity = manager.create()
		assert.equal(entity.generation(), 0)
		assert.equal(entity.index(), 0)
		var component = new Component(5)
		entity.asign(component)
		var component_array = entity.get(Component)
		assert.equal(component_array.length, 1)
		assert.equal(component_array[0].a, 5)
		component_array.forEach(element => {
			element.f()
		})
		assert.equal(component_array[0].a, 6)
		entity.asign(new Component(3))
		entity.remove(component)
		assert.equal(entity.get(Component).length, 1)
	})
	it('it should add 2 components', function () {
		class Component {
			a: number
			constructor(a: number){
				this.a = a
			}
		}
		class ComponentB {
			a: number
			constructor(a: number){
				this.a = a
			}
		}
		var manager = new EntityManager()
		var entity = manager.create()
		var comp = new Component(2)
		entity.asign(comp)
		entity.asign(new ComponentB(3))
		assert.equal(entity.get(Component).length, 1)
		assert.throws(() => entity.asign(comp))
	})
	it('it should add 2 components with Component', function () {
		class Component {
			a: number
			constructor(a: number){
				this.a = a
			}
		}
		class ComponentB {
			a: number
			constructor(a: number){
				this.a = a
			}
		}
		var manager = new EntityManager()
		var entity0 = manager.create()
		var entity1 = manager.create()
		var entity2 = manager.create()
		entity0.asign(new Component(2))
		entity2.asign(new Component(2))
		entity2.asign(new ComponentB(2))
		entity1.asign(new ComponentB(2))
		assert.equal(manager.getEnities(Component).length, 2)
	})
})

