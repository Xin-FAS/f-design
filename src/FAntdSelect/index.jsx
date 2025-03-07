import { Select, Spin } from 'antd';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';

const sendDataCache = new Map();

let time
const inputChange = (value, cb) => {
    clearTimeout(time);
    time = setTimeout(() => {
        cb(value);
        clearTimeout(time);
        time = undefined;
    }, 500);
}

// 创建一个定时器，移除指定api和请求参数的缓存结果
const createRemoveTimeout = (api, cKey) => {
    // 30秒刷新
    setTimeout(() => {
        if (sendDataCache.has(api) && sendDataCache.get(api).has(cKey)) {
            sendDataCache.get(api).delete(cKey);
        }
    }, 30000);
};
// 创建缓存
const setDataCache = (api, cKey, promise) => {
    if (sendDataCache.has(api)) {
        sendDataCache.get(api).set(cKey, promise);
    } else {
        const _map = new Map();
        _map.set(cKey, promise);
        sendDataCache.set(api, _map);
    }
    createRemoveTimeout(api, cKey);
};
// 查询缓存
const getDataCache = (api, cKey) => {
    let result;
    if (sendDataCache.has(api) && sendDataCache.get(api).has(cKey)) {
        result = sendDataCache.get(api).get(cKey);
    }
    return result;
};
export default ({
    api,
    data,
    onResponse,
    value,
    setValue,
    filter,
    requestValid,
    onChange,
    apiData = {},
    initLabel,
    onSearch,
    onClear,
    autoSearch,
    labelName = 'label',
    valueName = 'value',
    ...args
}) => {
    const [selectOptions, setSelectOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true);
    const prevSendData = useMemo(
        () => ({
            current: Math.random(),
        }),
        [],
    );

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    // 设置选中数据
    const updateValue = value => {
        onChange && onChange(value)
        setValue && setValue(value)
    }
    // 备份数据
    const bakOptions = useRef([])
    // 设置选项数据
    const setData = data => {
        // 备份数据用于过滤
        const bakData = JSON.parse(JSON.stringify(data))
        bakOptions.current = bakData
        // 使用filter过滤数据
        if (filter) data = filter(bakData)
        setSelectOptions(data);
    };
    // 处理接口返回
    const promiseThen = (res) => {
        if (isMounted.current) {
            onResponse && onResponse(res);
            // 如果当前选中值不在数据集中则清空选中值
            if (value) {
                const isFind = res.data.findIndex(v => v[valueName] === value) !== -1
                if (!isFind) updateValue(undefined)
            }
            setData(res.data);
        }
        return res;
    };
    // 获取选项数据
    const getOptions = useCallback((searchLabel = initLabel) => {
        // 校验是否可执行
        if (requestValid && !requestValid()) return;
        // 如果使用静态数据则直接处理返回
        if (data) return setData(data);
        // 准备请求
        let sendOtherData = {}
        // 如果为自动搜索则添加搜索label
        if (autoSearch) sendOtherData[labelName] = searchLabel
        const sendData = {
            ...apiData,
            ...sendOtherData
        }
        // 先获取缓存对象
        const cacheDataPromise = getDataCache(api, JSON.stringify(sendData));
        // 存在缓存结果直接返回
        if (cacheDataPromise) return cacheDataPromise.then(promiseThen);
        // 开始请求
        setLoading(true);
        // 清空当前选项数据
        setSelectOptions([])
        const apiPromise = api(sendData);
        // 设置缓存结果
        setDataCache(api, JSON.stringify(sendData), apiPromise);
        apiPromise.then(promiseThen).finally(() => setLoading(false));
    }, [apiData, prevSendData, value, requestValid]);

    // filter过滤条件改变时，重新对数据筛选
    useEffect(() => {
        setData(bakOptions.current);
    }, [filter]);

    const oldApiData = useRef(Math.random() + '')
    const oldrequestValidResult = useRef(undefined)
    useEffect(() => {
        let resultFilterResult
        if (requestValid) resultFilterResult = requestValid()
        // apiData发生变化时重新获取数据
        if (oldApiData.current !== JSON.stringify(apiData)) {
            oldApiData.current = JSON.stringify(apiData)
            getOptions()
        } else if (requestValid && oldrequestValidResult.current !== resultFilterResult) {
            oldrequestValidResult.current = resultFilterResult
            // 请求拦截的结果从false到true也需要重新获取数据
            if (resultFilterResult) getOptions()
        }
    }, [apiData, requestValid]);
    // 过滤数据
    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    return (
        <Select
            allowClear
            showSearch
            loading={loading}
            value={value}
            onChange={updateValue}
            onSearch={value => {
                if (autoSearch) inputChange(value, getOptions)
                onSearch && onSearch(value)
            }}
            notFoundContent={loading ? <Spin size="small" /> : null}
            filterOption={autoSearch ? false : filterOption}
            onClear={() => {
                if (autoSearch) getOptions('')
                onClear && onClear()
            }}
            placeholder={
                setValue ?
                    '全部数据' :
                    (autoSearch ? '请选择，可过滤' : '请选择，可搜索')
            }
            options={selectOptions}
            {...args}
            style={{
                width: '100%',
                ...(args.style ?? {})
            }}
            fieldNames={{
                label: labelName,
                value: valueName,
                ...(args.fieldNames ?? {})
            }}
        />
    );
};
