// Google Apps Script Web App URL - Replace with your deployed web app URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzWYZC_iUi1T-Xz7vVlpybTMfgf6t8MItZ3QCjpm0IMGVRnNnWebhr8gZ454FGn0vGaUA/exec";

// Initialize form elements
const form = document.getElementById("paymentForm");
const classSelect = document.getElementById("class");
const paymentTypeSelect = document.getElementById("paymentType");
const fixedAmountDiv = document.getElementById("fixedAmount");
const customAmountDiv = document.getElementById("customAmount");
const amountInput = document.getElementById("amount");
const customAmountInput = document.getElementById("customAmountInput");

// Fee structure
const feeStructure = {
  nursery: 45000 + 1000,
  primary: 49000 + 1000,
};
function getClassCategory(selectedClass) {
  if (selectedClass.startsWith("nur")) return "nursery";
  if (selectedClass.startsWith("pry")) return "primary";
  return "others";
}

// Update amount based on class and payment type
function updateAmount() {
  const selectedClass = classSelect.value;
  const paymentType = paymentTypeSelect.value;
  const category = getClassCategory(selectedClass);
  let amount = 0;

  if (category === "nursery") {
    amount = feeStructure.nursery;
  } else if (category === "primary") {
    amount = feeStructure.primary;
  }

  if (paymentType === "half") {
    amount = amount / 2;
  }

  if (selectedClass === "others") {
    fixedAmountDiv.classList.remove("active");
    customAmountDiv.classList.add("active");
  } else {
    fixedAmountDiv.classList.add("active");
    customAmountDiv.classList.remove("active");
    amountInput.value = amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  }
}
// Update amount based on class and payment type
function updateAmount() {
  const selectedClass = classSelect.value;
  const paymentType = paymentTypeSelect.value;
  let amount = 0;

  if (selectedClass.startsWith("nur")) {
    amount = feeStructure.nursery;
  } else if (selectedClass.startsWith("pry")) {
    amount = feeStructure.primary;
  }

  if (paymentType === "half") {
    amount = amount / 2;
  }

  if (selectedClass === "others") {
    fixedAmountDiv.classList.remove("active");
    customAmountDiv.classList.add("active");
  } else {
    fixedAmountDiv.classList.add("active");
    customAmountDiv.classList.remove("active");
    amountInput.value = amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  }
}

// Event listeners
classSelect.addEventListener("change", updateAmount);
paymentTypeSelect.addEventListener("change", updateAmount);

// Handle form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get form data
  const studentName = document.getElementById("studentName").value;
  const selectedClass = classSelect.value;
  const paymentType = paymentTypeSelect.value;
  const amount =
    selectedClass === "others"
      ? parseFloat(customAmountInput.value) * 1
      : parseFloat(amountInput.value.replace(/[^0-9.-]+/g, ""));

  // Submit to Google Sheets
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentName,
        term,
        class: selectedClass,
        classCategory: getClassCategory(selectedClass),
        paymentType,
        amount,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
  }

  // Initialize Paystack payment
  let handler = PaystackPop.setup({
    key: "pk_live_2e57947c4049ce5ffba1eba23d52af13e7927faf",
    email: "Monehinseun4125@gmail.com",
    amount: amount * 100, // Convert to kobo
    currency: "NGN",
    ref: "" + Math.floor(Math.random() * 1000000000 + 1),
    onClose: function () {
      alert("Window closed.");
    },
    callback: function (response) {
      let message = "Payment complete! Reference: " + response.reference;
      alert(message);
    },
  });

  handler.openIframe();
});

// Initialize amount on page load
updateAmount();
