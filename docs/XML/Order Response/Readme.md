# Mascot XML Order Response Structure – Documentation

This document explains the structure, rules, and configuration for **XML Order Responses** from Mascot.  
It includes **header**, **order line**, and **totals** fields, as well as details for **parties** and **delivery handling**.

---

## Table of Contents
1. [Rules](#rules)  
2. [Data Types](#data-types)  
3. [Header Structure](#header-structure)  
4. [Parties](#parties)  
5. [Order Line Structure](#order-line-structure)  
6. [Delivery Structure](#delivery-structure)  
7. [Totals](#totals)  
8. [XML Schema Definition (XSD)](#xml-schema-definition-xsd)  
9. [Examples](#examples)

---

## Rules

| Rule | Description |
|-------|-------------|
| **M - Mandatory** | Critical field that must **always** be populated. |
| **O - Optional** | Field can be left blank if information is unavailable. |
| **R - Recommended** | Important field that should be populated if available. |
| **C - Conditional** | Required based on specific business rules. |

---

## Data Types

| DataType | Description | Format | Example |
|-----------|-------------|--------|---------|
| **Alpha** | Letters | `AaBbCcDd` | `John Johnson` |
| **Alphanumeric** | Letters+Numbers | `Ref 321_2` | `ItemABC123` |
| **Numeric** | Numbers | `453` | `123456789` |
| **Date** | ISO Date | `YYYY-MM-DD` | `2025-01-23` |
| **Decimal** | Number with decimals | `123.45` | `25.00` |

---

## Header Structure

| Fieldname | Format | Rule | Description | Example |
|------------|--------|------|-------------|---------|
| `<Schema><Version>` | Numeric | **M** | Version of the schema used (future proofing). | `1` |
| `<OrderType>` | Fixed: `Standard` or `Return` | **M** | Defines if this is a standard order response or a return. | `Standard` |
| `<OrderResponseNumber>` | Numeric | **M** | Order response number from Mascot’s ERP system. | `00096944` |
| `<BuyerOrderReference>` | Alphanumeric | **O** | The buyer’s original order reference. | `1244212` |
| `<OrderDate>` | Date | **M** | Date of the original order. | `2023-08-07` |
| `<OrderResponseDate>` | Date | **M** | Date when Mascot generated the response. | `2023-09-01` |
| `<RequestedDeliveryDate>` | Date | **O** | Delivery date requested by the buyer. | `2023-09-02` |
| `<OrderCurrency>` | ISO 4217 (3-letter code) | **M** | Currency of the order. | `EUR` |
| `<DeliveryTerms>` | Text | **O** | Agreed delivery terms (e.g., Incoterms). | `DAP` |
| `<DeliveryText>` | Text | **O** | Human-readable description of delivery terms. | `Delivered Duty Paid` |

---

## Parties

There are **five different party levels** to allow flexibility if buyer, payer, invoice, and delivery information differ.  

| Party | Description |
|-------|-------------|
| `<BuyerParty>` | The buyer placing the order. |
| `<SupplierParty>` | Mascot (the supplier). |
| `<PayerParty>` | The payer if different from buyer. |
| `<InvoiceParty>` | The party receiving the invoice. |
| `<DeliveryToParty>` | The delivery recipient. |

Each party follows this structure:

| Fieldname | Format | Rule | Example |
|------------|--------|------|---------|
| `<ID>` | Alphanumeric | **O** | `5790001082956` |
| `<Name1>` | Text | **M** | `Mascot International A/S` |
| `<Name2>` | Text | **O** | `Company name2` |
| `<Address>` | Text | **M** | `Silkeborgvej 14` |
| `<City>` | Text | **M** | `Engesvang` |
| `<PostalCode>` | Alphanumeric | **M** | `7442` |
| `<CountryCode>` | ISO 3166-1 Alpha-2 | **M** | `DK` |
| `<Communication>` | Container | **O** | Contact details |

**Communication subfields:**

| Fieldname | Format | Rule | Example |
|------------|--------|------|---------|
| `<EmailAddress>` | Email | **O** | `customer@email.com` |
| `<PhoneNumber>` | Alphanumeric | **O** | `+4512345678` |

---

## Order Line Structure

Each `<OrderLine>` represents a single product line.  

| Fieldname | Format | Rule | Description | Example |
|------------|--------|------|-------------|---------|
| `<Line>` | Numeric | **O** | Iteration/line number. | `1` |
| `<OriginalLine>` | Alphanumeric | **O** | Original buyer order line reference. | `100` |
| `<BuyerLineReference>` | Alphanumeric | **O** | Line reference from buyer. | `BE20019` |
| `<SupplierEANCode>` | Numeric (13) | **M** | Mascot’s EAN/GTIN code. | `5707209199999` |
| `<SupplierMaterialNumber>` | Alphanumeric | **M** | Mascot’s material number. | `99999-210-18 L` |
| `<ProductDescription>` | Text | **M** | Product description. | `MASCOT® Trousers` |
| `<Quantity>` | Numeric | **M** | Ordered quantity. | `2` |
| `<UnitGrossPrice>` | Decimal | **M** | Gross price per unit. | `25.00` |
| `<LineGrossPrice>` | Decimal | **M** | Gross total per line. | `50.00` |
| `<LineDiscounts>` | Container | **O** | Discounts on line level. | See below |
| `<LineCharges>` | Container | **O** | Charges on line level. | See below |
| `<UnitNetPrice>` | Decimal | **M** | Net unit price after discounts/charges. | `22.25` |
| `<LineNetPrice>` | Decimal | **M** | Net line total. | `44.50` |
| `<Delivery>` | Container | **M** | Delivery splits for partial deliveries. | See [Delivery Structure](#delivery-structure) |

### Discounts (`<LineDiscounts>`)

| Fieldname | Format | Rule | Example |
|------------|--------|------|---------|
| `<Text>` | Text | **O** | `10% example discount` |
| `<Value>` | Decimal | **M** | `10.00` |
| `<Percentage>` | Decimal | **O** | `10.00` |

### Charges (`<LineCharges>`)

| Fieldname | Format | Rule | Example |
|------------|--------|------|---------|
| `<Text>` | Text | **O** | `Charge Fee` |
| `<Value>` | Decimal | **M** | `2.00` |
| `<Percentage>` | Decimal | **O** | |

---

## Delivery Structure

A single `<OrderLine>` can contain **multiple `<Delivery>` blocks** (for split shipments).  

| Fieldname | Format | Rule | Description | Example |
|------------|--------|------|-------------|---------|
| `<ConfirmedAmount>` | Numeric | **M** | Quantity confirmed for delivery. | `1` |
| `<EstimatedDeliveryDate>` | Date | **M** | Estimated delivery date. | `2025-09-10` |

---

## Totals

The `<OrderResponseTotal>` contains the **summary of the entire order response**.

| Fieldname | Format | Rule | Description | Example |
|------------|--------|------|-------------|---------|
| `<NumberOfLines>` | Numeric | **M** | Number of lines in the response. | `2` |
| `<QuantityTotal>` | Decimal | **M** | Total ordered quantity. | `3` |
| `<LineTotal>` | Decimal | **M** | Total line amount (gross/net depending on calculation). | `86.50` |
| `<HeaderDiscounts>` | Container | **O** | Discounts at header level. | See Discounts |
| `<HeaderCharges>` | Container | **O** | Charges at header level. | See Charges |
| `<TaxRate>` | Decimal | **M** | Tax rate. | `20.00` |
| `<TaxTotal>` | Decimal | **M** | Total tax amount. | `6.92` |
| `<NetPaymentTotal>` | Decimal | **M** | Final payment total including taxes, charges, and discounts. | `100.92` |

---

## XML Schema Definition (XSD)

The XML structure is defined in the official XSD schema:  
[**XML_Mascot_OrderResponse.xsd**](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/Orders%Response/XML_MASCOT_ORDER_RESPONSE_V1.xsd)

---

## Examples

Here are links to example XML Order Responses:

- [Standard Order Response](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/Order%20Response/Examples/OrderResponse_Standard.xml)  
- [With Discounts and Charges](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/Order%20Response/Examples/OrderResponse_DiscountsCharges.xml)  
- [With Multiple Deliveries](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/Order%20Response/Examples/OrderResponse_MultiDelivery.xml)

---
