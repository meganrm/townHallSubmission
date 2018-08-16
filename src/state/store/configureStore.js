import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import people from '../members-candidates/reducers';
import selections from '../selections/reducers';

export default () => {
    const store = createStore(
        combineReducers({
            people,
            selections,
        }),
        applyMiddleware(thunk),
    );
    return store;
};
