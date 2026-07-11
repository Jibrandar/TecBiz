const API_URL =
  "https://script.google.com/macros/s/AKfycbxoJAY_IiXaGgwnsIC2cH6w_ZyCI2KYnxOs7Ekg34i6I5SWviFrWuvNYHKheWKwtPwH/exec";

document.querySelectorAll(".tecbiz-form").forEach(form => {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitBtn = form.querySelector(".submit-btn");
        const message = form.querySelector(".form-message");

        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";

        message.classList.add("hidden");

        try {

            const formData = new FormData(form);

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            const result = await response.text();

            if (result.trim() === "SUCCESS") {

                message.className =
                    "form-message mt-6 rounded-xl p-4 text-center bg-green-100 text-green-700";

                message.innerHTML =
                    "✅ Your request has been submitted successfully.";

                form.reset();

            } else {

                throw new Error(result);

            }

        } catch (err) {

            message.className =
                "form-message mt-6 rounded-xl p-4 text-center bg-red-100 text-red-700";

            message.innerHTML =
                "❌ Something went wrong. Please try again.";

            console.error(err);

        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

    });

});