<template>
    <div class="callout">
        <h4>
            <strong><a v-on:click="$emit('showOrg', unit.id)">{{ unit.name }}</a></strong>
        </h4>
        <div v-if="hasChildren">
            <ul class="orgList">
                <orgUnit v-for="unit in filteredChildren" v-on:showOrg="$emit('showOrg', $event)" v-bind:key="unit.id" v-bind:unit="unit" v-bind:filterIds="filterIds"></orgUnit>
            </ul>
        </div>
    </div>
</template>
<style lang="scss">
.f6inject {
    .orgList {
        margin: 0;
    }
}
</style>
<script>
import orgUnit from './orgUnit.vue';

export default {
    name: 'department',
    components: {
        orgUnit
    },
    data: function () {
        return {
            open: false,
        };
    },
    props: {
        unit: Object,
        filterIds: Array,
    },
    computed: {
        filteredChildren: function () {
            var vm = this;
            if (vm.filterIds !== null) {
                return vm.unit.children.filter(function (el) {
                    return vm.filterIds.includes(el.id);
                });
            }
            return vm.unit.children;
        },
        hasChildren: function () {
            return this.unit.children && this.unit.children.length;
        }
    },
    methods: {
    }
}
</script>
