/* eslint-disable no-underscore-dangle */
import dotProp from "dot-prop-immutable";
import Base from "./Base";
import utils from "./utils/index";

export default class Entity extends Base {
  constructor(options) {
    super(options);

    if (!options.name || typeof options.name !== "string") {
      throw new Error(
        `[ZEUS] Extected name to be string, but got ${options.name}`
      );
    }

    this.name = options.name;
    this.schema = options.schema;
    this.schemas = [options.schema]; // Remove later
    this.API = options.API;
    this.selectors.get = state => state.entities[this.name];
    this.selectors.getById = (state, id) => this.selectors.get(state)[id];
    this.selectors.has = (state, id) =>
      this.selectors.get(state).hasOwnProperty(id);
    this.selectors.getProp = (state, id, prop) =>
      dotProp.get(this.selectors.getById(state, id), prop);
  }
}
