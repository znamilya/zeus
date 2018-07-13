/* eslint-disable no-underscore-dangle */
import utils from './utils';

const defaultOptions = {};

export default class Behavior {
    constructor(options) {
        this._options = {
            ...defaultOptions,
            ...options,
        };
        this._actionsWrapper = () => ({});
        this._asyncActionsWrapper = () => ({});
        this._mutationsWrapper = () => ({});
        this._selectorsWrapper = () => ({});
        this._effectsWrapper = () => [];
    }

    addActions(actionsWrapper) {
        this._actionsWrapper = actionsWrapper;

        return this;
    }

    addAsyncActions(asyncActionsWrapper) {
        this._asyncActionsWrapper = asyncActionsWrapper;

        return this;
    }

    addMutations(mutationsWrapper) {
        this._mutationsWrapper = mutationsWrapper;

        return this;
    }

    addSelectors(selectorsWrapper) {
        this._selectorsWrapper = selectorsWrapper;

        return this;
    }

    addEffects(effectsWrapper) {
        this._effectsWrapper = effectsWrapper;

        return this;
    }

    use(localOptions = {}) {
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
