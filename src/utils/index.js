import makeActionTypes from './makeActionTypes';
import makeActionCreator from './makeActionCreator';
import makeReducer from './makeReducer';

export const toFirstUpperLetter = str => `${str[0].toUpperCase()}${str.slice(1)}`;
export const makeMetaName = (entity, by) => {
    const entityName = entity.name;
    const byName = by ? by.name : '';

    return byName
        ? `${entityName}By${toFirstUpperLetter(byName)}`
        : `all${toFirstUpperLetter(entityName)}`;
};

export const namespacifyMutations = (name = '', separator = '', reducerHandlers = {}) =>
    Object.keys(reducerHandlers).reduce((acc, key) => {
        acc[`${name}${separator}${key}`] = reducerHandlers[key];

        return acc;
    }, {});

const extractId = (action, { idKey, actionParams }) => {
    if (typeof idKey === 'function') {
        return idKey(action);
    }

    if (idKey) {
        return action[idKey];
    }

    if (actionParams) {
        return action[actionParams[0]];
    }

    return action.id;
};

const resolveCollectionItemPath = (options, action) => {
    const id = extractId(action, options);

    if (options.by) {
        if (options.paginate) {
            return [id, 'byPages', action.page];
        }

        return [id];
    }

    if (options.paginate) {
        return ['byPages', action.page];
    }

    return [];
};

const createError = (reason = '', error = {}) => ({
    reason,
    message: error.message || '',
    code: error.code || -1,
    request: error.request,
});

export default {
    makeReducer,
    makeActionTypes,
    makeActionType: (namespace, actionTypeName) => `${namespace}/${actionTypeName}`,
    makeActionCreator,
    makeActionTypeName: name => name.replace(/([A-Z])/g, '_$1').toUpperCase(),
    makeActionNameFromActionTypeName: name =>
        name.toLowerCase().replace(/(_([a-z]))/g, (match, x1, x2) => {
            return x2.toUpperCase();
        }),
    makeMetaName,
    namespacifyMutations,
    extractId,
    resolveCollectionItemPath,
    createError,
};
