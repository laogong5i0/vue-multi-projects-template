# @fx/utils
开发实用工具箱

## @fx/utils/schema/validate

```js
import {
    ajvValidateFormData,
    validateFormDataAndTransformMsg,
    isValid
} from '@fx/utils/schema/validate';

// 直接调用 ajv 验证schema，返回格式化后的结果
ajvValidateFormData(...args);

// 校验数据并处理多语言(只处理当前节点)
validateFormDataAndTransformMsg(...args);

// 返回数据是否校验成功
isValid(...args);

// 返回数据是否校验成功
isValid(...args);
```
