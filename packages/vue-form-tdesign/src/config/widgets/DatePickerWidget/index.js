export default {
    name: 'DatePickerWidget',
    functional: true,
    render(h, context) {
        const { isNumberValue, isRange, ...otherProps } = context.data.attrs || {};

        context.data.attrs = {
            type: isRange ? 'daterange' : 'date',
            'value-format': isNumberValue ? 'timestamp' : 'yyyy-MM-dd',
            ...otherProps
        };

        const oldInputCall = context.data.on.input;
        context.data.on = {
            ...context.data.on,
            input(val) {
                const trueVal = val === null ? (isRange ? [] : undefined) : val;
                oldInputCall.apply(context.data.on, [trueVal]);
            }
        };

        return h('t-date-picker', context.data, context.children);
    }
};
