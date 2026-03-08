import { Injectable } from '@nestjs/common';
import { Obra } from './entities/obra.entity';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFDocument = require('pdfkit');

@Injectable()
export class ObrasPdfService {

  async generarReporteObra(obra: Obra): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'LETTER', margins: { top: 40, left: 40, right: 40, bottom: 0 } });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      this.buildDocument(doc, obra);
      doc.end();
    });
  }

  async generarReporteMultiple(obras: Obra[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'LETTER', margins: { top: 40, left: 40, right: 40, bottom: 0 } });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      obras.forEach((obra, index) => {
        if (index > 0) doc.addPage();
        this.buildDocument(doc, obra);
      });

      doc.end();
    });
  }

  private buildDocument(doc: PDFKit.PDFDocument, obra: Obra): void {
    const marginLeft = doc.page.margins.left;
    const pageWidth = doc.page.width - marginLeft - doc.page.margins.right;
    let y = 20; // Posición Y manual — TODO se calcula desde aquí

    // ====== ENCABEZADO ======
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#2c3e50')
      .text('SISTEMA DE SEGUIMIENTO DE OBRAS', marginLeft, y, { lineBreak: false });
    doc.font('Helvetica').fontSize(8).fillColor('#7f8c8d')
      .text('Gobierno del Estado de Yucatán', marginLeft, y, { width: pageWidth, align: 'right', lineBreak: false });

    y += 18;
    doc.moveTo(marginLeft, y).lineTo(marginLeft + pageWidth, y)
      .strokeColor('#2c3e50').lineWidth(0.5).stroke();

    // ====== TÍTULO ======
    y += 15;
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#2c3e50')
      .text('REPORTE DE OBRA', marginLeft, y, { width: pageWidth, align: 'center', lineBreak: false });

    y += 24;
    doc.font('Helvetica').fontSize(11).fillColor('#555555')
      .text(`Obra #${obra.numeroObra} — Ejercicio Fiscal ${obra.ejercicioFiscal?.anio ?? ''}`, marginLeft, y, { width: pageWidth, align: 'center', lineBreak: false });

    y += 20;
    doc.moveTo(marginLeft, y).lineTo(marginLeft + pageWidth, y)
      .strokeColor('#2c3e50').lineWidth(1).stroke();

    // ====== SECCIÓN: DATOS GENERALES ======
    y += 15;
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#2c3e50')
      .text('Datos Generales', marginLeft, y, { lineBreak: false });

    y += 20;

    const datosGenerales: [string, string][] = [
      ['No. de Obra', `${obra.numeroObra}`],
      ['Clave Única', obra.claveUnica],
      ['Nombre', obra.nombre],
      ['Ejercicio Fiscal', obra.ejercicioFiscal?.anio?.toString() ?? 'N/A'],
      ['Dependencia', obra.dependencia?.nombre ?? 'N/A'],
      ['Municipio', obra.municipio?.nombre ?? 'N/A'],
      ['Tipo de Proyecto', obra.tipoProyecto?.nombre ?? 'N/A'],
      ['Sector', obra.sector?.nombre ?? 'N/A'],
      ['Estatus', obra.estatusObra?.nombre ?? 'N/A'],
      ['Monto', this.formatMonto(obra.monto)],
    ];

    y = this.drawTable(doc, datosGenerales, pageWidth, y);

    // ====== SECCIÓN: DESCRIPCIÓN ======
    if (obra.descripcion) {
      y += 15;
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#2c3e50')
        .text('Descripción', marginLeft, y, { lineBreak: false });
      y += 18;
      doc.font('Helvetica').fontSize(10).fillColor('#000000')
        .text(obra.descripcion, marginLeft, y, { width: pageWidth, align: 'justify', lineBreak: false });
      y += 14;
    }

    // ====== SECCIÓN: UBICACIONES ======
    if (obra.ubicaciones && obra.ubicaciones.length > 0) {
      y += 15;
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#2c3e50')
        .text('Ubicaciones', marginLeft, y, { lineBreak: false });
      y += 20;
      y = this.drawUbicacionesTable(doc, obra, pageWidth, y);
    }

    // ====== PIE DE PÁGINA ======
    const fechaGeneracion = new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const footerY = doc.page.height - 30;
    doc.font('Helvetica').fontSize(8).fillColor('#999999')
      .text(`Generado: ${fechaGeneracion}`, marginLeft, footerY, { width: pageWidth, align: 'left', lineBreak: false });
    doc.text('Página 1 de 1', marginLeft, footerY, { width: pageWidth, align: 'right', lineBreak: false });
    doc.y = 0;
  }

  /**
   * Dibuja la tabla de datos generales (etiqueta - valor)
   */
  private drawTable(doc: PDFKit.PDFDocument, rows: [string, string][], tableWidth: number, startY: number): number {
    const colLabelWidth = 140;
    const colValueWidth = tableWidth - colLabelWidth;
    const startX = doc.page.margins.left;
    const rowHeight = 20;
    let y = startY;

    rows.forEach(([label, valor]) => {
      // Fondo label
      doc.save();
      doc.rect(startX, y, colLabelWidth, rowHeight).fill('#f5f6fa');
      doc.rect(startX, y, colLabelWidth, rowHeight).stroke('#dcdde1');
      doc.restore();

      // Fondo valor
      doc.save();
      doc.rect(startX + colLabelWidth, y, colValueWidth, rowHeight).fill('#ffffff');
      doc.rect(startX + colLabelWidth, y, colValueWidth, rowHeight).stroke('#dcdde1');
      doc.restore();

      // Texto label
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#34495e')
        .text(label, startX + 6, y + 5, { width: colLabelWidth - 12, lineBreak: false });

      // Texto valor
      doc.font('Helvetica').fontSize(9).fillColor('#000000')
        .text(valor, startX + colLabelWidth + 6, y + 5, { width: colValueWidth - 12, lineBreak: false });

      y += rowHeight;
      doc.y = 0;
    });

    return y;
  }

  /**
   * Dibuja la tabla de ubicaciones
   */
  private drawUbicacionesTable(doc: PDFKit.PDFDocument, obra: Obra, tableWidth: number, startY: number): number {
    const startX = doc.page.margins.left;
    const colWidths = [30, tableWidth - 30 - 100 - 90 - 90, 100, 90, 90];
    const headers = ['#', 'Dirección', 'Municipio', 'Localidad', 'Referencia'];
    const rowHeight = 18;
    let y = startY;

    // Header
    let xPos = startX;
    headers.forEach((header, i) => {
      doc.save();
      doc.rect(xPos, y, colWidths[i], rowHeight).fill('#2c3e50');
      doc.restore();
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff')
        .text(header, xPos + 4, y + 5, { width: colWidths[i] - 8, lineBreak: false });
      xPos += colWidths[i];
    });
    y += rowHeight;

    // Rows
    obra.ubicaciones.forEach((ub, idx) => {
      const fillColor = idx % 2 === 0 ? '#ffffff' : '#f8f9fa';
      const rowData = [
        `${idx + 1}`,
        ub.direccion ?? '',
        ub.municipio?.nombre ?? 'N/A',
        ub.localidadReferencia ?? '-',
        ub.referenciaLugar ?? '-',
      ];

      xPos = startX;
      rowData.forEach((text, i) => {
        doc.save();
        doc.rect(xPos, y, colWidths[i], rowHeight).fill(fillColor);
        doc.rect(xPos, y, colWidths[i], rowHeight).stroke('#dcdde1');
        doc.restore();
        doc.font('Helvetica').fontSize(8).fillColor('#000000')
          .text(text, xPos + 4, y + 5, { width: colWidths[i] - 8, lineBreak: false });
        xPos += colWidths[i];
      });
      y += rowHeight;
      doc.y = 0;
    });

    return y;
  }

  private formatMonto(monto: number): string {
    if (!monto && monto !== 0) return 'N/A';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(monto);
  }
}
