import CollectionBehavior from '../CollectionBehavior';
import Collection from '../Collection';
import Entity from '../Entity';

describe('CollectionBehavior', () => {
    it('should create new behavior', () => {
        const behavior = new CollectionBehavior({
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
            const behavior = new CollectionBehavior({
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
        describe('all', () => {
            let behavior;
            let entity;
            let collection;
            let reducer;
            let state;

            beforeEach(() => {
                behavior = new CollectionBehavior({
                    name: 'fetch',
                    async: true,
                    useDefaultMutations: true,
                }).addAsyncActions(() => ({
                    fetch: ['id'],
                }));
                entity = new Entity({
                    name: 'campaigns',
                });
                collection = new Collection({
                    entity,
                }).addBehaviors([behavior.use()]);
                reducer = collection.getReducer();
                state = {
                    ids: [],
                    status: 'idle',
                    error: null,
                };
            });

            it('should manage status and error', () => {
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_REQUEST,
                });

                expect(state.error).toBeNil();
                expect(state.status).toBe('fetch');

                state = reducer(state, {
                    type: collection.actionTypes.FETCH_SUCCESS,
                });

                expect(state.status).toBe('idle');

                const error = { code: 3400 };
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_FAILURE,
                    error,
                });

                expect(state.status).toBe('idle');
                expect(state.error).toBeObject();
                expect(state.error.code).toEqual(error.code);
                expect(state.error.reason).toEqual('fetch');
            });
        });

        describe('all with pagination', () => {
            let behavior;
            let entity;
            let collection;
            let reducer;
            let state;

            beforeEach(() => {
                behavior = new CollectionBehavior({
                    name: 'fetch',
                    async: true,
                    useDefaultMutations: true,
                }).addAsyncActions(() => ({
                    fetch: ['id'],
                }));
                entity = new Entity({
                    name: 'campaigns',
                });
                collection = new Collection({
                    entity,
                    paginate: true,
                }).addBehaviors([behavior.use({ paginate: true })]);
                reducer = collection.getReducer();
                state = {
                    pageCount: 1,
                    itemsCount: 0,
                    currentPage: 1,
                    byPages: {
                        1: {
                            ids: [],
                            status: 'idle',
                        },
                    },
                };
            });

            it('should manage status and error', () => {
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_REQUEST,
                    page: 1,
                });

                expect(state.byPages['1'].error).toBeNil();
                expect(state.byPages['1'].status).toBe('fetch');

                state = reducer(state, {
                    type: collection.actionTypes.FETCH_SUCCESS,
                    page: 1,
                });

                expect(state.byPages['1'].status).toBe('idle');

                const error = { code: 3400 };
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_FAILURE,
                    page: 1,
                    error,
                });

                expect(state.byPages['1'].status).toBe('idle');
                expect(state.byPages['1'].error).toBeObject();
                expect(state.byPages['1'].error.code).toEqual(error.code);
                expect(state.byPages['1'].error.reason).toEqual('fetch');
            });
        });

        describe('by', () => {
            let behavior;
            let entity;
            let entityBy;
            let collection;
            let reducer;
            let state;

            beforeEach(() => {
                behavior = new CollectionBehavior({
                    name: 'fetch',
                    async: true,
                    useDefaultMutations: true,
                }).addAsyncActions(() => ({
                    fetch: ['id'],
                }));
                entity = new Entity({
                    name: 'campaigns',
                });
                entityBy = new Entity({
                    name: 'users',
                });
                collection = new Collection({
                    entity,
                    by: entityBy,
                }).addBehaviors([behavior.use({ by: true })]);
                reducer = collection.getReducer();
                state = {
                    1: {
                        ids: [],
                        status: 'idle',
                    },
                };
            });

            it('should manage status and error', () => {
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_REQUEST,
                    id: 1,
                });

                expect(state['1'].error).toBeNil();
                expect(state['1'].status).toBe('fetch');

                state = reducer(state, {
                    type: collection.actionTypes.FETCH_SUCCESS,
                    id: 1,
                });

                expect(state['1'].status).toBe('idle');

                const error = { code: 3400 };
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_FAILURE,
                    id: 1,
                    error,
                });

                expect(state['1'].status).toBe('idle');
                expect(state['1'].error).toBeObject();
                expect(state['1'].error.code).toEqual(error.code);
                expect(state['1'].error.reason).toEqual('fetch');
            });
        });

        describe('by with pagination', () => {
            let behavior;
            let entity;
            let entityBy;
            let collection;
            let reducer;
            let state;

            beforeEach(() => {
                behavior = new CollectionBehavior({
                    name: 'fetch',
                    async: true,
                    useDefaultMutations: true,
                }).addAsyncActions(() => ({
                    fetch: ['id'],
                }));
                entity = new Entity({
                    name: 'campaigns',
                });
                entityBy = new Entity({
                    name: 'users',
                });
                collection = new Collection({
                    entity,
                    by: entityBy,
                    paginate: true,
                }).addBehaviors([behavior.use({ by: true, paginate: true })]);
                reducer = collection.getReducer();
                state = {
                    1: {
                        pageCount: 1,
                        itemsCount: 0,
                        currentPage: 1,
                        byPages: {
                            1: {
                                ids: [],
                                status: 'idle',
                            },
                        },
                    },
                };
            });

            it('should manage status and error', () => {
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_REQUEST,
                    id: 1,
                    page: 1,
                });

                expect(state['1'].byPages['1'].error).toBeNil();
                expect(state['1'].byPages['1'].status).toBe('fetch');

                state = reducer(state, {
                    type: collection.actionTypes.FETCH_SUCCESS,
                    id: 1,
                    page: 1,
                });

                expect(state['1'].byPages['1'].status).toBe('idle');

                const error = { code: 3400 };
                state = reducer(state, {
                    type: collection.actionTypes.FETCH_FAILURE,
                    id: 1,
                    page: 1,
                    error,
                });

                expect(state['1'].byPages['1'].status).toBe('idle');
                expect(state['1'].byPages['1'].error).toBeObject();
                expect(state['1'].byPages['1'].error.code).toEqual(error.code);
                expect(state['1'].byPages['1'].error.reason).toEqual('fetch');
            });
        });
    });
});
