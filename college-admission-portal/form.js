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
        const educationalTable = educationalTables[0];
        const allRows = educationalTable.querySelectorAll('tr');
        
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

      // POPULATE AAP CHECKBOXES
      const aapCheckboxes = document.querySelectorAll('.instructions-right .checkbox-item');
      if (aapCheckboxes.length >= 10 && aapSelection) {
        for (let i = 2; i < 10; i++) {
          if (aapCheckboxes[i]) {
            const div = aapCheckboxes[i].querySelector('div');
            if (div) {
              div.innerHTML = '☐ ' + div.innerHTML.substring(div.innerHTML.indexOf('<i>'));
            }
          }
        }

        const aapMap = {
          'als': 2, 'indigent': 3, 'indigenous': 4, 'pwd': 5,
          'iskolar': 6, 'solo-parent': 7, 'lab-school': 8, 'none': 9
        };

        const checkboxIndex = aapMap[aapSelection];
        if (checkboxIndex !== undefined && aapCheckboxes[checkboxIndex]) {
          const div = aapCheckboxes[checkboxIndex].querySelector('div');
          if (div) {
            div.innerHTML = '☑ ' + div.innerHTML.substring(div.innerHTML.indexOf('<i>'));
          }
        }
      }

      // PERSONAL INFORMATION - with null checks
      const setTextContent = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '';
      };

      setTextContent('userEmail', personalData.email || 'user@gmail.com');
      setTextContent('surname', personalData.surname);
      setTextContent('firstName', personalData.firstName);
      setTextContent('middleName', personalData.middleName);
      setTextContent('address', personalData.address);
      setTextContent('zipCode', personalData.zipCode);
      setTextContent('dateOfBirth', personalData.dateOfBirth);
      setTextContent('sex', personalData.sex);
      setTextContent('age', personalData.age);
      setTextContent('religion', personalData.religion);
      setTextContent('nationality', personalData.nationality);
      setTextContent('contactPerson', personalData.contactPerson);
      setTextContent('mobileNumber', personalData.mobileNumber);
      setTextContent('landlineNumber', personalData.landlineNumber || 'N/A');
      setTextContent('email', personalData.email);
      setTextContent('contactAddress', personalData.contactAddress);
      setTextContent('contactNumber', personalData.contactNumber);
      setTextContent('contactRelationship', personalData.contactRelationship);

      // EDUCATIONAL INFORMATION
      setTextContent('seniorHighSchool', educationData.seniorHighSchool);
      setTextContent('track', educationData.track);
      setTextContent('specialization', educationData.specialization || 'N/A');
      setTextContent('jhsYear', educationData.jhsYear);
      setTextContent('shsYear', educationData.shsYear);

      // GRADES
      setTextContent('englishGrade10', gradesData.englishGrade10);
      setTextContent('englishGrade11_1st', gradesData.englishGrade11_1st);
      setTextContent('englishGrade11_2nd', gradesData.englishGrade11_2nd);
      setTextContent('mathGrade10', gradesData.mathGrade10);
      setTextContent('mathGrade11_1st', gradesData.mathGrade11_1st);
      setTextContent('mathGrade11_2nd', gradesData.mathGrade11_2nd);
      setTextContent('scienceGrade10', gradesData.scienceGrade10);
      setTextContent('scienceGrade11_1st', gradesData.scienceGrade11_1st);
      setTextContent('scienceGrade11_2nd', gradesData.scienceGrade11_2nd);

      // PROGRAM CHOICES
      setTextContent('firstChoice', programData.firstChoice);
      setTextContent('firstCampus', programData.firstCampus);
      setTextContent('secondChoice', programData.secondChoice);
      setTextContent('secondCampus', programData.secondCampus);
      setTextContent('thirdChoice', programData.thirdChoice);
      setTextContent('thirdCampus', programData.thirdCampus);

      // PARENTAL INFORMATION - with better null checking
      const parentalTable = document.querySelector('.form-section1 table');
      if (parentalTable && parentalData) {
        const rows = parentalTable.querySelectorAll('tr');
        
        // Mother's info
        if (rows[0]) {
          const cells = rows[0].querySelectorAll('td');
          const motherInner0 = cells[0]?.querySelector('.cell-inner');
          const motherInner1 = cells[1]?.querySelector('.cell-inner');
          const motherInner2 = cells[2]?.querySelector('.cell-inner');
          const motherInner3 = cells[3]?.querySelector('.cell-inner');
          const motherInner4 = cells[4]?.querySelector('.cell-inner');
          
          if (motherInner0) motherInner0.textContent = parentalData.motherName || '';
          if (motherInner1) motherInner1.textContent = parentalData.motherAge || '';
          if (motherInner2) motherInner2.textContent = parentalData.motherOccupation || '';
          if (motherInner3) motherInner3.textContent = parentalData.motherIncome || '';
          if (motherInner4) motherInner4.textContent = parentalData.motherContact || '';
        }
        
        // Father's info
        if (rows[2]) {
          const cells = rows[2].querySelectorAll('td');
          const fatherInner0 = cells[0]?.querySelector('.cell-inner');
          const fatherInner1 = cells[1]?.querySelector('.cell-inner');
          const fatherInner2 = cells[2]?.querySelector('.cell-inner');
          const fatherInner3 = cells[3]?.querySelector('.cell-inner');
          const fatherInner4 = cells[4]?.querySelector('.cell-inner');
          
          if (fatherInner0) fatherInner0.textContent = parentalData.fatherName || '';
          if (fatherInner1) fatherInner1.textContent = parentalData.fatherAge || '';
          if (fatherInner2) fatherInner2.textContent = parentalData.fatherOccupation || '';
          if (fatherInner3) fatherInner3.textContent = parentalData.fatherIncome || '';
          if (fatherInner4) fatherInner4.textContent = parentalData.fatherContact || '';
        }
      }

      // 🔥 LOAD SAVED PHOTO - FIXED VERSION
      setTimeout(() => {
        const savedPhoto = localStorage.getItem("savedPhoto");
        const photoBox = document.getElementById("photoPreview");
        
        console.log('🔍 Checking for saved photo...');
        console.log('Photo exists:', !!savedPhoto);
        console.log('PhotoBox element found:', !!photoBox);
        
        if (savedPhoto && photoBox) {
          photoBox.innerHTML = "";
          photoBox.style.backgroundImage = `url('${savedPhoto}')`;
          photoBox.style.backgroundSize = "cover";
          photoBox.style.backgroundPosition = "center";
          photoBox.style.backgroundRepeat = "no-repeat";
          
          console.log('✅ Photo loaded successfully in form preview');
        } else {
          console.log('❌ Photo loading failed');
        }
      }, 100);

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