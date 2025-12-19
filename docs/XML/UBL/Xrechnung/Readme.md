# XRechnung EN16931 COMPLIANT

This repository provides documentation and examples of how Mascot delivers invoices in **XRechnung (EN 16931)** format.

---

## Overview

XRechnung is the German standard for electronic invoicing based on the **European Norm EN 16931**.  
It is typically required for **B2G (Business-to-Government)** invoicing but is also used for **B2B** integrations where structured electronic invoices are needed.

Mascot generates fully compliant **XRechnung invoices** and can deliver them through multiple secure channels.

---

## Example Breakdown

We have provided a **sample XRechnung invoice** for reference:  
[`Xrechnung-invoice-example.xml`](https://github.com/Mascot-International/integration-docs/blob/main/docs/Xrechnung/Xrechnung-invoice-example.xml)

### Key Elements in the Example
| Section | Description |
|----------|-------------|
| **Header** | Invoice ID, issue date, and currency information. |
| **Seller Party** | Mascot company details, including VAT number and address. |
| **Buyer Party** | Your company information, based on your customer setup in our system. |
| **Invoice Lines** | Detailed product or service lines with quantities, unit prices, and totals. |
| **Totals** | Net amount, taxes, and gross payable amount. |
| **Payment Information** | Bank details (IBAN, BIC) and payment terms for settlement. |

---

## Mandatory Fields (Informational)

All invoices we provide comply with the **EN 16931** standard and include all required data fields.

| Section | Field | Description | Example |
|----------|-------|-------------|---------|
| **Header** | `<cbc:ID>` | Unique invoice number. | `INV-100045` |
| | `<cbc:IssueDate>` | Date the invoice was issued. | `2025-08-28` |
| | `<cbc:DocumentCurrencyCode>` | Currency code. | `EUR` |
| **Seller** | `<cac:PartyName>` | Mascot company name. | `Mascot International A/S` |
| | `<cac:PostalAddress>` | Mascot address. | `Silkeborgvej 12, DK-7400 Silkeborg` |
| | `<cac:PartyTaxScheme>` | Mascot VAT ID. | `DK12345678` |
| **Buyer** | `<cac:PartyName>` | Your registered company name. | `Customer GmbH` |
| | `<cac:PostalAddress>` | Your company address. | `Example straße 45, Berlin, DE` |
| **Invoice Lines** | `<cbc:ID>` | Line number. | `1` |
| | `<cbc:InvoicedQuantity>` | Quantity delivered. | `10` |
| | `<cbc:LineExtensionAmount>` | Net amount for the line. | `150.00` |
| **Totals** | `<cbc:TaxExclusiveAmount>` | Total net amount. | `1000.00` |
| | `<cbc:TaxInclusiveAmount>` | Total gross amount. | `1190.00` |
| | `<cbc:PayableAmount>` | Final amount payable. | `1190.00` |

> This table is for **reference only** — Mascot populates all mandatory fields in every delivered invoice.

---

## Connection Options

We can deliver your invoices securely in different ways:

| Option | Description | Requirements |
|---------|-------------|--------------|
| **SFTP (Preferred)** | Invoices are placed in a dedicated folder on our secure SFTP server. | Provide your **IP address** for whitelisting. |
| **Your SFTP/FTP** | We send invoices directly to your SFTP or FTP endpoint. | Provide your **server details** (host, user, folder path, etc.). |
| **Email** | Invoices are sent as XML attachments. | Provide the **email address** where invoices should be delivered. |
