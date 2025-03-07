---
title: FPasswordScore 密码强度框
---

## FPasswordScore

### 基础使用

```jsx
import { FPasswordScore, FWrapperRow, FAntdInput } from 'FAS-Design'
import { useState } from 'react'
import { Button } from 'antd'

export default () => {
    return <>
        <FPasswordScore />
        <FPasswordScore value={1} />
        <FPasswordScore value={2} />
        <FPasswordScore value={3} />
        <FPasswordScore value={4} />
    </>
}
```

### 配合表单自动计算
需要引入库`zxcvbn`使用，在表单中自动计算密码强度，并限制使用的密码强度不能为`非常弱`

```jsx
import { FAntdInput, FPasswordScore } from 'FAS-Design'
import { useState } from 'react'
import zxcvbn from 'zxcvbn'
import { Form, Button } from 'antd'

export default () => {
    const [passwordScore, setPasswordScore] = useState()
    const [log, setLog] = useState({})
    
    return <>
        <Form
            layout="vertical"
            onFinish={setLog}
        >
            <Form.Item
                name={'password'}
                label={<p style={{ display: 'flex', alignItem: 'center' }}>
                    <span>密码</span>
                    <FPasswordScore value={passwordScore} />
                </p>}
                rules={[
                    {
                        required: true,
                        message: '密码不能为空'
                    },
                    ({ getFieldValue }) => ({
                        validator (rule, value) {
                            if (!value || passwordScore >= 1) return Promise.resolve()
                            return Promise.reject('密码强度太弱')
                        },
                    }),
                ]}
            >
                <FAntdInput type={'password'} onChange={value => {
                    // 计算密码强度
                    if (!value) setPasswordScore(undefined)
                    else setPasswordScore(zxcvbn(value).score)
                }} />
            </Form.Item>
            <Form.Item>
                <Button type={'primary'} htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
        控制台数据：{JSON.stringify(log)}
    </>
}
```

## FPasswordScore API

### Props

| 属性名   | 类型     | 是否必填 | 说明            | 默认值 |
|-------|--------|------|---------------|-----|
| value | number | 否    | 密码强度，支持范围 0-4 |     |
