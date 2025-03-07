---
title: FAntdSearchGroup 查询功能组
---

## FAntdSearchGroup

### 基础使用

根据配置项渲染以及控制加载状态

```jsx
import { FAntdSearchGroup } from 'FAS-Design'
import { Space } from 'antd'

// 模拟搜索，返回一个Promise对象
const handleGroup = () => new Promise(resolve => setTimeout(resolve, 2000))

export default () => {
    return <>
        <p>占位符</p>
        <Space direction="vertical">
            <FAntdSearchGroup
                onSearch={handleGroup}
            />
            <FAntdSearchGroup
                onSearch={handleGroup}
                onReset={handleGroup}
            />
            <FAntdSearchGroup
                onSearch={handleGroup}
                onReset={handleGroup}
                onExport={handleGroup}
            />
        </Space>
        <p>占位符</p>
    </>
}
```

## FAntdSearchGroup API

### Method

| 方法名      | 是否必填  | 说明          |
|:---------|:------|:------------|
| onSearch | false | 完善方法会出现查询按钮 |
| onReset  | false | 完善方法会出现重置按钮 |
| onExport | false | 完善方法会出现导出按钮 |
