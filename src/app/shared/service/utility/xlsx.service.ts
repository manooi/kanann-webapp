import { ElementRef, Injectable } from '@angular/core';
import * as XLSX from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class XlsxService {
  constructor() { }

  tableToExcel(htmlElement: HTMLElement | null, fileName: string, sheetName: string) {
    if (htmlElement == null) {
      return;
    }

    const wb =  XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(htmlElement);
    XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}