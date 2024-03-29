<template>
<div>
    <div id="filtering" class="callout warning hide"></div>

    <div class="grid-container">
        <div class="contact-header grid-x grid-padding-x align-middle" v-if="addressFilters.field_id">
            <div class="cell shrink">
                Filtering by: {{ addressFilters.name }}
            </div>
            <div class="cell auto">
                <button class="button hollow" v-on:click="$emit('clearFilters')">Clear filter</button>
            </div>
        </div>
        <div class="contact-header grid-x grid-padding-x">
            <div class="cell shrink">
                <label>
                    Show
                    <select class="contact-per-page" v-model="perPage">
                        <option v-for="pp in perPageChoices" v-bind:key="pp" v-bind:value="pp">{{ pp }}</option>
                    </select>
                    entries
                </label>
            </div>
            <div class="cell auto">

            </div>
            <div class="cell shrink">
                <label>
                    Search:
                    <input type="text" class="contact-search" placeholder="Name, title, location..." v-model="searchQuery" v-on:keyup="search"/>
                </label>
            </div>
        </div>
    </div>

    <paginate name="filterUsers" ref="paginator" tag="div" class="contact-list grid-container" v-bind:list="filteredUsers" v-bind:per="perPage">
        <div class="contact grid-x grid-padding-x align-middle align-center cell" v-if="paginated('filterUsers').length == 0">
            <img v-if="usersList.length == 0" v-bind:src="`${baseUrl}/${loadingImg}`" alt="Loading"/>
            <span v-else>No users match your query. Try removing some filters.</span>
        </div>
        <div class="contact grid-x grid-padding-x align-middle" v-for="(user, i) in paginated('filterUsers')" v-bind:key="i">
            <div class="cell auto">
                <ul class="no-bullet shrink">
                    <li><b>{{ user.name }}</b></li>
                    <li><i>{{ user.title }}</i></li>
                </ul>
            </div>
            <div class="cell auto show-for-medium details">
                <ul class="no-bullet shrink">
                    <li><a v-bind:href="`mailto:${ user.email }`">{{ user.email }}</a></li>
                    <li v-if="user.phone_landline"><b>Ph:</b> <a v-bind:href="`tel:${user.phone_landline}`">{{ user.phone_landline }}</a></li>
                    <li v-if="user.phone_mobile"><b>Mob:</b> <a v-bind:href="`tel:${user.phone_mobile}`">{{ user.phone_mobile }}</a></li>
                </ul>
            </div>
            <div class="cell auto show-for-large details">
                <ul class="no-bullet shink">
                    <li v-if="user.location"><b>Loc:</b> <a v-on:click="$emit('showModal', 'location', user.location.id)">{{ user.location.name }}</a></li>
                    <li v-if="user.unit"><b>Unit:</b> {{ user.unit }}</li>
                    <li v-if="user.division"><b>Grp:</b> {{ user.division }}</li>
                </ul>
            </div>
            <div class="cell shrink show-for-small-only side-controls print-hide">
                <div class="button-group">
                    <a v-if="user.phone_landline" v-bind:href="`tel:${user.phone_landline}`" class="button hollow"><i class="fi-telephone"></i></a>
                    <a v-bind:href="`mailto:${ user.email }`" class="button hollow"><i class="fi-mail"></i></a>
                </div>
            </div>
        </div>
    </paginate>

    <div class="grid-container">
        <div class="contact grid-x grid-padding-x">
            <div class="cell shrink">
                 <span v-if="$refs.paginator">Viewing {{ $refs.paginator.pageItemsCount }}</span>
            </div>
            <div class="cell auto">
            </div>
            <div class="cell shrink">
                <paginate-links for="filterUsers" v-bind:classes="{'ul': 'pagination', '.active': 'current'}" v-bind:show-step-links="true" v-bind:limit="4" ></paginate-links>
            </div>
        </div>
    </div>

</div>
</template>
<style lang="scss">

.f6inject {
    .float-right {
        float: right !important;
    }

    .details {
        font-size: 0.85rem;
    }

    .contact-header {
        background-color: #e6e6e6;
        border: 1px solid #e6e6e6;

        .contact-per-page, .contact-search {
            display: inline-block;
            margin: 0 0.5em;
        }

        .contact-per-page {
            width: 6em;
        }

        .contact-search {
            width: 12em;
        }

        .button, .button:hover {
            background-color: white;
            margin-bottom: 0;
        }
    }


    .contact-list {

    }

    .contact-list .contact {
        padding: 0.5em 0;
        border: 1px solid #f1f1f1;
    }

    .contact-list .contact:nth-child(2n) {
        background-color: #f1f1f1;
    }

    .nowrap { white-space: nowrap; }
    table .shrink * { font-size: 0.7rem }

    .loading-icon {
        padding: 2em;
        text-align: center;
    }

    .cell ul {
        margin-bottom: 0;
    }

    .side-controls .button-group {
        margin-bottom: 0;
        .button {
            font-size: 1.1rem;
        }
    }

    .orgSpecial {
        font-weight: bold;
    }

    @media print {
        /* when printing, hide elements with this CSS class */
        .print-hide {
            display: none !important;
        }

        /* by default link hrefs will be injected into page, disable */
        a[href]:after {
            content: none !important;
        }
    }
}

</style>
<script>
import { mapGetters } from 'vuex';
import { Search } from 'js-search';
import debounce from 'debounce';
import loadingImg from './assets/loading.gif';


var searchDB = new Search('id');
var searchKeys = [
    'name', 'preferred_name', 'email', 'title',
    'phone_landline', 'phone_extension', 'phone_mobile',
    'org_search', 'location_search',
];
searchKeys.forEach(function (key) {
    searchDB.addIndex(key);
});


export default {
    name: 'addressList',
    data: function () {
        return {
            perPageChoices: [10, 25, 50, 100],
            perPage: 25,
            searchQuery: '',
            paginate: ['filterUsers'],
            loadingImg,
        };
    },
    props: {
        baseUrl: String,
        addressFilters: Object,
        modal: Object,
        hideOrg: Boolean,
    },
    computed: {
        // used to render the list of users
        filteredUsers: function () {
            //console.log('filteredUsers');
            return this.usersList.filter(function(el) {return el.visible});
        },
         // bind to getters in store.js
        ...mapGetters([
            'usersList'
        ]),
        modalLocation: function () {
            return this.modal.location ? this.$store.getters.location(this.modal.location.id) : null;
        },
    },
    methods: {
        updateVisible: function () {
            var vm = this;
            var query = null;
            //console.log('updateVisible');

            // get a list of IDs that match the current search term (if exists)
            if (vm.searchQuery) {
                query = searchDB.search(vm.searchQuery).map(function (el) {
                    return el.id;
                });
            } else {
                query = vm.usersList.map(function (el) {
                    return el.id;
                });
            }
            //console.log(query);

            // apply address filter as a callback function.
            // address filter should have these properties:
            // - field_id: property name on the user object to match on
            // - name: string to show at the top next to "Filtering by:"
            // - value: value to match with
            // - mode: modifier to indicate a special type of match

            // here's one for a basic match-by-value
            var check_func = function (el) {
                if (!vm.addressFilters.field_id) {
                    return true;
                }
                var fields = vm.addressFilters.field_id.split('.');
                var base = el;
                for (var i=0; i<fields.length; i++) {
                    if (base == null) {
                        return false;
                    }
                    base = base[fields[i]];
                }

                return base == vm.addressFilters.value;
            };

            // add specific filter overrides for more complex lookups
            // this one searches inside the org_unit_chain list for a match
            if ((vm.addressFilters.mode == 'cascade') && (vm.addressFilters.field_id == 'org_unit.id')) {
                check_func = function (el) {
                    if (el == null) {
                        return false;
                    }
                    return el.org_unit_chain.findIndex(function (fl) {
                        return fl == vm.addressFilters.value;
                    }) != -1;
                };
            }

            vm.usersList.forEach(function (el) {
                el.visible = check_func(el);
                el.visible &= query.includes(el.id);
            });
        },
        // if the current search term changes, update the visible status of each record
        search: debounce( function () {
            this.updateVisible();
        }, 100 ),
    },
    watch: {
        addressFilters: function (val, oldVal) {
            // if the current address filter changes, clear the search and update the visible status of each record
            this.searchQuery = '';
            this.updateVisible();
        },
        usersList: function (val, oldVal) {
            // when the user list changes, update the search index
            searchDB.addDocuments(val);
            this.updateVisible();
        }
    },
    mounted: function () {
        // on first mount, update the search index with the current user list
        searchDB.addDocuments(this.usersList);
    }
}
</script>
