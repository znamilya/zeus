/* eslint-disable no-underscore-dangle */
import dotProp from 'dot-prop-immutable';
import BaseBehavior from './BaseBehavior';
import utils from './utils';

const DEFAULT_ITEM_STATE = {
    ids: [],
    error: null,
    status: 'idle',
};

const DEFAULT_PAGINATE_STATE = {
    currentPage: 1,
    itemsCount: 0,
    pageCount: 0,
    byPages: {},
};

const createAsyncAllMutations = behaviorOptions => ({
    REQUEST: state => ({
        ...DEFAULT_ITEM_STATE,
        ...state,
        status: behaviorOptions.name,
        error: null,
    }),
    SUCCESS: (state, { result }) => ({
        ...state,
        status: 'idle',
        ids: result || [],
    }),
    FAILURE: (state, { error = {} }) => ({
        ...state,
        status: 'idle',
        error: {
            reason: behaviorOptions.name,
            code: error.code || -1,
        },
    }),
});

const createAsyncAllPaginateMutations = (behaviorOptions, localOptions) => ({
    REQUEST: (state, action) => {
        const nextState = {
            ...DEFAULT_PAGINATE_STATE,
            ...state,
            // currentPage: action.page || 1,
        };

        return dotProp.set(nextState, ['byPages', action.page], pageState => ({
            ...DEFAULT_ITEM_STATE,
            ...pageState,
            status: behaviorOptions.name,
            error: null,
        }));
    },
    SUCCESS: (state, action) => {
        const page = action.page || 1;
        const nextState = {
            ...state,
            // currentPage: page,
            itemsCount: action.itemsCount,
            pageCount: Math.ceil(action.itemsCount / localOptions.paginate),
        };

        return dotProp.set(nextState, ['byPages', page], pageState => ({
            ...pageState,
            ids: action.result || [],
            status: 'idle',
        }));
    },
    FAILURE: (state, { error = {}, page }) =>
        dotProp.set(state, ['byPages', page || 1], pageState => ({
            ...pageState,
            status: 'idle',
            error: {
                reason: behaviorOptions.name,
                code: error.code || -1,
            },
        })),
});

const createAsyncByMutations = (behaviorOptions, localOptions) => ({
    REQUEST: (state, action) => {
        const id = utils.extractId(action, localOptions);

        return {
            ...state,
            [id]: {
                ...DEFAULT_ITEM_STATE,
                ...state[id],
                status: behaviorOptions.name,
                error: null,
            },
        };
    },
    SUCCESS: (state, action) => {
        const id = utils.extractId(action, localOptions);

        return {
            ...state,
            [id]: {
                ...state[id],
                status: 'idle',
                ids: action.result || [],
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
                status: 'idle',
                error: {
                    reason: behaviorOptions.name,
                    code: error.code || -1,
                },
            },
        };
    },
});

const createAsyncByPaginateMutations = (behaviorOptions, localOptions) => ({
    REQUEST: (state, action) => {
        const page = action.page || 1;
        const nextState = { ...state };
        const id = utils.extractId(action, localOptions);

        if (!nextState[id]) {
            nextState[id] = { ...DEFAULT_PAGINATE_STATE };
        }

        return {
            ...nextState,
            [id]: {
                ...nextState[id],
                // currentPage: page,
                byPages: {
                    ...nextState[id].byPages,
                    [page]: {
                        ...DEFAULT_ITEM_STATE,
                        ...nextState[id].byPages[page],
                        ids: [],
                        status: behaviorOptions.name,
                        error: null,
                    },
                },
            },
        };
    },
    SUCCESS: (state, action) => {
        const id = utils.extractId(action, localOptions);
        const page = action.page || 1;
        const nextState = dotProp.set(state, [id], itemState => ({
            ...itemState,
            // currentPage: page,
            itemsCount: action.itemsCount,
            pageCount: Math.ceil(action.itemsCount / localOptions.paginate),
        }));

        return dotProp.set(nextState, [id, 'byPages', page], pageState => ({
            ...pageState,
            ids: action.result || [],
            status: 'idle',
        }));
    },
    FAILURE: (state, action) => {
        const id = utils.extractId(action, localOptions);
        const { page = 1, error = {} } = action;

        return dotProp.set(state, [id, 'byPages', page], pageState => ({
            ...pageState,
            status: 'idle',
            error: {
                reason: behaviorOptions.name,
                code: error.code || -1,
            },
        }));
    },
});

const defaultOptions = {
    async: false,
    useDefaultMutations: false,
    mutationsStrategy: 'merge',
};

export default class Behavior extends BaseBehavior {
    constructor(options) {
        super(options);

        this._options = {
            ...defaultOptions,
            ...this._options,
        };
    }

    use(localOptions = {}) {
        let _defaultMutationsWrapper;

        if (this._options.useDefaultMutations && this._options.async) {
            let mutations;

            if (localOptions.by) {
                mutations = localOptions.paginate
                    ? createAsyncByPaginateMutations(this._options, localOptions)
                    : createAsyncByMutations(this._options, localOptions);
            } else {
                mutations = localOptions.paginate
                    ? createAsyncAllPaginateMutations(this._options, localOptions)
                    : createAsyncAllMutations(this._options, localOptions);
            }

            const prefix = utils.makeActionTypeName(this._options.name);
            _defaultMutationsWrapper = () => utils.namespacifyMutations(prefix, '_', mutations);
        }

        return {
            actions: this._actionsWrapper,
            asyncActions: this._asyncActionsWrapper,
            mutations: _defaultMutationsWrapper
                ? [_defaultMutationsWrapper, this._mutationsWrapper]
                : this._mutationsWrapper,
            selectors: this._selectorsWrapper,
            effects: this._effectsWrapper,
            options: localOptions,
        };
    }
}
