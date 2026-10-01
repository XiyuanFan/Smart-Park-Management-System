//列表数据查询请求的通用抽象逻辑
import { useState, useCallback, useEffect } from "react";
//查询表单类型是一个“键值对象”
type MyFormData = {
    [key: string]: any
}

//列表获取函数类型 
interface DataFetcher<T> {
    (args: T & { page: number; pageSize: number }): Promise<any>
}
/**传给 Hook 的请求函数必须长这样：
   接收 “查询条件 + page + pageSize”
  返回 Promise */
function useDataList<T extends MyFormData, U>(initialFormData: T, fetchData: DataFetcher<T>) {
    const [dataList, setDataList] = useState<U[]>([]) //表格数据 U是数据数组中的数据对象类型
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<T>(initialFormData); //搜索条件
    const [searchData, setSearchData] = useState<T>(initialFormData); //搜索条件

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // 这里刻意用 searchData 而不是 formData：
            // searchData 只在点击「查询」时更新，formData 会随每次输入变化。
            // 用 formData 会让依赖数组与读取的变量不一致（旧代码的隐患）。
            const { data: { list, total } } = await fetchData({ page, pageSize, ...searchData });
            setDataList(list);
            setTotal(total)
        } catch (error) {

            console.log(error)
        } finally {

            setLoading(false)
        }
    }, [searchData, page, pageSize, fetchData])
    //使用useCallback缓存 loadData ，稳定loadData
    //因为下面的useEffect的依赖项是loadData
    //以后只要 loadData 变了，也就是查询条件、页码、pageSize 变了，就重新请求
    useEffect(() => {
        loadData()
    }, [loadData]);

    //通用输入框更新函数
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    //查询值更新函数
    const search = () => {
        setPage(1);
        setPageSize(10);
        setSearchData(formData);
    }
    //分页器切换逻辑
    const onChange = (page: number, pageSize: number) => {
        setPage(page);
        setPageSize(pageSize)
    }
    //重置逻辑
    const reset = () => {
        setPage(1)
        setPageSize(10)
        setFormData(initialFormData)
        setSearchData(initialFormData);
    }
    //返回状态，setState，封装好的行为函数
    return { dataList, page, pageSize, total, loading, formData, setDataList, setPage, setPageSize, setTotal, setLoading, setFormData, loadData, onChange, search, handleChange, reset }
}


export default useDataList