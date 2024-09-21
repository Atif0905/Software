import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import '../App.css';
const PrintPage = () => {
  const { state } = useLocation();
  const { expense } = state || { expense: {} };
  const formatDate = useMemo(() => (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  }, []);
  const handlePrint = () => {
    window.print();
  };
  const handleDownloadPDF = async () => {
    const input = document.getElementById('print-content');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210; // A4 size width in mm
    const pageHeight = 295; // A4 size height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save('expense-details.pdf');
  };
  const handleDownloadExcel = () => {
    const tableData = [
      ["Amount", "Summary", "Payment Date", "Comment"], // Header
      [
        expense.amount,
        expense.expenseSummary,
        formatDate(expense.Paydate),
        expense.comment
      ]
    ];
    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expense Details");
    XLSX.writeFile(wb, "expense-details.xlsx");
  };
  return (
    <div className='white'>
    <div className="container">
      <div className="button-group d-flex justify-content-end mt-5">
        <button onClick={handleDownloadExcel} className="Excel">Download as Excel</button>
        <button onClick={handlePrint} className="print-button ">Print</button>
        <button onClick={handleDownloadPDF} className="Download">
          <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
          </svg>
          <span className="icon2"></span>
        </button>
      </div>
      <h2 className="heading">Expense Detail ({expense.amount})</h2>
      <div id="print-content">
        <h4 className="company-name">EKAKSHAR BUILDTECH PRIVATE LIMITED</h4>
        <h5 className="company-address">
          UNIT NO-407, Sector-90 Alphathum Noida, Gautambuddha Nagar Uttar Pradesh 201301
        </h5>
        {expense ? (
          <>
            <h5 className="expense-header mt-5">Expense Paid to {expense.teamLeadName?.toUpperCase()}</h5>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Summary</th>
                  <th>Payment Date</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{expense.amount}</td>
                  <td>{expense.expenseSummary}</td>
                  <td>{formatDate(expense.Paydate)}</td>
                  <td>{expense.comment}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <p>No expense details to display.</p>
        )}
      </div>
    </div>
    </div>
  );
};
export default PrintPage;