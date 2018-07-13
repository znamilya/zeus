export default (namespace = '', syncTypes = [], asyncTypes = []) => {
    const syncActionTypes = syncTypes.reduce((accamulator, item) => {
        accamulator[item] = `${namespace}/${item}`;

        return accamulator;
    }, {});

    const asyncActionTypes = asyncTypes.reduce((accamulator, item) => {
        accamulator[item] = `${namespace}/${item}`;
        accamulator[`${item}_REQUEST`] = `${namespace}/${item}_REQUEST`;
        accamulator[`${item}_FAILURE`] = `${namespace}/${item}_FAILURE`;
        accamulator[`${item}_SUCCESS`] = `${namespace}/${item}_SUCCESS`;

        return accamulator;
    }, {});

    return {
        ...syncActionTypes,
        ...asyncActionTypes,
    };
};
