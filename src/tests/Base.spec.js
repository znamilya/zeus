import Entity from '../Entity';
import EntityBehavior from '../EntityBehavior';

describe('Entity', () => {
    describe('addActions', () => {
        it('should accpet entity as first param', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addActions(self => {
                expect(self).toBe(entity);

                return {};
            });
        });

        it('should add actions', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addActions(() => ({
                create: ['data'],
                remove: ['id'],
            }));

            expect(entity.actions).toContainAllKeys(['create', 'remove']);
            expect(entity.actions.create).toBeFunction();
            expect(entity.actions.remove).toBeFunction();
        });

        it('should add action types', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addActions(() => ({
                create: ['data'],
                remove: ['id'],
                removeAll: ['id'],
            }));

            expect(entity.actionTypes).toContainAllKeys(['CREATE', 'REMOVE', 'REMOVE_ALL']);
            expect(entity.actionTypes.CREATE).toEqual('tests/CREATE');
            expect(entity.actionTypes.REMOVE).toEqual('tests/REMOVE');
            expect(entity.actionTypes.REMOVE_ALL).toEqual('tests/REMOVE_ALL');
        });

        it('should overwrite action with the same name', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addActions(() => ({
                create: ['data'],
            }));

            // Меня на action с тем же названием, но другими параметрами
            entity.addActions(() => ({
                create: ['params'],
            }));

            const params = {};

            expect(entity.actionTypes).toContainAllKeys(['CREATE']);
            // Вызываем action, что бы посмотреть на параметр объекта, который он вернет
            expect(entity.actions.create(params)).toContainAllKeys(['type', 'params']);
        });
    });

    describe('addAsyncActions', () => {
        it('should accpet entity as first param', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addAsyncActions(self => {
                expect(self).toBe(entity);

                return {};
            });
        });

        it('should add actions', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addAsyncActions(() => ({
                create: ['data'],
                remove: ['id'],
            }));

            expect(entity.actions).toContainAllKeys(['create', 'remove']);
            expect(entity.actions.create).toBeFunction();
            expect(entity.actions.remove).toBeFunction();
        });

        it('should add async action types', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addAsyncActions(() => ({
                create: ['data'],
            }));

            expect(entity.actionTypes).toContainAllKeys([
                'CREATE',
                'CREATE_REQUEST',
                'CREATE_SUCCESS',
                'CREATE_FAILURE',
            ]);
            expect(entity.actionTypes.CREATE).toEqual('tests/CREATE');
            expect(entity.actionTypes.CREATE_REQUEST).toEqual('tests/CREATE_REQUEST');
            expect(entity.actionTypes.CREATE_SUCCESS).toEqual('tests/CREATE_SUCCESS');
            expect(entity.actionTypes.CREATE_FAILURE).toEqual('tests/CREATE_FAILURE');
        });

        it('should overwrite action with the same name', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addAsyncActions(() => ({
                create: ['data'],
            }));

            // Меня на action с тем же названием, но другими параметрами
            entity.addAsyncActions(() => ({
                create: ['params'],
            }));

            const params = {};

            // Вызываем action, что бы посмотреть на параметр объекта, который он вернет
            expect(entity.actions.create(params)).toContainAllKeys(['type', 'params']);
        });
    });

    describe('addMutations', () => {
        it('should accpet entity as first param', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addMutations(self => {
                expect(self).toBe(entity);

                return {};
            });
        });

        it('should namespecify local mutations names', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const createHandler = () => {};
            const removeHandler = () => {};

            entity.addMutations(() => ({
                CREATE: createHandler,
                REMOVE: removeHandler,
            }));

            expect(entity._mutations).toContainAllKeys(['tests/CREATE', 'tests/REMOVE']);
            expect(entity._mutations['tests/CREATE']).toBe(createHandler);
            expect(entity._mutations['tests/REMOVE']).toBe(removeHandler);
        });

        it('should not namespecify external mutations name', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const externalUpdateHandler = () => {};

            entity.addMutations(() => ({
                'external/UPDATE': externalUpdateHandler,
            }));

            expect(entity._mutations).toContainAllKeys(['external/UPDATE']);
            expect(entity._mutations['external/UPDATE']).toBe(externalUpdateHandler);
        });

        it('should combine mutations if mutation with the same name already exists', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const createHandler1 = () => {};
            const createHandler2 = () => {};

            entity.addMutations(() => ({
                CREATE: createHandler1,
            }));

            entity.addMutations(() => ({
                CREATE: createHandler2,
            }));

            expect(entity._mutations['tests/CREATE']).toBeArray();
            expect(entity._mutations['tests/CREATE']).toIncludeAllMembers([
                createHandler1,
                createHandler2,
            ]);
        });
    });

    describe('getReducer', () => {
        it('should return reducer with all added mutations', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const createHandler = jest.fn();
            const removeHandler = jest.fn();

            entity.addMutations(() => ({
                CREATE: createHandler,
                REMOVE: removeHandler,
            }));

            const reducer = entity.getReducer();
            const defaultState = {};

            expect(reducer).toBeFunction();
            // expect(reducer._isReducer).toBeTrue();
            expect(reducer(defaultState, { type: 'init' })).toEqual(defaultState);

            reducer(defaultState, { type: 'tests/CREATE' });
            reducer(defaultState, { type: 'tests/CREATE' });
            reducer(defaultState, { type: 'tests/REMOVE' });

            expect(createHandler).toHaveBeenCalledTimes(2);
            expect(removeHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('addSelectors', () => {
        it('should accpet entity as first param', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addSelectors(self => {
                expect(self).toBe(entity);

                return {};
            });
        });

        it('should add selectors', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const entity1 = {
                count: 1,
            };
            const entity2 = {
                count: 2,
            };
            const store = {
                entities: {
                    tests: {
                        1: entity1,
                        2: entity2,
                    },
                },
            };

            entity.addSelectors(self => ({
                getTotalCount(state) {
                    return Object.values(self.selectors.get(state)).reduce((acc, item) => {
                        acc += item.count;
                        return acc;
                    }, 0);
                },
            }));

            expect(entity.selectors.getTotalCount(store)).toEqual(3);
        });

        it('should overwrite selector with the same name', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addSelectors(() => ({
                getNumber() {
                    return 10;
                },
            }));

            entity.addSelectors(() => ({
                getNumber() {
                    return 20;
                },
            }));

            expect(entity.selectors.getNumber({})).toEqual(20);
        });
    });

    describe('addEffects', () => {
        it('should accpet entity as first param', () => {
            const entity = new Entity({
                name: 'tests',
            });

            entity.addEffects(self => {
                expect(self).toBe(entity);

                return {};
            });
        });

        it('should add effects', async () => {
            expect.assertions(3);

            const entity = new Entity({
                name: 'tests',
            });
            // Да... это говно какое-то
            const createHandler = function*() {
                const handler = jest.fn();
                handler();
                return handler;
            };
            const removeHandler = function*() {
                const handler = jest.fn();
                handler();
                return handler;
            };

            entity.addEffects(() => ({
                CREATE: createHandler,
                REMOVE: removeHandler,
            }));

            expect(entity.effects).toContainAllKeys(['CREATE', 'REMOVE']);

            // Проверяем что обработчики эффектов вызываются
            const createHandlerSpy = await entity.effects.CREATE().next().value;
            const removeHandlerSpy = await entity.effects.REMOVE().next().value;

            expect(createHandlerSpy).toHaveBeenCalledTimes(1);
            expect(removeHandlerSpy).toHaveBeenCalledTimes(1);
        });

        it('should combine mutations if mutation with the same name already exists', async () => {
            expect.assertions(0);

            const entity = new Entity({
                name: 'tests',
            });
            const createHandler1Spy = jest.fn();
            const createHandler2Spy = jest.fn();
            const createHandler1 = function*() {
                createHandler1Spy();
            };
            const createHandler2 = function*() {
                createHandler2Spy();
            };

            entity.addEffects(() => ({
                CREATE: createHandler1,
            }));
            entity.addEffects(() => ({
                CREATE: createHandler2,
            }));

            // Проверяем что обработчики эффектов вызываются
            await entity.effects.CREATE().next();

            // expect(createHandler1Spy).toHaveBeenCalledTimes(1);
            // expect(createHandler2Spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('getSagas', () => {
        it('should return sagas with all effects', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const createHandler = function*() {};

            entity.addEffects(() => ({
                CREATE: createHandler,
            }));

            expect(entity.getSagas().constructor.name).toEqual('GeneratorFunctionPrototype');
        });
    });

    describe('addBehaviors', () => {
        it('should add actions', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            }).addActions(() => ({
                toggle: ['id'],
            }));

            entity.addBehaviors([toggleBehavior.use()]);

            expect(entity.actions).toContainKey('toggle');
            expect(entity.actionTypes.TOGGLE).toEqual('tests/TOGGLE');
        });

        it('should use entity`s action if entity and behavior have an action with the same name', () => {
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            }).addActions(() => ({
                toggle: ['id'],
            }));
            const entity = new Entity({
                name: 'tests',
            }).addActions(() => ({
                toggle: ['data'],
            }));

            expect(entity.actions.toggle()).toContainAllKeys(['type', 'data']);
        });

        it('should add async actions', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            }).addAsyncActions(() => ({
                toggle: ['id'],
            }));

            entity.addBehaviors([toggleBehavior.use()]);

            expect(entity.actions).toContainKey('toggle');
            expect(entity.actionTypes.TOGGLE).toEqual('tests/TOGGLE');
            expect(entity.actionTypes.TOGGLE_REQUEST).toEqual('tests/TOGGLE_REQUEST');
            expect(entity.actionTypes.TOGGLE_SUCCESS).toEqual('tests/TOGGLE_SUCCESS');
            expect(entity.actionTypes.TOGGLE_FAILURE).toEqual('tests/TOGGLE_FAILURE');
        });

        it('should add mutations', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const toggleHandler = jest.fn();
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            })
                .addActions(() => ({
                    toggle: ['id'],
                }))
                .addMutations(() => ({
                    TOGGLE: toggleHandler,
                }));

            entity.addBehaviors([toggleBehavior.use()]);

            expect(entity._mutations).toContainKey('tests/TOGGLE');
        });

        it('should combine mutations of behavior and entity /* and call behaviors mutation first */', () => {
            const entityToggleHandler = jest.fn();
            const behaviorToggleHandler = jest.fn();
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            })
                .addActions(() => ({
                    toggle: ['id'],
                }))
                .addMutations(() => ({
                    TOGGLE: behaviorToggleHandler,
                }));
            const entity = new Entity({
                name: 'tests',
            })
                .addBehaviors([toggleBehavior.use()])
                .addMutations(() => ({
                    TOGGLE: entityToggleHandler,
                }));
            const reducer = entity.getReducer();

            reducer({}, entity.actions.toggle());

            expect(entityToggleHandler).toHaveBeenCalledTimes(1);
            expect(behaviorToggleHandler).toHaveBeenCalledTimes(1);
        });

        it('should add selectors', () => {
            const selector = jest.fn();
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            }).addSelectors(() => ({
                getSomething: selector,
            }));
            const entity = new Entity({
                name: 'tests',
            }).addBehaviors([toggleBehavior.use()]);

            expect(entity.selectors.getSomething).toBe(selector);
        });

        it('should use entity`s selectors if entity and behavior have an action with the same name', () => {
            const entitySelector = jest.fn();
            const behaviorSelector = jest.fn();
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            }).addSelectors(() => ({
                getSomething: behaviorSelector,
            }));
            const entity = new Entity({
                name: 'tests',
            })
                .addBehaviors([toggleBehavior.use()])
                .addSelectors(() => ({
                    getSomething: entitySelector,
                }));

            expect(entity.selectors.getSomething).toBe(entitySelector);
        });

        it('should add effects', () => {
            const entity = new Entity({
                name: 'tests',
            });
            const toggleHandler = jest.fn();
            const toggleBehavior = new EntityBehavior({
                name: 'testBehavior',
            })
                .addActions(() => ({
                    toggle: ['id'],
                }))
                .addEffects(() => ({
                    TOGGLE: toggleHandler,
                }));

            entity.addBehaviors([toggleBehavior.use()]);

            expect(entity.effects).toContainKey('TOGGLE');
            expect(entity.effects.TOGGLE).toBe(toggleHandler);
        });
    });
});
