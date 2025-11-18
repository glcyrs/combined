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

// ====== Get current page ======
const currentPage = window.location.pathname.split("/").pop();

// ====== Load progress safely ======
let savedStep = parseInt(localStorage.getItem("currentStep"));
let currentStep = pageToStep[currentPage] !== undefined ? pageToStep[currentPage] : (savedStep || 5);
let maxUnlockedStep = parseInt(localStorage.getItem("maxUnlockedStep")) || currentStep;

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");

  // ====== Update step UI ======
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

  // ====== Step click navigation ======
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index > maxUnlockedStep) return;

      currentStep = index;
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

  // ====== POPULATE FORM FROM LOCALSTORAGE ======
  function populateForm() {
    try {
      // Get all stored data from localStorage
      const personalData = JSON.parse(localStorage.getItem('personalData') || '{}');
      const educationData = JSON.parse(localStorage.getItem('educationData') || '{}');
      const gradesData = JSON.parse(localStorage.getItem('gradesData') || '{}');
      const programData = JSON.parse(localStorage.getItem('programData') || '{}');
      const parentalData = JSON.parse(localStorage.getItem('parentalData') || '{}');
      const siblingData = JSON.parse(localStorage.getItem('siblingData') || '{}');

      // GET CONFIRMATION PAGE DATA
      const academicStatus = localStorage.getItem('field_academicStatus') || '';
      const alreadyEnrolled = localStorage.getItem('field_alreadyEnrolled') || '';
      const firstTimeApplying = localStorage.getItem('field_firstTimeApplying') || '';
      const transferred = localStorage.getItem('field_transferred') || '';
      const transferredFrom = localStorage.getItem('field_transferredFrom') || '';
      const transferredYear = localStorage.getItem('field_transferredYear') || '';
      const bsuGraduate = localStorage.getItem('field_bsuGraduate') || '';
      const bsuSchool = localStorage.getItem('field_bsuSchool') || '';

      // GET AAP DATA
      const aapSelection = localStorage.getItem('field_aap') || '';

      // POPULATE ACADEMIC STATUS CHECKBOXES
      const academicCheckboxes = document.querySelectorAll('.instructions-right .checkbox-item');
      if (academicCheckboxes.length >= 2) {
        // Currently enrolled as Grade 12
        if (academicStatus === 'graduating') {
          academicCheckboxes[0].querySelector('div').innerHTML = '☑ <i>Currently enrolled as Grade 12 student</i>';
          academicCheckboxes[1].querySelector('div').innerHTML = '☐ <i>Senior High School Graduate</i>';
        } 
        // Senior High School Graduate
        else if (academicStatus === 'graduated') {
          academicCheckboxes[0].querySelector('div').innerHTML = '☐ <i>Currently enrolled as Grade 12 student</i>';
          academicCheckboxes[1].querySelector('div').innerHTML = '☑ <i>Senior High School Graduate</i>';
        }
      }

      // POPULATE TRANSFER STATUS IN EDUCATIONAL INFORMATION
      const educationalTables = document.querySelectorAll('.form-section table');
      if (educationalTables.length > 0) {
        const educationalTable = educationalTables[0]; // First table is educational info
        const allRows = educationalTable.querySelectorAll('tr');
        
        // Find the row with transfer question
        allRows.forEach(row => {
          const cell = row.querySelector('td[colspan="2"]');
          if (cell && cell.innerHTML.includes('Have you ever transferred')) {
            if (transferred === 'yes') {
              cell.innerHTML = `
                <strong>Have you ever transferred during your Senior Your High School?</strong><br>
                <span style="margin-left:20px;">☑ <i>Yes, previously from ${transferredFrom || '___'} (Year: ${transferredYear || '___'})</i></span>
                <span style="margin-left:20px;">☐ <i>No</i></span>
              `;
            } else if (transferred === 'no') {
              cell.innerHTML = `
                <strong>Have you ever transferred during your Senior Your High School?</strong><br>
                <span style="margin-left:20px;">☐ <i>Yes, previously from</i></span>
                <span style="margin-left:20px;">☑ <i>No</i></span>
              `;
            }
          }
        });
      }

      console.log('Confirmation data loaded:', {
        academicStatus,
        alreadyEnrolled,
        firstTimeApplying,
        transferred,
        transferredFrom,
        transferredYear,
        bsuGraduate,
        bsuSchool
      });

            // POPULATE AAP CHECKBOXES
      const aapCheckboxes = document.querySelectorAll('.instructions-right .checkbox-item');
      if (aapCheckboxes.length >= 10 && aapSelection) {
        // Reset all AAP checkboxes to unchecked first
        for (let i = 2; i < 10; i++) { // AAP starts at index 2
          if (aapCheckboxes[i]) {
            const div = aapCheckboxes[i].querySelector('div');
            if (div) {
              const text = div.textContent.trim();
              div.innerHTML = '☐ ' + div.innerHTML.substring(div.innerHTML.indexOf('<i>'));
            }
          }
        }

        // Map AAP values to checkbox indices
        const aapMap = {
          'als': 2,           // Alternative Learning System Graduate
          'indigent': 3,      // Indigent Applicant
          'indigenous': 4,    // Indigenous Applicant
          'pwd': 5,           // Person with Disability (PWD)
          'iskolar': 6,       // Iskolar ng Bayan
          'solo-parent': 7,   // Children of Solo Parents
          'lab-school': 8,    // Integrated School / Laboratory School
          'none': 9           // None
        };

        const checkboxIndex = aapMap[aapSelection];
        if (checkboxIndex !== undefined && aapCheckboxes[checkboxIndex]) {
          const div = aapCheckboxes[checkboxIndex].querySelector('div');
          if (div) {
            div.innerHTML = '☑ ' + div.innerHTML.substring(div.innerHTML.indexOf('<i>'));
          }
        }
      }

      console.log('AAP data loaded:', { aapSelection });

      // PERSONAL INFORMATION
      if (document.getElementById('userEmail')) {
        document.getElementById('userEmail').textContent = personalData.email || 'user@gmail.com';
      }
      if (document.getElementById('surname')) {
        document.getElementById('surname').textContent = personalData.surname || '';
      }
      if (document.getElementById('firstName')) {
        document.getElementById('firstName').textContent = personalData.firstName || '';
      }
      if (document.getElementById('middleName')) {
        document.getElementById('middleName').textContent = personalData.middleName || '';
      }
      if (document.getElementById('address')) {
        document.getElementById('address').textContent = personalData.address || '';
      }
      if (document.getElementById('zipCode')) {
        document.getElementById('zipCode').textContent = personalData.zipCode || '';
      }
      if (document.getElementById('dateOfBirth')) {
        document.getElementById('dateOfBirth').textContent = personalData.dateOfBirth || '';
      }
      if (document.getElementById('sex')) {
        document.getElementById('sex').textContent = personalData.sex || '';
      }
      if (document.getElementById('age')) {
        document.getElementById('age').textContent = personalData.age || '';
      }
      if (document.getElementById('religion')) {
        document.getElementById('religion').textContent = personalData.religion || '';
      }
      if (document.getElementById('nationality')) {
        document.getElementById('nationality').textContent = personalData.nationality || '';
      }
      if (document.getElementById('contactPerson')) {
        document.getElementById('contactPerson').textContent = personalData.contactPerson || '';
      }
      if (document.getElementById('mobileNumber')) {
        document.getElementById('mobileNumber').textContent = personalData.mobileNumber || '';
      }
      if (document.getElementById('landlineNumber')) {
        document.getElementById('landlineNumber').textContent = personalData.landlineNumber || 'N/A';
      }
      if (document.getElementById('email')) {
        document.getElementById('email').textContent = personalData.email || '';
      }
      if (document.getElementById('contactAddress')) {
        document.getElementById('contactAddress').textContent = personalData.contactAddress || '';
      }
      if (document.getElementById('contactNumber')) {
        document.getElementById('contactNumber').textContent = personalData.contactNumber || '';
      }
      if (document.getElementById('contactRelationship')) {
        document.getElementById('contactRelationship').textContent = personalData.contactRelationship || '';
      }

      // EDUCATIONAL INFORMATION
      if (document.getElementById('seniorHighSchool')) {
        document.getElementById('seniorHighSchool').textContent = educationData.seniorHighSchool || '';
      }
      if (document.getElementById('track')) {
        document.getElementById('track').textContent = educationData.track || '';
      }
      if (document.getElementById('specialization')) {
        document.getElementById('specialization').textContent = educationData.specialization || 'N/A';
      }
      if (document.getElementById('jhsYear')) {
        document.getElementById('jhsYear').textContent = educationData.jhsYear || '';
      }
      if (document.getElementById('shsYear')) {
        document.getElementById('shsYear').textContent = educationData.shsYear || '';
      }

      // GRADES - Update the table cells
      if (document.getElementById('englishGrade10')) {
        document.getElementById('englishGrade10').textContent = gradesData.englishGrade10 || '';
      }
      if (document.getElementById('englishGrade11_1st')) {
        document.getElementById('englishGrade11_1st').textContent = gradesData.englishGrade11_1st || '';
      }
      if (document.getElementById('englishGrade11_2nd')) {
        document.getElementById('englishGrade11_2nd').textContent = gradesData.englishGrade11_2nd || '';
      }
      if (document.getElementById('mathGrade10')) {
        document.getElementById('mathGrade10').textContent = gradesData.mathGrade10 || '';
      }
      if (document.getElementById('mathGrade11_1st')) {
        document.getElementById('mathGrade11_1st').textContent = gradesData.mathGrade11_1st || '';
      }
      if (document.getElementById('mathGrade11_2nd')) {
        document.getElementById('mathGrade11_2nd').textContent = gradesData.mathGrade11_2nd || '';
      }
      if (document.getElementById('scienceGrade10')) {
        document.getElementById('scienceGrade10').textContent = gradesData.scienceGrade10 || '';
      }
      if (document.getElementById('scienceGrade11_1st')) {
        document.getElementById('scienceGrade11_1st').textContent = gradesData.scienceGrade11_1st || '';
      }
      if (document.getElementById('scienceGrade11_2nd')) {
        document.getElementById('scienceGrade11_2nd').textContent = gradesData.scienceGrade11_2nd || '';
      }

      // PROGRAM CHOICES
      if (document.getElementById('firstChoice')) {
        document.getElementById('firstChoice').textContent = programData.firstChoice || '';
      }
      if (document.getElementById('firstCampus')) {
        document.getElementById('firstCampus').textContent = programData.firstCampus || '';
      }
      if (document.getElementById('secondChoice')) {
        document.getElementById('secondChoice').textContent = programData.secondChoice || '';
      }
      if (document.getElementById('secondCampus')) {
        document.getElementById('secondCampus').textContent = programData.secondCampus || '';
      }
      if (document.getElementById('thirdChoice')) {
        document.getElementById('thirdChoice').textContent = programData.thirdChoice || '';
      }
      if (document.getElementById('thirdCampus')) {
        document.getElementById('thirdCampus').textContent = programData.thirdCampus || '';
      }

      // PARENTAL INFORMATION
      const parentalTable = document.querySelector('.form-section1 table');
      if (parentalTable && parentalData) {
        const rows = parentalTable.querySelectorAll('tr');
        
        // Mother's info (first data row)
        if (rows[0]) {
          const cells = rows[0].querySelectorAll('td');
          if (cells[0]) cells[0].querySelector('.cell-inner').textContent = parentalData.motherName || '';
          if (cells[1]) cells[1].querySelector('.cell-inner').textContent = parentalData.motherAge || '';
          if (cells[2]) cells[2].querySelector('.cell-inner').textContent = parentalData.motherOccupation || '';
          if (cells[3]) cells[3].querySelector('.cell-inner').textContent = parentalData.motherIncome || '';
          if (cells[4]) cells[4].querySelector('.cell-inner').textContent = parentalData.motherContact || '';
        }
        
        // Father's info (third data row, skipping labels)
        if (rows[2]) {
          const cells = rows[2].querySelectorAll('td');
          if (cells[0]) cells[0].querySelector('.cell-inner').textContent = parentalData.fatherName || '';
          if (cells[1]) cells[1].querySelector('.cell-inner').textContent = parentalData.fatherAge || '';
          if (cells[2]) cells[2].querySelector('.cell-inner').textContent = parentalData.fatherOccupation || '';
          if (cells[3]) cells[3].querySelector('.cell-inner').textContent = parentalData.fatherIncome || '';
          if (cells[4]) cells[4].querySelector('.cell-inner').textContent = parentalData.fatherContact || '';
        }
      }

      // LOAD SAVED PHOTO AT THE END
      const savedPhoto = localStorage.getItem("savedPhoto");
      const photoBox = document.getElementById("photoPreview");
      
      if (savedPhoto && photoBox) {
        photoBox.style.backgroundImage = `url('${savedPhoto}')`;
        photoBox.style.backgroundSize = "cover";
        photoBox.style.backgroundPosition = "center";
        photoBox.style.backgroundRepeat = "no-repeat";
        photoBox.textContent = ""; // Remove "2x2 Photo" text
        console.log('✅ Photo loaded in form preview');
      }

      console.log('Form populated successfully from localStorage');
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }

  // Run on page load
  populateForm();

  // ====== Initial render ======
  updateSteps();
});