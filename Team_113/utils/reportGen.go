package utils

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"time"

	"github.com/jung-kurt/gofpdf"
)

// InvoiceItem struct for each invoice entry
type InvoiceItem struct {
	Description string
	Quantity    int
	UnitPrice   uint
}

// GenerateInvoice creates a PDF invoice
func GenerateInvoice(filename string, customerName string, items []InvoiceItem) error {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(10, 10, 10)
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(40, 10, "Invoice")
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, "Customer: "+customerName)
	pdf.Ln(10)
	pdf.Cell(40, 10, "Date: "+time.Now().Format("2006-01-02"))
	pdf.Ln(10)

	headers := []string{"Description", "Quantity", "Unit Price", "Total"}
	widths := []float64{80, 30, 40, 40}
	for i, header := range headers {
		pdf.CellFormat(widths[i], 10, header, "1", 0, "C", false, 0, "")
	}
	pdf.Ln(-1)

	totalAmount := uint(0)
	for _, item := range items {
		itemTotal := uint(item.Quantity) * item.UnitPrice
		totalAmount += itemTotal
		values := []string{item.Description, fmt.Sprintf("%d", item.Quantity), fmt.Sprintf("%d", item.UnitPrice), fmt.Sprintf("%d", itemTotal)}
		for i, value := range values {
			pdf.CellFormat(widths[i], 10, value, "1", 0, "C", false, 0, "")
		}
		pdf.Ln(-1)
	}

	pdf.SetFont("Arial", "B", 12)
	pdf.CellFormat(150, 10, "Total Amount:", "", 0, "L", false, 0, "")
	pdf.CellFormat(40, 10, fmt.Sprintf("%d", totalAmount), "1", 1, "C", false, 0, "")

	return pdf.OutputFileAndClose(filename)
}

// sendEmail sends an email with an attached PDF invoice
func sendEmail(to, filename string) error {
	from := "mohantybrajesh4@gmail.com" // Fetch email from environment variable
	password := "axrbvuubnrsrctso"      // Replace with your app password
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Read the invoice file
	fileData, err := os.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("failed to read invoice file: %v", err)
	}

	// Encode the file content to Base64
	encodedFile := base64.StdEncoding.EncodeToString(fileData)

	// Email body message
	emailBody := "Please find your invoice attached."

	// Email headers and body (with attachment)
	msg := []byte(
		"To: " + to + "\r\n" +
			"Subject: Invoice for Your Purchase\r\n" +
			"MIME-Version: 1.0\r\n" +
			"Content-Type: multipart/mixed; boundary=boundary123\r\n\r\n" +

			"--boundary123\r\n" +
			"Content-Type: text/plain; charset=\"UTF-8\"\r\n" +
			"Content-Transfer-Encoding: 7bit\r\n\r\n" +
			emailBody + "\r\n\r\n" +

			"--boundary123\r\n" +
			"Content-Type: application/pdf\r\n" +
			"Content-Transfer-Encoding: base64\r\n" +
			"Content-Disposition: attachment; filename=\"" + filename + "\"\r\n\r\n" +
			encodedFile + "\r\n" +

			"--boundary123--",
	)

	// Authentication for sending email
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send the email with the attachment
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, msg)
}

// GenerateAndSendInvoice generates an invoice and emails it
func GenerateAndSendInvoice(email string, customerName string, items []InvoiceItem) error {
	filename := "invoice.pdf"

	if err := GenerateInvoice(filename, customerName, items); err != nil {
		return fmt.Errorf("failed to generate invoice: %v", err)
	}

	if err := sendEmail(email, filename); err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}

	log.Printf("Invoice generated and sent successfully to %s", email)
	return nil
}
