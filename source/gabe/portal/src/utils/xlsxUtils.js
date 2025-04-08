import * as XLSX from "xlsx";
import XLSXStyle from "xlsx-style";
import { saveAs } from "file-saver";
import path from "path";
import _ from "lodash";

const FILE_NAME = "国网湖北省电力有限公司信息通信公司出差审批单.xlsx";
const COL_PARAMS = ["hidden", "wpx", "width", "wch", "MDW"];
const STYLE_PARAMS = ["fill", "font", "alignment", "border"];

/**
 * 数字转换成excel表头。 （递归处理）
 * @param {Number} num 需要转换的数字
 */
// eslint-disable-next-line no-unused-vars
function numToString(num) {
  let strArray = [];
  let numToStringAction = function (o) {
    let temp = o - 1;
    let a = parseInt(temp / 26);
    let b = temp % 26;
    strArray.push(String.fromCharCode(64 + parseInt(b + 1)));
    if (a > 0) {
      numToStringAction(a);
    }
  };
  numToStringAction(num);
  return strArray.reverse().join("");
}

/**
 * 表头字母转换成数字。（进制转换）
 * @param {string} str 需要装换的字母
 */
function stringToNum(str) {
  let temp = str.toLowerCase().split("");
  let len = temp.length;
  let getCharNumber = function (charx) {
    return charx.charCodeAt() - 96;
  };
  let numout = 0;
  let charnum = 0;
  for (let i = 0; i < len; i++) {
    charnum = getCharNumber(temp[i]);
    numout += charnum * Math.pow(26, len - i - 1);
  }
  return numout;
}

/**
 * worksheet转成ArrayBuffer
 * @param {worksheet} s xlsx库中的worksheet
 */
function s2ab(s) {
  if (typeof ArrayBuffer !== "undefined") {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  } else {
    const buf = new Array(s.length);
    for (let i = 0; i !== s.length; ++i) {
      buf[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
}

/**
 * 导出成Excel
 * @param {Array} data 数据
 * @param {Object} columns 每列参数说明。可直接写对应的中文名称，也可以写这一列的样式。比如列宽，背景色
 * @param {String} filename 文件名。可根据文件名后缀动态判断文件格式。支持xlsx, xlsm, xlsb（这三个支持自定义样式）, html, csv等
 * @param {Object} styleConf 其他xlsx-style的参数
 *
 * columns数据格式：{
 *         name: '姓名',
 *         sex: '性别',
 *         birthday: {
 *           name: '出生日期',
 *           wch: 14
 *         },
 *         address: {
 *           name: '地址',
 *           wpx: 160,
 *           alignment: { wrapText: true }
 *         }
 *       }
 *
 * styleConf数据格式: {
 *          'E4': {
 *             font: {
 *               bold: true,
 *               color: { rgb 'FFFF0000' }
 *             }
 *          },
 *          '!merges': [ // 合并第一行
 *             {
 *               s: { c: 0, r: 0 },
 *               e: { c: 7, r: 0 }
 *             }
 *          ]
 *        }
 */
export function exportExcel(data, columns, filename = FILE_NAME, styleConf) {
  let keys = _.keys(columns);
  let colNames = _.mapValues(columns, (o) => {
    if (_.isPlainObject(o)) {
      return o.name;
    } else {
      return o;
    }
  });

  // 创建工作簿
  let wb = XLSX.utils.book_new();

  // 显示表头
  const ws = XLSX.utils.json_to_sheet([colNames], {
    header: keys,
    skipHeader: true,
  });
  // 过滤数据，只显示表头包含的数据
  for (let i = 0; i < data.length; i++) {
    data[i] = _.pick(data[i], keys);
  }
  // 追加数据到excel中，从第二行开始
  XLSX.utils.sheet_add_json(ws, data, {
    header: keys,
    skipHeader: true,
    origin: "A2",
  });

  wb.SheetNames.push("sheet1");
  wb.Sheets["sheet1"] = ws;

  // 根据不同的扩展名，导出不同格式的文件
  let bookType = null;
  let ext = path.extname(filename);
  if (ext == null) {
    filename += ".xlsx";
    bookType = "xlsx";
  } else {
    bookType = ext.substr(1).toLowerCase();
  }

  let wbOut;
  // 如果是支持样式的格式
  if (["xlsx", "xlsm", "xlsb"].includes(bookType)) {
    // ws['!merges'] = [{// 合并第一行数据[B1,C1,D1,E1]
    //   s: {// s为开始
    //     c: 0, // 开始列
    //     r: 0// 开始取值范围
    //   },
    //   e: {// e结束
    //     c: 7, // 结束列
    //     r: 0// 结束范围
    //   }
    // }]

    for (const key in ws) {
      // 第一行，表头
      if (key.replace(/[^0-9]/gi, "") === "1") {
        ws[key].s = {
          fill: {
            fgColor: { rgb: "FFA3F4B1" },
          },
          font: {
            name: "宋体",
            sz: 12,
            bold: true,
          },
          border: {
            bottom: {
              style: "thin",
              color: "FF000000",
            },
          },
        };
      } else {
        let str = key.replace(/[^A-Za-z]+$/gi, "");
        let colIndex = stringToNum(str) - 1;
        if (keys[colIndex] && _.isPlainObject(columns[keys[colIndex]])) {
          const a = _.pick(columns[keys[colIndex]], STYLE_PARAMS);
          ws[key].s = _.assign(ws[key].s, a);
        }
      }
    }
    // 设置列宽
    const colsP = [];
    _.mapValues(columns, (o) => {
      colsP.push(_.pick(o, COL_PARAMS));
    });
    ws["!cols"] = colsP;

    // 合并其他样式参数
    if (styleConf) {
      for (const key in styleConf) {
        if (ws.hasOwnProperty(key)) {
          ws[key].s = styleConf[key];
        }
      }
    }
    wbOut = XLSXStyle.write(wb, {
      bookType: bookType,
      bookSST: false,
      type: "binary",
    });
  } else {
    wbOut = XLSX.write(wb, {
      bookType: bookType,
      bookSST: false,
      type: "binary",
    });
  }

  saveAs(new Blob([s2ab(wbOut)], { type: "" }), filename);
}
