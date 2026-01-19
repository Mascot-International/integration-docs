# Mascot XML Order – Documentation

This document explains the structure, rules, and configuration for **XML Orders** to Mascot.  
It includes **header**, **order line**, and **dropshipment** fields, as well as details for **delivery types** and **SFTP transmission** setup.

---

## Table of Contents
1. [Rules](#rules)
2. [Data Types](#data-types)
3. [Header Structure](#header-structure)
4. [Order Line Structure](#order-line-structure)
5. [Dropshipment Orders (ZE)](#dropshipment-orders-ze)
6. [Delivery Types Explained](#delivery-types-explained)
7. [SFTP Transmission Setup](#sftp-transmission-setup)
8. [XML Schema Definition (XSD)](#xml-schema-definition-xsd)
9. [Examples](#examples)

---

## Rules

| Rule | Description |
|-------|------------|
| **M - Mandatory** | Critical field that must **always** be populated. |
| **O - Optional** | Field can be left blank if information is unavailable. |
| **R - Recommended** | Important field that should be populated if available. |
| **C - Conditional** | Required based on specific business rules. |

---

## Data Types

| DataType | Description | Format | Example 1 |
|-----------|-------------|--------|-----------|
|**Alpha** | Letters | `AaBbCcDd` | `John Johnson` |
|**Alphanumeric** | Letters+Numbers | `Ref 321_2` | `John 1993` |
|**Numeric** | Numbers | `453` | `123456789` |
|**Date** | Date | `YYYY-MM-DD` | `2024-12-04` |

---

## Header Structure

| Fieldname | Format | Rule | Description | Example |
|------------|--------|------|-------------|---------|
| `<Ordertype>` | Fixed: `ZI` or `ZE` | **M** | `ZI` = B2B orders, `ZE` = B2C (Dropshipment) orders. | `ZI` |
| `<BuyerID>` | Max Length 13 (numeric) | **M** | Your ID number (account or GLN). Must be confirmed by Mascot. | `5790001294939` |
| `<PreferredDeliveryDate>` | `YYYY-MM-DD` (date) | **M** | Preferred delivery date. | `2025-01-23` |
| `<OrderReference>` | Max Length 16 (alphanumeric) | **M** | Your reference for this order. | `ORDERREF5436` |
| `<IssueEmail>` | Email | **R** | Email for error notifications if mandatory fields are missing. | `user@company.com` |
| `<NonStandardDelivery>` | Container | **O** | Alternative delivery option. See [Delivery Types](#delivery-types-explained). |  |
| `<DeliveryByNumber>` | Max Length 13 (numeric) | **O** | Commission or GLN number for alternative addresses. | `1234567891011` |
| `<DeliveryByAddress>` | Container | **O** | Alternative delivery address fields (if not using `<DeliveryByNumber>`). |  |
| ├─ `<Name>` | Max Length 70 (alphanumeric) | **C** | Required if `<DeliveryByAddress>` is used. | `Mascot International A/S` |
| ├─ `<Address>` | Max Length 35 (alphanumeric) | **C** | Required if `<DeliveryByAddress>` is used. | `Silkeborgvej 12` |
| ├─ `<CountryCode>` | Max Length 2 | **C** | ISO 3166 country code. | `DK` |
| ├─ `<PostCode>` | Max Length 10 (numeric) | **C** | Postal code. | `7400` |
| └─ `<City>` | Max Length 35 (alphanumeric) | **C** | City name. | `Silkeborg` |

---

## Order Line Structure

| Fieldname | Format | Rule | Description | Example |
|------------|--------|------|-------------|---------|
| `<OrderLine>` | Container | **M** | Container for each orderline | |
| `<Line>` | Max Length 3 | **O** | For each line number | "1"|
| `<BuyersLineReference>` | Max Length 35 (alphanumeric) | **O** | Customer's reference per line. | `Customer_Line_Ref-1` |
| `<SuppliersEANCode>` | Max Length 13 (numeric) | **M** | Supplier's unique EAN key for the product. | `1234567891012` |
| `<SuppliersMaterialNumber>` | Max Length 35 (alphanumeric) | **O** | Mascot material number. | `2314-231-231 XL` |
| `<ProductDescription>` | Max Length 70 (alphanumeric) | **O** | Product description (for identification). | `Mascot T-Shirt CROSSOVER Java 00782` |
| `<Quantity>` | Max Length 3 (numeric) | **M** | Quantity ordered. | `5` |

---

## Dropshipment Orders (ZE)

For **B2C orders (Ordertype = ZE)**, additional fields are required:

| Fieldname | Format | Rule | Description | Example |
|------------|--------|------|-------------|---------|
| `<Dropshipment>` | Container  | **C** | Only required for `ZE` orders. |  |
| `<DeliveryType>` | Max Length 3 (alphanumeric) | **M** | `Z00` = Company address, `Z01` = Private address. | `Z01` |
| `<DepositLocation>` | Max Length 30 | **O** | Deposit location description. | `Carport` |
| `<Name>` | Max Length 60 | **M** | Name of recipient. | `John Doe` |
| `<Street>` | Max Length 30 (alphanumeric) | **M** | Delivery street. | `Silkeborgvej 12` |
| `<PostCode>` | Max Length 10 (numeric) | **M** | Postal code. | `7000` |
| `<City>` | Max Length 30 (alphanumeric) | **M** | City. | `Silkeborg` |
| `<CountryCode>` | Max Length 2 | **M** | ISO 3166 country code. | `DK` |
| `<ShippingNotification>` | Container | **C** | Needed for tracking notifications. |  |
| ├─ `<EmailAddress>` | Max Length 30 (alphanumeric) | **C** | End-customer email for notifications. | `customer@email.com` |
| ├─ `<PhonePrefix>` | Max Length 4 (must start with +) | **C** | Country code prefix. | `+45` ('+' required) |
| └─ `<PhoneNumber>` | Max Length 11 (numeric) | **C** | Phone number. | `12345678` |

---

## Delivery Types Explained

1. **Standard Delivery**  
   Use `<BuyerID>` only. Delivery will go to the standard company address linked to that ID.

2. **Alternative Delivery**  
   Two options:  
   - **`<DeliveryByNumber>`** – Use if you have a commission or GLN number linked to a known address at Mascot.  
   - **`<DeliveryByAddress>`** – Use for a custom address (without GLN/commission number).  
   - **Priority Rule** – If **both** are filled, `DeliveryByNumber` takes priority.

3. **Dropshipment (ZE Orders)**  
   When `<Ordertype>` is `ZE`, `<Dropshipment>` information **overrides** all other delivery details.

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
> - Mascot's SFTP server is secured by a firewall. Provide your outbound IP addresses for whitelisting.  
> - For troubleshooting, use filenames starting with `ORDER` and include a unique identifier (e.g., the order reference).

---

## XML Schema Definition (XSD)

The XML structure is defined in the official XSD schema:  
[**XML_Mascot_Order.xsd**](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/XML-Mascot/Orders/XML_Mascot_Order.xsd)

---

## Examples

Here are links to example XML files provided by Mascot:

- [Standard Delivery Address](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/XML-Mascot/Orders/Examples/Order_Mascot_Example_1_StandardDeliveryAddress.xml)
- [Delivery By Number](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/XML-Mascot/Orders/Examples/Order_Mascot_Example_2_DeliveryByNumber.xml)
- [Delivery By Address](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/XML-Mascot/Orders/Examples/Order_Mascot_Example_3_DeliveryByAddress.xml)
- [Dropshipment](https://github.com/Mascot-International/integration-docs/blob/main/docs/XML/XML-Mascot/Orders/Examples/Order_Mascot_Example_4_Dropshipment.xml)
