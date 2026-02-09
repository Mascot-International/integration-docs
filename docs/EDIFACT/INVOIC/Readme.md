# EDIFACT INVOIC – Documentation

This document describes how **Mascot International** supports the **EDIFACT INVOIC (Invoice)** message.

It explains:
- Which **segments** are supported
- Which **qualifiers and codes** are allowed
- What can be **customised per customer**
- What a **typical INVOIC message** looks like

You do **not** need deep EDIFACT knowledge to get started.

---

## Table of Contents
1. [Supported EDIFACT Versions](#supported-edifact-versions)
2. [Message Header](#message-header)
3. [Dates (DTM)](#dates-dtm)
4. [Parties (NAD)](#parties-nad)
5. [References (RFF)](#references-rff)
6. [Currency (CUX)](#currency-cux)
7. [Payment Terms](#payment-terms)
8. [Line Items](#line-items)
9. [Monetary Amounts (MOA)](#monetary-amounts-moa)
10. [Tax](#tax)
11. [Charges & Allowances](#charges-&-allowances)
12. [What Can Be Customised](#what-can-be-customised)
13. [Example INVOIC Message (Simplified)](#example-invoic-message-simplified)

---

## Supported EDIFACT Versions

We support the following INVOIC message versions:

- `INVOIC:D:93A`
- `INVOIC:D:96A`
- `INVOIC:D:02A`

Other versions may be supported on request.

**Example**
```
UNH+1+INVOIC:D:96A:UN:EAN008'
```

---

## Message Header

### UNH – Message Header

| Element | Description |
|------|-------------|
| `UNH#D0065` | Message type (`INVOIC`) |
| `UNH#D0054` | Message type release number |
| `UNH#D0057` | Association assigned code (`EAN008`) |

---

### BGM – Beginning of Message

Used to identify the invoice.

| Element | Description |
|------|-------------|
| Document type | Invoice / Credit note |
| Document number | Invoice number |
| Function code | Original / Replacement |

Typical document types:
- `380` – Commercial invoice
- `381` – Credit note

---

## Dates (DTM)

The following date types are supported:

| Qualifier | Meaning | Notes |
|---------|--------|------|
| `DTM+137` | Document date | Invoice creation date |
| `DTM+3` | Invoice date | Accounting date |
| `DTM+35` | Delivery date | Optional |
| `DTM+13` | Due date | Payment terms |

**Customisation**
- Some dates may be mandatory depending on customer setup

---

## Parties (NAD)

We support the following parties:

| Qualifier | Party | Mandatory |
|---------|------|----------|
| `BY` | Buyer | Yes |
| `SU` | Supplier | Yes |
| `DP` | Delivery party | Optional |
| `IV` | Invoice party | Optional |
| `PY` | Payer | Optional |

**Notes**
- Party identifiers are typically GLNs
- Delivery party may be omitted if not applicable

---

## References (RFF)

### Delivery Reference

Used to reference a delivery note or shipment.

**Supported qualifiers**
- `AAJ`
- `DQ`
- `PK`

Custom qualifiers can be agreed if needed.

```
RFF+AAJ:DEL12345'
DTM+171:20260208:102'
```

---

### Buyer Order Reference

Used to reference the buyer’s order.

**Supported qualifiers**
- `ON` – Order number
- `CO` – Customer order

```
RFF+ON:PO1234567'
```

---

### Other References

| Reference | Notes |
|---------|------|
| Contract number | Optional |
| Previous invoice | Used for credit notes |
| Account number | Buyer-specific |
| VAT number | Per party (BY / SU / IV) |

```
RFF+VN:INVOICENUMBER'
RFF+VA:VAT number'
RFF+ADE:Customer Account Number'
RFF+IT:Customer Number'
```

---

## Currency (CUX)

Currency is supported at header level.

```
CUX+2:EUR:9'
```

Multiple currencies are not supported.

---

## Payment Terms

Payment terms can be expressed as:

- Due date (Qualifier can be customised)
- Coded payment terms
- Discount percentage

Example:
```
PAT+3'
DTM+13:20260301:102'
PCD+12:5'
```

---

## Line Items

### LIN – Line Item

Each invoice must contain one or more line items.

Supported:
- Line number
- Item identification
- Position number

---

### PIA – Product Identification

Supported identifiers:
- Supplier item number (SA or custom)
- Buyer item number (BP or custom)
- Agreed custom identifiers (5 or 1)

```
LIN+1++123456:EN'
PIA+5+ABC123:SA'
PIA+5+123ABC:BP'
```

---

### PRI – Price

Prices are supported per line.

Common qualifiers:
- Net price
- Gross price

---

## Monetary Amounts (MOA)

### Header Totals

Supported totals include:

| Qualifier | Meaning |
|---------|--------|
| `MOA+9` | Invoice total |
| `MOA+39` | Amount payable |
| `MOA+77` | Invoice amount |
| `MOA+79` | Total line amount |
| `MOA+86` | Invoice amount |
| `MOA+86` | Tax amount |
| `MOA+124` | Tax amount |
| `MOA+125` | Taxable amount |
| `MOA+131` | Total Charges and Allowances |
| `MOA+150` | Tax amount |
| `MOA+165` | Adjusted amount |

---

### Line Amounts

Supported per line:

| Qualifier | Meaning |
|---------|--------|
| `MOA+204` | Line gross amount |
| `MOA+8` | Line net amount |

---

## Tax

Tax is supported at:
- Line level
- Header summary level

Supports:
- One or multiple tax rates
- Taxable base and tax amount

---

## Charges & Allowances

Charges and allowances can be provided at:
- Line level
- Header level

Typical use cases:
- Freight charges
- Administrative fees
- Discounts

---

## What Can Be Customised

The following can be configured per customer:

- INVOIC version (`93A`, `96A`, `00B`)
- Mandatory vs optional dates
- Allowed RFF qualifiers
- VAT handling per party
- Payment term structure
- Required totals
- Line discount Charge (Split or Total)


---

## Example INVOIC Message (Simplified)

```
UNA:+.? '
UNB+UNOC:3+SENDER_GLN:14+Receiver_GLN:14+1234567:8910+1519++++++1'
UNH+1+INVOIC:D:96A:UN:EAN008'
BGM+380+INV12345+9'
DTM+137:20260209:102'
DTM+3:20260209:102'
DTM+35:20260209:102'
NAD+BY+1234567890123::9'
NAD+SU+9876543210987::9'
RFF+AAJ:DEL12345'
DTM+171:20260209:102'
RFF+ON:PO1234567'
DTM+171:20260209:102'
RFF+VN:29598746'
DTM+171:20260209:102'

NAD+BY+BUYERGLN::9++NAME+STREET+CITY++POSTCODE+DK'
NAD+SU+SUPPLIERGLN::9++NAME+STREET+CITY++POSTCODE+DK'
RFF+VA:DK123456789'
NAD+DP+DELIVERYGLN::9++NAME+STREET+CITY++POSTCODE+DK'
NAD+IV+INVOICEGLN::9++NAME+STREET+CITY++POSTCODE+DK'
RFF+VA:DK123456780'
NAD+PR+PAYERGLN++NAME+STREET+CITY++POSTCODE+DK'

TAX+7+VAT+25.00'
CUX+2:EUR:9'
PAT+22+:::PAYMENT TERMS+1::D:XX'

ALC+A++++DI:::DISCOUNT'
MOA+204:10.00'
ALC+C++++FC:::FREIGHT CHARGE'
MOA+8:10.00'
LIN+1++123456:EN'
PIA+5+12345-123-010 82C52:SA'
IMD+F++:::WINTER JACKET STRETCHED'
QTY+47:10:PCE'
PRI+AAA:25.00'
MOA+203:250.00'
UNS+S'

MOA+79:250.00'
MOA+9:250.00'
TAX+7+VAT+++:::25.00+S'
UNT+49+1'
UNZ+1+1519'
```
