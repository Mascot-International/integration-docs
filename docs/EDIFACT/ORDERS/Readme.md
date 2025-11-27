# Mascot EDIFACT ORDER Format – Documentation

This document provides an overview of the **EDIFACT message structure** for Mascot orders.  
It includes details for **segment descriptions, data rules, and examples** for both standard B2B and Dropshipment (B2C) orders.

---

## Table of Contents
1. [Rules](#rules)
2. [Data Types](#data-types)
3. [Message Structure](#message-structure)
4. [Segment Descriptions](#segment-descriptions)
5. [Delivery Options Explained](#delivery-options-explained)
6. [Example Messages](#example-messages)
7. [Transmission Notes](#transmission-notes)

---

## Rules

| Rule | Description |
|-------|------------|
| **M - Mandatory** | Critical field that must **always** be populated. |
| **O - Optional** | Field can be blank if not required. |
| **C - Conditional** | Required only if specific conditions are met. |

---

## Message Structure

Example start of an EDIFACT message:

```
UNA:+.? '
UNB+UNOC:3+Sender_ID:14+Mascot_GLN:14+241009:0833+36440'
UNH+364448150+ORDERS:D:XXX:UN'
```
- `UNA` – Service string advice (always the same)
- `UNB` – Interchange header with sender/receiver information | **Your Sender_ID needs to be unique**
- `UNH` – Message header

---

## Segment Descriptions

| Segment | Rule | Description | Example |
|----------|------|-------------|---------|
| **BGM** | M | Order reference number | `BGM+220+ORDER12345'` |
| **DTM** | O | Requested delivery date (YYYYMMDD) | `DTM+2:20251009:102'` |
| **NAD+BY** | M | Buyer info (GLN and address) | `NAD+BY+Buyer_GLN_Number::91++Company+Street+City++Postcode+CountryCode'` |
| **COM** | R | Buyer email for error handling | `COM+Company-email@client.com:EM'` |
| **NAD+SU** | M | Supplier details (Mascot) | `NAD+SU+5790001294939::92++MASCOT+Silkeborgvej 14+Silkeborg++7500+DK'` |
| **NAD+DP** | O | Delivery point if alternate | `NAD+DP+Delivery_ID/GLN_Number::91++Company+Street+City++Postcode+CountryCode'` **GLN/ID Needs to be known to Mascot**|
| **LIN** | M | Product line, includes product EAN | `LIN+10++5711074225378:EN'` |
| **PIA** | O | Seller product references | `PIA+5+50569-961-1809 M:SA'` |
| **PIA** | O | Buyer product references | `PIA+5+Buyer Material No:BP'` |
| **QTY** | M | Quantity | `QTY+21:5:PCE'` |
| **UNS** | M | Section control (always `S`) | `UNS+S'` |
| **UNT** | M | Trailer segment with line count | `UNT+22+3644'` |
| **UNZ** | M | Message end | `UNZ+1+3644'` |

---

## Delivery Options Explained

1. **Standard Delivery**  
   Use **`NAD+BY`**, leave **`NAD+DP`** empty. Delivery will go to the standard company address linked to that GLN/ID.

2. **Other Delivery Options**  
   - Company Address – Use **`NAD+DP+Delivery_ID/GLN_Number::91++Company+Street+City++Postcode+DE`** if you have a commission number or GLN number linked to a known address at Mascot.  
   - 3rd Party Address – Use **`NAD+DP+LEAVE EMPTY::91++Company+Street+City++Postcode+DE`** for a custom address (without GLN/commission number).  
   - **Priority Rule** – If **both** are filled, `NAD+DP+Delivery_/GLN_NUMBER` takes priority.

---
## Example Messages

Example files are available here:

- [Standard Delivery B2B Order](https://github.com/Mascot-International/integration-docs/blob/main/docs/EDIFACT/ORDERS/Examples/Order_Mascot_EDIFACT_Standard.edi)
- [Alternative Company Delivery B2B Order](https://github.com/Mascot-International/integration-docs/blob/main/docs/EDIFACT/Orders/Examples/Order_Mascot_EDIFACT_Alternative_Company_Delivery.edi)
- [Alternative 3rd Party Address Delivery B2B Order](https://github.com/Mascot-International/integration-docs/blob/main/docs/EDIFACT/Orders/Examples/Order_Mascot_EDIFACT_Alternative_Delivery_Address:edi)

---

## SFTP Transmission Setup

| Parameter | Value |
|------------|-------|
| **Hostname** | Provided by Mascot |
| **Login** | Provided by Mascot |
| **Port** | Test: `322`<br>Production: `22` |
| **Directory** | `/ORDERS` |
| **Encoding** | `UTF-8` |

> **Important:**  
> - Mascot's SFTP server is secured by a firewall. Ensure Mascot has your outbound server IP for firewall configuration.  
> - For troubleshooting, use filenames starting with `ORDER_` and include a unique identifier (e.g., ORDER_20251009_1234.edi).
