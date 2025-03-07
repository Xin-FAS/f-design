---
title: FAntdSelect 下拉选择框
---

## FAntdSelect

### 基础使用

默认宽度100%

```jsx
import { FAntdSelect } from 'FAS-Design'
import { useState } from 'react'
import { Button } from 'antd'

export default () => {
    const [value, setValue] = useState()

    return <div style={{ width: '200px' }}>
        <p>value：{value}</p>
        <FAntdSelect
            data={[
                {
                    label: 'Label1',
                    value: 'Value1'
                },
                {
                    label: 'Label2',
                    value: 'Value2'
                },
            ]}
            value={value}
            setValue={setValue}
        />
    </div>
}
```

### 动态数据

可以使用`requestValid`参数控制是否进行请求，在多参数联动下实现效果

```jsx
import { FAntdSelect } from 'FAS-Design'
import { Button } from 'antd'
import { useState } from 'react'

// 模拟接口
const GetListAPI = params => {
    // 模拟接口返回
    const mapper = {
        'name1': [
            {
                label: 'Label',
                value: 'Value'
            },
            {
                label: 'Label1-1',
                value: 'Value1-1'
            },
        ],
        'name2': [
            {
                label: 'Label',
                value: 'Value'
            },
            {
                label: 'Label2-1',
                value: 'Value2-1',
            },
        ],
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                code: '200',
                data: mapper[params.name]
            })
        }, 3000)
    })
}

export default () => {
    const [value, setValue] = useState()
    const [name, setName] = useState('name1')
    const [filterStatus, setFilterStatus] = useState(true)

    return <>
        <p>value：{value}</p>
        <p>
            <Button onClick={() => setName(name => {
                if (name === 'name1') return 'name2'
                if (name === 'name2') return 'name1'
            })}>修改请求参数{name}</Button>
            <Button onClick={() => setFilterStatus(status => !status)}>{filterStatus ? '停用' : '启用'}请求</Button>
        </p>
        <FAntdSelect
            api={GetListAPI}
            apiData={{
                name
            }}
            requestValid={() => filterStatus}
            value={value}
            setValue={setValue}
        />
    </>
}
```

### 动态自动搜索

当使用动态自动搜索时，赋值回显数据需要传入`initLabel`，因为在初始搜索中需要获取相关数据回显，以下演示了自动搜索、数据回显 +
数据过滤重复

```jsx
import { FAntdSelect, FAntdInput } from 'FAS-Design'
import { useState } from 'react'

// 模拟接口
const GetListAPI = data => {
    const sourceData = [
        {
            id: '1',
            name: '张三',
        },
        {
            id: '1-1',
            name: '张三1',
        },
        {
            id: '1-2',
            name: '张三2',
        },
    ]
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                code: 200,
                data: data.name ? sourceData.filter(v => v.name.indexOf(data.name) !== -1) : sourceData
            })
        }, 2000)
    })
}

export default () => {
    const [value1, setValue1] = useState('1')
    const [value2, setValue2] = useState()

    return <>
        <p>输入框一：回显选中张三</p>
        <FAntdSelect
            api={GetListAPI}
            value={value1}
            setValue={setValue1}
            valueName={'id'}
            labelName={'name'}
            autoSearch
            initLabel={'张三'}
        />
        <p>输入框二：不会搜索到输入框一中选中值</p>
        <FAntdSelect
            api={GetListAPI}
            value={value2}
            setValue={setValue2}
            valueName={'id'}
            labelName={'name'}
            autoSearch
            filter={data => data.filter(v => v.id !== value1)}
        />
    </>
}
```

### 配合表单使用

在表单中不需要绑定value，选择框默认的placeholder会根据当前环境进行设置

```jsx
import { FAntdSelect } from 'FAS-Design'
import { useState, useRef } from 'react'
import { Form, Space, Button } from 'antd'

export default () => {
    const [form] = Form.useForm();
    const [log, setLog] = useState({})
    const [value, setValue] = useState('')

    const dataOptions = useRef([
        {
            label: 'Label1',
            value: 'Value1'
        },
        {
            label: 'Label2',
            value: 'Value2'
        }
    ])

    return <div style={{ width: '300px' }}>
        <p>回显表单数据</p>
        <div style={{ display: 'flex' }}>
            <FAntdSelect data={dataOptions.current} value={value} setValue={setValue} />
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
                <FAntdSelect data={dataOptions.current} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type={'primary'} htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
        控制台数据：{JSON.stringify(log)}
    </div>
}
```

## FAntdSelect API

更多API查看Antd Select API

### Props

| 属性名          | 类型                 | 是否必填 | 说明                               | 默认值     |
|:-------------|:-------------------|:-----|:---------------------------------|:--------|
| api          | apiData => Promise | 否    | 数据来源，需要返回一个Promise对象，与data属性必填一个 |         |
| data         | array              | 否    | 静态数据                             |         |
| value        | string             | 否    | 当前绑定值                            |         |
| setValue     | value => void      | 否    | 用于设置绑定值                          |         |
| filter       | data => array      | 否    | 用于过滤选项数据，回调参数为当前选项数据             |         |
| requestValid | () => boolean      | 否    | 返回布尔值，请求之前的校验函数，返回false表示不请求     |         |
| apiData      | object             | 否    | 给api函数传递参数                       |         |
| initLabel    | string             | 否    | 用于自动搜索时回显数据                      |         |
| autoSearch   | boolean            | 否    | 是否为自动搜索，会根据所输入的label填充进接口参数中     | false   |
| labelName    | string             | 否    | 映射的label字段名称                     | `label` |
| valueName    | string             | 否    | 映射的value字段名称                     | `value` |

### Method

| 方法名        | 是否必填 | 说明     |
|------------|------|--------|
| onResponse | 否    | 请求回调函数 |
