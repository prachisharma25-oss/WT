package com.electricity.model;

/**
 * Model class representing an electricity bill.
 * Encapsulates customer details and all billing calculations.
 */
public class Bill {

    // ── Customer Details ─────────────────────────────────────────────────────
    private String customerName;
    private String customerId;
    private String address;
    private String meterNumber;
    private String month;

    // ── Unit Readings ─────────────────────────────────────────────────────────
    private int previousReading;
    private int currentReading;
    private int unitsConsumed;

    // ── Slab-wise Charges ─────────────────────────────────────────────────────
    private double slab1Units;   // 0 – 50
    private double slab2Units;   // 51 – 150
    private double slab3Units;   // 151 – 250
    private double slab4Units;   // above 250

    private double slab1Charge;
    private double slab2Charge;
    private double slab3Charge;
    private double slab4Charge;

    // ── Totals ────────────────────────────────────────────────────────────────
    private double energyCharge;
    private double fixedCharge;
    private double taxAmount;
    private double totalAmount;

    // Slab rates (constants)
    public static final double RATE_SLAB1 = 3.50;
    public static final double RATE_SLAB2 = 4.00;
    public static final double RATE_SLAB3 = 5.20;
    public static final double RATE_SLAB4 = 6.50;
    public static final double FIXED_CHARGE = 50.00;
    public static final double TAX_RATE     = 0.05;   // 5 %

    // ── Constructors ──────────────────────────────────────────────────────────

    public Bill() { }

    /**
     * Constructs a fully-calculated Bill.
     *
     * @param customerName   Full name of the consumer
     * @param customerId     Unique consumer ID
     * @param address        Consumer address
     * @param meterNumber    Meter serial number
     * @param month          Billing month
     * @param previousReading Meter reading at start of billing period
     * @param currentReading  Meter reading at end of billing period
     */
    public Bill(String customerName, String customerId, String address,
                String meterNumber, String month,
                int previousReading, int currentReading) {

        this.customerName   = customerName;
        this.customerId     = customerId;
        this.address        = address;
        this.meterNumber    = meterNumber;
        this.month          = month;
        this.previousReading = previousReading;
        this.currentReading  = currentReading;

        this.unitsConsumed = currentReading - previousReading;
        calculateBill();
    }

    // ── Core Calculation Logic ─────────────────────────────────────────────────

    /**
     * Applies the tiered slab rate structure and computes the total payable amount.
     *
     * Slabs:
     *   First  50 units  → Rs. 3.50 / unit
     *   Next  100 units  → Rs. 4.00 / unit  (51 – 150)
     *   Next  100 units  → Rs. 5.20 / unit  (151 – 250)
     *   Above 250 units  → Rs. 6.50 / unit
     */
    private void calculateBill() {
        int units = this.unitsConsumed;

        // Slab 1 : 0 – 50
        if (units <= 50) {
            slab1Units  = units;
        } else {
            slab1Units  = 50;
        }

        // Slab 2 : 51 – 150
        if (units > 50) {
            slab2Units = Math.min(units - 50, 100);
        }

        // Slab 3 : 151 – 250
        if (units > 150) {
            slab3Units = Math.min(units - 150, 100);
        }

        // Slab 4 : above 250
        if (units > 250) {
            slab4Units = units - 250;
        }

        slab1Charge  = slab1Units  * RATE_SLAB1;
        slab2Charge  = slab2Units  * RATE_SLAB2;
        slab3Charge  = slab3Units  * RATE_SLAB3;
        slab4Charge  = slab4Units  * RATE_SLAB4;

        energyCharge = slab1Charge + slab2Charge + slab3Charge + slab4Charge;
        fixedCharge  = FIXED_CHARGE;
        taxAmount    = (energyCharge + fixedCharge) * TAX_RATE;
        totalAmount  = energyCharge + fixedCharge + taxAmount;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getCustomerName()   { return customerName; }
    public void   setCustomerName(String customerName)   { this.customerName = customerName; }

    public String getCustomerId()     { return customerId; }
    public void   setCustomerId(String customerId)       { this.customerId = customerId; }

    public String getAddress()        { return address; }
    public void   setAddress(String address)             { this.address = address; }

    public String getMeterNumber()    { return meterNumber; }
    public void   setMeterNumber(String meterNumber)     { this.meterNumber = meterNumber; }

    public String getMonth()          { return month; }
    public void   setMonth(String month)                 { this.month = month; }

    public int    getPreviousReading() { return previousReading; }
    public void   setPreviousReading(int previousReading) { this.previousReading = previousReading; }

    public int    getCurrentReading()  { return currentReading; }
    public void   setCurrentReading(int currentReading)   { this.currentReading = currentReading; }

    public int    getUnitsConsumed()   { return unitsConsumed; }
    public void   setUnitsConsumed(int unitsConsumed)     { this.unitsConsumed = unitsConsumed; }

    public double getSlab1Units()   { return slab1Units; }
    public double getSlab2Units()   { return slab2Units; }
    public double getSlab3Units()   { return slab3Units; }
    public double getSlab4Units()   { return slab4Units; }

    public double getSlab1Charge()  { return slab1Charge; }
    public double getSlab2Charge()  { return slab2Charge; }
    public double getSlab3Charge()  { return slab3Charge; }
    public double getSlab4Charge()  { return slab4Charge; }

    public double getEnergyCharge() { return energyCharge; }
    public double getFixedCharge()  { return fixedCharge; }
    public double getTaxAmount()    { return taxAmount; }
    public double getTotalAmount()  { return totalAmount; }
}
