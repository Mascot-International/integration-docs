This document explains the structure, rules, and calculation principles for a **Peppol BIS Billing 3.0 Invoice** using **UBL 2.1 XML**.

---

## Table of Contents
1. Rules
2. Data Types
3. Invoice Header Structure
4. Party Information
5. Tax and Monetary Totals
6. Invoice Line Structure
7. Discount Handling Rules

---

## Rules

| Rule | Description |
|------|------------|
| **M - Mandatory** | Element must always be present according to Peppol BIS 3.0. |
| **O - Optional** | Element may be omitted if not applicable. |
| **C - Conditional** | Required based on business or tax rules. |
| **R - Recommended** | Strongly recommended for interoperability. |

---

## Data Types

| DataType | Description | Format | Example |
|---------|------------|--------|---------|
| **Identifier** | Business identifier | Alphanumeric | `INVOICE-12345` |
| **Date** | ISO date | `YYYY-MM-DD` | `2025-12-05` |
| **Amount** | Decimal with currency | `n.nn` | `99.95` |
| **Percentage** | Numeric percent | `n.nn` | `21.00` |

---

## Invoice Header Structure

| Element | Rule | Description |
|-------|------|------------|
| `cbc:CustomizationID` | **M** | Identifies EN 16931 + Peppol BIS 3.0 compliance |
| `cbc:ProfileID` | **M** | Peppol billing profile |
| `cbc:ID` | **M** | Invoice number |
| `cbc:IssueDate` | **M** | Invoice issue date |
| `cbc:DueDate` | **M** | Payment due date |
| `cbc:InvoiceTypeCode` | **M** | `380` = Commercial invoice |
| `cbc:DocumentCurrencyCode` | **M** | Invoice currency |
| `cbc:BuyerReference` | **R** | Buyer reference or order reference |

---

## Party Information

### AccountingSupplierParty (Seller)

| Element | Rule | Description |
|-------|------|------------|
| `cbc:EndpointID` | **M** | Seller Peppol endpoint ID (e.g. GLN) |
| `cac:PartyName` | **M** | Legal name |
| `cac:PostalAddress` | **M** | Registered address |
| `cac:PartyTaxScheme` | **C** | VAT registration |
| `cac:PartyLegalEntity` | **M** | Legal entity details |

### AccountingCustomerParty (Buyer)

Same structure and rules as supplier party, using buyer identifiers.

---

## Tax and Monetary Totals

### TaxTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:TaxAmount` | **M** | Total VAT amount |
| `cac:TaxSubtotal` | **M** | VAT breakdown per tax rate |

### LegalMonetaryTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:LineExtensionAmount` | **M** | Sum of line net amounts (after discount) |
| `cbc:TaxExclusiveAmount` | **M** | Net amount before VAT |
| `cbc:TaxInclusiveAmount` | **M** | Gross amount incl. VAT |
| `cbc:PayableAmount` | **M** | Amount to be paid |

---

## Invoice Line Structure

| Element | Rule | Description |
|-------|------|------------|
| `cbc:ID` | **M** | Line number |
| `cbc:InvoicedQuantity` | **M** | Quantity invoiced |
| `cbc:LineExtensionAmount` | **M** | Net line amount after discount |
| `cac:InvoicePeriod` | **O** | Service or delivery period |
| `cac:OrderLineReference` | **R** | Reference to order line |
| `cac:AllowanceCharge` | **O** | Line-level discount or charge |
| `cac:Item` | **M** | Product information |
| `cac:Price` | **M** | Unit price before discount |

---

## Discount Handling Rules

- Discounts are expressed using `cac:AllowanceCharge`
- `cbc:ChargeIndicator = false` indicates a discount
- `cbc:MultiplierFactorNumeric` holds the discount percentage
- `cbc:BaseAmount` is the original line amount (price × quantity)
- `cbc:Amount` is the discount value
- `cbc:LineExtensionAmount` = BaseAmount − DiscountAmount

---
