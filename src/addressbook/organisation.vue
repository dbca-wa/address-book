<template>
    <div>
        <div class="grid-container">
            <div class="contact-header grid-x grid-padding-x">
                <div class="cell auto">

                </div>
                <div class="cell shrink">
                    <label>
                        Search:
                        <input type="text" class="contact-search" placeholder="Unit name" v-model="searchQuery" v-on:keyup="search"/>
                    </label>
                </div>
            </div>
        </div>

        <div class="grid-container">
            <department v-for="unit in orgTree" v-on:showOrg="showOrg" v-bind:key="unit.id" v-bind:unit="unit" v-bind:filterIds="filterIds"/>
        </div>
        <div class="reveal-overlay show" v-on:click="$emit('showModal', 'orgUnit', null)" v-if="modal">
            <div class="small reveal" v-on:click.stop tabindex="-1">
                <h3>{{ modal.name }}</h3>
                <div class="button-group"><button class="button hollow" v-on:click="setFilter(modal, 'cascade')">List all users (this and all subunits)&nbsp;&nbsp;<i class="fi-filter"></i></button><button class="button hollow" v-on:click="setFilter(modal, 'single')">List users (this unit only)&nbsp;&nbsp;<i class="fi-filter"></i></button></div>
                
                <div class="grid-container full detailList">
                    <div class="grid-x grid-margin-x" v-if="modal.acronym">
                        <div class="cell large-2 large-text-right"><b>Acronym:</b></div>
                        <div class="cell auto">{{ modal.acronym }}</div>
                    </div>
                    <div class="grid-x grid-margin-x" v-if="modal.unit_type">
                        <div class="cell large-2 large-text-right"><b>Type:</b></div>
                        <div class="cell auto">{{ modal.unit_type }}</div>
                    </div>
                    <div class="grid-x grid-margin-x" v-if="modalLocation">
                        <div class="cell large-2 large-text-right"><b>Location:</b></div>
                        <div class="cell auto">
                            <a v-on:click="$emit('showModal', 'location', modalLocation.id)">{{ modalLocation.name }}</a><br/>
                            {{ modalLocation.address }}<br/>
                        </div>
                    </div>
                    <div class="grid-x grid-margin-x" v-if="modal.parent">
                        <div class="cell large-2 large-text-right"><b>Parent:</b></div>
                        <div class="cell auto"><a v-on:click="$emit('showModal', 'orgUnit', modal.parent)">{{ $store.getters.orgUnit(modal.parent).name }}<span v-if="$store.getters.orgUnit(modal.parent).acronym"> ({{ $store.getters.orgUnit(modal.parent).acronym }})</span></a></div>
                    </div>
                    <div class="grid-x grid-margin-x" v-if="modal.children.length">
                        <div class="cell large-2 large-text-right"><b>Children:</b></div>
                        <div class="cell auto">
                            <ul>
                                <li v-for="org_id in modal.children" v-if="$store.getters.orgUnit(org_id)" v-bind:key="org_id"><a v-on:click="$emit('showModal', 'orgUnit', org_id)">{{ $store.getters.orgUnit(org_id).name }}<span v-if="$store.getters.orgUnit(org_id).acronym"> ({{ $store.getters.orgUnit(org_id).acronym }})</span></a></li>
                            </ul>
                        </div>
                    </div>

                </div>
                <button class="close-button" type="button" v-on:click="$emit('showModal', 'orgUnit', null)"><span aria-hidden="true">×</span></button>
            </div>
        </div>
    </div>
</template>
<style lang="scss">

</style>
<script>
import { mapGetters } from 'vuex';
import { Search } from 'js-search';
import debounce from 'debounce';

import department from './department.vue';


var searchDB = new Search('id');
var searchKeys = [
    'name', 'acronym',  
];
searchKeys.forEach(function (key) {
    searchDB.addIndex(key);
});


export default {
    name: 'organisation',
    components: {
        department,
    },
    data: function () {
        return {
            orgUnits: [],
            filterIds: null,
            searchQuery: '',
        };
    },
    props: {
        modal: Object,
    },
    computed: {
        // bind to getters in store.js
        ...mapGetters([
            'orgTree'
        ]),
        modalLocation: function () {
            return (this.modal && this.modal.location) ? this.$store.getters.location(this.modal.location) : null;
        },
        orgFlat: function () {
            var results = [];
            var spelunk = function (el) {
                results.push({
                    id: el.id,
                    name: el.name,
                    acronym: el.acronym,
                    filterIds: el.filterIds,
                });
                el.children.map(spelunk);
            }
            this.orgTree.map(spelunk);
            return results;
        },
    },
    methods: {
        showOrg: function (ev) {
            this.$emit('showModal', 'orgUnit', ev);
        },
        setFilter: function (org, mode) {
            this.$emit('showModal', 'orgUnit', null);
            this.$emit('updateFilter', {
                field_id: 'org_unit.id',
                name: org.name,
                value: org.id,
                mode: mode
            });
        },
        updateVisible: function () {
            var vm = this;

            // get a list of IDs that match the current search term (if exists)
            if (vm.searchQuery) {
                var results = new Set();
                searchDB.search(vm.searchQuery).map(function (el) {
                    el.filterIds.map(function (fl) {
                        results.add(fl);
                    });
                });
                vm.filterIds = Array.from(results);
            } else {
                vm.filterIds = null;
            }

        },
        search: debounce( function () {
            this.updateVisible();
        }, 100 ),
    },
    watch: {
        orgTree: function (val, oldVal) {
            // when the org structure changes, update the search index
            if (self.orgFlat) {
                searchDB.addDocuments(self.orgFlat);
                this.updateVisible();
            }
        }
    },
    mounted: function () {
        // on first mount, update the search index with the current org tree
        searchDB.addDocuments(this.orgFlat);
    },
}
</script>
