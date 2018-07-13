/* eslint-disable no-underscore-dangle */
import Base from './Base';

export default class Feature extends Base {
    constructor(options) {
        super(options);

        if (!options.name || typeof options.name !== 'string') {
            throw new Error(`[ZEUS] Extected name to be string, but got ${options.name}`);
        }

        this.name = options.name;
        this.selectors.get = state => state.features[this.name];
    }
}
