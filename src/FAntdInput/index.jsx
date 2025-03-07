import { Input, InputNumber, message } from 'antd';
import { useState, forwardRef, useRef, useImperativeHandle } from 'react'
import Decimal from "decimal.js";

// 复制功能
const copyText = value => {
    navigator.clipboard
    .writeText(value)
    .then(() => {
        message.success('内容已复制');
    })
    .catch(() => {
        message.error('复制失败');
    });
}
// 简单的防抖
let time
const searchInputChange = (value, cb) => {
    clearTimeout(time);
    time = setTimeout(() => {
        cb(value);
        clearTimeout(time);
        time = undefined;
    }, 500);
}
// step={1} precision={0} min={1}
// type === 'number-strict'：数字输入框，严格模式（限制最小值为0， 步长为1，且不保留小数）
export default forwardRef(({
    value,
    setValue,
    type,
    onChange,
    onSearch,
    copy = true,
    autoSearch = true,
    insideIcon = true,
    // 小数格式位数
    fixed,
    ...args
}, ref) => {
    // 搜索
    const [searchLoading, setSearchLoading] = useState(false)
    const emitSearch = value => {
        if (searchLoading) return
        setSearchLoading(true)
        if (onSearch) {
            const searchResult = onSearch(value)
            // 如果返回值是promise，则控制loading状态
            if (Object.prototype.toString.call(searchResult) === '[object Promise]')
                searchResult.finally(() => setSearchLoading(false))
            else setSearchLoading(false)
        }
    }
    // 触发改变事件和同步数据
    const changeAndUpdate = (value, ...args) => {
        onChange && onChange(value, ...args)
        setValue && setValue(value)
    }
    //
    const getNumberTypeArgs = () => {
        const renderSymbols = symbols => ({
            ...insideIcon ? {
                formatter (value) {
                    // 格式化显示时添加￥符号，为空时不显示符号
                    return value ? `${value}${symbols}`: value
                },
            } : {
                addonAfter: symbols
            },
            parser (value) {
                // 格式化数据时去除￥符号
                const replaceValue = value?.replace(symbols, '')
                return replaceValue ? +new Decimal(replaceValue).toFixed(fixed ?? 2) : replaceValue
            },
        })
        const mapperArgs = {
            'number-strict': {
                precision: 0,
                min: 0,
            },
            'number-price': renderSymbols('￥'),
            'number-percentage': renderSymbols('%')
        }
        if (type in mapperArgs) return mapperArgs[type]
        return {}
    }
    const inputRef = useRef()
    useImperativeHandle(ref, () => {
        return {
            inputRef
        }
    }, [inputRef])
    // 数字输入框参数
    const NumberInput = (
        <InputNumber
            ref={inputRef}
            placeholder="请输入"
            allowClear
            value={value}
            onChange={changeAndUpdate}
            parser={value => value ? +new Decimal(value).toFixed(fixed ?? 0) : value}
            step={1}
            {...getNumberTypeArgs()}
            {...args}
            style={{
                width: '100%',
                ...(args?.style ?? {})
            }}
        />
    )
    const BaseInput = (
        <Input
            ref={inputRef}
            placeholder="请输入"
            allowClear
            value={value}
            onChange={(event, ...args) => {
                changeAndUpdate(event.target.value, ...args)
            }}
            onDoubleClick={() => {
                const _value = value ?? inputRef.current?.input.value
                if (_value && copy) copyText(value)
            }}
            {...args}
        />
    )
    const PasswordInput = (
        <Input.Password
            ref={inputRef}
            placeholder="请输入密码"
            allowClear
            value={value}
            onChange={(event, ...args) => {
                changeAndUpdate(event.target.value, ...args)
            }}
            {...args}
        />
    )
    const SearchInput = (
        <Input.Search
            ref={inputRef}
            placeholder={autoSearch ? '输入后自动搜索': '请输入'}
            allowClear
            value={value}
            onChange={(event, ...args) => {
                changeAndUpdate(event.target.value, ...args)
                if (!autoSearch) return
                searchInputChange(event.target.value, emitSearch)
            }}
            loading={searchLoading}
            onSearch={emitSearch}
            {...args}
        />
    )
    if (
        type === 'number' ||
        type === 'number-price' ||
        type === 'number-strict' ||
        type === 'number-percentage'
    ) return NumberInput
    if (type === 'password') return PasswordInput
    if (type === 'search') return SearchInput
    return BaseInput
});
