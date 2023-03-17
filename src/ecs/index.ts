const ENTITY_INDEX_BITS = 22;
const ENTITY_INDEX_MASK = (1 << ENTITY_INDEX_BITS) - 1;

const ENTITY_GENERATION_BITS = 8;
const ENTITY_GENERATION_MASK = (1 << ENTITY_GENERATION_BITS) - 1;
const MINIMUM_FREE_INDICES = 0;

class Entity {
    id: number;

    constructor(id: number) {
        this.id = id;
    }

    index(): number {
        return this.id & ENTITY_INDEX_MASK;
    }

    generation(): number {
        return (this.id >> ENTITY_INDEX_BITS) & ENTITY_GENERATION_MASK;
    }
}

class EntityManager {
    private free_indices: number[] = [];
    private generation: Map<number, number> = new Map();
    private entities: Map<number, Entity> = new Map();
    private components: Map<number, Map<string, any>> = new Map();

    public create(): Entity {
        let idx = 0;
        if (this.free_indices.length > MINIMUM_FREE_INDICES) {
            idx = this.free_indices.shift()!;
        } else {
            idx = this.generation.size;
            this.generation.set(idx, 0);
        }
        let entity = this.make_entity(idx, this.generation.get(idx)!);
        this.entities.set(idx, entity);
        return entity;
    }

    private make_entity(idx: number, generation: number): Entity {
        return new Entity(idx + (generation << ENTITY_INDEX_BITS));
    }

    public alive(e: Entity): boolean {
        return this.generation.get(e.index()) === e.generation();
    }

    public destroy(e: Entity): void {
        this.components.delete(e.id);
        this.entities.delete(e.id);
        let index = e.index();
        let generation = this.generation.get(index)! + 1;
        this.generation.set(index, generation);
        this.free_indices.push(index);
    }

    public asign(component: any, e: Entity): void {
        let entity_components = this.components.get(e.id);
        if (!entity_components) {
            this.components.set(e.id, new Map([[component.constructor.name, [component]]]));
            return;
        }
        let components_of_type = entity_components.get(component.constructor.name);
        if (!components_of_type) {
            let elComponents = this.components.get(e.id)!;
            elComponents.set(component.constructor.name, [component]);
            return;
        }
        if (components_of_type &&
            entity_components.get(component.constructor.name)
            .find((comp: any) => component === comp)
        )
            throw Error('Component is allready asiged');
        entity_components.get(component.constructor.name)!.push(component);
    }

    public get(c_type: any, e: Entity): any[] {
        let entity_components = this.components.get(e.id);
        if (!entity_components) {
            return [];
        }
        let components_of_type = entity_components.get(c_type.name);
        if (!components_of_type) {
            return [];
        }
        return components_of_type;
    }

    public remove(component: any, e: Entity): void {
        let entity_components = this.components.get(e.id);
        if (!entity_components) {
            return;
        }
        let components_of_type = entity_components.get(component.constructor.name);
        if (!components_of_type) {
            return;
        }
        entity_components.set(component.constructor.name, entity_components.get(component.constructor.name).filter((compon: any)=> {
            return compon !== component;
        }));
    }

    public getEnities(c_type: any): Entity[] {
        return [...this.entities.values()].filter(
            (entity) => {
                return entity && this.get(c_type, entity).length;
            }
        );
    }
}

export {Entity, EntityManager}