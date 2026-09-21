import { useEffect, useState } from "react";
import "./AdminPricing.css";

function AdminPricing() {
  const [settings, setSettings] = useState(null);
  const [feeType, setFeeType] = useState("fixed");
  const [feeValue, setFeeValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPricingSettings = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/pricing",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load pricing settings"
        );
        return;
      }

      const pricing = data.settings;

      setSettings(pricing || null);

      if (pricing) {
        setFeeType(
          pricing.fee_type || "fixed"
        );

        setFeeValue(
          pricing.fee_value ?? ""
        );
      }

      setMessage("");
    } catch (error) {
      console.error(
        "Pricing settings error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      return;
    }

    if (feeValue === "") {
      setMessage("Fee value is required");
      return;
    }

    const numericFee = Number(feeValue);

    if (
      Number.isNaN(numericFee) ||
      numericFee < 0
    ) {
      setMessage(
        "Fee value must be a valid non-negative number"
      );
      return;
    }

    if (
      feeType !== "fixed" &&
      feeType !== "percentage"
    ) {
      setMessage("Invalid fee type");
      return;
    }

    if (
      feeType === "percentage" &&
      numericFee > 100
    ) {
      setMessage(
        "Percentage fee cannot be greater than 100"
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/admin/pricing",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fee_type: feeType,
            fee_value: numericFee,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update pricing"
        );
        return;
      }

      setMessage(
        "Pricing settings updated successfully."
      );

      setSettings(
        data.settings || {
          fee_type: feeType,
          fee_value: numericFee,
        }
      );

      await fetchPricingSettings();
    } catch (error) {
      console.error(
        "Update pricing error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setSaving(false);
    }
  };

  const calculateExample = () => {
    const sellerPrice = 100;

    const numericFee =
      Number(feeValue) || 0;

    if (feeType === "percentage") {
      return (
        sellerPrice +
        (sellerPrice * numericFee) / 100
      );
    }

    return sellerPrice + numericFee;
  };

  const exampleFee =
    Number(feeValue) || 0;

  const exampleBuyerPrice =
    calculateExample();

  return (
    <main className="admin-pricing-page">

      {/* Background Animation */}
      <div className="pricing-bg pricing-bg-one"></div>
      <div className="pricing-bg pricing-bg-two"></div>
      <div className="pricing-bg pricing-bg-three"></div>

      {/* Header */}
      <section className="pricing-header">

        <div className="pricing-header-icon">
          💰
        </div>

        <div>
          <p className="pricing-label">
            ADMIN CONTROL CENTER
          </p>

          <h1>
            Pricing <span>Settings</span>
          </h1>

          <p className="pricing-description">
            Configure the platform fee added
            to the seller price.
          </p>
        </div>

      </section>

      {/* Message */}
      {message && (
        <div
          className={`pricing-message ${
            message.includes("successfully")
              ? "pricing-success"
              : "pricing-error"
          }`}
        >
          <span>
            {message.includes("successfully")
              ? "✅"
              : "⚠️"}
          </span>

          {message}
        </div>
      )}

      {loading ? (

        /* Loading */
        <section className="pricing-loading">

          <div className="pricing-loader">
            💰
          </div>

          <h2>
            Loading Pricing Settings...
          </h2>

          <p>
            Fetching current platform pricing
          </p>

        </section>

      ) : (

        <>

          {/* Main Pricing Layout */}
          <section className="pricing-layout">

            {/* Settings Form */}
            <div className="pricing-settings-card">

              <div className="pricing-card-heading">

                <div className="pricing-card-icon">
                  ⚙️
                </div>

                <div>
                  <span>
                    PLATFORM CONFIGURATION
                  </span>

                  <h2>
                    Platform Fee
                  </h2>
                </div>

              </div>

              <p className="pricing-card-description">
                Choose how much extra amount
                will be added to the seller price.
              </p>

              <form
                className="pricing-form"
                onSubmit={handleSubmit}
              >

                {/* Fee Type */}
                <div className="pricing-field">

                  <label htmlFor="fee-type">
                    Fee Type
                  </label>

                  <div className="pricing-select-wrapper">
                    <span>📊</span>

                    <select
                      id="fee-type"
                      value={feeType}
                      onChange={(e) =>
                        setFeeType(
                          e.target.value
                        )
                      }
                    >
                      <option value="fixed">
                        Fixed Amount
                      </option>

                      <option value="percentage">
                        Percentage
                      </option>
                    </select>
                  </div>

                </div>

                {/* Fee Value */}
                <div className="pricing-field">

                  <label htmlFor="fee-value">
                    Fee Value
                  </label>

                  <div className="pricing-input-wrapper">

                    <span>
                      {feeType ===
                      "percentage"
                        ? "%"
                        : "₹"}
                    </span>

                    <input
                      id="fee-value"
                      type="number"
                      min="0"
                      max={
                        feeType ===
                        "percentage"
                          ? "100"
                          : undefined
                      }
                      step="0.01"
                      value={feeValue}
                      onChange={(e) =>
                        setFeeValue(
                          e.target.value
                        )
                      }
                      placeholder={
                        feeType ===
                        "percentage"
                          ? "Example: 10"
                          : "Example: 20"
                      }
                      required
                    />

                  </div>

                  <small>
                    {feeType ===
                    "percentage"
                      ? "Enter a value from 0% to 100%."
                      : "Enter a fixed amount in Indian Rupees."}
                  </small>

                </div>

                {/* Save */}
                <button
                  type="submit"
                  className="save-pricing-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="button-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      💾 Save Pricing
                    </>
                  )}
                </button>

              </form>

            </div>

            {/* Live Preview */}
            <div className="pricing-preview-card">

              <div className="preview-top">

                <div className="preview-icon">
                  🧮
                </div>

                <div>
                  <span>
                    LIVE PREVIEW
                  </span>

                  <h2>
                    Price Calculation
                  </h2>
                </div>

              </div>

              <div className="calculation-box">

                <div className="calculation-row">
                  <span>
                    Seller Price
                  </span>

                  <strong>
                    ₹100.00
                  </strong>
                </div>

                <div className="calculation-symbol">
                  +
                </div>

                <div className="calculation-row fee-row">
                  <span>
                    Platform Fee
                  </span>

                  <strong>
                    {feeType ===
                    "percentage"
                      ? `${exampleFee}%`
                      : `₹${exampleFee.toFixed(2)}`}
                  </strong>
                </div>

                <div className="calculation-line"></div>

                <div className="calculation-row final-row">
                  <span>
                    Buyer Price
                  </span>

                  <strong>
                    ₹
                    {exampleBuyerPrice.toFixed(
                      2
                    )}
                  </strong>
                </div>

              </div>

              <div className="pricing-formula">

                <span>FORMULA</span>

                <p>
                  Seller Price + Platform Fee
                  = Buyer Price
                </p>

              </div>

              <div className="preview-note">
                💡 This example uses a seller
                price of ₹100.
              </div>

            </div>

          </section>

          {/* Current Settings */}
          <section className="current-pricing-section">

            <div className="current-pricing-heading">

              <div>
                <span>
                  ACTIVE CONFIGURATION
                </span>

                <h2>
                  📋 Current Settings
                </h2>
              </div>

              <div className="active-badge">
                ● ACTIVE
              </div>

            </div>

            {settings ? (

              <div className="current-pricing-grid">

                <div className="current-pricing-item">

                  <div className="current-icon">
                    📊
                  </div>

                  <div>
                    <p>
                      Fee Type
                    </p>

                    <strong>
                      {settings.fee_type ===
                      "percentage"
                        ? "Percentage"
                        : "Fixed Amount"}
                    </strong>
                  </div>

                </div>

                <div className="current-pricing-item">

                  <div className="current-icon">
                    💰
                  </div>

                  <div>
                    <p>
                      Fee Value
                    </p>

                    <strong>
                      {settings.fee_type ===
                      "percentage"
                        ? `${settings.fee_value}%`
                        : `₹${settings.fee_value}`}
                    </strong>
                  </div>

                </div>

                <div className="current-pricing-item">

                  <div className="current-icon">
                    🧮
                  </div>

                  <div>
                    <p>
                      Example Buyer Price
                    </p>

                    <strong>
                      ₹
                      {(() => {
                        const value =
                          Number(
                            settings.fee_value
                          ) || 0;

                        const price =
                          settings.fee_type ===
                          "percentage"
                            ? 100 +
                              (100 * value) /
                                100
                            : 100 + value;

                        return price.toFixed(
                          2
                        );
                      })()}
                    </strong>
                  </div>

                </div>

                {settings.updated_at && (
                  <div className="current-pricing-item">

                    <div className="current-icon">
                      🕒
                    </div>

                    <div>
                      <p>
                        Last Updated
                      </p>

                      <strong>
                        {new Date(
                          settings.updated_at
                        ).toLocaleString()}
                      </strong>
                    </div>

                  </div>
                )}

              </div>

            ) : (

              <div className="no-pricing-settings">
                <span>⚙️</span>

                <h3>
                  No Pricing Settings Found
                </h3>

                <p>
                  Save a pricing configuration
                  to create the active settings.
                </p>
              </div>

            )}

          </section>

          {/* Information */}
          <section className="pricing-info">

            <div className="pricing-info-icon">
              💡
            </div>

            <div>
              <h3>
                How Pricing Works
              </h3>

              <p>
                The seller sets the original
                book price. The configured
                platform fee is then added to
                calculate the buyer price.
              </p>
            </div>

          </section>

          {/* Footer */}
          <section className="pricing-footer">

            <div className="pricing-footer-icon">
              💰
            </div>

            <div>
              <h2>
                USED BOOK MARKET
              </h2>

              <p>
                Pricing management control panel
              </p>
            </div>

            <div className="pricing-footer-status">
              <span></span>
              System Online
            </div>

          </section>

        </>
      )}

    </main>
  );
}

export default AdminPricing;