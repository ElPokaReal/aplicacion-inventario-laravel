import ExcelJS from 'exceljs';
import { getCompanyLogoBase64 } from './imageUtils';

/**
 * Genera un archivo Excel con formato profesional usando ExcelJS
 * Con logo, encabezado y diseño mejorado
 */
export const generateExcelReport = async ({
  title,
  columns,
  data,
  companySettings,
  fileName
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title.substring(0, 31));

  let startRow = 1;

  // Intentar agregar el logo
  try {
    const logoBase64 = await getCompanyLogoBase64(companySettings.logo);
    if (logoBase64) {
      const imageId = workbook.addImage({
        base64: logoBase64,
        extension: 'png',
      });

      // Agregar logo en la esquina superior izquierda
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 80, height: 80 }
      });

      // Información de la empresa al lado del logo
      worksheet.mergeCells('B1:D1');
      const nameCell = worksheet.getCell('B1');
      nameCell.value = companySettings.name;
      nameCell.font = { size: 16, bold: true, color: { argb: '4F46E5' } };
      nameCell.alignment = { vertical: 'middle', horizontal: 'left' };

      worksheet.mergeCells('B2:D2');
      const rifCell = worksheet.getCell('B2');
      rifCell.value = `RIF: ${companySettings.rif}`;
      rifCell.font = { size: 11, color: { argb: '6366F1' } };
      rifCell.alignment = { vertical: 'middle', horizontal: 'left' };

      // Ajustar altura de las primeras filas
      worksheet.getRow(1).height = 30;
      worksheet.getRow(2).height = 20;
      worksheet.getRow(3).height = 10; // Espacio
      worksheet.getRow(4).height = 10; // Espacio

      startRow = 5; // Los datos empiezan en fila 5
    }
  } catch (error) {
    console.warn('No se pudo agregar el logo:', error);
  }

  // Título del reporte
  const numCols = columns.length;
  const lastCol = String.fromCharCode(64 + numCols);
  
  worksheet.mergeCells(`A${startRow}:${lastCol}${startRow}`);
  const titleCell = worksheet.getCell(`A${startRow}`);
  titleCell.value = title;
  titleCell.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4F81BD' },
  };
  worksheet.getRow(startRow).height = 28;

  // Fila vacía
  startRow++;
  worksheet.getRow(startRow).height = 10;

  // Encabezados
  startRow++;
  worksheet.addRow(columns);
  worksheet.getRow(startRow).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(startRow).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getRow(startRow).height = 24;
  
  // Aplicar color de fondo y ancho a cada columna del encabezado
  columns.forEach((col, i) => {
    // Calcular ancho basado en el contenido
    let maxLength = col.length;
    data.forEach(row => {
      const cellValue = String(row[i] || '');
      maxLength = Math.max(maxLength, cellValue.length);
    });
    // Ancho mínimo 18, máximo 50 (más espacio)
    worksheet.getColumn(i + 1).width = Math.max(18, Math.min(maxLength + 5, 50));
    
    worksheet.getRow(startRow).getCell(i + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F81BD' },
    };
    worksheet.getRow(startRow).getCell(i + 1).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };
  });

  // Agregar filas de datos
  data.forEach((row, index) => {
    const excelRow = worksheet.addRow(row);
    excelRow.height = 20;
    excelRow.alignment = { vertical: 'middle' };
    
    // Alternar colores de fila
    excelRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFFFFF' : 'F5F5F5' }
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'D3D3D3' } },
        left: { style: 'thin', color: { argb: 'D3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
        right: { style: 'thin', color: { argb: 'D3D3D3' } }
      };
    });
  });

  // Generar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });

  // Descargar
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
