const managerDistricts = {
  "Rohit Kumar": ["Nalanda", "Banka", "Bhagalpur", "Jamui", "Khagaria", "Munger"],
  "Dharmendra Kumar": ["Arwal", "Aurangabad", "Gaya", "Jehanabad", "Sitamarhi", "Sheohar", "Vaishali"],
  "Shalu Kumari": ["Begusarai", "Katihar", "Kishanganj", "Araria", "Nawada", "Purnia"],
  "Rahul Kumar": ["Bhojpur", "Buxar", "Kaimur", "Patna", "Rohtas", "Samastipur"],
  "Vishwanath Singh": ["Darbhanga", "East Champaran", "Madhubani", "West Champaran"],
  "Ritesh Kumar Rohit": ["Gopalganj", "Muzaffarpur", "Saran", "Siwan"],
  "Markandey Shahi": ["Lakhisarai", "Madhepura", "Saharsa", "Sheikhpura", "Supaul"]
};

// Element references
const managerSelect = document.getElementById('manager');
const districtContainer = document.getElementById('districtCheckboxes');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const form = document.getElementById('dataForm');

// ✅ Populate inline checkboxes based on manager
managerSelect.addEventListener('change', function () {
  const selectedManager = this.value;
  districtContainer.innerHTML = '';

  if (selectedManager && managerDistricts[selectedManager]) {
    managerDistricts[selectedManager].forEach(district => {
      const label = document.createElement('label');
      label.style.display = 'inline-flex';
      label.style.alignItems = 'center';
      label.style.marginRight = '10px';
      label.style.fontSize = '14px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = district;
      checkbox.name = 'districts';
      checkbox.style.marginRight = '4px';

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(district));
      districtContainer.appendChild(label);
    });
  }
});

// ✅ Get selected districts
const getSelectedDistricts = () => {
  const checked = document.querySelectorAll('#districtCheckboxes input[type="checkbox"]:checked');
  return Array.from(checked).map(cb => cb.value);
};

// ✅ Only digits in phone input
phoneInput.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

// ✅ Form submit handler
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const selectedDistricts = getSelectedDistricts();
  const scheduleDate = document.getElementById('schedule_date').value;

  if (selectedDistricts.length === 0) {
    alert("❌ Please select at least one district.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("❌ Please enter a valid 10-digit phone number.");
    return;
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    alert("❌ Only Gmail addresses (ending in @gmail.com) are allowed.");
    return;
  }

  if (!scheduleDate) {
    alert("❌ Please select a schedule date.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  if (scheduleDate < today) {
    alert("❌ Schedule date cannot be in the past.");
    return;
  }

  const data = {
    manager: managerSelect.value,
    district: selectedDistricts.join(", "),
    name: document.getElementById('name').value.trim(),
    email: email,
    phone: document.getElementById('countryCode').value + phone,
    schedule_date: scheduleDate
  };

  fetch('https://script.google.com/macros/s/AKfycbzqZdiXI68sxeLuQmklm6NjNg7mxzSwdfgWQX3KCOX_I88ZBrkPAVYMQaMx2WbqcjCrkg/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    document.getElementById('msg').innerHTML = "✅ Data submitted successfully!";
    form.reset();
    districtContainer.innerHTML = '';
  }).catch(err => {
    document.getElementById('msg').innerHTML = "❌ Error: " + err;
  });
});
