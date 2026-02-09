# EDIFACT ORDRSP – Documentation

This document describes how **Mascot International** supports the **EDIFACT ORDRSP (Order Response)** message.

It explains:
- Which **segments** are supported
- Which **qualifiers and codes** are allowed
- What can be **customised per customer**
- What a **typical ORDRSP message** looks like

You do **not** need deep EDIFACT knowledge to get started.

---

## Table of Contents
1. [Supported EDIFACT Versions](#supported-edifact-versions)
2. [Message Header](#message-header)
3. [Dates (DTM)](#dates-dtm)
4. [Parties & Contacts (NAD / CTA / COM)](#parties--contacts-nad--cta--com)
5. [References (RFF)](#references-rff)  
6. [Currency (CUX)](#currency-cux) 
7. [Delivery Terms (TOD)](#delivery-terms-tod)
8. [Line Items (LIN / PIA)](##line-items-lin--pia)
9. [Quantities (QTY)](#quantities-qty)
10. [Prices & Amounts (PRI / MOA)](#prices--amounts-pri--moa)
11. [Tax](#tax)  
12. [Charges & Allowances](#charges--allowances)
13. [What Can Be Customised](#what-can-be-customised)
14. [Example ORDRSP Message (Simplified)](#example-ordrsp-message-simplified)

---

## Supported EDIFACT Versions

We support the following ORDRSP message versions:

- `ORDRSP:D:93A`
- `ORDRSP:D:96A`
- `ORDRSP:D:02A`
- `ORDRSP:D:99A`

Other versions may be supported on request.

Example:
```
UNH+1+ORDRSP:D:96A:UN:EAN005'
```

---

## Message Header

### UNH – Message Header

| Element | Description |
|------|-------------|
| `UNH#D0065` | Message type (`ORDRSP`) |
| `UNH#D0054` | Message type release number |
| `UNH#D0057` | Association assigned code |

---

### BGM – Beginning of Message

Used to identify the order response.

| Element | Description |
|------|-------------|
| Document type | Order response |
| Document number | Response number |
| Response type | Accepted / Changed / Rejected |

---

## Dates (DTM)

Supported date qualifiers:

- `DTM+137` – Document date  
- `DTM+2` – Delivery date  
- `DTM+63` – Delivery earliest  
- `DTM+69` – Delivery latest  
- `DTM+76` – Delivery promised  
- `DTM+113` – Delivery current  
- `DTM+83` – Delivery scheduled  

---

## Parties & Contacts (NAD / CTA / COM)

Supported parties:
- Buyer (`BY`)
- Supplier (`SU`)
- Seller (`SE`)

Contact details via CTA / COM are supported.

---

## References (RFF)

Supported reference qualifiers:
- `ON`
- `CO`
- `OP`
- `VN`

---

## Currency (CUX)

Currency is supported at header level.

```
CUX+2:EUR:9'
```

---

## Delivery Terms (TOD)

Delivery terms can be provided using coded values or free text.

### Example – Coded Delivery Terms
```
TOD+6'
```

### Example – Delivery Terms with Description
```
TOD+6++:::Delivered Duty Paid'
```

---

## Line Items (LIN / PIA)

Each order response may contain one or more line items.

```
LIN+1++123456:EN'
PIA+5+12345-123-010:SA'
PIA+5+1234-123:BP'
```

---

## Quantities (QTY)

Supported quantity types include:
- Ordered
- Delivered
- Backordered
- Split delivery

```
QTY+21:10'
QTY+113:8'
QTY+83:2'
```

---

## Prices & Amounts (PRI / MOA)

```
PRI+AAA:25.00'
MOA+204:200.00'
```

---

## Tax

Tax may be provided at line level.

```
TAX+7+VAT+++:::25.00'
```

---

## Charges & Allowances

Charges and allowances may be provided at header or line level.

```
ALC+A++++DI:::DISCOUNT'
MOA+204:10.00'
```

---

## What Can Be Customised

- ORDRSP version  
- Mandatory vs optional delivery dates  
- Allowed RFF qualifiers  
- Line delivery type (total, split, loop)  
- Price and tax handling  

---

## Example ORDRSP Message (Simplified)

```
UNA:+.? '
UNB+UNOC:3+SENDER_GLN:14+RECEIVER_GLN:14+240209:1200+1'
UNH+1+ORDRSP:D:96A:UN:EAN005'
BGM+231+RESP12345+9'
DTM+137:20260209:102'

NAD+BY+1234567890123::9'
NAD+SU+9876543210987::9'

RFF+ON:PO1234567'
RFF+VN:29598746'

CUX+2:EUR:9'
TOD+6'

LIN+1++123456:EN'
QTY+21:10'
QTY+113:8'
DTM+76:20260215:102'
PRI+AAA:25.00'
MOA+204:200.00'

MOA+79:200.00'
UNT+40+1'
UNZ+1+1'
```
