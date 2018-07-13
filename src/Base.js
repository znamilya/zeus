/* eslint-disable no-underscore-dangle */
import { takeLatest } from "redux-saga/effects";
import utils from "./utils/index";

class Base {
  constructor(options) {
    this.actionTypes = {};
    this.actions = {};
    this.selectors = {};
    this._mutations = {};
    this.effects = [];
    this._options = {
      defaultState: {},
      defaultItemState: {},
      ...options
    };
  }

  addBehaviors(behaviors = []) {
    behaviors.forEach(behavior => {
      this._addActions(behavior.actions(this, behavior.options));
      this._addAsyncActions(behavior.asyncActions(this, behavior.options));

      if (Array.isArray(behavior.mutations)) {
        behavior.mutations.forEach(mutations => {
          this._addMutations(mutations(this, behavior.options));
        });
      } else {
        this._addMutations(behavior.mutations(this, behavior.options));
      }

      this._addSelectors(behavior.selectors(this, behavior.options));
      this._addEffects(behavior.effects(this, behavior.options));
    });

    return this;
  }

  addActions(actionsWrapper) {
    const actions = actionsWrapper(this);

    this._addActions(actions);

    return this;
  }

  _addActions(actions) {
    Object.entries(actions).forEach(([actionName, params = []]) => {
      const actionTypeName = utils.makeActionTypeName(actionName);
      const actionType = utils.makeActionType(this.name, actionTypeName);
      const action = utils.makeActionCreator(actionType, ...params);
      this.actionTypes[actionTypeName] = actionType;
      this.actions[actionName] = action;
    });
  }

  addAsyncActions(asyncActionsWrapper) {
    const asyncActions = asyncActionsWrapper(this);

    this._addAsyncActions(asyncActions);

    return this;
  }

  _addAsyncActions(actions) {
    Object.entries(actions).forEach(([actionName, params = []]) => {
      const actionTypeName = utils.makeActionTypeName(actionName);
      const actionTypes = utils.makeActionTypes(
        this.name,
        [],
        [actionTypeName]
      );
      const action = utils.makeActionCreator(
        actionTypes[actionTypeName],
        ...params
      );
      this.actionTypes = {
        ...this.actionTypes,
        ...actionTypes
      };
      this.actions[actionName] = action;
    });
  }

  addMutations(mutationsWrapper) {
    const mutations = mutationsWrapper(this);

    this._addMutations(mutations);

    return this;
  }

  _addMutations(mutations) {
    Object.entries(mutations).forEach(([actionTypeName, handler]) => {
      const isExternalActionType = actionTypeName.includes("/");
      const actionType = isExternalActionType
        ? actionTypeName
        : utils.makeActionType(this.name, actionTypeName);

      if (
        this._mutations[actionType] &&
        !Array.isArray(this._mutations[actionType])
      ) {
        this._mutations[actionType] = [this._mutations[actionType]];
        this._mutations[actionType].push(handler);
      } else {
        this._mutations[actionType] = handler;
      }
    });
  }

  addSelectors(selectorsWrapper) {
    const selectors = selectorsWrapper(this);

    this._addSelectors(selectors);

    return this;
  }

  _addSelectors(selectors) {
    Object.entries(selectors).forEach(([selectorName, fn]) => {
      this.selectors[selectorName] = fn;
    });
  }

  addEffects(effectsWrapper) {
    const effects = effectsWrapper(this);

    this._addEffects(effects);

    return this;
  }

  _addEffects(effects) {
    Object.entries(effects).forEach(([actionTypeName, handler]) => {
      this.effects[actionTypeName] = handler;
    });
  }

  getReducer() {
    return utils.makeReducer(this._options.defaultState, this._mutations);
  }

  *getSagas() {
    return yield Object.entries(this.effects).map(
      ([actionTypeName, handler]) => {
        const isExternalActionType = actionTypeName.includes("/");
        const actionType = isExternalActionType
          ? actionTypeName
          : utils.makeActionType(this.name, actionTypeName);

        return takeLatest(actionType, handler);
      }
    );
  }
}

export default Base;
