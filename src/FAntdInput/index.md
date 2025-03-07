---
title: FAntdInput 输入框
---

## FAntdInput

FAntdInput使用decimal.js控制浮点数的精度，如需要使用请安装 `pnpm add decimal.js`，npm及yarn同理安装

### 基础使用

组件宽度默认100%，双向绑定只需要绑定value和setValue属性即可，如果使用对象结构，setValue的第一个值为最新value

```jsx
import { FAntdInput } from 'FAS-Design'
import { useState } from 'react'

export default () => {
    const [value, setValue] = useState()
    const [object, setObject] = useState({
        value: undefined,
    })

    return <div style={{ width: '250px' }}>
        <p>正常绑定 value：{value}</p>
        <FAntdInput value={value} setValue={setValue} />
        <p>对象绑定 object.value：{object.value}</p>
        <FAntdInput value={object.value} setValue={value => {
            setObject(data => ({
                ...data,
                value
            }))
        }} />
    </div>
}
```

### 数字输入框

* 默认模式：步长为1、默认不保留小数
* 百分比模式：存在百分比符号、步长为1、默认保留两位小数
* 严格模式：最小值为0、步长为1、不保留小数
* 价格模式：出现后缀符号、步长为1，默认保留两位小数

```jsx
import { FAntdInput } from 'FAS-Design'
import { useState } from 'react'

export default () => {
    const [value1, setValue1] = useState()
    const [value2, setValue2] = useState()
    const [value3, setValue3] = useState()
    const [value4, setValue4] = useState()

    return <>
        <p>默认模式 value：{value1}</p>
        <FAntdInput
            value={value1}
            setValue={setValue1}
            type={'number'}
            style={{ width: '250px' }}
        />
        <p>百分比模式 value：{value2}</p>
        <FAntdInput
            value={value2}
            setValue={setValue2}
            type={'number-percentage'}
            style={{ width: '250px' }}
        />
        <p>严格模式 value：{value3}</p>
        <FAntdInput
            value={value3}
            setValue={setValue3}
            type={'number-strict'}
            style={{ width: '250px' }}
        />
        <p>价格模式 value：{value4}</p>
        <FAntdInput
            value={value4}
            setValue={setValue4}
            type={'number-price'}
            insideIcon={false}
            style={{ width: '250px' }}
        />
    </>
}
```

### 防抖搜索框

有自动和手动搜索模式，自动搜索会在输入框内容改变的时候触发

```jsx
import { FAntdInput } from 'FAS-Design'
import { useState } from 'react'
import { Button } from 'antd'

export default () => {
    const [value1, setValue1] = useState('')
    const [value2, setValue2] = useState('')
    const [logList, setLogList] = useState([])

    const onSearch = value => {
        setLogList(data => ([
            ...data,
            '执行搜索：' + value
        ]))
        // 模拟异步搜索，可返回一个Promise控制加载状态
        return new Promise(resolve => {
            setTimeout(resolve, 1000)
        })
    }

    return <div>
        <p>自动搜索 value：{value1}</p>
        <FAntdInput
            value={value1}
            setValue={setValue1}
            onSearch={onSearch}
            type={'search'}
        />
        <p>手动搜索 value：{value2}</p>
        <FAntdInput
            value={value2}
            setValue={setValue2}
            onSearch={onSearch}
            autoSearch={false}
            type={'search'}
        />
        <p>执行日志：</p>
        {
            logList.map(log => <p key={log}>{log}</p>)
        }
    </div>
}
```

### 密码输入框

```jsx
import { FAntdInput } from 'FAS-Design'
import { useState } from 'react'

export default () => {
    return <FAntdInput type={'password'} />
}
```

### 配合表单使用

在Antd表单中使用的时候，不需要设置value和setValue即可绑定表单数据

```jsx
import { FAntdInput } from 'FAS-Design'
import { useState } from 'react'
import { Form, Space, Button } from 'antd'

export default () => {
    const [form] = Form.useForm();
    const [log, setLog] = useState({})
    const [value, setValue] = useState('')

    return <div style={{ width: '300px' }}>
        <p>回显表单数据</p>
        <div style={{ display: 'flex' }}>
            <FAntdInput value={value} setValue={setValue} />
            <Button
                onClick={() => {
                    form.setFieldsValue({
                        label1: value
                    })
                }}
                style={{ marginLeft: '10px' }}
            >
                确认
            </Button>
        </div>
        <p>表单：</p>
        <Form
            form={form}
            onFinish={setLog}
        >
            <Form.Item label={'Label1'} name={'label1'} rules={[{ required: true }]}>
                <FAntdInput />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type={'primary'} htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
        控制台数据：{JSON.stringify(log)}
    </div>
}
```

## FAntdInput API

更多API查看Antd Input API

### Props

| 属性名        | 类型       | 是否必填 | 说明                                                                                  | 默认值                                            |
|:-----------|:---------|:-----|:------------------------------------------------------------------------------------|:-----------------------------------------------|
| value      | string   | 否    | 当前input值，配合setValue双向绑定使用                                                           |                                                |
| setValue   | function | 否    | 当前input改变事件，配合value双向绑定使用                                                           |                                                |
| type       | string   | 否    | 设置当前输入框类型，可选number、number-strict、number-price、number-percentage、search、password，见示例 |                                                |
| copy       | boolean  | 否    | 是否可双击复制输入框的内容（仅在https环境下type为空时生效）                                                  | true                                           |
| autoSearch | boolean  | 否    | 是否自动搜索（仅在type为search下生效）                                                            | true                                           |
| insideIcon | boolean  | 否    | 后缀符号是否在输入框之中（仅在type为number-price和number-percentage下生效）                              | true                                           |
| fixed      | number   | 否    | 控制数字类型的小数位数（仅在type为number相关类型下生效、number-strict下不生效）                                 | number默认模式0（number-price、number-percentage默认2） |

### Method

| 方法名      | 是否必填 | 说明                        | 
|:---------|:-----|:--------------------------|
| onChange | 否    | 输入框改变事件，回调第一个值为value      |
| onSearch | 否    | 输入框搜索事件（仅在type为search下生效） |

### Ref

| 属性       | 说明            |
|:---------|:--------------|
| inputRef | input的ref实例对象 |

