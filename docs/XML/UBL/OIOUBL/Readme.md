# OIOUBL Invoice – Documentation

This document explains the structure, rules, and calculation principles for an **OIOUBL Invoice** based on **UBL 2.1**, used primarily in **Denmark** for public and private e-invoicing.

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
| **M - Mandatory** | Required by OIOUBL specification. |
| **O - Optional** | Optional unless required by agreement or Danish business rules. |
| **C - Conditional** | Required depending on VAT or legal requirements. |
| **R - Recommended** | Recommended for interoperability with Danish systems. |

---

## Data Types

| DataType | Description | Format | Example |
|---------|------------|--------|---------|
| **Identifier** | Business identifier | Alphanumeric | `INV-OIO-2025-01` |
| **Date** | Calendar date | `YYYY-MM-DD` | `2025-12-05` |
| **Amount** | Monetary amount | Decimal | `99.95` |
| **Quantity** | Numeric quantity | Decimal | `2` |
| **Percentage** | Percentage value | `n.nn` | `10.00` |

---

## Invoice Header Structure

| Element | Rule | Description |
|-------|------|------------|
| `cbc:CustomizationID` | **M** | OIOUBL customization identifier |
| `cbc:ProfileID` | **R** | OIOUBL process profile |
| `cbc:ID` | **M** | Invoice number |
| `cbc:IssueDate` | **M** | Invoice issue date |
| `cbc:DueDate` | **O** | Payment due date |
| `cbc:InvoiceTypeCode` | **M** | `380` = Commercial invoice |
| `cbc:DocumentCurrencyCode` | **M** | Invoice currency (typically DKK or EUR) |
| `cbc:BuyerReference` | **R** | Buyer reference or EAN reference |

---

## Party Information

### AccountingSupplierParty (Seller)

| Element | Rule | Description |
|-------|------|------------|
| `cbc:EndpointID` | **M** | Danish EAN / GLN number |
| `cac:PartyName` | **M** | Legal supplier name |
| `cac:PostalAddress` | **M** | Registered Danish address |
| `cac:PartyTaxScheme` | **C** | Danish VAT (CVR) number |
| `cac:PartyLegalEntity` | **R** | Legal entity details |

### AccountingCustomerParty (Buyer)

| Element | Rule | Description |
|-------|------|------------|
| `cbc:EndpointID` | **M** | Buyer EAN / GLN |
| `cac:PartyName` | **M** | Buyer name |
| `cac:PostalAddress` | **M** | Buyer address |
| `cac:PartyTaxScheme` | **C** | Buyer VAT if applicable |

---

## Delivery Information

| Element | Rule | Description |
|-------|------|------------|
| `cac:Delivery` | **O** | Delivery information |
| `cac:DeliveryLocation` | **O** | Delivery address |
| `cac:DeliveryParty` | **O** | Delivery recipient |

---

## Allowances and Charges

Allowances and charges are used for:
- Discounts
- Fees
- Surcharges

They may appear at **document level** or **line level**.

| Element | Rule | Description |
|-------|------|------------|
| `cbc:ChargeIndicator` | **M** | `false` = allowance (discount) |
| `cbc:AllowanceChargeReason` | **R** | Textual reason |
| `cbc:MultiplierFactorNumeric` | **O** | Discount percentage |
| `cbc:Amount` | **M** | Allowance/charge amount |
| `cbc:BaseAmount` | **C** | Amount used for calculation |

---

## Tax and Monetary Totals

### TaxTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:TaxAmount` | **M** | Total VAT amount |
| `cac:TaxSubtotal` | **C** | VAT breakdown per rate |

### LegalMonetaryTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:LineExtensionAmount` | **M** | Sum of net invoice lines |
| `cbc:TaxExclusiveAmount` | **M** | Net total before VAT |
| `cbc:TaxInclusiveAmount` | **M** | Gross total incl. VAT |
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
| `cac:AllowanceCharge` | **O** | Line-level discount |
| `cac:Item` | **M** | Product or service information |
| `cac:Price` | **M** | Unit price before discount |

---

## Discount Handling Rules (10%)

- Discounts are expressed using `cac:AllowanceCharge`
- `cbc:ChargeIndicator = false` indicates a discount
- `cbc:MultiplierFactorNumeric = 10` represents a 10% discount
- `cbc:BaseAmount = Price × Quantity`
- `cbc:Amount = BaseAmount × 10%`
- `cbc:LineExtensionAmount = BaseAmount − Amount`



