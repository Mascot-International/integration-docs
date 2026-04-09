# ZUGFeRD / Factur-X Invoice (EN16931 – CII) – Documentation

This document explains the structure, rules, and calculation principles for an **EN16931-compliant ZUGFeRD / Factur-X invoice** using the **UN/CEFACT Cross Industry Invoice (CII)** syntax.

---

## Table of Contents
1. [Rules](#rules)
2. [Data Types](#data-types)
3. [Document Context](#document-context)
4. [Document Header](#document-header)
5. [Trade Parties](#trade-parties)
6. [Delivery Information](#delivery-information)
7. [Allowances and Charges](#allowances-and-charges)
8. [Tax and Monetary Totals](#tax-and-monetary-totals)
9. [Invoice Line Structure](#invoice-line-structure)

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
| **Date** | Calendar date | `YYYYMMDD` (format 102) | `20251205` |
| **Amount** | Monetary amount | Decimal | `99.95` |
| **Quantity** | Numeric quantity | Decimal | `2` |
| **Percentage** | Percentage value | `n.nn` | `10.00` |

---

## Document Context

| Element | Rule | Description |
|--------|------|------------|
| `ram:GuidelineSpecifiedDocumentContextParameter/ram:ID` | **M** | Must be `urn:cen.eu:en16931:2017` |

---

## Document Header

| Element | Rule | Description |
|--------|------|------------|
| `ram:ID` | **M** | Invoice number |
| `ram:TypeCode` | **M** | `380` = Commercial invoice |
| `ram:IssueDateTime` | **M** | Invoice issue date (format 102) |

---

## Trade Parties

### Seller (ram:SellerTradeParty)

| Element | Rule | Description |
|--------|------|------------|
| `ram:Name` | **M** | Seller name |
| `ram:PostalTradeAddress` | **M** | Seller address |
| `ram:SpecifiedTaxRegistration` | **C** | VAT registration |

### Buyer (ram:BuyerTradeParty)

Same structure and rules as seller.

---

## Delivery Information

| Element | Rule | Description |
|--------|------|------------|
| `ram:ApplicableHeaderTradeDelivery` | **O** | Delivery details |
| `ram:ShipToTradeParty` | **O** | Delivery party |

---

## Allowances and Charges

Allowances and charges may appear:
- At **header level**
- At **line level**

| Element | Rule | Description |
|--------|------|------------|
| `ram:ChargeIndicator` | **M** | `false` = allowance (discount) |
| `ram:Reason` | **O** | Reason text |
| `ram:CalculationPercent` | **O** | Discount percentage |
| `ram:ActualAmount` | **M** | Discount amount |
| `ram:BasisAmount` | **C** | Base amount |

---

## Tax and Monetary Totals

### ApplicableTradeTax

| Element | Rule | Description |
|--------|------|------------|
| `ram:CalculatedAmount` | **M** | Tax amount |
| `ram:RateApplicablePercent` | **M** | VAT rate |
| `ram:CategoryCode` | **M** | VAT category |

### Monetary Summation

| Element | Rule | Description |
|--------|------|------------|
| `ram:LineTotalAmount` | **M** | Sum of net lines |
| `ram:TaxBasisTotalAmount` | **M** | Net total before tax |
| `ram:TaxTotalAmount` | **M** | Total tax |
| `ram:GrandTotalAmount` | **M** | Total including tax |
| `ram:DuePayableAmount` | **M** | Amount payable |

---

## Invoice Line Structure

| Element | Rule | Description |
|--------|------|------------|
| `ram:LineID` | **M** | Line number |
| `ram:BilledQuantity` | **M** | Quantity |
| `ram:LineTotalAmount` | **M** | Net line amount |
| `ram:SpecifiedTradeProduct/ram:Name` | **M** | Item description |
| `ram:NetPriceProductTradePrice/ram:ChargeAmount` | **M** | Unit price |
| `ram:SpecifiedLineTradeSettlement/ram:ApplicableTradeTax` | **M** | Tax details |

---

## Summary

An EN16931-compliant ZUGFeRD / Factur-X invoice:

- Uses **CII (CrossIndustryInvoice)** syntax
- Requires strict adherence to **EN16931 business rules**
- Must be validated using **XSD and Schematron**

For interoperability with Peppol, UBL should be used.

---

