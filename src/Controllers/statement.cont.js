import PDFDocument from "pdfkit";
import accountModel from "../Model/account.model.js";
import ledgerModel from "../Model/ledger.model.js";
import { errorResponse } from "../Services/response.js";

export const generateMonthlyStatement = async (req, res) => {
    try {
        const { accountId, month, year } = req.query;

        if (!accountId || !month || !year) {
            return errorResponse(res, 400, "accountId, month and year are required");
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);


        const account = await accountModel.findById(accountId).populate("user", "name");
        if (!account) { return errorResponse(res, 404, "Account not found") }


        // Monthly transactions
        const ledgers = await ledgerModel.find({
            account: accountId,
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });

        // Opening balance
        const openingEntries = await ledgerModel.find({
            account: accountId,
            createdAt: { $lt: startDate }
        });

        let openingBalance = 0;
        openingEntries.forEach(entry => {
            if (entry.type === "CREDIT") openingBalance += entry.amount;
            if (entry.type === "DEBIT") openingBalance -= entry.amount;
        });

        let runningBalance = openingBalance;
        let totalDebit = 0;
        let totalCredit = 0;

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Monthly_Statement_${month}_${year}.pdf`
        );

        doc.pipe(res);

        /* ================= HEADER ================= */
        doc.fontSize(19).font("Helvetica-Bold");
        doc.text("Monthly Account Statement", { align: "center" });
        doc.moveDown();

        doc.fontSize(11).font("Helvetica-Bold");
        doc.text(`Account Number: ${account.accountNumber}`);
        doc.text(`Account Holder: ${account.user.name}`);
        doc.text(`Statement Period: ${month}/${year}`);
        doc.moveDown();

        /* ================= TABLE HEADER ================= */
        const dateX = 40;
        const typeX = 200;
        const debitX = 300;
        const creditX = 380;
        const balanceX = 460;

        let currentY = doc.y;

        doc.fontSize(10).font("Helvetica-Bold");
        doc.text("Date", dateX, currentY);
        doc.text("Type", typeX, currentY);
        doc.text("Debited", debitX, currentY);
        doc.text("Credited", creditX, currentY);
        doc.text("Balance", balanceX, currentY);

        currentY += 15;
        doc.moveTo(dateX, currentY).lineTo(550, currentY).stroke();
        currentY += 10;
        doc.font("Helvetica").fontSize(10);

        /* ================= TABLE ROWS ================= */
        const rowHeight = 18;

        ledgers.forEach(entry => {
            if (currentY > 750) {
                doc.addPage();
                currentY = 50;
            }

            let debit = "";
            let credit = "";

            if (entry.type === "DEBIT") {
                runningBalance -= entry.amount;
                totalDebit += entry.amount;
                debit = entry.amount.toFixed(2);
            } else if (entry.type === "CREDIT") {
                runningBalance += entry.amount;
                totalCredit += entry.amount;
                credit = entry.amount.toFixed(2);
            }

            const date = entry.createdAt.toISOString().split("T")[0];

            doc.text(date, dateX, currentY);
            doc.text(entry.type, typeX, currentY);
            doc.text(debit, debitX, currentY);
            doc.text(credit, creditX, currentY);
            doc.text(runningBalance.toFixed(2), balanceX, currentY);

            currentY += rowHeight;
        });

        /* ================= TOTAL SECTION ================= */
        currentY += 10;
        doc.moveTo(dateX, currentY).lineTo(550, currentY).stroke();
        currentY += 20;

        doc.fontSize(11).font("Helvetica-Bold");
        doc.text(`Total Debit: Rs ${totalDebit.toFixed(2)}`, dateX, currentY);
        currentY += 18;
        doc.text(`Total Credit: Rs ${totalCredit.toFixed(2)}`, dateX, currentY);
        currentY += 18;
        doc.text(`Closing Balance: Rs ${runningBalance.toFixed(2)}`, dateX, currentY);

        doc.end();

    } catch (error) {
        console.error("Error generating statement:", error);
        return errorResponse(res, 500, "An error occurred while generating the statement");
    }
};