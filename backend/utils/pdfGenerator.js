/**
 * PDF Generation utility for prescriptions
 * Uses pdfkit to create professional medical prescription PDFs
 */
const PDFDocument = require('pdfkit');
const { s3Client } = require('./s3Config');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

/**
 * Generate a prescription PDF and upload to S3
 * @param {Object} prescription - Populated prescription document
 * @returns {Promise<string>} - S3 URL of the generated PDF
 */
const generatePrescriptionPDF = async (prescription) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margin: 50,
                info: {
                    Title: `Prescription - ${prescription.patientId?.name || 'Patient'}`,
                    Author: `Dr. ${prescription.doctorId?.name || 'Doctor'}`,
                    Subject: 'Medical Prescription',
                    Creator: 'Medicare - The Healthcare'
                }
            });

            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', async () => {
                try {
                    const pdfBuffer = Buffer.concat(chunks);
                    const fileName = `prescriptions/prescription-${prescription._id}-${Date.now()}.pdf`;

                    // Upload to S3
                    const putCommand = new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: fileName,
                        Body: pdfBuffer,
                        ContentType: 'application/pdf',
                    });
                    await s3Client.send(putCommand);

                    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
                    resolve(s3Url);
                } catch (uploadErr) {
                    reject(uploadErr);
                }
            });

            const doctor = prescription.doctorId;
            const patient = prescription.patientId;

            // ========== HEADER ==========
            // Blue header bar
            doc.rect(0, 0, doc.page.width, 120).fill('#0072ff');

            doc.fillColor('#ffffff')
                .font('Helvetica-Bold')
                .fontSize(28)
                .text('Medicare', 50, 30);

            doc.fontSize(11)
                .font('Helvetica')
                .text('The Healthcare', 50, 62);

            doc.fontSize(10)
                .text('Digital Prescription', 50, 82);

            // Prescription ID on right
            doc.fontSize(9)
                .text(`Rx #${prescription._id.toString().slice(-8).toUpperCase()}`, 350, 35, { align: 'right' });

            doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 350, 50, { align: 'right' });

            // ========== DOCTOR & PATIENT INFO ==========
            let yPos = 140;

            // Doctor info
            doc.fillColor('#333333')
                .font('Helvetica-Bold')
                .fontSize(14)
                .text(`Dr. ${doctor?.name || 'N/A'}`, 50, yPos);

            doc.font('Helvetica')
                .fontSize(10)
                .fillColor('#666666')
                .text(`${doctor?.specialization || ''} | ${doctor?.hospital || ''}`, 50, yPos + 18)
                .text(`Experience: ${doctor?.experience || 'N/A'} years`, 50, yPos + 32);

            // Patient info on right
            doc.fillColor('#333333')
                .font('Helvetica-Bold')
                .fontSize(11)
                .text('Patient:', 350, yPos, { align: 'right' });

            doc.font('Helvetica')
                .fontSize(10)
                .fillColor('#666666')
                .text(`${patient?.name || 'N/A'}`, 350, yPos + 15, { align: 'right' })
                .text(`Age: ${patient?.age || 'N/A'} | Gender: ${patient?.gender || 'N/A'}`, 350, yPos + 29, { align: 'right' });

            // Divider
            yPos += 55;
            doc.moveTo(50, yPos).lineTo(doc.page.width - 50, yPos).strokeColor('#e0e0e0').lineWidth(1).stroke();

            // ========== DIAGNOSIS ==========
            yPos += 15;
            doc.fillColor('#0072ff')
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('Diagnosis', 50, yPos);

            yPos += 18;
            doc.fillColor('#333333')
                .font('Helvetica')
                .fontSize(10)
                .text(prescription.diagnosis, 50, yPos, { width: doc.page.width - 100 });

            yPos += doc.heightOfString(prescription.diagnosis, { width: doc.page.width - 100 }) + 15;

            // ========== MEDICINES TABLE ==========
            doc.fillColor('#0072ff')
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('Prescribed Medicines', 50, yPos);

            yPos += 22;

            // Table header
            const colWidths = [30, 140, 80, 100, 80, 70];
            const headers = ['#', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Notes'];
            const tableX = 50;

            doc.rect(tableX, yPos, doc.page.width - 100, 22).fill('#f0f4ff');
            doc.fillColor('#333333').font('Helvetica-Bold').fontSize(9);

            let xPos = tableX + 5;
            headers.forEach((header, i) => {
                doc.text(header, xPos, yPos + 6, { width: colWidths[i] });
                xPos += colWidths[i];
            });
            yPos += 22;

            // Table rows
            doc.font('Helvetica').fontSize(9).fillColor('#333333');
            prescription.medicines.forEach((med, index) => {
                // Check if we need a new page
                if (yPos > doc.page.height - 100) {
                    doc.addPage();
                    yPos = 50;
                }

                const rowHeight = 20;
                if (index % 2 === 1) {
                    doc.rect(tableX, yPos, doc.page.width - 100, rowHeight).fill('#fafbff');
                    doc.fillColor('#333333');
                }

                xPos = tableX + 5;
                const rowData = [
                    `${index + 1}`,
                    med.name,
                    med.dosage,
                    med.frequency,
                    med.duration,
                    med.notes || '-'
                ];
                rowData.forEach((data, i) => {
                    doc.text(data, xPos, yPos + 5, { width: colWidths[i] - 5 });
                    xPos += colWidths[i];
                });
                yPos += rowHeight;
            });

            // ========== ADDITIONAL NOTES ==========
            if (prescription.additionalNotes) {
                yPos += 15;
                doc.fillColor('#0072ff')
                    .font('Helvetica-Bold')
                    .fontSize(12)
                    .text('Additional Notes', 50, yPos);

                yPos += 18;
                doc.fillColor('#333333')
                    .font('Helvetica')
                    .fontSize(10)
                    .text(prescription.additionalNotes, 50, yPos, { width: doc.page.width - 100 });

                yPos += doc.heightOfString(prescription.additionalNotes, { width: doc.page.width - 100 }) + 10;
            }

            // ========== FOLLOW-UP ==========
            if (prescription.followUpDate) {
                yPos += 10;
                doc.fillColor('#0072ff')
                    .font('Helvetica-Bold')
                    .fontSize(11)
                    .text(`Follow-up Date: ${prescription.followUpDate}`, 50, yPos);
            }

            // ========== FOOTER ==========
            const footerY = doc.page.height - 80;
            doc.moveTo(50, footerY).lineTo(doc.page.width - 50, footerY).strokeColor('#e0e0e0').lineWidth(1).stroke();

            doc.fillColor('#999999')
                .font('Helvetica')
                .fontSize(8)
                .text('This is a digitally generated prescription from Medicare - The Healthcare.', 50, footerY + 10, { align: 'center' })
                .text(`Generated on ${new Date().toLocaleString('en-IN')}`, 50, footerY + 22, { align: 'center' })
                .text('This prescription is valid for 30 days from the date of issue.', 50, footerY + 34, { align: 'center' });

            doc.end();

        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { generatePrescriptionPDF };
