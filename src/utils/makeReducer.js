export default (defaultState, obj = {}) => {
    const reducer = (state = defaultState, action) => {
        if (!Object.prototype.hasOwnProperty.call(obj, action.type)) {
            return state;
        }

        const handlers = obj[action.type];

        if (Array.isArray(handlers)) {
            return handlers.reduce((nextState, handler) => handler(nextState, action), state);
        }

        return handlers(state, action);
    };

    return reducer;
};
