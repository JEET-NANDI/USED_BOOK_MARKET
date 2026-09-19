import { useEffect, useState } from "react";

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
      setMessage(
        "Fee value is required"
      );
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
      setMessage(
        "Invalid fee type"
      );
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
        (sellerPrice * numericFee) /
          100
      );
    }

    return sellerPrice + numericFee;
  };

  return (
    <div>
      <h1>Pricing Settings</h1>

      <p>
        Configure the platform fee added
        to the seller price.
      </p>

      {message && (
        <p>{message}</p>
      )}

      {loading ? (
        <p>
          Loading pricing settings...
        </p>
      ) : (
        <>
          <hr />

          <h2>
            Platform Fee
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Fee Type:
                {" "}

                <select
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
              </label>
            </div>

            <br />

            <div>
              <label>
                Fee Value:
                {" "}

                <input
                  type="number"
                  min="0"
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
              </label>

              {feeType ===
                "percentage" && (
                <span>
                  {" "}%
                </span>
              )}

              {feeType === "fixed" && (
                <span>
                  {" "}₹
                </span>
              )}
            </div>

            <br />

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Pricing"}
            </button>
          </form>

          <hr />

          <h2>
            Example Calculation
          </h2>

          <p>
            Example seller price:{" "}
            <strong>₹100</strong>
          </p>

          <p>
            Fee type:{" "}
            <strong>
              {feeType}
            </strong>
          </p>

          <p>
            Platform fee:{" "}
            <strong>
              {feeType ===
              "percentage"
                ? `${feeValue || 0}%`
                : `₹${feeValue || 0}`}
            </strong>
          </p>

          <p>
            Example buyer price:{" "}
            <strong>
              ₹
              {calculateExample().toFixed(
                2
              )}
            </strong>
          </p>

          {settings && (
            <>
              <hr />

              <h2>
                Current Settings
              </h2>

              <p>
                Fee type:{" "}
                <strong>
                  {settings.fee_type}
                </strong>
              </p>

              <p>
                Fee value:{" "}
                <strong>
                  {settings.fee_value}
                </strong>
              </p>

              {settings.updated_at && (
                <p>
                  Last updated:{" "}
                  <strong>
                    {new Date(
                      settings.updated_at
                    ).toLocaleString()}
                  </strong>
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPricing;