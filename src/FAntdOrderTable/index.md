---
title: FAntdOrderTable 订单表格
---

## FAntdOrderTable

### 基础使用

基于`FAntdTable`二次封装，不熟悉`FAntdTable`可以先去查看对应文档，使用时需要传入`FAntdTable`

```jsx
import { FAntdOrderTable, FAntdTable, FAntdSearchGroup } from 'FAS-Design'
import { Button } from 'antd'
import { useRef } from 'react'

// 模拟接口
const TableDataAPI = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            code: 'OK',
            count: 3,
            data: [
                {
                    name: 'Xin',
                    age: 22,
                    more: '鲁迅'
                },
                {
                    name: 'FAS',
                    age: 22,
                    more: '周树人'
                },
                {
                    name: 'wzkang',
                    age: 21,
                    more: 'BSAN'
                }
            ]
        })
    }, 2000)
})

export default () => {
    const headerOptions = [
        {
            label: '年龄',
            render: row => row.age
        },
        {
            label: '姓名',
            render: row => row.name
        },
    ]
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age'
        },
        {
            title: '说明',
            dataIndex: 'more',
            key: 'more'
        },
        {
            title: '操作',
            dataIndex: 'active',
            key: 'active',
            render () {
                return <>
                    <Button type={'primary'}>操作</Button>
                </>
            }
        }
    ]
    const headerSuffix = row => (
        <Button type={'link'}>操作</Button>
    )

    const orderTableRef = useRef()
    return <>
        <FAntdSearchGroup
            onSearch={() => orderTableRef.current?.initPageSearch()}
            onReset={() => orderTableRef.current?.resetPageSearch()}
            style={{
                marginBottom: '10px'
            }}
        />
        <FAntdOrderTable
            ref={orderTableRef}
            api={TableDataAPI}
            FAntdTable={FAntdTable}
            columns={columns}
            headerOptions={headerOptions}
            headerSuffix={headerSuffix}
        />
    </>
}
```

## FAntdOrderTable API

更多参数查看FAntdTable API、Antd Table API

### Props

| 属性名           | 类型                     | 是否必填  | 说明                    | 默认值 |
|:--------------|:-----------------------|:------|:----------------------|:----|
| FAntdTable    | React.Component        | true  | 传入FAntdTable组件        |     |
| headerOptions | row => Array           | false | 传入一个函数用于自定义渲染表格行的顶部部分 |     |
| headerSuffix  | row => React.Component | false | 传入一个函数用于渲染表格行顶部的后半部分  |     |

### Ref
ref 同FAntdTable Ref
