import Vue from 'vue';

declare class CheckboxesWidget extends Vue {
    /** value / v-model */
    value: object

    /** checkboxes选型列表 */
    enumOptions: object
}

export default CheckboxesWidget;
