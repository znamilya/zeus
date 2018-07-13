import Collection from '../Collection';
import Entity from '../Entity';

describe('Collection', () => {
    describe('new instance', () => {
        it('should create new collection', () => {
            const entity = new Entity({
                name: 'campaigns',
            });
            const collection = new Collection({
                entity,
            });

            expect(collection).toBeObject();
        });

        describe('default selectors', () => {
            describe('all entities', () => {
                const entity1 = {
                    id: 1,
                    title: 'title 1',
                };
                const entity2 = {
                    id: 2,
                    title: 'title 2',
                };
                const state = {
                    entities: {
                        campaigns: {
                            1: entity1,
                            2: entity2,
                        },
                    },
                    collections: {
                        allCampaigns: {
                            ids: [1, 2],
                            status: 'idle',
                        },
                    },
                };
                const entity = new Entity({
                    name: 'campaigns',
                });
                const collection = new Collection({
                    entity,
                });

                it('should add default selectors', () => {
                    expect(collection.selectors).toContainAllKeys(['get', 'getMeta', 'getData']);
                });

                it('"get" should return whole collection', () => {
                    expect(collection.selectors.get(state)).toEqual(state.collections.allCampaigns);
                });

                it('"getMeta" should return meta info', () => {
                    expect(collection.selectors.getMeta(state)).toEqual(
                        state.collections.allCampaigns,
                    );
                });

                it('"getData" should return array of items', () => {
                    const data = collection.selectors.getData(state);

                    expect(data).toBeArray();
                    expect(data).toHaveLength(2);
                    expect(data[0]).toBe(entity1);
                    expect(data[1]).toBe(entity2);
                });
            });

            describe('all entities with pagination', () => {
                const entity1 = {
                    id: 1,
                    title: 'title 1',
                };
                const entity2 = {
                    id: 2,
                    title: 'title 2',
                };
                const state = {
                    entities: {
                        campaigns: {
                            1: entity1,
                            2: entity2,
                        },
                    },
                    collections: {
                        allCampaigns: {
                            pageCount: 1,
                            itemsCount: 2,
                            currentPage: 1,
                            byPages: {
                                1: {
                                    ids: [1, 2],
                                    status: 'idle',
                                },
                            },
                        },
                    },
                };
                const entity = new Entity({
                    name: 'campaigns',
                });
                const collection = new Collection({
                    entity,
                    paginate: true,
                });

                it('should add default selectors', () => {
                    expect(collection.selectors).toContainAllKeys([
                        'getCurrentPage',
                        'getPageCount',
                        'getItemsCount',
                        'getMeta',
                        'getData',
                    ]);
                });

                it('"getCurrentPage" should return current page', () => {
                    expect(collection.selectors.getCurrentPage(state)).toEqual(1);
                });

                it('"getPageCount" should return page count', () => {
                    expect(collection.selectors.getPageCount(state)).toEqual(1);
                });

                it('"getItemsCount" should return items count', () => {
                    expect(collection.selectors.getItemsCount(state)).toEqual(2);
                });

                it('"getMeta" should return meta info for page', () => {
                    expect(collection.selectors.getMeta(state, 1)).toEqual(
                        state.collections.allCampaigns.byPages['1'],
                    );
                });

                it.skip('"getData" should return array of items for page', () => {
                    const data = collection.selectors.getData(state, 1);

                    expect(data).toBeArray();
                    expect(data).toHaveLength(2);
                    expect(data[0]).toBe(entity1);
                    expect(data[1]).toBe(entity2);
                });
            });

            describe('entities by entities', () => {
                const entity1 = {
                    id: 1,
                    title: 'title 1',
                };
                const entity2 = {
                    id: 2,
                    title: 'title 2',
                };
                const byEntity1 = {
                    id: 10,
                    name: 'John',
                };
                const state = {
                    entities: {
                        campaigns: {
                            1: entity1,
                            2: entity2,
                        },
                        users: {
                            1: byEntity1,
                        },
                    },
                    collections: {
                        campaignsByUsers: {
                            10: {
                                ids: [1, 2],
                                status: 'idle',
                            },
                        },
                    },
                };
                const entity = new Entity({
                    name: 'campaigns',
                });
                const byEntity = new Entity({
                    name: 'users',
                });
                const collection = new Collection({
                    entity,
                    by: byEntity,
                });

                it('should add default selectors', () => {
                    expect(collection.selectors).toContainAllKeys(['get', 'getData', 'getMeta']);
                });

                it('"get" should return whole collection', () => {
                    expect(collection.selectors.get(state)).toEqual(
                        state.collections.campaignsByUsers,
                    );
                });

                it('"getMeta" should return meta info', () => {
                    expect(collection.selectors.getMeta(state, 10)).toEqual(
                        state.collections.campaignsByUsers['10'],
                    );
                });

                it.skip('"getData" should return array of items for page', () => {
                    const data = collection.selectors.getData(state, 10);

                    expect(data).toBeArray();
                    expect(data).toHaveLength(2);
                    expect(data[0]).toBe(entity1);
                    expect(data[1]).toBe(entity2);
                });
            });

            describe('entities by entities with pagination', () => {
                const entity1 = {
                    id: 1,
                    title: 'title 1',
                };
                const entity2 = {
                    id: 2,
                    title: 'title 2',
                };
                const byEntity1 = {
                    id: 10,
                    name: 'John',
                };
                const state = {
                    entities: {
                        campaigns: {
                            1: entity1,
                            2: entity2,
                        },
                        users: {
                            1: byEntity1,
                        },
                    },
                    collections: {
                        campaignsByUsers: {
                            10: {
                                pageCount: 1,
                                itemsCount: 2,
                                currentPage: 1,
                                byPages: {
                                    1: {
                                        ids: [1, 2],
                                        status: 'idle',
                                    },
                                },
                            },
                        },
                    },
                };
                const entity = new Entity({
                    name: 'campaigns',
                });
                const byEntity = new Entity({
                    name: 'users',
                });
                const collection = new Collection({
                    entity,
                    by: byEntity,
                    paginate: true,
                });

                it('should add default selectors', () => {
                    expect(collection.selectors).toContainAllKeys([
                        'get',
                        'getCurrentPage',
                        'getPageCount',
                        'getItemsCount',
                        'getMeta',
                        'getData',
                    ]);
                });

                it('"getCurrentPage" should return current page', () => {
                    expect(collection.selectors.getCurrentPage(state, 10)).toEqual(1);
                });

                it('"getPageCount" should return page count', () => {
                    expect(collection.selectors.getPageCount(state, 10)).toEqual(1);
                });

                it('"getItemsCount" should return items count', () => {
                    expect(collection.selectors.getItemsCount(state, 10)).toEqual(2);
                });

                it('"getMeta" should return meta info for page', () => {
                    expect(collection.selectors.getMeta(state, 10, 1)).toEqual(
                        state.collections.campaignsByUsers['10'].byPages['1'],
                    );
                });

                it.skip('"getData" should return array of items for page', () => {
                    const data = collection.selectors.getData(state, 10, 1);

                    expect(data).toBeArray();
                    expect(data).toHaveLength(2);
                    expect(data[0]).toBe(entity1);
                    expect(data[1]).toBe(entity2);
                });
            });
        });
    });
});
