import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation } from "react-router-dom";

const countryStateCity = {
  Pakistan: {
    Punjab: ["Lahore", "Faisalabad", "Rawalpindi"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur"],
    KPK: ["Peshawar", "Abbottabad", "Mardan"],
    Balochistan: ["Quetta", "Gwadar", "Sibi"]
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Dallas", "Austin"],
    Florida: ["Miami", "Orlando", "Tampa"]
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Hamilton"],
    Quebec: ["Montreal", "Quebec City", "Laval"],
    BritishColumbia: ["Vancouver", "Victoria", "Richmond"]
  },
};

const OrderNow = () => {
  const location = useLocation();
  const selectedItem = location.state?.selectedItem || null;

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    email: "",
    phone: "",
    shipDifferent: false,
    shipAddress: {
      firstName: "",
      lastName: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zip: "",
    },
    message: "",
    paymentMethod: "cod",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e, section = "billing") => {
    const { name, value, type, checked } = e.target;
    if (section === "billing") {
      setBilling((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        ...(name === "country" && { state: "", city: "" }),
        ...(name === "state" && { city: "" }),
      }));
    } else {
      setBilling((prev) => ({
        ...prev,
        shipAddress: { ...prev.shipAddress, [name]: value },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const orderData = {
      item: selectedItem?.name || "Unknown Item",
      price: selectedItem?.price || 0,
      billing: {
        firstName: billing.firstName,
        lastName: billing.lastName,
        company: billing.company,
        address: billing.address,
        country: billing.country,
        state: billing.state,
        city: billing.city,
        zip: billing.zip,
        email: billing.email,
        phone: billing.phone,
      },
      shipDifferent: billing.shipDifferent,
      shipAddress: billing.shipAddress,
      message: billing.message,
      paymentMethod: billing.paymentMethod,
      cardDetails: {
        cardName: billing.cardName,
        cardNumber: billing.cardNumber,
        expiry: billing.expiry,
        cvv: billing.cvv,
      },
      totalAmount: selectedItem?.price || 0,
      status: "Pending",
    };

    try {
      await axios.post("http://localhost:3000/api/orders", orderData);
      setSuccessMessage("Order placed successfully!");
      setBilling({
        firstName: "",
        lastName: "",
        company: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zip: "",
        email: "",
        phone: "",
        shipDifferent: false,
        shipAddress: {
          firstName: "",
          lastName: "",
          address: "",
          country: "",
          state: "",
          city: "",
          zip: "",
        },
        message: "",
        paymentMethod: "cod",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      });
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setSuccessMessage("❌ Something went wrong! Please try again.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="w-full py-16 bg-gray-50 mt-22">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex justify-center">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white p-8 md:p-10 rounded-3xl shadow-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
            Place Your Order
          </h2>

          {successMessage && (
            <div className={`mb-4 p-4 rounded-xl text-center ${successMessage.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {successMessage}
            </div>
          )}

          {selectedItem && (
            <div className="mb-6 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400">
              <h3 className="text-xl font-semibold text-gray-800">Ordering: {selectedItem.name}</h3>
              <p className="text-gray-600">Price: Rs {selectedItem.price}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {["firstName", "lastName", "company", "address", "zip", "email", "phone"].map((field) => (
              <motion.input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={
                  field === "firstName" ? "First Name" :
                  field === "lastName" ? "Last Name" :
                  field === "company" ? "Company Name (Optional)" :
                  field === "address" ? "Street Address" :
                  field === "zip" ? "ZIP / Postal Code" :
                  field === "email" ? "example@example.com" :
                  "+92 300-1234567"
                }
                value={billing[field]}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                required={field !== "company"}
              />
            ))}

            <motion.select
              name="country"
              value={billing.country}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              required
            >
              <option value="">Select Country</option>
              {Object.keys(countryStateCity).map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </motion.select>

            <motion.select
              name="state"
              value={billing.state}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              required
              disabled={!billing.country}
            >
              <option value="">Select State/Province</option>
              {billing.country &&
                Object.keys(countryStateCity[billing.country]).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
            </motion.select>

            <motion.select
              name="city"
              value={billing.city}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              required
              disabled={!billing.state}
            >
              <option value="">Select City</option>
              {billing.country && billing.state &&
                countryStateCity[billing.country][billing.state].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </motion.select>
          </div>

          <motion.div className="mt-4">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                name="shipDifferent"
                checked={billing.shipDifferent}
                onChange={handleChange}
                className="accent-orange-500 outline-none"
              />
              Ship to a different address
            </label>
          </motion.div>

          {billing.shipDifferent && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["firstName", "lastName", "address", "zip", "country", "state", "city"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={
                      field === "firstName" ? "First Name" :
                      field === "lastName" ? "Last Name" :
                      field === "address" ? "Street Address" :
                      field === "zip" ? "ZIP / Postal Code" :
                      field === "country" ? "Country" :
                      field === "state" ? "State / Province" :
                      "City"
                    }
                    value={billing.shipAddress[field]}
                    onChange={(e) => handleChange(e, "shipAddress")}
                    className="border border-gray-300 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                ))}
              </div>
            </div>
          )}

          <motion.div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h3>
            <div className="flex flex-col gap-3">
              {["cod", "paypal", "amazon", "card"].map((method) => (
                <label key={method} className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={billing.paymentMethod === method}
                    onChange={handleChange}
                    className="accent-orange-500 outline-none"
                  />
                  {method === "cod" ? "Cash on Delivery" :
                   method === "paypal" ? "PayPal" :
                   method === "amazon" ? "Amazon Pay" :
                   "Debit/Credit Card"}
                </label>
              ))}
            </div>
          </motion.div>

          {billing.paymentMethod === "card" && (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {["cardName", "cardNumber", "expiry", "cvv"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={
                    field === "cardName" ? "Name on Card" :
                    field === "cardNumber" ? "Card Number" :
                    field === "expiry" ? "MM/YY" :
                    "CVV"
                  }
                  value={billing[field]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              ))}
            </motion.div>
          )}

          <motion.textarea
            name="message"
            placeholder="Additional Notes (Optional)"
            value={billing.message}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 w-full mt-4 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
            rows={4}
          />

          <motion.button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full mt-6 transition-all shadow-md hover:shadow-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default OrderNow;
