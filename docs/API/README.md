# The MASCOT Order API is still in it's testing phase (not live yet).

# Mascot API Order – Documentation (JSON)

This document explains the structure, rules, and configuration for **API Orders** sent to Mascot using **JSON format**.  
It includes **header**, **order line**, and **dropshipment** objects, as well as details for **delivery types** and **business rules**.

---

## Table of Contents
1. Rules
2. Data Types
3. Header Object
4. Order Line Object
5. Dropshipment Orders (ZE)
6. Delivery Types Explained
7. API Payload Structure
8. Example Payload

---

## Rules

| Rule | Description |
|------|------------|
| **M - Mandatory** | Field must **always** be populated. |
| **O - Optional** | Field can be omitted if information is unavailable. |
| **R - Recommended** | Important field that should be populated if available. |
| **C - Conditional** | Required based on specific business rules. |

---

## Data Types

| DataType | Description | Format | Example |
|---------|------------|--------|---------|
| **String** | Text values | UTF-8 | `"John Doe"` |
| **Numeric** | Numbers only | Integer | `123456` |
| **Date** | ISO 8601 date | `YYYY-MM-DD` | `"2025-08-20"` |
| **Object** | JSON object | `{}` | `{ "City": "Aarhus" }` |
| **Array** | List of objects | `[]` | `[ { ... } ]` |

---

## Header Object

`Header` contains order-level information and delivery configuration.

| Fieldname | Type | Rule | Description | Example |
|---------|------|------|------------|---------|
| `Ordertype` | String | **M** | `ZI` = B2B orders, `ZE` = B2C (Dropshipment). | `"ZI"` |
| `BuyerID` | String (numeric, max 13) | **M** | Buyer account or GLN number (must be agreed with Mascot). | `"1234567890123"` |
| `PreferredDeliveryDate` | Date | **M** | Preferred delivery date. | `"2025-08-20"` |
| `OrderReference` | String (max 16) | **M** | Customer order reference. | `"ORD1234567890"` |
| `IssueEmail` | String (email) | **R** | Email used for error notifications. | `"customer@example.com"` |
| `NonStandardDelivery` | Object | **O** | Alternative delivery configuration. | `{}` |

### NonStandardDelivery Object

| Fieldname | Type | Rule | Description | Example |
|---------|------|------|------------|---------|
| `DeliveryByNumber` | String (numeric, max 13) | **O** | Commission or GLN number for delivery address. | `"9876543210123"` |
| `DeliveryByAddress` | Object | **O** | Custom delivery address. Used if `DeliveryByNumber` is not supplied. | `{}` |

#### DeliveryByAddress Object

| Fieldname | Type | Rule | Description | Example |
|---------|------|------|------------|---------|
| `Name` | String (max 70) | **C** | Required if `DeliveryByAddress` is used. | `"John Doe"` |
| `Address` | String (max 35) | **C** | Street and house number. | `"123 Example St"` |
| `CountryCode` | String (ISO 3166) | **C** | Country code. | `"DK"` |
| `PostCode` | String (numeric, max 10) | **C** | Postal code. | `"1000"` |
| `City` | String (max 35) | **C** | City name. | `"Copenhagen"` |

---

## Order Line Object

`OrderLine` is an **array** of order line objects.

| Fieldname | Type | Rule | Description | Example |
|---------|------|------|------------|---------|
| `BuyersLineReference` | String (max 35) | **O** | Customer line reference. | `"LINE001"` |
| `SuppliersEANCode` | String (numeric, max 13) | **M** | Mascot product EAN. | `"1234567890123"` |
| `SuppliersMaterialNumber` | String (max 35) | **O** | Mascot material number. | `"MAT12345"` |
| `ProductDescription` | String (max 70) | **O** | Product description for identification. | `"Example Product"` |
| `Quantity` | Numeric | **M** | Ordered quantity. | `10` |

---

## Dropshipment Orders (ZE)

When `Ordertype = ZE`, the `Dropshipment` object is **mandatory** and overrides all other delivery information.

| Fieldname | Type | Rule | Description | Example |
|---------|------|------|------------|---------|
| `DeliveryType` | String (max 3) | **M** | `Z00` = Company address, `Z01` = Private address. | `"Z00"` |
| `DepositLocation` | String (max 30) | **O** | Delivery deposit location. | `"Warehouse 1"` |
| `Name` | String (max 60) | **M** | Recipient name. | `"Jane Smith"` |
| `Street` | String (max 30) | **M** | Delivery street. | `"456 Delivery Rd"` |
| `PostCode` | String (numeric, max 10) | **M** | Postal code. | `"2000"` |
| `City` | String (max 30) | **M** | City name. | `"Aarhus"` |
| `CountryCode` | String (ISO 3166) | **M** | Country code. | `"DK"` |
| `ShippingNotification` | Object | **C** | Required for shipment notifications. | `{}` |

### ShippingNotification Object

| Fieldname | Type | Rule | Description | Example |
|---------|------|------|------------|---------|
| `EmailAddress` | String (email, max 30) | **C** | Customer email for tracking notifications. | `"notify@example.com"` |
| `PhonePrefix` | String (max 4, must start with `+`) | **C** | Country phone prefix. | `"+45"` |
| `PhoneNumber` | String (numeric, max 11) | **C** | Phone number. | `"12345678"` |

---

## Delivery Types Explained

1. **Standard Delivery**  
   - Only `BuyerID` is used  
   - Delivery goes to the default address registered at Mascot

2. **Alternative Delivery**  
   - Use **one** of the following:  
     - `DeliveryByNumber` (GLN or commission number)  
     - `DeliveryByAddress` (custom address)  
   - **Priority rule:** If both are supplied, `DeliveryByNumber` takes precedence

3. **Dropshipment (ZE Orders)**  
   - `Dropshipment` object **overrides all delivery details**  
   - Intended for B2C / end-customer delivery

---

## API Payload Structure

```json
{
  "Header": { ... },
  "OrderLine": [ ... ],
  "Dropshipment": { ... }
}
```

---

## Example Payload

```json
{
  "Header": {
    "Ordertype": "ZI",
    "BuyerID": "1234567890123",
    "PreferredDeliveryDate": "2025-08-20",
    "OrderReference": "ORD1234567890",
    "IssueEmail": "customer@example.com",
    "NonStandardDelivery": {
      "DeliveryByNumber": "9876543210123",
      "DeliveryByAddress": {
        "Name": "John Doe",
        "Address": "123 Example St",
        "CountryCode": "DK",
        "PostCode": "1000",
        "City": "Copenhagen"
      }
    }
  },
  "OrderLine": [
    {
      "BuyersLineReference": "LINE001",
      "SuppliersEANCode": "1234567890123",
      "SuppliersMaterialNumber": "MAT12345",
      "ProductDescription": "Example Product 1",
      "Quantity": 10
    }
  ]
}
```

