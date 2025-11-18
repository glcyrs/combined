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

// Mapping programs to their available campuses
document.addEventListener("DOMContentLoaded", () => {
  const allCampuses = [
    "Alangilan","Pablo Borbon","Malvar","Nasugbu","Lipa","San Juan","Aboitiz Lima","Lobo","Lemery","Rosario","Balayan","Mabini"
  ];

  const programCampuses = {
    "BS Agriculture - Animal Science": ["Lobo"],
    "BS Agriculture - Crop Science": ["Lobo"],
    "BS Forestry": ["Lobo"],
    "BS Architecture": ["Alangilan"],
    "BS Criminology": ["Pablo Borbon","Malvar","Nasugbu"],
    "BS Aerospace Engineering": ["Aboitiz Lima"],
    "BS Automotive Engineering": ["Aboitiz Lima"],
    "BS Biomedical Engineering": ["Aboitiz Lima"],
    "BS Ceramics Engineering": ["Alangilan"],
    "BS Chemical Engineering": ["Alangilan"],
    "BS Civil Engineering": ["Alangilan"],
    "BS Computer Engineering": ["Alangilan"],
    "BS Electrical Engineering": ["Alangilan"],
    "BS Electronics Engineering": ["Alangilan"],
    "BS Food Engineering": ["Aboitiz Lima"],
    "BS Geodetic Engineering": ["Alangilan"],
    "BS Geological Engineering": ["Alangilan"],
    "BS Industrial Engineering": ["Alangilan"],
    "BS Instrumentation and Control Engineering": ["Aboitiz Lima"],
    "BS Mechanical Engineering": ["Alangilan"],
    "BS Mechatronics Engineering": ["Aboitiz Lima"],
    "BS Metallurgical Engineering": ["Alangilan"],
    "BS Naval Architecture and Marine Engineering": ["Alangilan"],
    "BS Sanitary Engineering": ["Alangilan"],
    "Bachelor of Automotive Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Civil Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Computer Engineering Technology": ["Malvar","Lipa","Balayan","Aboitiz Lima"],
    "Bachelor of Drafting Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Electrical Engineering Technology": ["Malvar","Lipa","Balayan","Aboitiz Lima"],
    "Bachelor of Electronics Engineering Technology": ["Malvar","Lipa","Balayan","Aboitiz Lima"],
    "Bachelor of Food Engineering Technology": ["Alangilan","Malvar"],
    "Bachelor of Instrumentation and Control Engineering Technology": ["Alangilan","Lipa","Balayan"],
    "Bachelor of Mechanical Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Mechatronics Engineering Technology": ["Alangilan","Malvar"],
    "Bachelor of Welding and Fabrication Engineering Technology": ["Alangilan"],
    "BS Computer Science": ["Alangilan"],
    "BS Information Technology": ["Alangilan","Malvar","Nasugbu","Lipa","Balayan","Mabini"],
    "BS Nursing": ["Pablo Borbon","Nasugbu"],
    "BS Public Health - Disaster Response": ["Pablo Borbon"],
    "Bachelor of Early Childhood Education": ["Pablo Borbon"],
    "Bachelor of Elementary Education": ["Pablo Borbon","Malvar","Nasugbu","Rosario"],
    "Bachelor of Physical Education": ["Pablo Borbon","Malvar","Nasugbu","Lipa","San Juan","Rosario"],
    "Bachelor of Secondary Education - English": ["Pablo Borbon","Malvar","Nasugbu","Lipa","San Juan","Rosario"],
    "Bachelor of Secondary Education - Filipino": ["Pablo Borbon","Malvar","Nasugbu","San Juan"],
    "Bachelor of Secondary Education - Mathematics": ["Pablo Borbon","Malvar","Nasugbu","Lipa","Rosario"],
    "Bachelor of Secondary Education - Sciences": ["Pablo Borbon","Malvar","Nasugbu","Lipa"],
    "Bachelor of Secondary Education - Social Studies": ["Pablo Borbon","Malvar","Nasugbu","Lemery"],
    "Bachelor of Technical-Vocational Teacher Education - Electronics Technology": ["Lemery"],
    "Bachelor of Technical-Vocational Teacher Education - Garments, Fashion and Design": ["Lemery"],
    "Bachelor of Technology and Livelihood Education - Home Economics": ["Pablo Borbon","San Juan","Rosario"]
  };

  function lookupCampusesByKey(key) {
    if (!key) return null;
    if (programCampuses[key]) return programCampuses[key];
    const found = Object.keys(programCampuses).find(k => k.toLowerCase() === key.toLowerCase());
    return found ? programCampuses[found] : null;
  }

  function populateCampusSelect(campusSelect, campuses) {
    if (!campusSelect) return;
    campusSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = "Select Campus";
    campusSelect.appendChild(placeholder);

    campuses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      campusSelect.appendChild(opt);
    });

    if (campuses.length === 1) campusSelect.value = campuses[0];
  }

  const rows = document.querySelectorAll(".choice");
  if (!rows.length) {
    console.warn("[mapping] no .choice elements found.");
    return;
  }

  rows.forEach((row, index) => {
    const programSelect = row.querySelector(".choice-select select");
    const campusSelect  = row.querySelector(".campus-select select");

    if (!programSelect || !campusSelect) {
      console.warn("[mapping] row", index + 1, "missing program or campus select");
      return;
    }

    populateCampusSelect(campusSelect, allCampuses);

    programSelect.addEventListener("change", () => {
      const opt = programSelect.options[programSelect.selectedIndex];
      const key = (opt && opt.value && opt.value.trim() !== "") ? opt.value.trim() : (opt ? opt.text.trim() : "");
      const matched = lookupCampusesByKey(key) ?? allCampuses;
      populateCampusSelect(campusSelect, matched);
    });

    if (programSelect.selectedIndex > 0) {
      programSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
});

// ===== AUTO-SAVE FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
  const programSelects = document.querySelectorAll('.choice-select select');
  const campusSelects = document.querySelectorAll('.campus-select select');

  programSelects.forEach((select, index) => {
    const savedValue = localStorage.getItem(`program_choice_${index + 1}`);
    if (savedValue) {
      select.value = savedValue;
      select.dispatchEvent(new Event('change'));
    }
  });

  campusSelects.forEach((select, index) => {
    const savedValue = localStorage.getItem(`campus_choice_${index + 1}`);
    if (savedValue) {
      setTimeout(() => {
        select.value = savedValue;
      }, 100);
    }
  });

  programSelects.forEach((select, index) => {
    select.addEventListener('change', () => {
      localStorage.setItem(`program_choice_${index + 1}`, select.value);
    });
  });

  campusSelects.forEach((select, index) => {
    select.addEventListener('change', () => {
      localStorage.setItem(`campus_choice_${index + 1}`, select.value);
    });
  });
});

// ===== NEXT BUTTON WITH ENHANCED VALIDATION =====
const nextBtn = document.getElementById('nextBtn');
const errorNotif = document.getElementById('error-notif');

nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  let allFilled = true;
  const rows = document.querySelectorAll('.choice');

  rows.forEach(row => {
    const programSelect = row.querySelector('.choice-select select');
    const campusSelect = row.querySelector('.campus-select select');

    if (!programSelect.value) {
      allFilled = false;
      programSelect.classList.add('error');
      row.classList.add('row-error');
    } else {
      programSelect.classList.remove('error');
    }

    if (programSelect.value && !campusSelect.value) {
      allFilled = false;
      campusSelect.classList.add('error');
      row.classList.add('row-error');
    } else {
      campusSelect.classList.remove('error');
    }

    if (programSelect.value && campusSelect.value) {
      row.classList.remove('row-error');
    }
  });

  if (!allFilled) {
    showError();
    return;
  }

  // ============================================
  // 🔥 SAVE PROGRAM DATA BEFORE NAVIGATION
  // ============================================
  
  const programRows = document.querySelectorAll('.choice');
  
  const programData = {
    firstChoice: programRows[0]?.querySelector('.choice-select select')?.value || '',
    firstCampus: programRows[0]?.querySelector('.campus-select select')?.value || '',
    secondChoice: programRows[1]?.querySelector('.choice-select select')?.value || '',
    secondCampus: programRows[1]?.querySelector('.campus-select select')?.value || '',
    thirdChoice: programRows[2]?.querySelector('.choice-select select')?.value || '',
    thirdCampus: programRows[2]?.querySelector('.campus-select select')?.value || ''
  };

  localStorage.setItem('programData', JSON.stringify(programData));
  
  console.log('✅ Program data saved:', programData);

  window.location.href = 'form.html';
});

// ===== REMOVE HIGHLIGHT WHEN USER FIXES ANSWER =====
document.querySelectorAll('.choice-select select, .campus-select select').forEach(field => {
  field.addEventListener('change', () => {
    const row = field.closest('.choice');
    const programSelect = row.querySelector('.choice-select select');
    const campusSelect = row.querySelector('.campus-select select');

    if (field.value) {
      field.classList.remove('error');
    }

    if (programSelect.value && campusSelect.value) {
      row.classList.remove('row-error');
    }
  });
});

// ===== SHOW ERROR NOTIFICATION =====
function showError() {
  errorNotif.style.display = 'block';
  setTimeout(() => {
    errorNotif.style.opacity = 1;
  }, 10);

  setTimeout(() => {
    errorNotif.style.opacity = 0;
    setTimeout(() => {
      errorNotif.style.display = 'none';
    }, 500);
  }, 3000);
}