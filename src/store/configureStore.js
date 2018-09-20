import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import townhall from '../state/townhall/reducers';
import people from '../state/members-candidates/reducers';
import selections from '../state/selections/reducers';
import user from '../state/user/reducers';

export default () => {
    const store = createStore(
        combineReducers({
            people,
            selections,
            townhall,
            user,
        }),
        applyMiddleware(thunk),
    );
    return store;
};
