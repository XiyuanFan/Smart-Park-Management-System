import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel(data: any, header: string[]) {
  //把前端选中的 JSON 数据数组，转换成 Excel 工作表（worksheet）对象
  const ws = XLSX.utils.json_to_sheet(
    data, { header }
  );
  //创建一个工作簿
  const wb = XLSX.utils.book_new()
  //把我们的工作表加到工作簿中，这个 sheet 名字叫 "sheet1"    
  XLSX.utils.book_append_sheet(wb, ws, "sheet1");
  //转成浏览器可下载的二进制数据     
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

  //保存和下载
  /**这一步做两件事：
  1. 把二进制 buffer 包装成浏览器可识别的文件对象 Blob
  2. 用 file-saver 的 saveAs 触发浏览器下载 
   最终下载文件名是：selected-data.xlsx*/
  saveAs(new Blob([buf], { type: "application/octet-stream" }), "selected-data.xlsx")
}

/** ### 1. 前端导出 Excel 一般怎么实现？
  答：常见做法是使用 xlsx 将前端 JSON 数据转换成 Excel 工作表，再通过 file-saver 或浏览器下载能力生成 .xlsx 文件并触发下载。

  ### 2. xlsx 在这里主要做了什么？
 答：它负责把前端数据结构转换成 Excel 所需的工作表和工作簿对象，并进一步写成可下载的二进制数据。

  ### 3. file-saver 的作用是什么？
 答：file-saver 用于在浏览器端触发文件下载。它通常接收 Blob 对象和文件名，把前端生成的文件内容保存到用户本地。

  ### 4. 为什么要先创建 worksheet，再创建 workbook？
 答：因为 Excel 文件结构本身就是“工作簿 workbook”包含一个或多个“工作表 worksheet”。导出时通常先生成表，再把表加入工作簿，
  最后导出整个工作簿。

  ### 5. 为什么导出按钮通常要依赖表格勾选状态？
 答：因为很多导出场景要求用户明确选择需要导出的数据范围，避免一次性导出无关数据，也能减少文件体积和误操作。

  ### 6. 导出 Excel 时为什么常常需要先做数据格式化？
 答：因为页面展示和导出内容要求不完全一致。页面里可能是状态码映射、标签组件、金额格式化等，导出时需要转换成纯文本或更适合
  表格阅读的格式。 */