import { Space, Button } from 'antd'
import { useState } from 'react'

export default ({ onSearch, onReset, onExport, ...args }) => {
    const [searchLoading, setSearchLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const [exportLoading, setExportLoading] = useState(false)

    return (
        <Space {...args}>
            <Button type={'primary'} onClick={() => {
                setSearchLoading(true)
                onSearch()?.finally(() => setSearchLoading(false))
            }} loading={searchLoading}>查询</Button>
            {
                onReset &&
                <Button onClick={() => {
                    setResetLoading(true)
                    onReset()?.finally(() => setResetLoading(false))
                }} loading={resetLoading}>重置</Button>
            }
            {
                onExport &&
                <Button onClick={() => {
                    setExportLoading(true)
                    onExport()?.finally(() => setExportLoading(false))
                }} loading={exportLoading}>导出</Button>
            }
        </Space>
    )
}
