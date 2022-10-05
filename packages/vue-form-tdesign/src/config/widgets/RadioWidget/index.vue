<template>
    <t-radio-group
        v-bind="$attrs"
        v-on="$listeners"
    >
        <t-radio
            v-for="(item, index) in enumOptions"
            :key="index"
            :label="item.value"
        >
            {{ item.label }}
        </t-radio>
    </t-radio-group>
</template>

<script>
export default {
    name: 'RadioWidget',
    props: {
        enumOptions: {
            default: () => [],
            type: [Array]
        }
    }
};
</script>
