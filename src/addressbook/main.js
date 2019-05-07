import '../ieHacks.js';

import Vue from 'vue';
import Vuex from 'vuex';
import VuePaginate from 'vue-paginate';

Vue.use(Vuex);
Vue.use(VuePaginate);
Vue.config.productionTip = (process.env.NODE_ENV === 'production');

import store from './store.js';
import main from './main.vue';


var addressBookApp = function (target, args) {
    var options = {
        props: {
            baseUrl: args.baseUrl ? args.baseUrl : '',
            itAssetsUrl: args.itAssetsUrl ? args.itAssetsUrl : '', 
            kmiUrl: args.kmiUrl ? args.kmiUrl : '',
            hideOrg: args.hideOrg == 'true',
        }
    };

    /* eslint-disable no-new */
    return new Vue({
        store,
        render: function (h) {
            return h(main, options);
        }
    }).$mount(target);
};


export default addressBookApp
