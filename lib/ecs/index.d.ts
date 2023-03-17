declare class Entity {
    id: number;
    constructor(id: number);
    index(): number;
    generation(): number;
}
declare class EntityManager {
    private free_indices;
    private generation;
    private entities;
    private components;
    create(): Entity;
    private make_entity;
    alive(e: Entity): boolean;
    destroy(e: Entity): void;
    asign(component: any, e: Entity): void;
    get(c_type: any, e: Entity): any[];
    remove(component: any, e: Entity): void;
    getEnities(c_type: any): Entity[];
}
export { Entity, EntityManager };
