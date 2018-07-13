/* eslint-disable no-underscore-dangle */
import BaseBehavior from './BaseBehavior';
import utils from './utils';

const DEFAULT_ITEM_STATE = {
    meta: {
        error: null,
        status: 'idle',
    },
};

const createAsyncMutations = (behaviorOptions, localOptions) => ({
    REQUEST: (state, action) => {
        const id = utils.extractId(action, localOptions);
        const nextState = { ...state };

        if (!nextState[id]) {
            nextState[id] = DEFAULT_ITEM_STATE;
        }

        return {
            ...nextState,
            [id]: {
                ...nextState[id],
                meta: {
                    ...nextState[id].meta,
                    status: behaviorOptions.name,
                    error: null,
                },
            },
        };
    },
    SUCCESS: (state, action) => {
        const id = utils.extractId(action, localOptions);

        return {
            ...state,
            [id]: {
                ...state[id],
                meta: {
                    ...state[id].meta,
                    status: 'idle',
                },
            },
        };
    },
    FAILURE: (state, action) => {
        const id = utils.extractId(action, localOptions);
        const { error = {} } = action;

        return {
            ...state,
            [id]: {
                ...state[id],
                meta: {
                    ...state[id].meta,
                    status: 'idle',
                    error: {
                        reason: behaviorOptions.name,
                        code: error.code || -1,
                    },
                },
            },
        };
    },
});

export default class Behavior extends BaseBehavior {
    use(localOptions = {}) {
        if (this._options.useDefaultMutations && this._options.async) {
            const mutations = createAsyncMutations(this._options, localOptions);
            const prefix = utils.makeActionTypeName(this._options.name);
            this._mutationsWrapper = () => utils.namespacifyMutations(prefix, '_', mutations);
        }

        return {
            actions: this._actionsWrapper,
            asyncActions: this._asyncActionsWrapper,
            mutations: this._mutationsWrapper,
            selectors: this._selectorsWrapper,
            effects: this._effectsWrapper,
            options: localOptions,
        };
    }
}
