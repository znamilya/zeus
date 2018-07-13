import Entity from '../Entity';

describe('Entity', () => {
    describe('new instance', () => {
        it('should create new entity', () => {
            const entityName = 'test';
            const entity = new Entity({
                name: entityName,
            });

            expect(entity).toBeObject();
            expect(entity.name).toEqual(entityName);
        });

        it('should contain initial entity params', () => {
            const name = 'test';
            const schema = {};
            const API = {};
            const entity = new Entity({
                name,
                schema,
                API,
            });

            expect(entity.name).toBe(name);
            expect(entity.schema).toBe(schema);
            expect(entity.API).toBe(API);
        });

        it('should create schema array', () => {
            const schema = {};
            const entity = new Entity({
                name: 'test',
                schema,
            });

            expect(entity.schemas).toBeArray();
            expect(entity.schemas[0]).toBe(schema);
        });

        it('shouls create all entity`s stuff', () => {
            const entity = new Entity({
                name: 'test',
            });

            expect(entity.actions).toBeObject();
            expect(entity.actionTypes).toBeObject();
            expect(entity.selectors).toBeObject();
            expect(entity.effects).toBeArray();
        });

        describe('default selectors', () => {
            const entity1 = {
                title: 'title',
                parent: {
                    child: 'child',
                },
            };
            const entity2 = {};
            const state = {
                entities: {
                    tests: {
                        1: entity1,
                        2: entity2,
                    },
                },
            };

            it('should add default selectors', () => {
                const entity = new Entity({
                    name: 'actionTest',
                });

                expect(entity.selectors).toContainAllKeys(['get', 'getById', 'has', 'getProp']);
            });

            it('"get" should return all entities', () => {
                const entity = new Entity({
                    name: 'tests',
                });

                expect(entity.selectors.get(state)).toBe(state.entities.tests);
            });

            it('"getById" should return entity by id', () => {
                const entity = new Entity({
                    name: 'tests',
                });

                expect(entity.selectors.getById(state, 1)).toBe(entity1);
                expect(entity.selectors.getById(state, 2)).toBe(entity2);
            });

            it('"has" should return "true" if entity with passed id is exists', () => {
                const entity = new Entity({
                    name: 'tests',
                });

                expect(entity.selectors.has(state, 1)).toBeTrue();
                expect(entity.selectors.has(state, 2)).toBeTrue();
            });

            it('"has" should return "false" if entity with passed id isn`t exists', () => {
                const entity = new Entity({
                    name: 'tests',
                });

                expect(entity.selectors.has(state, 4)).toBeFalse();
                expect(entity.selectors.has(state, 6)).toBeFalse();
            });

            it('"getProp" should return prop of entity with passed id', () => {
                const entity = new Entity({
                    name: 'tests',
                });

                expect(entity.selectors.getProp(state, 1, 'title')).toEqual('title');
                expect(entity.selectors.getProp(state, 1, 'parent.child')).toEqual('child');
            });
        });
    });
});
