# @jiguanshu/vue-form-tdesign


## 安装

```ssh
## npm
npm install --save @jiguanshu/vue-form-tdesign

## yarn
yarn add @jiguanshu/vue-form-tdesign
```

## 使用
```html
<VueForm
    v-model="formData"
    :schema="schema"
>
</VueForm>
```

```js
//  使用
import VueForm from '@jiguanshu/vue-form-tdesign';

export default {
    name: 'Demo',
    components: {
        VueForm
    },
    data() {
        return {
            formData: {},
            schema: {
                type: 'object',
                required: [
                    'userName',
                    'age',
                ],
                properties: {
                    userName: {
                        type: 'string',
                        title: '用户名',
                        default: 'laogong5i0',
                    },
                    age: {
                        type: 'number',
                        title: '年龄'
                    },
                    bio: {
                        type: 'string',
                        title: '签名',
                        minLength: 10,
                        default: '知道的越多、就知道的越少',
                        'ui:options': {
                            placeholder: '请输入你的签名',
                            type: 'textarea',
                            rows: 1
                        }
                    }
                }
            }
        };
    }
};
```

## License
Apache-2.0
