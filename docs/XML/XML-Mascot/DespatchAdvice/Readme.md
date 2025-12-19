# XML Despatch Advice – Documentation

This document describes the structure, rules, and usage of the **XML MASCOT Despatch Advice** message.

The Despatch Advice is used to notify the buyer about goods that have been shipped, including shipment details, packages, and despatched line items.

---

## Table of Contents
1. Rules
2. Data Types
3. Despatch Advice Header Structure
4. Party Information
5. Transport and Delivery Information
6. Package Information
7. Despatch Line Structure
8. Despatch Totals
9. Example XML Structure

---

## Rules

| Rule | Description |
|------|------------|
| **M - Mandatory** | Field must always be populated. |
| **O - Optional** | Field may be omitted if not applicable. |
| **C - Conditional** | Required based on business rules. |
| **R - Recommended** | Strongly recommended for correct logistics processing. |

---

## Data Types

| DataType | Description | Format | Example |
|---------|------------|--------|---------|
| **Identifier** | Business identifier | Alphanumeric | `DN-2025-001` |
| **Date** | ISO date | `YYYY-MM-DD` | `2025-01-23` |
| **Numeric** | Number value | Decimal | `1.52` |
| **Quantity** | Quantity | Numeric | `2` |
| **Text** | Free text | UTF-8 | `Road` |

---

## Despatch Advice Header Structure

| Element | Rule | Description | Example |
|-------|------|------------|---------|
| `Schema/Version` | **M** | Despatch Advice schema version | `1` |
| `DeliveryNoteNumber` | **M** | Supplier delivery note number | `DN-10001` |
| `BuyerOrderReference` | **R** | Buyer order reference | `ORDER-REF-01` |
| `DespatchAdviceDate` | **M** | Document creation date | `2025-01-20` |
| `DespatchDate` | **M** | Goods despatch date | `2025-01-21` |
| `ExpectedDeliveryDate` | **R** | Expected delivery date | `2025-01-23` |

---

## Party Information

### SupplierParty

| Element | Rule | Description |
|-------|------|------------|
| `Name1` | **M** | Supplier name |
| `Address` | **M** | Supplier street address |
| `City` | **M** | Supplier city |
| `PostalCode` | **M** | Supplier postal code |
| `CountryCode` | **M** | ISO country code |
| `Communication/PhoneNumber` | **O** | Supplier phone number |

### BuyerParty

Same structure and rules as `SupplierParty`, representing the buyer.

### DeliveryToParty

| Element | Rule | Description |
|-------|------|------------|
| `Name1` | **M** | Delivery recipient name |
| `Address` | **M** | Delivery address |
| `City` | **M** | Delivery city |
| `PostalCode` | **M** | Delivery postal code |
| `CountryCode` | **M** | ISO country code |
| `Communication/PhoneNumber` | **O** | Delivery contact phone |

---

## Transport and Delivery Information

| Element | Rule | Description |
|-------|------|------------|
| `TransportMode` | **O** | Mode of transport (e.g. Road, Sea) |
| `TermsOfDelivery` | **O** | Delivery terms description |
| `TermsOfDeliveryCode` | **R** | Incoterms code (e.g. DAP) |

---

## Package Information

`Packages` describes the handling units used in the shipment.

| Element | Rule | Description |
|-------|------|------------|
| `PackageID` | **M** | Unique package identifier |
| `GrossWeight` | **M** | Gross package weight |
| `NetWeight` | **M** | Net package weight |

Multiple `Packages` elements may be provided if several packages are shipped.

---

## Despatch Line Structure

Each `DespatchLines` element represents one despatched item.

| Element | Rule | Description |
|-------|------|------------|
| `Line` | **M** | Despatch line number |
| `OriginalLine` | **R** | Original order line number |
| `BuyerLineReference` | **O** | Buyer line reference |
| `SupplierMaterialNumber` | **R** | Supplier material number |
| `EAN` | **R** | Product EAN |
| `ProductDescription` | **O** | Product description |
| `Quantity` | **M** | Despatched quantity |
| `OriginalQuantity` | **R** | Ordered quantity |
| `UnitOfMeasure` | **M** | Unit of measure |
| `BatchNumber` | **O** | Batch / lot number |
| `LineWeight` | **O** | Weight for this line |
| `LineVolume` | **O** | Volume for this line |

### PackageIdentification (per line)

| Element | Rule | Description |
|-------|------|------------|
| `PackageID` | **M** | Package reference |
| `PackageType` | **O** | Package type |
| `PackageQuantity` | **M** | Quantity in package |

---

## Despatch Totals

`DespatchTotals` contains summary information for the despatch.

| Element | Rule | Description |
|-------|------|------------|
| `TotalNumberOfLines` | **M** | Number of despatch lines |
| `NumberOfHandlingUnits` | **M** | Number of packages |
| `TotalQuantity` | **M** | Total despatched quantity |
| `TotalGrossWeight` | **M** | Total gross weight |
| `TotalNetWeight` | **M** | Total net weight |
| `TotalGrossVolume` | **O** | Total gross volume |
| `TotalNetVolume` | **O** | Total net volume |

---

## Example XML Structure (All Fields Included)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<DespatchAdvice>
  <Schema>
    <Version>1</Version>
  </Schema>

  <DeliveryNoteNumber>DN-10001</DeliveryNoteNumber>
  <BuyerOrderReference>ORDER-REF-01</BuyerOrderReference>
  <DespatchAdviceDate>2025-01-20</DespatchAdviceDate>
  <DespatchDate>2025-01-21</DespatchDate>
  <ExpectedDeliveryDate>2025-01-23</ExpectedDeliveryDate>
  <TransportMode>Road</TransportMode>
  <TermsOfDelivery>Delivered At Place</TermsOfDelivery>
  <TermsOfDeliveryCode>DAP</TermsOfDeliveryCode>

  <SupplierParty>
    <Name1>Mascot International</Name1>
    <Address>ADDRESS</Address>
    <City>CITY</City>
    <PostalCode>POSTCODE</PostalCode>
    <CountryCode>DK</CountryCode>
    <Communication>
      <PhoneNumber>123456789</PhoneNumber>
    </Communication>
  </SupplierParty>

  <BuyerParty>
    <Name1>Customer A/S</Name1>
    <Address>Main Street 1</Address>
    <City>CITY</City>
    <PostalCode>POSTCODE</PostalCode>
    <CountryCode>COUNTRYCODE</CountryCode>
    <Communication>
      <PhoneNumber>123456789</PhoneNumber>
    </Communication>
  </BuyerParty>

  <DeliveryToParty>
    <Name1>Customer Warehouse</Name1>
    <Address>ADDRESS</Address>
    <City>CITY</City>
    <PostalCode>POSTCODE</PostalCode>
    <CountryCode>COUNTRYCODE</CountryCode>
    <Communication>
      <PhoneNumber>123456789</PhoneNumber>
    </Communication>
  </DeliveryToParty>

  <Packages>
    <PackageID>PKG-001</PackageID>
    <GrossWeight>0.28</GrossWeight>
    <NetWeight>0.28</NetWeight>
  </Packages>

  <DespatchLines>
    <Line>1</Line>
    <OriginalLine>2</OriginalLine>
    <BuyerLineReference>CUSTOMER_LINE_REF-2</BuyerLineReference>
    <SupplierMaterialNumber>MAT-12345</SupplierMaterialNumber>
    <EAN>5701234567890</EAN>
    <ProductDescription>Safety Shoes Model X</ProductDescription>
    <Quantity>2</Quantity>
    <OriginalQuantity>2</OriginalQuantity>
    <UnitOfMeasure>PAIR</UnitOfMeasure>
    <BatchNumber>BATCH-001</BatchNumber>
    <LineWeight>0.28</LineWeight>
    <LineVolume>1.52</LineVolume>
    <PackageIdentification>
      <PackageID>PKG-001</PackageID>
      <PackageType>BOX</PackageType>
      <PackageQuantity>2</PackageQuantity>
    </PackageIdentification>
  </DespatchLines>

  <DespatchTotals>
    <TotalNumberOfLines>1</TotalNumberOfLines>
    <NumberOfHandlingUnits>1</NumberOfHandlingUnits>
    <TotalQuantity>2</TotalQuantity>
    <TotalGrossWeight>1.32</TotalGrossWeight>
    <TotalNetWeight>0.28</TotalNetWeight>
    <TotalGrossVolume>79.32</TotalGrossVolume>
    <TotalNetVolume>1.52</TotalNetVolume>
  </DespatchTotals>
</DespatchAdvice>
```


