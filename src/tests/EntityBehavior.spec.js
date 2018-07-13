import EntityBehavior from '../EntityBehavior';
import Entity from '../Entity';

describe('EntityBehavior', () => {
    it('should create new behavior', () => {
        const behavior = new EntityBehavior({
            name: 'test',
        });

        expect(behavior).toBeObject();
    });

    describe('use', () => {
        it('should return wrappers and "use" options', () => {
            const actions = {};
            const asyncActions = {};
            const mutations = {};
            const selectors = {};
            const effects = {};
            const behavior = new EntityBehavior({
                name: 'test',
            })
                .addActions(() => actions)
                .addAsyncActions(() => asyncActions)
                .addMutations(() => mutations)
                .addSelectors(() => selectors)
                .addEffects(() => effects);
            const options = {};
            const stuff = behavior.use(options);

            expect(stuff.actions()).toBe(actions);
            expect(stuff.asyncActions()).toBe(asyncActions);
            expect(stuff.mutations()).toBe(mutations);
            expect(stuff.selectors()).toBe(selectors);
            expect(stuff.effects()).toBe(effects);
            expect(stuff.options).toBe(options);
        });
    });

    describe('default async mutations', () => {
        let behavior;
        let entity;
        let reducer;
        let state;

        beforeEach(() => {
            behavior = new EntityBehavior({
                name: 'fetch',
                async: true,
                useDefaultMutations: true,
            }).addAsyncActions(() => ({
                fetch: ['id'],
            }));
            entity = new Entity({
                name: 'test',
            }).addBehaviors([behavior.use()]);
            reducer = entity.getReducer();
            state = {
                1: {
                    id: 1,
                    meta: {},
                },
                2: {
                    id: 2,
                    meta: {},
                },
            };
        });

        it('should only use it if "useDefaultMutations" and "async" are "true"', () => {
            const behavior = new EntityBehavior({
                name: 'fetch',
                async: true,
                useDefaultMutations: true,
            });

            expect(behavior.use().mutations()).not.toBeEmpty();
        });

        it('should not use it if either "useDefaultMutations" or "async" are not "true"', () => {
            const behavior1 = new EntityBehavior({
                name: 'fetch',
                async: true,
                useDefaultMutations: false,
            });
            const behavior2 = new EntityBehavior({
                name: 'fetch',
                async: false,
                useDefaultMutations: true,
            });
            const behavior3 = new EntityBehavior({
                name: 'fetch',
            });

            expect(behavior1.use().mutations()).toBeEmpty();
            expect(behavior2.use().mutations()).toBeEmpty();
            expect(behavior3.use().mutations()).toBeEmpty();
        });

        it('request should change status to behavior name and reset an error', () => {
            state = reducer(state, {
                type: entity.actionTypes.FETCH_REQUEST,
                id: 1,
            });

            expect(state['1'].meta.error).toBeNil();
            expect(state['1'].meta.status).toBe('fetch');
        });

        it('success should change status to "idle"', () => {
            state = reducer(state, {
                type: entity.actionTypes.FETCH_REQUEST,
                id: 1,
            });
            state = reducer(state, {
                type: entity.actionTypes.FETCH_SUCCESS,
                id: 1,
            });

            expect(state['1'].meta.status).toBe('idle');
        });

        it('failure should change status to "idle" and add an error', () => {
            const error = { code: 3400 };
            state = reducer(state, {
                type: entity.actionTypes.FETCH_REQUEST,
                id: 1,
            });
            state = reducer(state, {
                type: entity.actionTypes.FETCH_FAILURE,
                id: 1,
                error,
            });

            expect(state['1'].meta.status).toBe('idle');
            expect(state['1'].meta.error).toBeObject();
            expect(state['1'].meta.error.code).toEqual(error.code);
            expect(state['1'].meta.error.reason).toEqual('fetch');
        });

        it('should not mutate any other entities', () => {
            const error = { code: 3400 };
            const orig2 = state['2'];
            state = reducer(state, {
                type: entity.actionTypes.FETCH_REQUEST,
                id: 1,
            });

            expect(state['2']).toBe(orig2);

            state = reducer(state, {
                type: entity.actionTypes.FETCH_SUCCESS,
                id: 1,
            });

            expect(state['2']).toBe(orig2);

            state = reducer(state, {
                type: entity.actionTypes.FETCH_FAILURE,
                id: 1,
                error,
            });

            expect(state['2']).toBe(orig2);
        });

        it('should add default item state on request if entity doesnt exist', () => {
            state = reducer(state, {
                type: entity.actionTypes.FETCH_REQUEST,
                id: 3,
            });

            expect(state['3']).toBeObject();
            expect(state['3'].meta).toBeObject();
        });
    });
});
