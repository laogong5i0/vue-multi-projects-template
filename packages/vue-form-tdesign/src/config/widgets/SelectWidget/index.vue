<template>
    <t-select
        v-bind="$attrs"
        v-on="$listeners"
    >
        <t-option
            v-for="(item, index) in enumOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
        ></t-option>
    </t-select>
</template>

<script>
export default {
    name: 'SelectWidget',
    props: {
        enumOptions: {
            default: () => [],
            type: [Array]
        }
    }
};
</script>
