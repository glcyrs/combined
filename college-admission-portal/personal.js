const APP_VERSION = "1.0.4";  // 🔴 CHANGE THIS WHEN YOU UPDATE

const savedVersion = localStorage.getItem("APP_VERSION");

// If version changed → clear all saved data
if (savedVersion !== APP_VERSION) {
    console.warn("⚠️ New version detected — clearing old saved progress...");
    localStorage.clear(); 
    localStorage.setItem("APP_VERSION", APP_VERSION);
} else {
    console.log("✔️ Version matched — keeping saved progress");
}



// =====================================================
// GRADE CARD DOWNLOAD ALERT
// =====================================================
const downloads = [
  'assets/grades_form_1.pdf', // for the first card
  'assets/grades_form_2.pdf'  // for the second card
];

document.querySelectorAll('.grade-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = downloads[index];
    link.download = downloads[index].split('/').pop(); // set filename
    link.click();
  });
});

// 2 

document.addEventListener('DOMContentLoaded', () => {
  // ================= POPUP INFO BUTTONS =================
  const infoButtons = document.querySelectorAll('.info-btn');
  infoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.closest('.idp-section').querySelector('.idp-popup');
      popup.classList.add('show');
    });
  });

  const closeButtons = document.querySelectorAll('.popup-close-btn');
  closeButtons.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      const popup = e.target.closest('.idp-popup');
      popup.classList.remove('show');
    });
  });

  // ================= CLEAR INPUT ERRORS =================
 document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => removeError(el));
  el.addEventListener('change', () => removeError(el));
});

function removeError(el) {
  el.classList.remove('error');
  const notif = document.getElementById('error-notif');
  if (notif) notif.style.display = 'none';
}

// Remove error on radio buttons immediately
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const name = radio.name;  
    const container = document.getElementById(`${name}Field`) || radio.closest('.radio-group');
    if (container) container.classList.remove('error', 'error-radio-group');
    const notif = document.getElementById('error-notif');
    if (notif) notif.style.display = 'none';
  });
});

// Parents table (contenteditable) error removal
const parentCells = document.querySelectorAll('#parentsBox td[contenteditable="true"]');
parentCells.forEach(cell => {
  cell.addEventListener('input', () => {
    const parentsBox = document.getElementById('parentsBox');
    let empty = false;
    parentCells.forEach(c => { if (!c.textContent.trim()) empty = true; });
    if (!empty) parentsBox.classList.remove('error');
  });
});

// Siblings table error removal
const siblingInputs = document.querySelectorAll('#siblingsTable td[contenteditable="true"], #siblingsTable select');
siblingInputs.forEach(el => {
  el.addEventListener('input', removeSiblingError);
  el.addEventListener('change', removeSiblingError);
});

function removeSiblingError() {
  const summaryTable = document.querySelector('.siblings-summary-table');
  const inputRow = document.getElementById('siblingsTable').rows[1];
  const cells = Array.from(inputRow.cells).slice(0,5);
  let hasText = false;
  cells.forEach(cell => {
    const select = cell.querySelector('select');
    if (select && select.value.trim() !== "") hasText = true;
    if (!select && cell.textContent.trim() !== "") hasText = true;
  });
  const dataRows = summaryTable.querySelectorAll("tr:not(.header-row):not(.no-siblings-text)");
  if (hasText || dataRows.length > 0) {
    document.getElementById('siblingsField').classList.remove('error');
    document.getElementById('addSiblingBox').classList.remove('error');
  }
}
});

// ================= REMOVE ERROR HIGHLIGHTS IMMEDIATELY =================

// FIRST MEMBER
const firstMemberField = document.querySelector('.vertical-field');
const firstMemberRadios = document.querySelectorAll('input[name="first_member"]');

firstMemberRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    firstMemberField.classList.remove('error');
  });
});

// 4PS
const ppsField = document.querySelector('#ppsField');
const ppsRadios = document.querySelectorAll('input[name="4ps"]');

ppsRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    ppsField.classList.remove('error');
  });
});

// INDIGENOUS
const indigenousField = document.querySelector('#indigenousField');
const indigenousRadios = document.querySelectorAll('input[name="indigenous"]');

indigenousRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    indigenousField.classList.remove('error');
  });
});

// LGBTQIA+
const lgbtqiaField = document.querySelector('#lgbtqiaField');
const lgbtqiaRadios = document.querySelectorAll('input[name="lgbtqia"]');

lgbtqiaRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    lgbtqiaField.classList.remove('error');
  });
});

// IDP
const idpField = document.querySelector('#idpField');
const idpRadios = document.querySelectorAll('input[name="idp"]');

idpRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    idpField.classList.remove('error');
  });
});

// PWD
const pwdField = document.querySelector('#pwdField');
const pwdRadios = document.querySelectorAll('input[name="pwd"]');

pwdRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    pwdField.classList.remove('error');
  });
});

// SOLO PARENT
const soloField = document.querySelector('#soloField');
const soloParentRadios = document.querySelectorAll('input[name="solo_parent"]');

soloParentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    soloField.classList.remove('error');
  });
});

// FAMILY INCOME
const incomeField = document.querySelector('#incomeField');
const incomeRadios = document.querySelectorAll('input[name="income"]');

incomeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    incomeField.classList.remove('error');
  });
});

// SIBLINGS
const siblingsField = document.querySelector('#siblingsField');
const siblingsRadios = document.querySelectorAll('input[name="hasSiblings"]');

siblingsRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    siblingsField.classList.remove('error');
  });
});

// ================= PHOTO UPLOAD =================
function handlePhotoUpload() {
  const fileInput = document.getElementById("photoInput");
  const statusText = document.getElementById("photoStatus");
  const photoPreview = document.getElementById("photoPreview");
  const errorMsg = document.querySelector(".photo-error");
  const file = fileInput.files[0];

  if (!file || !file.type.startsWith("image/")) {
    errorMsg.style.display = "block";
    statusText.textContent = "No file chosen";
    photoPreview.style.backgroundImage = "none";
    return;
  }

  errorMsg.style.display = "none";
  statusText.textContent = file.name;

  const reader = new FileReader();
  reader.onload = function (e) {
    photoPreview.style.backgroundImage = `url('${e.target.result}')`;
  };
  reader.readAsDataURL(file);
}

// ================= SIBLINGS SHOW/HIDE =================
document.getElementById("hasSiblingsYes").addEventListener("change", () => {
  document.getElementById("addSiblingHeader").style.display = "block";
  document.getElementById("addSiblingBox").style.display = "block";
  document.getElementById("summaryHeader").style.display = "block";
  document.getElementById("summaryBox").style.display = "block";
});
document.getElementById("hasSiblingsNo").addEventListener("change", () => {
  document.getElementById("addSiblingHeader").style.display = "none";
  document.getElementById("addSiblingBox").style.display = "none";
  document.getElementById("summaryHeader").style.display = "block";
  document.getElementById("summaryBox").style.display = "block";
});


function addSiblingToSummary() {
  const inputTable = document.getElementById('siblingsTable');
  const summaryTable = document.querySelector('.siblings-summary-table');
  const inputRow = inputTable.rows[1];

  // Read values
  const fullnameCell = inputRow.cells[0];
  const ageCell = inputRow.cells[1];
  const educationSelect = inputRow.cells[2].querySelector('select');
  const schoolCell = inputRow.cells[3];
  const yearGradCell = inputRow.cells[4];

  const fullname = fullnameCell.innerText.trim();
  const age = ageCell.innerText.trim();
  const education = educationSelect.value.trim();
  const school = schoolCell.innerText.trim();
  const yearGraduated = yearGradCell.innerText.trim();

  // Validation
  let hasError = false;

  function markError(cell, condition) {
    if (condition) {
      cell.classList.add("error");
      hasError = true;
    } else {
      cell.classList.remove("error");
    }
  }

  markError(fullnameCell, fullname === "");
  markError(ageCell, age === "");
  markError(educationSelect, education === "");
  markError(schoolCell, school === "");
  markError(yearGradCell, yearGraduated === "");

  // If any field is empty → STOP
  if (hasError) return;

  // Remove "No siblings" row if it exists
  const noSiblingsRow = summaryTable.querySelector('.no-siblings-text');
  if (noSiblingsRow) noSiblingsRow.parentNode.remove();

  // Add row
  const nextNumber = summaryTable.rows.length;
  const newRow = summaryTable.insertRow(-1);

  newRow.innerHTML = `
    <td>${nextNumber}</td>
    <td>${fullname}</td>
    <td>${age}</td>
    <td>${education}</td>
    <td>${school}</td>
    <td>${yearGraduated}</td>
    <td><button type="button" class="remove-summary-btn" onclick="removeSummaryRow(this)">X</button></td>
  `;

  // Clear inputs after add
  fullnameCell.innerText = '';
  ageCell.innerText = '';
  educationSelect.value = '';
  schoolCell.innerText = '';
  yearGradCell.innerText = '';
}


function removeSummaryRow(button) {
  const row = button.parentNode.parentNode;
  const summaryTable = document.querySelector('.siblings-summary-table');
  row.parentNode.removeChild(row);

  for (let i = 1; i < summaryTable.rows.length; i++) {
    summaryTable.rows[i].cells[0].innerText = i;
  }

  if (summaryTable.rows.length === 1) {
    const noRow = summaryTable.insertRow(-1);
    const cell = noRow.insertCell(0);
    cell.colSpan = 7;
    cell.className = 'no-siblings-text';
    cell.innerText = '**No siblings**';
  }
}

// ================= PH ADDRESS CASCADING =================
(() => {
  let data;
  fetch('ph_address.json')
    .then(res => res.json())
    .then(jsonData => { data = jsonData; populateRegions(); })
    .catch(err => console.error('Failed to load JSON', err));

  const regionSelect = document.getElementById("region");
  const provinceSelect = document.getElementById("province");
  const citySelect = document.getElementById("city");
  const barangaySelect = document.getElementById("barangay");

  function populateRegions() {
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    Object.values(data).forEach(region => {
      const option = document.createElement("option");
      option.value = region.region_name;
      option.text = region.region_name;
      regionSelect.add(option);
    });
  }

  regionSelect.addEventListener('change', () => {
    populateProvinces();
    citySelect.innerHTML = '<option value="">Select City/Municipality</option>';
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
  });
  provinceSelect.addEventListener('change', () => {
    populateCities();
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
  });
  citySelect.addEventListener('change', () => populateBarangays());

  function getSelectedRegionObj() { return Object.values(data).find(r => r.region_name === regionSelect.value); }

  function populateProvinces() {
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    const selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    Object.keys(selectedRegion.province_list).forEach(provName => {
      const option = document.createElement("option");
      option.value = provName;
      option.text = provName;
      provinceSelect.add(option);
    });
  }

  function populateCities() {
    citySelect.innerHTML = '<option value="">Select City/Municipality</option>';
    const selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    const provinceObj = selectedRegion.province_list[provinceSelect.value];
    if (!provinceObj) return;
    provinceObj.municipality_list.forEach(muni => {
      const cityName = Object.keys(muni)[0];
      const option = document.createElement("option");
      option.value = cityName;
      option.text = cityName;
      citySelect.add(option);
    });
  }

  function populateBarangays() {
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    const selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    const provinceObj = selectedRegion.province_list[provinceSelect.value];
    if (!provinceObj) return;
    const muniObj = provinceObj.municipality_list.find(m => Object.keys(m)[0] === citySelect.value);
    if (!muniObj) return;
    const barangays = muniObj[citySelect.value].barangay_list;
    if (!barangays) return;
    barangays.forEach(brgy => {
      const option = document.createElement("option");
      option.value = brgy;
      option.text = brgy;
      barangaySelect.add(option);
    });
  }
})();

// ================= NATIONALITY =================
fetch("nationalities.json")
  .then(response => response.json())
  .then(list => {
    const nationalitySelect = document.getElementById("nationality");
    if (!nationalitySelect) return;
    list.forEach(nat => {
      const option = document.createElement("option");
      option.value = nat;
      option.textContent = nat;
      nationalitySelect.appendChild(option);
    });
    const otherOption = document.createElement("option");
    otherOption.value = "Other";
    otherOption.textContent = "Other";
    nationalitySelect.appendChild(otherOption);
  })
  .catch(err => console.error("Failed to load nationality list:", err));

// =============== RESTORE REGION ==================
const savedRegion = localStorage.getItem("region");
if (savedRegion) {
  const checkRegion = setInterval(() => {
    if ([...region.options].some(opt => opt.value === savedRegion)) {
      region.value = savedRegion;
      clearInterval(checkRegion);
      region.dispatchEvent(new Event("change"));
    }
  }, 100);
}

// =============== RESTORE PROVINCE ==================
const savedProvince = localStorage.getItem("province");
if (savedProvince) {
  const checkProvince = setInterval(() => {
    if ([...province.options].some(opt => opt.value === savedProvince)) {
      province.value = savedProvince;
      clearInterval(checkProvince);
      province.dispatchEvent(new Event("change"));
    }
  }, 100);
}

// =============== RESTORE CITY ==================
const savedCity = localStorage.getItem("city");
if (savedCity) {
  const checkCity = setInterval(() => {
    if ([...city.options].some(opt => opt.value === savedCity)) {
      city.value = savedCity;
      clearInterval(checkCity);
      city.dispatchEvent(new Event("change"));
    }
  }, 100);
}

// =============== RESTORE BARANGAY ==================
const savedBarangay = localStorage.getItem("barangay");
if (savedBarangay) {
  const checkBarangay = setInterval(() => {
    if ([...barangay.options].some(opt => opt.value === savedBarangay)) {
      barangay.value = savedBarangay;
      clearInterval(checkBarangay);
    }
  }, 100);
}

// Restore Nationality
const savedNationality = localStorage.getItem("nationality");
if (savedNationality) {
  const nat = document.getElementById("nationality");
  const checkNat = setInterval(() => {
    if ([...nat.options].some(opt => opt.value === savedNationality)) {
      nat.value = savedNationality;
      clearInterval(checkNat);
      nat.dispatchEvent(new Event("change"));
    }
  }, 100);
}


// ================= VALIDATION ON NEXT BUTTON =================
function showNotification(message) {
  const notif = document.getElementById('error-notif');
  notif.textContent = message;
  notif.style.display = 'block';
  notif.style.opacity = 1;
  setTimeout(() => { notif.style.opacity = 0; setTimeout(() => { notif.style.display = 'none'; }, 500); }, 4000);
}

// --- Dynamic show/hide logic for Indigenous section ---
document.addEventListener('DOMContentLoaded', () => {
  const indigenousRadios = document.querySelectorAll('input[name="indigenous"]');
  const indigenousSelect = document.getElementById('indigenousSelect');
  const indigenousOther = document.getElementById('indigenousOther');

  // Initially hide dropdown and textfield
  indigenousSelect.parentElement.style.display = "none";
  indigenousOther.parentElement.style.display = "none";

  // Show/hide dropdown when Yes/No is selected
  indigenousRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked && this.value === "Yes") {
        indigenousSelect.parentElement.style.display = "block";
      } else {
        indigenousSelect.parentElement.style.display = "none";
        indigenousOther.parentElement.style.display = "none";
        indigenousSelect.value = "N/A";
        indigenousSelect.classList.remove('error');
        indigenousOther.value = "";
        indigenousOther.classList.remove('error');
      }
    });
  });

  // Show/hide "Others" textfield if selected in dropdown
  indigenousSelect.addEventListener('change', function() {
    if (this.value === "Others") {
      indigenousOther.parentElement.style.display = "block";
    } else {
      indigenousOther.parentElement.style.display = "none";
      indigenousOther.value = "";
      indigenousOther.classList.remove('error');
    }
  });
});


/// handle next
function handleNext() {
  let error = false;
  const requiredText = ['lastName','firstName','birthdate','height','email','mobile','telephone', 'contactName','contactAddress', 'contactMobile'];
  requiredText.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.classList.add('error'); error = true; }
  });
  
  // --- SEX REQUIRED ---
  const sexGroup = document.querySelector('.radio-group');
  const sex = document.querySelector('input[name="sex"]:checked');

  if (!sex) {
    sexGroup.classList.add('error-radio-group');
    error = true;
  } else {
    sexGroup.classList.remove('error-radio-group');
  }


  const photo = document.getElementById('photoInput');
  if (!photo.files || !photo.files[0]) { document.querySelector(".photo-error").style.display = "block"; error = true; }

  // Nationality Required
  const nationality = document.getElementById('nationality');
  const otherNationality = document.getElementById('otherNationality');

  // If user has NOT selected anything
  if (nationality.value === "Select Nationality" || nationality.value.trim() === "") {
    nationality.classList.add('error');
    error = true;
  }

  // If user selected "Other", then the text input must NOT be empty
  if (nationality.value === "Other") {
    if (!otherNationality.value.trim()) {
      otherNationality.classList.add('error');
      error = true;
    }
  }

  // --- ADDRESS REQUIRED FIELDS ---
  const requiredSelects = ['region', 'province', 'city', 'barangay'];
  requiredSelects.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add('error');
      error = true;
    } else {
      el.classList.remove('error');
    }
  });

  // House No. / Street required
  const houseNo = document.getElementById('houseNo');
  if (!houseNo.value.trim()) {
    houseNo.classList.add('error');
    error = true;
  } else {
    houseNo.classList.remove('error');
  }

  // Emergency Relationship Required
  const contactRelationship = document.getElementById('contactRelationship');
  const otherRelationship = document.getElementById('otherRelationship');

  // Check dropdown
  if (!contactRelationship.value || contactRelationship.value === "Select Relationship") {
    contactRelationship.classList.add('error');
    error = true;
  } else {
  contactRelationship.classList.remove('error');
  }

  // If "Others" is selected, the text input must not be empty
  if (contactRelationship.value === "Others") {
    if (!otherRelationship.value.trim()) {
      otherRelationship.classList.add('error');
      error = true;
    } else {
      otherRelationship.classList.remove('error');
    }
  }

  // Show/hide Other Relationship field dynamically
  contactRelationship.addEventListener('change', function() {
    const otherContainer = document.getElementById('otherRelationshipContainer');

    if (this.value === "Others") {
      otherContainer.style.display = "block";
    } else {
      otherContainer.style.display = "none";

      // Clear and remove error highlight when hidden
      otherRelationship.value = "";
      otherRelationship.classList.remove('error');
    }
  });

  //first member required
  const firstMemberField = document.querySelector('.vertical-field');
  const firstMember = document.querySelector('input[name="first_member"]:checked');
  
    if (!firstMember) {
      firstMemberField.classList.add('error');
      error = true;
  } else {
       firstMemberField.classList.remove('error');
  }

  //4ps required
  const ppsField = document.getElementById('ppsField');
  const pps = document.querySelector('input[name="4ps"]:checked');

  if (!pps) {
    ppsField.classList.add('error');
    error = true;
  } else {
    ppsField.classList.remove('error');
  }
 
  // Indigenous Field
  const indigenousField = document.getElementById('indigenousField');
  const indigenousRadios = document.querySelectorAll('input[name="indigenous"]');
  const indigenousSelect = document.getElementById('indigenousSelect');
  const indigenousOther = document.getElementById('indigenousOther');

  // Initially hide dropdown and textfield
  indigenousSelect.parentElement.style.display = "none";
  indigenousOther.parentElement.style.display = "none";

  // Show/hide the dropdown when Yes/No is selected
  indigenousRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked && this.value === "Yes") {
        indigenousSelect.parentElement.style.display = "block"; // show dropdown
      } else if  (this.checked && this.value === "No") {
        indigenousSelect.parentElement.style.display = "none"; // hide dropdown
        indigenousOther.parentElement.style.display = "none"; // hide textfield
        indigenousSelect.value = "N/A"; 
        indigenousSelect.classList.remove('error');
        indigenousOther.value = ""; 
        indigenousOther.classList.remove('error');
      }
    });
  });

  // Show/hide the "Others" textfield if selected in dropdown
  indigenousSelect.addEventListener('change', function() {
    if (this.value === "Others") {
      indigenousOther.parentElement.style.display = "block";
    } else {
      indigenousOther.parentElement.style.display = "none";
      indigenousOther.value = "";
      indigenousOther.classList.remove('error');
    }
  });

  // Validation in handleNext()
  const indgns = document.querySelector('input[name="indigenous"]:checked');

  if (!indgns) {
    indigenousField.classList.add('error');
    error = true;

    // hide the dropdown and others just in case
    indigenousSelect.parentElement.style.display = "none";
    indigenousOther.parentElement.style.display = "none";

  } else {
    indigenousField.classList.remove('error');

    // Only validate dropdown if "Yes" is selected
    if (indgns.value === "Yes") {
      indigenousSelect.parentElement.style.display = "block";

      if (!indigenousSelect.value || indigenousSelect.value === "N/A") {
        indigenousSelect.classList.add('error');
        error = true;
      } else {
        indigenousSelect.classList.remove('error');

        // Only validate textfield if "Others" is selected
        if (indigenousSelect.value === "Others") {
          indigenousOther.parentElement.style.display = "block";
          if (!indigenousOther.value.trim()) {
            indigenousOther.classList.add('error');
            error = true;
          } else {
            indigenousOther.classList.remove('error');
          }
        } else {
          indigenousOther.parentElement.style.display = "none"; // hide textfield if not Others
          indigenousOther.classList.remove('error');
        }
      }
    } else {
      indigenousSelect.parentElement.style.display = "none";
      indigenousOther.parentElement.style.display = "none";
      // If "No" is selected, clear errors
      indigenousSelect.classList.remove('error');
      indigenousOther.classList.remove('error');
    }
  }

  //lgbtqia+ required
  const lgbtqiaField = document.getElementById('lgbtqiaField');
  const lgbt = document.querySelector('input[name="lgbtqia"]:checked');

  if (!lgbt) {
    lgbtqiaField.classList.add('error');
    error = true;
  } else {
    lgbtqiaField.classList.remove('error');
  }

  //person w/ disability required
  const pwdField = document.getElementById('pwdField');
  const personDis = document.querySelector('input[name="pwd"]:checked');

  if (!personDis) {
    pwdField.classList.add('error');
    error = true;
  } else {
    pwdField.classList.remove('error');
  }

  //soloparent required
  const soloField = document.getElementById('soloField');
  const solo = document.querySelector('input[name="solo_parent"]:checked');

  if (!solo) {
    soloField.classList.add('error');
    error = true;
  } else {
    soloField.classList.remove('error');
  }

  //income required
  const incomeField = document.getElementById('incomeField');
  const estimatedInc = document.querySelector('input[name="income"]:checked');

  if (!estimatedInc) {
    incomeField.classList.add('error');
    error = true;
  } else {
    incomeField.classList.remove('error');
  }

  //parents table required
  const parentsBox = document.getElementById('parentsBox');
  const parentCells = parentsBox.querySelectorAll('td[contenteditable="true"]');

  // Check if any cell is empty
  let parentsEmpty = false;
  parentCells.forEach(cell => {
    if (!cell.textContent.trim()) {
      parentsEmpty = true;
    }
  });

  // Highlight if empty
  if (parentsEmpty) {
    parentsBox.classList.add('error');
    error = true;
  } else {
    parentsBox.classList.remove('error');
  }

  //Internally Displaced Person required
  const idpField = document.getElementById('idpField');
  const idpRadios = document.querySelectorAll('input[name="idp"]');
  const idpDetailsContainer = document.getElementById('idpDetailsContainer');
  const idpDetails = document.getElementById('idpDetails');

  // Initially hide the details field
  idpDetailsContainer.style.display = "none";

  // Show/hide the details input when Yes/No is selected
  idpRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked && this.value === "Yes") {
        idpDetailsContainer.style.display = "block";
      } else if (this.checked && this.value === "No") {
        idpDetailsContainer.style.display = "none";
        idpDetails.value = "";
        idpDetails.classList.remove('error');
      }
    });
  });

  // Validation inside handleNext()
  const idpChecked = document.querySelector('input[name="idp"]:checked');

  if (!idpChecked) {
    idpField.classList.add('error');
    error = true;

    // Hide details just in case
    idpDetailsContainer.style.display = "none";

  } else {
    idpField.classList.remove('error');

    if (idpChecked.value === "Yes") {
      idpDetailsContainer.style.display = "block";

      if (!idpDetails.value.trim()) {
        idpDetails.classList.add('error');
        error = true;
      } else {
        idpDetails.classList.remove('error');
      }
    } else {
      idpDetailsContainer.style.display = "none";
      idpDetails.classList.remove('error');
    }
  }

  // --- SIBLINGS VALIDATION ---
const hasSiblings = document.querySelector('input[name="hasSiblings"]:checked');
const summaryTable = document.querySelector('.siblings-summary-table');

let siblingsError = false;

// 1. Radio not selected
if (!hasSiblings) {
  siblingsError = true;
}

// 2. If YES → sibling must be added to summary
if (hasSiblings && hasSiblings.value === "yes") {

  // A. Check if summary table has REAL sibling data
  const dataRows = summaryTable.querySelectorAll("tr:not(.header-row):not(.no-siblings-text)");
  const summaryHasData = dataRows.length > 0;

  if (!summaryHasData) {
    siblingsError = true;
  }

  // B. Check if editable row is still filled (meaning user typed but didn’t click “Add”)
  const inputRow = document.getElementById('siblingsTable').rows[1];
  const cells = Array.from(inputRow.cells).slice(0,5);
  let rowHasText = false;

  cells.forEach(cell => {
    const select = cell.querySelector("select");
    if (select && select.value.trim() !== "") rowHasText = true;
    if (!select && cell.textContent.trim() !== "") rowHasText = true;
  });

  // If user typed something but did not click "Add", block Next
  if (rowHasText && !summaryHasData) {
    siblingsError = true;
  }
}

// APPLY ERROR HIGHLIGHT
if (siblingsError) {
  siblingsField.classList.add("error");
  addSiblingBox.classList.add("error");

  error = true;   // 🔥 MOST IMPORTANT — TRIGGERS YOUR STOP
} else {
  siblingsField.classList.remove("error");
  addSiblingBox.classList.remove("error");
}

  if (error) { showNotification("Please complete all required fields before proceeding."); window.scrollTo({top:0, behavior:"smooth"}); return; }

  window.location.href = "educattach.html";
}


// Show/Hide Other Nationality field based on dropdown selection
document.getElementById('nationality').addEventListener('change', function() {
  const otherContainer = document.getElementById('otherNationalityContainer');

  if (this.value === "Other") {
    otherContainer.style.display = "block";
  } else {
    otherContainer.style.display = "none";

    // Clear and remove error highlight when hidden
    document.getElementById('otherNationality').value = "";
    document.getElementById('otherNationality').classList.remove('error');
  }
});

// ====================== SAVE PROGRESS SYSTEM ======================

// Save radio groups
function saveRadio(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  if (selected) {
    localStorage.setItem(name, selected.value ?? "Yes");
  }
}

function loadRadio(name) {
  const saved = localStorage.getItem(name);
  if (!saved) return;

  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach(r => {
    if ((r.value || r.nextSibling.textContent.trim()) === saved) {
      r.checked = true;
    }
  });
}

// Save text inputs
function saveInput(id) {
  const el = document.getElementById(id);
  if (el) localStorage.setItem(id, el.value);
}

function loadInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const saved = localStorage.getItem(id);
  if (saved) el.value = saved;
}

// Save contenteditable table cells
function saveTable(tableId, storageKey) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = [...table.querySelectorAll("tr")].map(row =>
    [...row.children].map(cell =>
      cell.contentEditable === "true" ? cell.innerText.trim() : null
    )
  );

  localStorage.setItem(storageKey, JSON.stringify(rows));
}

function loadTable(tableId, storageKey) {
  const table = document.getElementById(tableId);
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (!table || !saved.length) return;

  const rows = table.querySelectorAll("tr");
  saved.forEach((row, rIndex) => {
    row.forEach((cellValue, cIndex) => {
      if (cellValue !== null && rows[rIndex] && rows[rIndex].children[cIndex]) {
        rows[rIndex].children[cIndex].innerText = cellValue;
      }
    });
  });
}

// ========================= SAVE PROGRESS =========================

// Save INPUT and SELECT fields automatically
const autoSaveFields = [
  "lastName","firstName","birthdate","height","email","mobile","telephone",
  "nationality","otherNationality",
  "region","province","city","barangay","houseNo",
  "contactName","contactAddress","contactMobile",
  "contactRelationship","otherRelationship"
];

// Attach auto-save listeners
autoSaveFields.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => {
      localStorage.setItem(id, el.value);
    });
    el.addEventListener("change", () => {
      localStorage.setItem(id, el.value);
    });
  }
});

// Restore saved values
autoSaveFields.forEach(id => {
  const el = document.getElementById(id);
  if (el && localStorage.getItem(id)) {
    el.value = localStorage.getItem(id);
  }
});


// ========================= SAVE SEX RADIO =========================
document.querySelectorAll('input[name="sex"]').forEach(radio => {
  radio.addEventListener("change", () => {
    localStorage.setItem("sex", radio.value);
  });
});

// Restore SEX
const savedSex = localStorage.getItem("sex");
if (savedSex) {
  const radio = document.querySelector(`input[name="sex"][value="${savedSex}"]`);
  if (radio) radio.checked = true;
}


// ========================= SAVE CONTACT RELATIONSHIP =========================
document.getElementById("contactRelationship").addEventListener("change", function () {
  localStorage.setItem("contactRelationship", this.value);
});

// Restore contact relationship
const savedRel = localStorage.getItem("contactRelationship");
if (savedRel) {
  document.getElementById("contactRelationship").value = savedRel;
}


// ========================= SAVE PHOTO =========================
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const photoStatus = document.getElementById("photoStatus");

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem("savedPhoto", e.target.result);
    photoPreview.style.backgroundImage = `url('${e.target.result}')`;
    photoStatus.textContent = file.name;
  };
  reader.readAsDataURL(file);
});

// Restore photo
const savedPhoto = localStorage.getItem("savedPhoto");
if (savedPhoto) {
  photoPreview.style.backgroundImage = `url('${savedPhoto}')`;
  photoStatus.textContent = "Saved Photo Loaded";
}


// ========================= ADDRESS SELECTION SAVE =========================
["region","province","city","barangay"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("change", () => {
      localStorage.setItem(id, el.value);
    });
  }
});

// ====================== SAVE ON CHANGE ======================

// RADIO GROUPS
[
  "first_member", "4ps", "indigenous",
  "lgbtqia", "idp", "pwd",
  "solo_parent", "income", "hasSiblings"
].forEach(name => {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach(radio => {
    radio.addEventListener("change", () => saveRadio(name));
  });
});

// TEXT FIELDS
["indigenousOther", "idpDetails"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => saveInput(id));
  }
});

// TABLES (Parents + Siblings)
["parentsBox", "siblingsTable"].forEach(tableId => {
  const table = document.getElementById(tableId);
  if (table) {
    table.addEventListener("input", () => {
      if (tableId === "parentsBox") saveTable("parentsBox", "parentsData");
      if (tableId === "siblingsTable") saveTable("siblingsTable", "siblingsData");
    });
  }
});

// ====================== LOAD ALL SAVED DATA ======================

window.addEventListener("DOMContentLoaded", () => {
  // Load radio answers
  [
    "first_member", "4ps", "indigenous", "lgbtqia",
    "idp", "pwd", "solo_parent", "income", "hasSiblings"
  ].forEach(loadRadio);

  // Load text answers
  ["indigenousOther", "idpDetails"].forEach(loadInput);

  // Load tables
  loadTable("parentsBox", "parentsData");
  loadTable("siblingsTable", "siblingsData");
});

// =====================================================
// STEP NAVIGATION — FIXED & UNIFIED
// =====================================================

// 1️⃣ Page → Step index map
const pageMap = [
  "index.html",
  "readfirst.html",
  "confirmation.html",
  "aap.html",
  "personal.html",
  "educattach.html",
  "programs.html",
  "form.html",
  "submit.html"
];

// 2️⃣ Detect CURRENT PAGE  ← PLACE IT HERE
let currentPage = window.location.pathname.split("/").pop().toLowerCase();
if (!currentPage) currentPage = "index.html";

// 3️⃣ Convert page → step index
let currentStep = pageMap.indexOf(currentPage);

// 4️⃣ Load saved progress
let maxUnlockedStep = parseInt(localStorage.getItem("maxUnlockedStep")) || 0;

// 5️⃣ Update unlocked step
if (currentStep > maxUnlockedStep) {
  maxUnlockedStep = currentStep;
  localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
}

const steps = document.querySelectorAll(".step");

// 6️⃣ Apply UI states
steps.forEach((step, index) => {
  if (index === currentStep) {
    step.classList.add("active");
  }

  if (index <= maxUnlockedStep) {
    step.classList.add("unlocked");
    step.style.cursor = "pointer";

    step.querySelectorAll("*").forEach(el => el.style.pointerEvents = "none");

    step.addEventListener("click", () => {
      localStorage.setItem("maxUnlockedStep", Math.max(maxUnlockedStep, index));
      window.location.href = pageMap[index];
    });
  }
});

// =====================================================
// ADD THIS CODE TO THE END OF YOUR personal.js FILE
// =====================================================

// ==================== FIX INCOME RADIO AUTO-SAVE ====================
function saveIncomeRadio() {
  const selected = document.querySelector('input[name="income"]:checked');
  if (!selected) return;
  
  // Get the label text next to the radio button
  const label = selected.parentElement.textContent.trim();
  localStorage.setItem("income", label);
  console.log("✅ Income saved:", label);
}

function loadIncomeRadio() {
  const saved = localStorage.getItem("income");
  if (!saved) return;
  
  console.log("🔄 Loading income:", saved);
  
  const incomeRadios = document.querySelectorAll('input[name="income"]');
  
  incomeRadios.forEach(radio => {
    const label = radio.parentElement.textContent.trim();
    
    if (label === saved) {
      radio.checked = true;
      console.log("✅ Income restored:", label);
    }
  });
}

// Attach save listeners to income radios
document.addEventListener("DOMContentLoaded", () => {
  const incomeRadios = document.querySelectorAll('input[name="income"]');
  
  incomeRadios.forEach(radio => {
    radio.addEventListener("change", saveIncomeRadio);
  });

  // Restore saved income on page load
  loadIncomeRadio();
});


// ==================== FIX SIBLINGS YES/NO AUTO-SAVE ====================

function applySiblingsVisibility(choice) {
  const header = document.getElementById("addSiblingHeader");
  const box = document.getElementById("addSiblingBox");
  const summaryHeader = document.getElementById("summaryHeader");
  const summaryBox = document.getElementById("summaryBox");

  if (choice === "Yes") {
    header.style.display = "block";
    box.style.display = "block";
    summaryHeader.style.display = "block";
    summaryBox.style.display = "block";
  } else {
    header.style.display = "none";
    box.style.display = "none";
    summaryHeader.style.display = "block"; // still show summary
    summaryBox.style.display = "block";
  }
}

// ==========================
// YES/NO SAVE
// ==========================

function saveSiblingsChoice() {
  const selected = document.querySelector('input[name="hasSiblings"]:checked');
  if (!selected) return;

  const choice = selected.id === "hasSiblingsYes" ? "Yes" : "No";
  localStorage.setItem("hasSiblings", choice);
  console.log("Saved YES/NO:", choice);

  applySiblingsVisibility(choice);
}

function loadSiblingsChoice() {
  const saved = localStorage.getItem("hasSiblings");

  if (saved === "Yes") {
    document.getElementById("hasSiblingsYes").checked = true;
    applySiblingsVisibility("Yes");
  } else if (saved === "No") {
    document.getElementById("hasSiblingsNo").checked = true;
    applySiblingsVisibility("No");
  }
}

// ==========================
// SUMMARY SAVE/LOAD
// ==========================

function saveSiblingsSummary() {
  const table = document.querySelector(".siblings-summary-table");
  const rows = [];

  table.querySelectorAll("tr").forEach((row, index) => {
    if (index === 0) return; // skip header

    if (row.querySelector(".no-siblings-text")) return;

    const cells = row.querySelectorAll("td");
    rows.push({
      fullname: cells[1].innerText,
      age: cells[2].innerText,
      education: cells[3].innerText,
      school: cells[4].innerText,
      year: cells[5].innerText
    });
  });

  localStorage.setItem("siblingsSummary", JSON.stringify(rows));
  console.log("Saved summary:", rows);
}

function loadSiblingsSummary() {
  const saved = localStorage.getItem("siblingsSummary");
  if (!saved) return;

  const data = JSON.parse(saved);
  const table = document.querySelector(".siblings-summary-table");

  // Remove ALL rows except header
  const rows = table.querySelectorAll("tr:not(:first-child)");
  rows.forEach(r => r.remove());

  if (data.length === 0) {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 7;
    cell.className = "no-siblings-text";
    cell.innerText = "**No siblings**";
    return;
  }

  data.forEach((sibling, i) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${sibling.fullname}</td>
      <td>${sibling.age}</td>
      <td>${sibling.education}</td>
      <td>${sibling.school}</td>
      <td>${sibling.year}</td>
      <td><button class="remove-summary-btn" onclick="removeSummaryRow(this)">X</button></td>
    `;
  });
}

// ==========================
// ADD SIBLING
// ==========================

window.addSiblingToSummary = function () {
  const inputRow = document.getElementById("siblingsTable").rows[1];

  const fullname = inputRow.cells[0].innerText.trim();
  const age = inputRow.cells[1].innerText.trim();
  const education = inputRow.cells[2].querySelector("select").value.trim();
  const school = inputRow.cells[3].innerText.trim();
  const year = inputRow.cells[4].innerText.trim();

  let valid = true;

  function highlight(cell, condition) {
    if (condition) {
      cell.classList.add("error");
      valid = false;
    } else {
      cell.classList.remove("error");
    }
  }

  highlight(inputRow.cells[0], fullname === "");
  highlight(inputRow.cells[1], age === "");
  highlight(inputRow.cells[2], education === "");
  highlight(inputRow.cells[3], school === "");
  highlight(inputRow.cells[4], year === "");

  if (!valid) return;

  const table = document.querySelector(".siblings-summary-table");

  // Remove "no siblings"
  const noRow = table.querySelector(".no-siblings-text");
  if (noRow) noRow.closest("tr").remove();

  const newRow = table.insertRow();
  const nextNum = table.rows.length - 1;

  newRow.innerHTML = `
    <td>${nextNum}</td>
    <td>${fullname}</td>
    <td>${age}</td>
    <td>${education}</td>
    <td>${school}</td>
    <td>${year}</td>
    <td><button class="remove-summary-btn" onclick="removeSummaryRow(this)">X</button></td>
  `;

  inputRow.cells[0].innerText = "";
  inputRow.cells[1].innerText = "";
  inputRow.cells[2].querySelector("select").value = "";
  inputRow.cells[3].innerText = "";
  inputRow.cells[4].innerText = "";

  saveSiblingsSummary();
};

// ==========================
// REMOVE ROW
// ==========================

window.removeSummaryRow = function (btn) {
  const table = document.querySelector(".siblings-summary-table");
  btn.closest("tr").remove();

  // Renumber
  const rows = table.querySelectorAll("tr:not(:first-child)");
  if (rows.length === 0) {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 7;
    cell.className = "no-siblings-text";
    cell.innerText = "**No siblings**";
  } else {
    rows.forEach((r, i) => (r.cells[0].innerText = i + 1));
  }

  saveSiblingsSummary();
};

// ==========================
// INITIALIZE
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  loadSiblingsChoice();
  loadSiblingsSummary();

  document.querySelectorAll('input[name="hasSiblings"]').forEach(r => {
    r.addEventListener("change", saveSiblingsChoice);
  });
});


// ==================== DEBUG CONSOLE ====================
window.addEventListener("DOMContentLoaded", () => {
  console.log("=== 📊 AUTO-SAVE STATUS ===");
  console.log("Income:", localStorage.getItem("income"));
  console.log("Has Siblings:", localStorage.getItem("hasSiblings"));
  console.log("Siblings Summary:", localStorage.getItem("siblingsSummary"));
});