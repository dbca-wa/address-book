import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        users: new Map(),
        usersOrder: [],
        locations: new Map(),
        locationsOrder: [],
    },
    getters: {
        usersList: function (state) {
            return state.usersOrder;
        },
        user: function (state) {
            return function (id) {
                return state.users.get(id);
            };
        },
        locationsList: function (state) {
            return state.locationsOrder;
        },
        'location': function (state) {
            return function (id) {
                return state.locations.get(id);
            };
        },
    },
    plugins: [createPersistedState({
        key: 'oim_addressbook',
        paths: [],
        overwrite: true,
        // copy of the method from vuex-persistedstate, with shims for the 3 non-JS objects
        getState: function (key, storage, value) {
            var result = undefined;
            try {
                result = (value = storage.getItem(key)) && typeof value !== 'undefined'
                    ? JSON.parse(value)
                    : {
                        usersOrder: [],
                        locationsOrder: [],
                    };
            } catch (err) {
                console.log('getState failed');
            }

            var userMap = result.usersOrder ? result.usersOrder.map(function (el) {
                return [el.id, el];
            }) : [];
            result.users = new Map(userMap);
            var locationMap = result.locationsOrder ? result.locationsOrder.map(function (el) {
                return [el.id, el];
            }) : [];
            result.locations = new Map(locationMap);

            return result;
        }
    })],
    mutations: {
        updateUsers: function (state, usersList) {
            state.usersOrder = usersList;
            state.users = new Map(state.usersOrder.map(function (el) {
                return [el.id, el];
            }));
        },
        updateLocations: function (state, locationsList) {
            state.locationsOrder = locationsList;
            state.locations = new Map(state.locationsOrder.map(function (el) {
                return [el.id, el];
            }));
        },
    },
});

export default store
