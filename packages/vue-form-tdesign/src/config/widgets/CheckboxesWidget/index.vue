<template>
    <t-checkbox-group
        v-bind="$attrs"
        v-on="$listeners"
    >
        <t-checkbox
            v-for="(item, index) in enumOptions"
            :key="index"
            :label="item.value"
        >
            {{ item.label }}
        </t-checkbox>
    </t-checkbox-group>
</template>

<script>
export default {
    name: 'CheckboxesWidget',
    props: {
        enumOptions: {
            default: () => [],
            type: [Array]
        }
    }
};
</script>
