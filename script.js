const managerDistricts = {
  "Rohit Kumar": ["Patna", "Nalanda"],
  "Dharmendra Kumar": ["Gaya", "Jehanabad", "Arwal", "Aurangabad"],
  "Shalu Kumari": ["Munger", "Lakhisarai", "Sheikhpura"],
  "Rahul Kumar": ["Bhagalpur", "Banka"],
  "Vishwanath Singh": ["Muzaffarpur", "Vaishali", "Sheohar"],
  "Ritesh Kumar Rohit": ["Begusarai", "Khagaria"],
  "Markandey Shahi": ["West Champaran", "East Champaran", "Gopalganj", "Siwan"]
};

document.getElementById("manager").addEventListener("change", function () {
  const selectedManager = this.value;
  const districts = managerDistricts[selectedManager] || [];
  const container = document.getElementById("districtCheckboxes");

  container.innerHTML = "";

  districts.forEach(district => {
    const wrapper = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = district;
    checkbox.name = "district";
    wrapper.appendChild(checkbox);
    wrapper.appendChild(document.createTextNode(district));
    container.appendChild(wrapper);
  });
});

document.getElementById("dataForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const msg = document.getElementById("msg");

  const districts = Array.from(document.querySelectorAll('#districtCheckboxes input[type="checkbox"]:checked'))
                         .map(cb => cb.value);

  if (districts.length === 0) {
    msg.textContent = "Please select at least one district.";
    msg.style.color = "red";
    return;
  }

  const data = {
    schedule_date: document.getElementById("schedule_date").value,
    manager: document.getElementById("manager").value,
    district: districts,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value
  };

  fetch("YOUR_GOOGLE_SCRIPT_URL", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.text())
  .then(result => {
    if (result === "Success") {
      msg.textContent = "Form submitted successfully!";
      msg.style.color = "green";
      document.getElementById("dataForm").reset();
      document.getElementById("districtCheckboxes").innerHTML = "";
    } else {
      msg.textContent = "Submission failed.";
      msg.style.color = "red";
    }
  })
  .catch(error => {
    msg.textContent = "Error submitting form.";
    msg.style.color = "red";
    console.error("Error:", error);
  });
});
