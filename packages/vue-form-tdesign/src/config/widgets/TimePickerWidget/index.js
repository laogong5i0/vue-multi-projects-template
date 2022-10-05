export default {
    name: 'TimePickerWidget',
    functional: true,
    render(h, context) {
        context.data.attrs = {
            'value-format': 'HH:mm:ss',
            ...context.data.attrs || {}
        };

        const oldInputCall = context.data.on.input;
        context.data.on = {
            ...context.data.on,
            input(val) {
                oldInputCall.apply(context.data.on, [val === null ? undefined : val]);
            }
        };

        return h('t-time-picker', context.data, context.children);
    }
};
