# EDIFACT DESADV – Documentation

This document describes how **Mascot International** supports the **EDIFACT DESADV (Despatch Advice)** message, based on actual DESADV messages exchanged with customers.

It explains:
- Which **segments** are used
- Which **qualifiers and codes** are supported
- What can be **customised per customer**
- How a **real DESADV message** looks in practice

You do **not** need deep EDIFACT knowledge to get started.

---

## Table of Contents
1. [Supported EDIFACT Versions](#supported-edifact-versions)
2. [Message Header](#message-header)
3. [Dates (DTM)](#dates-dtm)
4. [References (RFF)](#references-rff)
5. [Parties (NAD)](#parties-nad)
6. [Delivery Terms (TOD)](#delivery-terms-tod)
8. [Packaging & Logistics](#packaging--logistics)
9. [Line Items](#line-items)
10. [Quantities](#quantities)
11. [Control Segments](#control-segments)
12. [What Can Be Customised](#what-can-be-customised)
13. [Example DESADV Message](#example-desadv-message)

---

## Supported EDIFACT Versions

We support the following DESADV message version:

- `INVOIC:D:93A`
- `INVOIC:D:96A`
- `INVOIC:D:02A`

Other versions may be supported on request.

**Example**
```
UNH+1+DESADV:D:96A:UN:EAN005'
```

---

## Message Header

### UNB – Interchange Header

```
UNB+UNOC:3+SENDER_GLN:14+RECEIVER_GLN:14+260112:1144+264++++++1'
```

---

### UNH – Message Header

```
UNH+1+DESADV:D:96A:UN:EAN005'
```

---

### BGM – Beginning of Message

```
BGM+351+123456789'
```

Used to identify the DESADV.

---

## Dates (DTM)

```
DTM+137:20251208:102'
DTM+11:20251208:102'
DTM+35:20251211:102'
```

| Qualifier | Meaning |
|---------|--------|
| `137` | Document date |
| `11` | Despatch date |
| `35` | Delivery date |

---

## References (RFF)

```
RFF+DQ:123456789'
DTM+171:20260109:102'
RFF+ON:123456'
DTM+171:20251205:102'
RFF+VN:1234567'
DTM+171:20251205:102'
```

### Delivery Reference

Used to reference a delivery note or shipment.

**Supported qualifiers**
- `AAJ`
- `DQ`
- `PK`


### Other References

**Available qualifiers**
- `ON` – Order number
- `CO` – Customer order
- `VN` – Account Number

Custom qualifiers can be agreed if needed.

---

## Parties (NAD)

```
NAD+BY+BUYERGLN::9++NAME+STREET+CITY++POSTCODE+DK'
NAD+DP+DELIVERYGLN::9++NAME+STREET+CITY++POSTCODE+DK'
NAD+SU+SUPPLIERGLN::9++NAME+STREET+CITY++POSTCODE+DK'
```

---

## Delivery Terms (TOD)

```
TOD+10E++:::DAP'
```

Incoterms code (e.g. DAP)

---

## Packaging & Logistics

This section describes how the goods are packed, identified, and shipped.

```
CPS++1'
PAC+1++PK'
MEA+PD+AAB:3+KGM:115.362'
QTY+:8:PCE'
PCI+33E'
GIN+BJ+12345678910:CARRIER-NAME'
```

- **CPS** groups packaging and the related line items  
- **PAC** defines number and type of packages  
- **MEA** provides physical measurements (e.g. weight, volume)  
- **QTY** indicates the number of units in the package  
- **PCI** identifies marked or labelled packages  
- **GIN** carries logistic identifiers such as SSCC or carrier references  

Packaging information is optional and used when shipment tracking or handling details are required.

---

## Line Items

Line items define which products are included in the despatch.

```
LIN+1++57123456789:EN'
PIA+1+123456789-123-123:SA'
IMD+F++:::DESCRIPTION'
```

- **LIN** identifies the line and primary product ID (e.g. EAN)  
- **PIA** provides additional product identifiers (supplier or buyer item numbers)  
- **IMD** contains a free-text product description  

Each DESADV contains one or more line items.

---

## Quantities

Quantities specify how many items are shipped per line.

```
QTY+21:4:PCE'
```

- **QTY** communicates the quantity for the line item  
- **21** indicates ordered quantity  
- **PCE** defines the unit of measure  

Multiple quantity types may be used per line if required.

## Control Segments

```
CNT+2:7'
UNT+78+1'
UNZ+1+264'
```

---

## What Can Be Customised

- Reference qualifiers
- Delivery terms
- Packaging structure
- Use of SSCC / carrier IDs
- Optional segments

---

## Example DESADV Message

```
UNA:+.? '
UNB+UNOC:3+SENDER_GLN:14+RECEIVER_GLN:14+260112:1144+264++++++1'
UNH+1+DESADV:D:96A:UN:EAN005'
BGM+351+123456789'

DTM+137:20251208:102'
DTM+11:20251208:102'
DTM+35:20251211:102'
RFF+DQ:123456789'
DTM+171:20260109:102'
RFF+ON:123456'
DTM+171:20251205:102'
RFF+VN:1234567'
DTM+171:20251205:102'

NAD+BY+BUYERGLN::9++NAME+STREET+CITY++POSTCODE+DK'
NAD+DP+DELIVERYGLN::9++NAME+STREET+CITY++POSTCODE+DK'
NAD+SU+SUPPLIERGLN::9++NAME+STREET+CITY++POSTCODE+DK'

TOD+10E++:::DAP'
CPS++1'

PAC+1++PK'
MEA+PD+AAB:3+KGM:115.362'
QTY+:8:PCE'
PCI+33E'
GIN+BJ+12345678910:CARRIER-NAME'

LIN+1++57123456789:EN'
PIA+1+123456789-123-123:SA'
IMD+F++:::DESCRIPTION'
QTY+21:4:PCE'
RFF+ON:123456'
RFF+VN:1234567'

CNT+2:7'
UNT+78+1'
UNZ+1+264'
```
