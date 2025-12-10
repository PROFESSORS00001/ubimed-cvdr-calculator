import { Request, Response } from 'express';

export const sendEmailReport = async (req: Request, res: Response) => {
    try {
        const { email, recordId, studyCode } = req.body;

        if (!email || !recordId) {
            return res.status(400).json({ error: 'Missing email or record ID' });
        }

        // Mock Email Sending Logic
        console.log(`\n--- MOCK EMAIL SERVICE ---`);
        console.log(`To: ${email}`);
        console.log(`Subject: CVDR Assessment Report `);
        console.log(`Body: Calculated risk report for patient ${studyCode || 'Unknown'} (ID: ${recordId}) is attached.`);
        console.log(`Attachment: Report_${recordId}.pdf`);
        console.log(`--------------------------\n`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return res.json({ 
            success: true, 
            message: `Report successfully queued for ${email}` 
        });

    } catch (error) {
        console.error("Email Error:", error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};
