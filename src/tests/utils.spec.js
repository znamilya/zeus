import utils from '../utils';

describe('utils', () => {
    describe('makeMetaName', () => {
        const displsayAds = { name: 'displsayAds' };
        const campaigns = { name: 'campaigns' };

        it('should make name for one entity', () => {
            let actual = utils.makeMetaName(campaigns);

            expect(actual).toEqual('allCampaigns');

            actual = utils.makeMetaName(displsayAds);

            expect(actual).toEqual('allDisplsayAds');
        });

        it('should make name for two entities', () => {
            let actual = utils.makeMetaName(displsayAds, campaigns);

            expect(actual).toEqual('displsayAdsByCampaigns');
        });
    });

    describe('makeActionNameFromActionTypeName', () => {
        it('should make actionName from actionTypeName', () => {
            [['REMOVE_SELECTED', 'removeSelected'], ['FETCH', 'fetch'], ['UPDATE_THEM_ALL', 'updateThemAll']].forEach(
                ([actionTypeName, actionName]) => {
                    const actual = utils.makeActionNameFromActionTypeName(actionTypeName);

                    expect(actual).toEqual(actionName);
                },
            );
        });
    });

    describe('extractId', () => {
        const action = { id: 1, campaignId: 10, groupId: 100 };

        it('should use field "id" as a default idKey', () => {
            const options = {
                actionParams: ['id', 'campaignId', 'groupId'],
            };
            const id = utils.extractId(action, options);

            expect(id).toBe(action.id);
        });

        it('should use first item of actionParams if they has been passed and idKey hasn`t', () => {
            const options = {
                actionParams: ['campaignId', 'groupId'],
            };
            const id = utils.extractId(action, options);

            expect(id).toBe(action.campaignId);
        });

        it('can accpet a string with id key', () => {
            const options = {
                actionParams: ['id', 'campaignId', 'groupId'],
                idKey: 'groupId',
            };
            const id = utils.extractId(action, options);

            expect(id).toBe(action.groupId);
        });

        it('can accept a function to build an id key', () => {
            const options = {
                actionParams: ['id', 'campaignId', 'groupId'],
                idKey: ({ campaignId, groupId }) => `${campaignId}-${groupId}`,
            };
            const id = utils.extractId(action, options);

            expect(id).toBe(`${10}-${100}`);
        });
    });

    describe('namespacifyMutations', () => {
        const handlers = {
            create() {},
            update() {},
            remove() {},
        };
        const mutations = {
            CREATE: handlers.create,
            UPDATE: handlers.update,
            REMOVE: handlers.remove,
        };

        it('should add name to each mutation', () => {
            const name = 'test';
            const actual = utils.namespacifyMutations(name, '', mutations);

            expect(actual[`${name}CREATE`]).toBe(handlers.create);
            expect(actual[`${name}UPDATE`]).toBe(handlers.update);
            expect(actual[`${name}REMOVE`]).toBe(handlers.remove);
        });

        it('should add separator into each name', () => {
            const name = 'test';
            const separator = '~';
            const actual = utils.namespacifyMutations(name, separator, mutations);

            expect(actual[`${name}${separator}CREATE`]).toBe(handlers.create);
            expect(actual[`${name}${separator}UPDATE`]).toBe(handlers.update);
            expect(actual[`${name}${separator}REMOVE`]).toBe(handlers.remove);
        });
    });
});
