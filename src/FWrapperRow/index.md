---
title: FWrapperRow 横向布局 
---

## FWrapperRow

### 基础使用

```jsx
import { FWrapperRow } from 'FAS-Design'
import { Input, Select } from 'antd'

export default () => {
    return <>
        <FWrapperRow>
            <FWrapperRow.Item label={'姓名'}>
                FAS
            </FWrapperRow.Item>
            <FWrapperRow.Item label={'年龄'}>
                22岁
            </FWrapperRow.Item>
        </FWrapperRow>
        <FWrapperRow>
            <FWrapperRow.Item label={'用户名'}>
                <Input />
            </FWrapperRow.Item>
            <FWrapperRow.Item label={'昵称'}>
                <Select
                    style={{
                        width: '200px'
                    }}
                    options={[
                        {
                            label: '测试昵称1',
                            value: 1
                        },
                        {
                            label: '测试昵称2',
                            value: 2
                        }
                    ]}
                />
            </FWrapperRow.Item>
            <FWrapperRow.Item>
                <Select
                    style={{
                        width: '200px'
                    }}
                    options={[
                        {
                            label: '测试昵称1',
                            value: 1
                        },
                        {
                            label: '测试昵称2',
                            value: 2
                        }
                    ]}
                />
            </FWrapperRow.Item>
        </FWrapperRow>
    </>
}
```

## FWrapperRow API

| 属性名           | 类型     | 是否必填        | 说明          | 默认值 |
|:--------------|:-------|:------------|:------------|:----|
| label         | string | 否           | 显示的文字       |     |
| children      | any    | 是           | 展示内容content |     |
| itemClass     | string | 否           | 父级元素class   |     |
| labelStyles   | object | label的style |             |     |
| labelClass    | string | label的class |             |     |
| contentStyles | object | content父级样式 |             |     |
| contentClass  | string | content父级样式 |             |     |
