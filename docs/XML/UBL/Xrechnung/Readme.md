# XRechnung Invoice (EN16931 – UBL) – Documentation

This document explains the structure, rules, and calculation principles for an **EN16931-compliant XRechnung invoice** using the **UBL 2.1 syntax**.

---

## Table of Contents
1. [Rules](#rules)
2. [Data Types](#data-types)
3. [Invoice Header Structure](#invoice-header-structure)
4. [Party Information](#party-information)
5. [Delivery Information](#delivery-information)
6. [Allowances and Charges](#allowances-and-charges)
7. [Tax and Monetary Totals](#tax-and-monetary-totals)
8. [Invoice Line Structure](#invoice-line-structure)

---

## Rules

| Rule | Description |
|------|------------|
| **M - Mandatory** | Required by EN16931 specification. |
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
| `cbc:InvoiceTypeCode` | **M** | `380` = Commercial invoice |
| `cbc:DocumentCurrencyCode` | **M** | Invoice currency |
| `cbc:BuyerReference` | **C** | Required for public sector (Leitweg-ID) |

---

## Party Information

### AccountingSupplierParty (Seller)

| Element | Rule | Description |
|-------|------|------------|
| `cac:PartyName` | **M** | Seller name |
| `cac:PostalAddress` | **M** | Seller address |
| `cac:PartyTaxScheme` | **C** | VAT registration |
| `cac:PartyLegalEntity` | **O** | Legal entity information |

### AccountingCustomerParty (Buyer)

| Element | Rule | Description |
|-------|------|------------|
| `cac:PartyName` | **M** | Buyer name |
| `cac:PostalAddress` | **M** | Buyer address |
| `cbc:EndpointID` | **M** | Electronic address (e.g. Leitweg-ID) |

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
- At **document level**
- At **invoice line level**

| Element | Rule | Description |
|-------|------|------------|
| `cbc:ChargeIndicator` | **M** | `false` = allowance (discount) |
| `cbc:AllowanceChargeReason` | **O** | Reason text |
| `cbc:MultiplierFactorNumeric` | **O** | Percentage |
| `cbc:Amount` | **M** | Amount |
| `cbc:BaseAmount` | **C** | Base for calculation |

---

## Tax and Monetary Totals

### TaxTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:TaxAmount` | **M** | Total tax |
| `cac:TaxSubtotal` | **O** | Tax breakdown |

### LegalMonetaryTotal

| Element | Rule | Description |
|-------|------|------------|
| `cbc:LineExtensionAmount` | **M** | Sum of net lines |
| `cbc:TaxExclusiveAmount` | **M** | Net total |
| `cbc:TaxInclusiveAmount` | **M** | Gross total |
| `cbc:PayableAmount` | **M** | Amount payable |

---

## Invoice Line Structure

| Element | Rule | Description |
|-------|------|------------|
| `cbc:ID` | **M** | Line number |
| `cbc:InvoicedQuantity` | **M** | Quantity |
| `cbc:LineExtensionAmount` | **M** | Net line amount |
| `cac:Item` | **M** | Description |
| `cac:Price` | **M** | Unit price |
| `cac:ClassifiedTaxCategory` | **M** | VAT category |

---

## Summary

An EN16931-compliant XRechnung invoice:

- Uses **UBL 2.1 syntax**
- Requires **Leitweg-ID / EndpointID** for public sector
- Must comply with **EN16931 and German CIUS (XRechnung rules)**
- Must be validated using **XSD and Schematron**

---
