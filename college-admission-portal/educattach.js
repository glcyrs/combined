const downloads = [
  'assets/grades_form_1.pdf',
  'assets/grades_form_2.pdf'
];

document.querySelectorAll('.grade-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = downloads[index];
    link.download = downloads[index].split('/').pop();
    link.click();
  });
});

// ====== Map pages to step index ======
const pageToStep = {
  "index.html": 0,
  "readfirst.html": 1,
  "confirmation.html": 2,
  "aap.html": 3,
  "personal.html": 4,
  "educattach.html": 5,
  "programs.html": 6,
  "form.html": 7,
  "submit.html": 8,
};

const currentPage = window.location.pathname.split("/").pop();
let savedStep = parseInt(localStorage.getItem("currentStep"));
let currentStep = pageToStep[currentPage] !== undefined ? pageToStep[currentPage] : (savedStep || 5);
let storedMax = parseInt(localStorage.getItem("maxUnlockedStep"));
let maxUnlockedStep = (storedMax !== null && !isNaN(storedMax)) ? storedMax : currentStep;

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");

  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
      if (index <= maxUnlockedStep) {
        step.classList.add("clickable");
        step.style.pointerEvents = "auto";
        step.style.opacity = "1";
      } else {
        step.classList.remove("clickable");
        step.style.pointerEvents = "none";
        step.style.opacity = "1";
      }
    });
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
  }

  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index > maxUnlockedStep) return;
      currentStep = index;
      if (currentStep === maxUnlockedStep && maxUnlockedStep < steps.length - 1) {
        maxUnlockedStep++;
      }
      updateSteps();
      if (typeof showSection === "function") showSection(currentStep);
      switch (index) {
        case 0: window.location.href = "index.html"; break;
        case 1: window.location.href = "readfirst.html"; break;
        case 2: window.location.href = "confirmation.html"; break;
        case 3: window.location.href = "aap.html"; break;
        case 4: window.location.href = "personal.html"; break;
        case 5: window.location.href = "educattach.html"; break;
        case 6: window.location.href = "programs.html"; break;
        case 7: window.location.href = "form.html"; break;
        case 8: window.location.href = "submit.html"; break;
      }
    });
  });

  updateSteps();
});

// =====================================================
// FILE STORAGE
// =====================================================
let uploadedFiles = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null
};

// =====================================================
// HANDLE FILE UPLOAD
// =====================================================
function handleFileUpload(num, label) {
  const input = document.getElementById(`file${num}`);
  const status = document.getElementById(`status${num}`);
  const file = input && input.files ? input.files[0] : null;

  if (file) {
    const type = label || (input && input.dataset && input.dataset.type) || "Required";
    uploadedFiles[num] = { file, type };

    if (status) {
      status.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color:#28a745;"></i>
        ${escapeHtml(file.name)}
      `;
    }

    const uploadBox = input ? input.closest(".upload-controls") : null;
    if (uploadBox) uploadBox.classList.remove("input-error");

    if (uploadBox) {
      const requiredInside = uploadBox.querySelectorAll(".form-input.input-error");
      requiredInside.forEach(el => el.classList.remove("input-error"));
    }

    localStorage.setItem(`file-${num}-data`, JSON.stringify({
      file: { name: file.name, size: file.size },
      type
    }));

    updateFileList();
  }
}

// =====================================================
// UPDATE FILE LIST TABLE
// =====================================================
function updateFileList() {
  const tableBody = document.getElementById("fileTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  let noFiles = true;

  Object.keys(uploadedFiles).forEach(key => {
    const slot = uploadedFiles[key];
    if (!slot) return;

    noFiles = false;
    const { file, type } = slot;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(key)}</td>
      <td>${escapeHtml(type)}</td>
      <td>${escapeHtml(file.name)}</td>
      <td>${(file.size / 1024).toFixed(1)} KB</td>
      <td style="text-align:center;">
        <i class="fa-solid fa-circle-check" style="color:#28a745;"></i>
      </td>
    `;
    tableBody.appendChild(row);
  });

  if (noFiles) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <div class="empty-text">No Attached files</div>
          </div>
        </td>
      </tr>
    `;
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// =====================================================
// NOTIFICATION/ALERT SYSTEM
// =====================================================
function showNotification(message) {
  let noti = document.getElementById("notification");
  let notiText;

  if (!noti) {
    noti = document.createElement("div");
    noti.id = "notification";

    noti.style.position = "fixed";
    noti.style.right = "20px";
    noti.style.top = "20px";
    noti.style.zIndex = "9999";
    noti.style.display = "flex";
    noti.style.alignItems = "center";
    noti.style.padding = "12px 16px";
    noti.style.borderRadius = "8px";
    noti.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
    noti.style.fontSize = "15px";
    noti.style.fontWeight = "500";
    noti.style.background = "#ffe3e3";
    noti.style.color = "#c20000";

    notiText = document.createElement("div");
    notiText.id = "notification-text";

    noti.appendChild(notiText);
    document.body.appendChild(noti);
  } else {
    notiText = document.getElementById("notification-text");
  }

  notiText.innerText = message;
  noti.style.background = "#ffe3e3";
  noti.style.border = "1px solid #ff9b9b";
  noti.style.color = "#c20000";
  noti.style.display = "flex";

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (noti._hideTimeout) clearTimeout(noti._hideTimeout);

  noti._hideTimeout = setTimeout(() => {
    noti.style.display = "none";
  }, 4000);
}

// =====================================================
// REMOVE FILE
// =====================================================
window.removeFile = function (fileNumber) {
  const confirmBox = document.getElementById("confirmBox");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  const doRemove = () => {
    uploadedFiles[fileNumber] = null;
    const input = document.getElementById(`file${fileNumber}`);
    if (input) input.value = "";
    const status = document.getElementById(`status${fileNumber}`);
    if (status) status.textContent = "No file chosen";

    if (input) {
      const uploadBox = input.closest(".upload-controls");
      if (uploadBox) uploadBox.classList.add("input-error");
    }

    localStorage.removeItem(`file-${fileNumber}-data`);
    updateFileList();
    showNotification("File removed. Please upload a file for this slot.", "error");
  };

  if (confirmBox && confirmYes && confirmNo) {
    confirmBox.style.display = "flex";
    confirmYes.onclick = () => {
      doRemove();
      confirmBox.style.display = "none";
    };
    confirmNo.onclick = () => confirmBox.style.display = "none";
  } else {
    doRemove();
  }
};

// =====================================================
// SYNC GRADES TO GRADESDATA FORMAT
// =====================================================
function syncGradesToGradesData() {
  const gradesData = {
    // Junior High School Grades (Grade 10)
    englishGrade10: document.querySelector('input[name="jhsEnglish"]')?.value || '',
    mathGrade10: document.querySelector('input[name="jhsMath"]')?.value || '',
    scienceGrade10: document.querySelector('input[name="jhsScience"]')?.value || '',
    
    // Senior High School Grade 11 - First Semester
    englishGrade11_1st: document.querySelector('input[name="g11EnglishGrade1"]')?.value || '',
    mathGrade11_1st: document.querySelector('input[name="g11MathGrade1"]')?.value || '',
    scienceGrade11_1st: document.querySelector('input[name="g11ScienceGrade1"]')?.value || '',
    
    // Senior High School Grade 11 - Second Semester
    englishGrade11_2nd: document.querySelector('input[name="g11EnglishGrade2"]')?.value || '',
    mathGrade11_2nd: document.querySelector('input[name="g11MathGrade2"]')?.value || '',
    scienceGrade11_2nd: document.querySelector('input[name="g11ScienceGrade2"]')?.value || '',
    
    // Store alternative subjects if selected
    mathAlt1: document.querySelector('select[name="g11MathAlt1"]')?.value || '',
    mathAlt2: document.querySelector('select[name="g11MathAlt2"]')?.value || '',
    scienceAlt1: document.querySelector('select[name="g11ScienceAlt1"]')?.value || '',
    scienceAlt2: document.querySelector('select[name="g11ScienceAlt2"]')?.value || '',
    englishAlt1: document.querySelector('select[name="g11EnglishAlt1"]')?.value || ''
  };

  localStorage.setItem('gradesData', JSON.stringify(gradesData));
  console.log('✅ Grades synced to gradesData format:', gradesData);
}

// =====================================================
// FORM VALIDATION & NEXT BUTTON
// =====================================================
(function setupNextButton() {
  const nextBtn = document.querySelector(".next-btn");
  if (!nextBtn) return;

  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const requiredInputs = document.querySelectorAll(".form-input[required]");
    let isValid = true;

    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    requiredInputs.forEach(input => {
      if (!input.value || !input.value.trim()) {
        input.classList.add("input-error");
        isValid = false;
      }
    });

    Object.keys(uploadedFiles).forEach(key => {
      if (!uploadedFiles[key]) {
        const fileInput = document.getElementById(`file${key}`);
        if (fileInput) {
          const uploadBox = fileInput.closest(".upload-controls");
          if (uploadBox) uploadBox.classList.add("input-error");
        }
        isValid = false;
      } else {
        const fileInput = document.getElementById(`file${key}`);
        if (fileInput) {
          const uploadBox = fileInput.closest(".upload-controls");
          if (uploadBox) uploadBox.classList.remove("input-error");
        }
      }
    });

    const gradeInputsJHS = document.querySelectorAll('.grades-table input[type="number"]');
    let hasEmptyGrades = false;
    gradeInputsJHS.forEach(input => {
      if (!input.value || input.value.trim() === "" || input.value === "0") {
        input.classList.add("input-error");
        hasEmptyGrades = true;
        isValid = false;
      }
    });
    
    if (hasEmptyGrades) {
      const content1Box = document.querySelector('.content1');
      if (content1Box) content1Box.classList.add("input-error");
    }

    const gradeInputsSHS = document.querySelectorAll('.grades-table2 input[type="number"]');
    const gradeSelects = document.querySelectorAll('.grades-table2 select');
    let hasEmptySHSGrades = false;

    gradeInputsSHS.forEach(input => {
      const row = input.closest('tr');
      const naCheckbox = row ? row.querySelector('input[type="checkbox"]') : null;
      
      if (naCheckbox && naCheckbox.checked) {
        return;
      }
      
      if (!input.value || input.value.trim() === "" || input.value === "0") {
        input.classList.add("input-error");
        hasEmptySHSGrades = true;
        isValid = false;
      }
    });

    gradeSelects.forEach(select => {
      const row = select.closest('tr');
      const naCheckbox = row ? row.querySelector('input[type="checkbox"]') : null;
      
      if (naCheckbox && naCheckbox.checked) {
        return;
      }
    });

    if (hasEmptySHSGrades) {
      const content2Boxes = document.querySelectorAll('.content2');
      content2Boxes.forEach(box => {
        if (box.querySelector('.grades-table2')) {
          box.classList.add("input-error");
        }
      });
    }

    if (!isValid) {
      Object.keys(uploadedFiles).forEach(key => {
        if (!uploadedFiles[key]) {
          const st = document.getElementById(`status${key}`);
          if (st) {
            st.innerHTML = `
              <i class="fa-solid fa-circle-xmark" style="color:#dc3545;"></i> Missing file
            `;
          }
        }
      });

      showNotification("Please fill out all required fields, complete all grades, and upload all attachments!", "error");
      return;
    }

    // ============================================
    // 🔥 SAVE EDUCATION & GRADES DATA BEFORE NAVIGATION
    // ============================================

    const seniorHighSchoolField = document.querySelector('input#seniorHighSchool');
    const trackField = document.querySelector('select[name="track"]');
    const strandField = document.querySelector('select[name="strand"]');
    const specializationField = document.querySelector('input[name="specialization"]');

    const educationData = {
      seniorHighSchool: seniorHighSchoolField?.value.toUpperCase() || '',
      track: trackField?.value || '',
      strand: strandField?.value || '',
      specialization: specializationField?.value || 'N/A',
      jhsYear: document.querySelector('input[name="jhsCompletionYear"]')?.value || '',
      shsYear: document.querySelector('input[name="shsCompletionYear"]')?.value || ''
    };

    const gradesData = {
      // Junior High School Grades (Grade 10)
      englishGrade10: document.querySelector('input[name="jhsEnglish"]')?.value || '',
      mathGrade10: document.querySelector('input[name="jhsMath"]')?.value || '',
      scienceGrade10: document.querySelector('input[name="jhsScience"]')?.value || '',
      
      // Senior High School Grade 11 - First Semester
      englishGrade11_1st: document.querySelector('input[name="g11EnglishGrade1"]')?.value || '',
      mathGrade11_1st: document.querySelector('input[name="g11MathGrade1"]')?.value || '',
      scienceGrade11_1st: document.querySelector('input[name="g11ScienceGrade1"]')?.value || '',
      
      // Senior High School Grade 11 - Second Semester
      englishGrade11_2nd: document.querySelector('input[name="g11EnglishGrade2"]')?.value || '',
      mathGrade11_2nd: document.querySelector('input[name="g11MathGrade2"]')?.value || '',
      scienceGrade11_2nd: document.querySelector('input[name="g11ScienceGrade2"]')?.value || '',
      
      // Store alternative subjects if selected
      mathAlt1: document.querySelector('select[name="g11MathAlt1"]')?.value || '',
      mathAlt2: document.querySelector('select[name="g11MathAlt2"]')?.value || '',
      scienceAlt1: document.querySelector('select[name="g11ScienceAlt1"]')?.value || '',
      scienceAlt2: document.querySelector('select[name="g11ScienceAlt2"]')?.value || '',
      englishAlt1: document.querySelector('select[name="g11EnglishAlt1"]')?.value || ''
    };

    localStorage.setItem('educationData', JSON.stringify(educationData));
    localStorage.setItem('gradesData', JSON.stringify(gradesData));

    console.log('✅ Education data saved:', educationData);
    console.log('✅ Grades data saved:', gradesData);

    window.location.href = "programs.html";
  });
})();

// =====================================================
// RESTORE & SAVE ALL PROGRESS
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

  function checkContainerHighlight(container, inputs) {
    const empty = Array.from(inputs).some(input => !input.value || input.value.trim() === "" || input.value === "0");
    if (!empty && container) container.classList.remove("input-error");
  }

  const jhsInputs = document.querySelectorAll('.grades-table input[type="number"]');
  const content1Box = document.querySelector('.content1');

  jhsInputs.forEach(input => {
    const saved = localStorage.getItem(`jhs-${input.name}`);
    if (saved) input.value = saved;

    if (input.value && input.value.trim() !== "" && input.value !== "0") {
      input.classList.remove("input-error");
    }

    input.addEventListener("input", () => {
      localStorage.setItem(`jhs-${input.name}`, input.value);
      input.classList.remove("input-error");
      checkContainerHighlight(content1Box, jhsInputs);
      syncGradesToGradesData(); // 🔥 Sync to gradesData format
    });
  });


  //  SCHOOL TYPE CODE  
  const schoolTypeRadios = document.querySelectorAll('input[name="schoolType"]');

// Load saved school type on page load
const savedSchoolType = localStorage.getItem('edu-schoolType');
schoolTypeRadios.forEach(radio => {
  if (savedSchoolType && radio.value === savedSchoolType) {
    radio.checked = true;
  }
  
  // Save school type when changed
  radio.addEventListener('change', () => {
    if (radio.checked) {
      localStorage.setItem('edu-schoolType', radio.value);
      console.log('✅ School type saved:', radio.value);
    }
  });
});
  //  END OF SCHOOL TYPE CODE 


  const shsInputs = document.querySelectorAll('.grades-table2 input[type="number"]');
  const shsSelects = document.querySelectorAll('.grades-table2 select');

  shsInputs.forEach(input => {
    const saved = localStorage.getItem(`shs-${input.name}`);
    if (saved) input.value = saved;

    input.addEventListener("input", () => {
      localStorage.setItem(`shs-${input.name}`, input.value);
      input.classList.remove("input-error");

      const content2Box = input.closest('.content2');
      const rows = content2Box.querySelectorAll('tr');
      let empty = false;
      rows.forEach(row => {
        const na = row.querySelector('input[type="checkbox"]');
        const val = row.querySelector('input[type="number"]');
        if (val && (!val.value || val.value.trim() === "" || val.value === "0") && !(na && na.checked)) {
          empty = true;
        }
      });
      if (!empty) content2Box.classList.remove("input-error");
      syncGradesToGradesData(); // 🔥 Sync to gradesData format
    });
  });

  shsSelects.forEach(select => {
    const saved = localStorage.getItem(`shs-${select.name}`);
    if (saved) select.value = saved;

    select.addEventListener("change", () => {
      localStorage.setItem(`shs-${select.name}`, select.value);
      syncGradesToGradesData(); // 🔥 Sync to gradesData format
    });
  });

  Object.keys(uploadedFiles).forEach(key => {
    const saved = localStorage.getItem(`file-${key}-data`);
    if (saved) {
      const data = JSON.parse(saved);
      uploadedFiles[key] = data;

      const status = document.getElementById(`status${key}`);
      if (status) {
        status.innerHTML = `
          <i class="fa-solid fa-circle-check" style="color:#28a745;"></i>
          ${data.file.name}
        `;
      }

      const input = document.getElementById(`file${key}`);
      if (input) {
        const uploadBox = input.closest(".upload-controls");
        if (uploadBox) uploadBox.classList.remove("input-error");
      }
    }
  });

  updateFileList();

  const eduFields = document.querySelectorAll('.container2 input, .container2 select, .container2 textarea');
  eduFields.forEach(field => {
    const saved = localStorage.getItem(`edu-${field.name}`);
    if (saved !== null) {
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = saved === "true";
      } else {
        field.value = saved;
      }
      field.classList.remove("input-error");
    }

    field.addEventListener("change", () => {
      if (field.type === "checkbox" || field.type === "radio") {
        localStorage.setItem(`edu-${field.name}`, field.checked);
      } else {
        localStorage.setItem(`edu-${field.name}`, field.value);
      }
      field.classList.remove("input-error");
    });
  });

  // 🔥 Initial sync on page load
  syncGradesToGradesData();
});

updateFileList();