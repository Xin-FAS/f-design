import { Table } from 'antd';
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';

let apiVersion = {}
export default forwardRef(
    (
        {
            api,
            apiData,
            filter,
            requestValid,
            successValid = res => res.code === 'OK',
            mapperOptions = {
                total: 'count',
                data: 'data'
            },
            initPageSize = 10,
            initCurrent = 1,
            autoInit = true,
            ...args
        },
        ref,
    ) => {
        const [pageSize, setPageSize] = useState(initPageSize);
        const [current, setCurrent] = useState(initCurrent);
        const [total, setTotal] = useState(0);
        const [loading, setLoading] = useState(false);
        const [tableData, setTableData] = useState([]);
        const isMounted = useRef(true);

        const getTableData = ({
            page = current,
            limit = pageSize,
            data = apiData,
            otherData = {}
        } = {}) => {
            if (requestValid && !requestValid()) return;
            setLoading(true);
            // 记录下请求时未改变的页码
            const _current = current;
            const _activePageSize = pageSize;
            const prevVersion = apiVersion[api.toString()]
            const activeVersion = (prevVersion ?? 0) + 1
            apiVersion[api.toString()] = activeVersion
            return api({
                pageSearch: {
                    limit,
                    page,
                },
                ...Object.assign({}, data, otherData)
            }).then(res => {
                if (
                    successValid(res) &&
                    _current === current &&
                    _activePageSize === pageSize &&
                    isMounted.current &&
                    activeVersion === apiVersion[api.toString()]
                ) {
                    const tableData = res[mapperOptions.data]
                    // 使用filter过滤数据
                    if (filter && tableData && tableData.length) res[mapperOptions.data] = tableData.filter(filter);
                    // 设置表格总条数
                    setTotal(res[mapperOptions.total]);
                    // 设置表格数据
                    setTableData(tableData ?? []);
                }
            }).catch(() => {
                setTotal(0);
                setTableData([]);
            }).finally(() => {
                setCurrent(page);
                setPageSize(limit);
                isMounted.current && setLoading(false)
            });
        };
        // 还原页数查询
        const initPageSearch = otherData => getTableData({
            page: initCurrent,
            limit: pageSize,
            otherData
        })
        // 重置查询（还原页数和条数和空查询）
        const resetPageSearch = otherData => getTableData({
            page: initCurrent,
            limit: initPageSize,
            data: {},
            otherData,
        })

        useImperativeHandle(
            ref,
            () => {
                return {
                    getTableData,
                    initPageSearch,
                    resetPageSearch,
                };
            },
            [current, pageSize, apiData],
        );
        useEffect(() => {
            autoInit && getTableData();
            return () => {
                isMounted.current = false;
            };
        }, []);
        return <Table
            loading={loading}
            dataSource={tableData}
            {...args}
            pagination={{
                showSizeChanger: true,
                current,
                pageSize,
                total,
                pageSizeOptions: [5, 10, 20, 50],
                ...(args?.pagination ?? {}),
                onChange: (page, limit) => {
                    getTableData({
                        page,
                        limit,
                    })
                    if (args?.pagination?.onChange) args.pagination.onChange(page, limit)
                },
            }}
        />
    },
);
