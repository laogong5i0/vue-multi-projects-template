import CheckboxesWidget from "./CheckboxesWidget";
import DatePickerWidget from "./DatePickerWidget";

// import "./style.css";

// webpack -> rollup
// const files = require.context('.', true, /\.js|vue$/);
// const widgetComponents = files.keys().reduce((preVal, curKey) => {
//     if (curKey !== './index.js') {
//         preVal[curKey.replace(/(\.\/|\/index\.(js|vue))/g, '')] = files(curKey).default;
//     }
//     return preVal;
// }, {});

export { CheckboxesWidget, DatePickerWidget };

// export default widgetComponents;
