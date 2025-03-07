---
title: FAntdTable 表格
---

## FAntdTable

### 基础使用

```jsx
import { FAntdTable } from 'FAS-Design'
import { useRef } from 'react'
import { Button } from 'antd'

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

    return <FAntdTable
        api={TableDataAPI}
        columns={columns}
    />
}
```

### 手动请求
```jsx
import { FAntdTable } from 'FAS-Design'
import { useRef, useState } from 'react'
import { Button, Space, Spin } from 'antd'

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
    const tableRef = useRef()
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

    const [tableLoading, setTableLoading] = useState(false)
    // 获取表格数据
    const handleTableRef = fnName => {
        setTableLoading(true)
        tableRef.current?.[fnName]().finally(() => setTableLoading(false))
    }
    
    return <>
        {tableLoading}
         <Space style={{ marginBottom: '10px' }}>
            <Button loading={tableLoading} onClick={() => handleTableRef('initPageSearch')}>获取数据</Button>
            <Button loading={tableLoading} onClick={() => handleTableRef('resetPageSearch')}>重置数据</Button>
            <Button loading={tableLoading} onClick={() => handleTableRef('getTableData')}>刷新数据</Button>
         </Space>
        <FAntdTable
            ref={tableRef}
            api={TableDataAPI}
            columns={columns}
            autoInit={false}
        />
    </>
}
```

## FAntdTable API

更多参数查看Antd Table API

### Props

| 属性名               | 类型                  | 是否必填 | 说明                       | 默认值                              |
|-------------------|---------------------|------|--------------------------|----------------------------------|
| api               | apiData => Promise  | 是    | 获取表格数据                   |                                  |
| apiData           | object              | 否    | 给api提供函数参数               |                                  |
| filter            | itemData => boolean | 否    | 过滤表格数据                   |                                  |
| requestValid      | () => boolean       | 否    | 是否进行请求                   |                                  |
| successValid      | response => boolean | 否    | 判断请求是否成功                 |                                  |
| mapperOptions     | object              | 否    | 表格数据映射字段名称               | { total: 'count', data: 'data' } |
| initPageSize      | number              | 否    | 初始表格数据条数                 | 10                               |
| initCurrent       | number              | 否    | 初始表格数据页数                 | 1                                |
| autoInit          | boolean             | 否    | 是否自动获取表格数据               | true                             |

### Ref

| 方法名             | 说明                                                                                                            |
|-----------------|---------------------------------------------------------------------------------------------------------------|
| getTableData    | 获取表格数据，直接调用可以获取当前页当前查询条件数据，可传入一个对象，包含page、limit、data、moreData参数，传入data参数会覆盖apiData，需要传入更多参数请使用moreData，一般用于刷新 |
| initPageSearch  | 根据当前条数、查询条件获取初始页数的数据，可传入一个对象当作额外查询数据，一般用于查询                                                                   |
| resetPageSearch | 使用初始条数、初始页数、空查询条件获取数据，可传入一个对象当作查询条件，一般用于重置                                                                    |
