# Standard UBL Invoice – Documentation

This document explains the structure, rules, and calculation principles for a **Standard UBL 2.1 Invoice**.

---

## Table of Contents
1. Rules
2. Data Types
3. Invoice Header Structure
4. Party Information
5. Delivery Information
6. Allowances and Charges
7. Tax and Monetary Totals
8. Invoice Line Structure
9. Discount Handling Rules (10%)

---

## Rules

| Rule | Description |
|------|------------|
| **M - Mandatory** | Required by UBL 2.1 specification. |
| **O - Optional** | Optional unless required by business agreement. |
| **C - Conditional** | Required depending on tax or business logic. |
| **R - Recommended** | Recommended for interoperability. |

---

## Data Types

| DataType | Description | Format | Example |
|---------|------------|--------|---------|
| **Identifier** | Business identifier | Alphanumeric | `INV-2025-001` |
| **Date** | Calendar date | `YYYY-MM-DD` | `2025-12-05` |
| **Amount** | Monetary amount | Decimal | `99.95` |
| **Quantity** | Numeric quantity | Decimal | `2` |
| **Percentage** | Percentage value | `n.nn` | `10.00` |

---

## Invoice Header Structure

| Element | Rule | Description |
|-------|------|------------|
| `cbc:ID` | **M** | Invoice number |
| `cbc:IssueDate` | **M** | Invoice issue date |
| `cbc:DueDate` | **O** | Payment due date |
| `cbc:InvoiceTypeCode` | **M** | `380` = Commercial invoice |
| `cbc:DocumentCurrencyCode` | **M** | Invoice currency |
| `cbc:BuyerReference` | **O** | Buyer reference or order reference |

---

## Party Information

### AccountingSupplierParty (Seller)

| Element | Rule | Description |
|-------|------|------------|
| `cac:PartyName` | **M** | Seller name |
| `cac:PostalAddress` | **M** | Seller address |
| `cac:PartyTaxScheme` | **C** | VAT or tax registration |
| `cac:PartyLegalEntity` | **O** | Legal registration details |

### AccountingCustomerParty (Buyer)

Same structure and rules as supplier party.

---

## Delivery Information

| Element | Rule | Description |
|-------|------|------------|
| `cac:Delivery` | **O** | Delivery information |
| `cac:DeliveryLocation` | **O** | Delivery address |
| `cac:DeliveryParty` | **O** | Delivery recipient |

---

## Allowances and Charges

Allowances and charges may appear:
- At **document level** (global discount / fee)
- At **invoice line level** (line discount)

| Element | Rule | Description |
|-------|------|------------|
| `cbc:ChargeIndicator` | **M** | `false` = allowance (discount) |
| `cbc:AllowanceChargeReason` | **O** | Textual reason |
| `cbc:MultiplierFactorNumeric` | **O** | Discount percentage |
| `cbc:Amount` | **M** | Discount amount |
| `cbc:BaseAmount` | **C** | Amount discount is calculated from |

---

## Tax and Monetary Totals

### TaxTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:TaxAmount` | **M** | Total tax amount |
| `cac:TaxSubtotal` | **O** | Tax breakdown |

### LegalMonetaryTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:LineExtensionAmount` | **M** | Sum of net invoice lines |
| `cbc:TaxExclusiveAmount` | **M** | Net total before tax |
| `cbc:TaxInclusiveAmount` | **M** | Gross total incl. tax |
| `cbc:AllowanceTotalAmount` | **O** | Total allowances |
| `cbc:ChargeTotalAmount` | **O** | Total charges |
| `cbc:PayableAmount` | **M** | Amount to be paid |

---

## Invoice Line Structure

| Element | Rule | Description |
|-------|------|------------|
| `cbc:ID` | **M** | Line number |
| `cbc:InvoicedQuantity` | **M** | Quantity invoiced |
| `cbc:LineExtensionAmount` | **M** | Net line amount |
| `cac:AllowanceCharge` | **O** | Line discount |
| `cac:Item` | **M** | Product description |
| `cac:Price` | **M** | Unit price |

---

## Discount Handling Rules (10%)

- Discounts use `cac:AllowanceCharge`
- `ChargeIndicator = false` indicates a discount
- `MultiplierFactorNumeric = 10` means 10%
- `BaseAmount = Price × Quantity`
- `Amount = BaseAmount × 10%`
- `LineExtensionAmount = BaseAmount − Amount`


