/* eslint-disable no-underscore-dangle */
import dotProp from "dot-prop-immutable";
import { createSelector } from "reselect";
import { denormalize } from "normalizr";
import Base from "./Base";
import utils from "./utils/index";

const DEFAULT_ITEM_STATE = {
  ids: [],
  error: null,
  status: "idle"
};

export default class Collection extends Base {
  constructor(options) {
    super(options);

    if (!options.entity) {
      throw new Error("[ZEUS] Expected entity to be passed");
    }

    this.name = options.name || utils.makeMetaName(options.entity, options.by);
    this.entity = options.entity;
    this.by = options.by;
    this.API = options.API;
    this.paginate = options.paginate;
    this.selectors = this._resolveDefaultSelectors();
    this._options = {
      defaultState: this.by ? {} : DEFAULT_ITEM_STATE,
      defaultItemState: DEFAULT_ITEM_STATE
    };
  }

  _resolveDefaultSelectors() {
    const getEntities = this.entity.selectors.get;
    const get = state => state.collections[this.name] || {};

    if (this.by) {
      if (this.paginate) {
        const getCurrentPage = (state, byId) =>
          dotProp.get(state, ["collections", this.name, byId, "currentPage"]) ||
          1;
        const getPageCount = (state, byId) =>
          dotProp.get(state, ["collections", this.name, byId, "pageCount"]) ||
          1;
        const getItemsCount = (state, byId) =>
          dotProp.get(state, ["collections", this.name, byId, "itemsCount"]) ||
          0;
        const getMeta = (state, byId, page) => {
          const currentPage = page || getCurrentPage(state, byId);

          return (
            dotProp.get(state, [
              "collections",
              this.name,
              byId,
              "byPages",
              currentPage
            ]) || DEFAULT_ITEM_STATE
          );
        };
        const getData = createSelector(
          [getMeta, state => state.entities],
          (meta, entities) =>
            denormalize(meta.ids, this.entity.schemas, entities)
        );

        return {
          get,
          getCurrentPage,
          getPageCount,
          getItemsCount,
          getMeta,
          getData
        };
      }

      const getMeta = (state, byId) =>
        get(state)[byId] || this._options.defaultItemState;
      const getData = createSelector([getEntities, getMeta], (entities, meta) =>
        meta.ids.map(id => entities[id]).filter(item => item)
      );

      return {
        get,
        getData,
        getMeta
      };
    }

    if (this.paginate) {
      const getCurrentPage = state =>
        dotProp.get(state, ["collections", this.name, "currentPage"]) || 1;
      const getPageCount = state =>
        dotProp.get(state, ["collections", this.name, "pageCount"]) || 1;
      const getItemsCount = state =>
        dotProp.get(state, ["collections", this.name, "itemsCount"]) || 0;
      const getMeta = (state, page) => {
        const currentPage = page || getCurrentPage(state);

        return (
          dotProp.get(state, [
            "collections",
            this.name,
            "byPages",
            currentPage
          ]) || DEFAULT_ITEM_STATE
        );
      };
      const getData = createSelector(
        [getMeta, state => state.entities],
        (meta, entities) => denormalize(meta.ids, this.entity.schemas, entities)
      );

      return {
        getCurrentPage,
        getPageCount,
        getItemsCount,
        getMeta,
        getData
      };
    }

    const getMeta = state =>
      state.collections[this.name] || this._options.defaultItemState;
    const getData = createSelector([getEntities, getMeta], (entities, meta) =>
      meta.ids.map(id => entities[id]).filter(item => item)
    );

    return {
      get,
      getMeta,
      getData
    };
  }
}
