import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import bwipjs from 'bwip-js';
import axios from 'axios';
const generateReceiptPDF = async (appointment, outputPath) => {

  return new Promise(async (resolve, reject) => {
    try {
      // Create PDF with custom page setup
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4'
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Color Palette
      const colors = {
        headerPink: '#FFB6C1',
        lightBlue: '#E6F2FF',
        textBlue: '#4169E1',
        darkBlue: '#1A3A6C',
        gray: '#666666'
      };

      // Background color
      doc
        .fillColor(colors.lightBlue)
        .rect(0, 0, doc.page.width, doc.page.height)
        .fill();

      // Header Background
      doc
        .fillColor(colors.headerPink)
        .rect(0, 0, doc.page.width, 100)
        .fill();

      // Add Logo (if possible)
      // Add Logo (from remote URL via buffer)
      try {
        const logoUrl = 'https://i.postimg.cc/tCrc8Hx5/logo3.png';
        const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
        const logoBuffer = Buffer.from(response.data); // ✅ no 'base64' here
        doc.image(logoBuffer, 50, 30, { width: 100, height: 40 });
      } catch (logoError) {
        console.warn('⚠️ Logo load failed:', logoError.message);
        doc
          .font('Helvetica-Bold')
          .fontSize(20)
          .fillColor('white')
          .text('DocDash', 50, 40);
      }



      // Payment Receipt Title
      doc
        .fontSize(24)
        .fillColor('black')
        .text('Payment Receipt', { align: 'right', continued: false })
        .moveDown();

      // Receipt Details
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(colors.darkBlue)
        .text(`Receipt ID: ${appointment._id}`, { align: 'right' })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
        .moveDown(1);

      // Patient Information
      doc
        .fillColor(colors.textBlue)
        .fontSize(16)
        .text('Patient Information', { underline: true });
      doc
        .fontSize(12)
        .fillColor(colors.darkBlue)
        .text(`Name: ${appointment.userData.name}`)
        .text(`Email: ${appointment.userData.email}`)
        .moveDown(1);

      // Doctor Information
      doc
        .fillColor(colors.textBlue)
        .fontSize(16)
        .text('Doctor Information', { underline: true });
      doc
        .fontSize(12)
        .fillColor(colors.darkBlue)
        .text(`Doctor: ${appointment.docData.name}`)
        .text(`Speciality: ${appointment.docData.speciality}`)
        .text(`Location: ${appointment.docData.address?.line1 || '123'} - ${appointment.docData.address?.line2 || 'Activa Health Care'}`)
        .moveDown(1);

      // Appointment Details
      doc
        .fillColor(colors.textBlue)
        .fontSize(16)
        .text('Appointment Details', { underline: true });
      doc
        .fontSize(12)
        .fillColor(colors.darkBlue)
        .text(`Date: ${appointment.slotDate.replace(/_/g, '/')}`)
        .text(`Time: ${appointment.slotTime}`)
        .moveDown(1);

      // Payment Summary
      doc
        .fillColor(colors.textBlue)
        .fontSize(16)
        .text('Payment Summary', { underline: true });
      doc
        .fontSize(12)
        .fillColor(colors.darkBlue)
        .text(`Payment Method: Credit/Debit Card`)
        .text(`Consultation Fee: $${appointment.amount.toFixed(2)}`)
        .text(`Status: Paid`)
        .moveDown(2);

      // Verification Barcode
      const barcodePath = path.join('receipts', `barcode_${appointment._id}.png`);
      await new Promise((barcodeResolve, barcodeReject) => {
        bwipjs.toBuffer({
          bcid: 'code128',
          text: appointment._id.toString(),
          scale: 3,
          height: 10,
          includetext: true,
        }, (err, png) => {
          if (err) {
            console.warn('Barcode generation failed:', err);
            barcodeResolve();
            return;
          }

          fs.writeFileSync(barcodePath, png);

          // Footer Barcode Section
          const barcodeTop = doc.y + 20;
          const centerX = doc.page.width / 2;

          doc.fontSize(12).fillColor(colors.gray).text('Verification Barcode', centerX - 60, barcodeTop);

          doc.image(barcodePath, centerX - 100, barcodeTop + 20, {
            width: 200,
            height: 50,
            align: 'center'
          });

          doc.fontSize(10)
            .fillColor(colors.gray)
            .text(`Scan or quote Receipt ID: ${appointment._id.toString()}`, centerX - 100, barcodeTop + 80, {
              align: 'center',
              width: 200,
            });

          doc.moveDown(2);
          doc
            .fontSize(10)
            .fillColor(colors.gray)
            .text('© 2025 DocDash - Confidential Document', {
              width: 200,
            height: 50,
              align: 'center'
            });


          barcodeResolve();
        });
      });

      // Footer
     

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);

    } catch (error) {
      console.error('PDF generation failed:', error);
      reject(error);
    }
  });
};

export default generateReceiptPDF;