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

      console.log('📦 Parental data loaded:', parentalData);

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
      setTextContent('contactMobile', personalData.contactMobile);
      setTextContent('contactRelationship', personalData.contactRelationship);

      // Handle "Others" relationship option
      const contactRel = document.getElementById('contactRelationship');
      if (contactRel && personalData.contactRelationship === 'Others' && personalData.otherRelationship) {
          contactRel.textContent = personalData.otherRelationship.toUpperCase();
      }

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

      const gradesTable = document.querySelector('.info-table tbody');
      if (gradesTable && gradesData) {
        const rows = gradesTable.querySelectorAll('tr');
        
        // English row (index 0)
        if (rows[0]) {
          const cells = rows[0].querySelectorAll('td');
          if (cells[4]) cells[4].textContent = gradesData.englishGrade10 || '';
          if (cells[5]) cells[5].textContent = gradesData.englishGrade11_1st || '';
          if (cells[6]) cells[6].textContent = gradesData.englishGrade11_2nd || '';
        }
        
        // Mathematics row (index 1)
        if (rows[1]) {
          const cells = rows[1].querySelectorAll('td');
          if (cells[4]) cells[4].textContent = gradesData.mathGrade10 || '';
          if (cells[5]) cells[5].textContent = gradesData.mathGrade11_1st || '';
          if (cells[6]) cells[6].textContent = gradesData.mathGrade11_2nd || '';
        }
        
        // Science row (index 2)
        if (rows[2]) {
          const cells = rows[2].querySelectorAll('td');
          if (cells[4]) cells[4].textContent = gradesData.scienceGrade10 || '';
          if (cells[5]) cells[5].textContent = gradesData.scienceGrade11_1st || '';
          if (cells[6]) cells[6].textContent = gradesData.scienceGrade11_2nd || '';
        }
      }


      // PROGRAM CHOICESS 
      const programTable = document.querySelector('.right-column table tbody');
      if (programTable && programData) {
        const rows = programTable.querySelectorAll('tr');
        
        // First Choice
        if (rows[0]) {
          const cells = rows[0].querySelectorAll('td');
          const programCell = cells[1]?.querySelector('.cell-inner');
          const campusCell = cells[2]?.querySelector('.cell-inner');
          
          if (programCell) programCell.textContent = programData.firstChoice || '';
          if (campusCell) campusCell.textContent = programData.firstCampus || '';
        }
        
        // Second Choice
        if (rows[1]) {
          const cells = rows[1].querySelectorAll('td');
          const programCell = cells[1]?.querySelector('.cell-inner');
          const campusCell = cells[2]?.querySelector('.cell-inner');
          
          if (programCell) programCell.textContent = programData.secondChoice || '';
          if (campusCell) campusCell.textContent = programData.secondCampus || '';
        }
        
        // Third Choice
        if (rows[2]) {
          const cells = rows[2].querySelectorAll('td');
          const programCell = cells[1]?.querySelector('.cell-inner');
          const campusCell = cells[2]?.querySelector('.cell-inner');
          
          if (programCell) programCell.textContent = programData.thirdChoice || '';
          if (campusCell) campusCell.textContent = programData.thirdCampus || '';
        }
      }
      
    // PARENTAL INFORMATION 
// Find the parental section first, then get its table
const parentalSection = document.querySelector('.section-title');
let parentalTable = null;

// Loop through all section titles to find "PARENTAL INFORMATION"
document.querySelectorAll('.section-title').forEach(title => {
  if (title.textContent.includes('PARENTAL INFORMATION')) {
    // Get the next sibling which should be the form-section1
    parentalTable = title.nextElementSibling?.querySelector('table');
  }
});

console.log('🔍 Parental table found:', parentalTable);

if (parentalTable && parentalData) {
  const rows = parentalTable.querySelectorAll('tr');
  console.log('🔍 Found rows:', rows.length);
  
  // MOTHER'S INFO (Row 0)
  if (rows[0]) {
    const cells = rows[0].querySelectorAll('td');
    console.log('🔍 Mother row cells:', cells.length);
    
    // Combine mother's name
    const motherFullName = [
      parentalData.motherFirst,
      parentalData.motherMiddle,
      parentalData.motherLast
    ].filter(Boolean).join(' ').toUpperCase();
    
    console.log('👩 Mother name:', motherFullName);
    
    const motherInner0 = cells[0]?.querySelector('.cell-inner');
    const motherInner1 = cells[1]?.querySelector('.cell-inner');
    const motherInner2 = cells[2]?.querySelector('.cell-inner');
    const motherInner3 = cells[3]?.querySelector('.cell-inner');
    const motherInner4 = cells[4]?.querySelector('.cell-inner');
    
    if (motherInner0) motherInner0.textContent = motherFullName || '';
    if (motherInner1) motherInner1.textContent = parentalData.motherAge || '';
    if (motherInner2) motherInner2.textContent = parentalData.motherOccupation || '';
    if (motherInner3) motherInner3.textContent = '0';
    if (motherInner4) motherInner4.textContent = parentalData.motherContact || '';
  }
  
  // FATHER'S INFO (Row 2)
  if (rows[2]) {
    const cells = rows[2].querySelectorAll('td');
    console.log('🔍 Father row cells:', cells.length);
    
    // Combine father's name
    const fatherFullName = [
      parentalData.fatherFirst,
      parentalData.fatherMiddle,
      parentalData.fatherLast
    ].filter(Boolean).join(' ').toUpperCase();
    
    console.log('👨 Father name:', fatherFullName);
    
    const fatherInner0 = cells[0]?.querySelector('.cell-inner');
    const fatherInner1 = cells[1]?.querySelector('.cell-inner');
    const fatherInner2 = cells[2]?.querySelector('.cell-inner');
    const fatherInner3 = cells[3]?.querySelector('.cell-inner');
    const fatherInner4 = cells[4]?.querySelector('.cell-inner');
    
    if (fatherInner0) fatherInner0.textContent = fatherFullName || '';
    if (fatherInner1) fatherInner1.textContent = parentalData.fatherAge || '';
    if (fatherInner2) fatherInner2.textContent = parentalData.fatherOccupation || '';
    if (fatherInner3) fatherInner3.textContent = '0';
    if (fatherInner4) fatherInner4.textContent = parentalData.fatherContact || '';
  }
} else {
  console.error('❌ Table or data not found!');
}
      

  // ====== SIBLING INFORMATION ======
try {
  console.log('🔍 Sibling data from storage:', siblingData);
  console.log('🔍 Is array?', Array.isArray(siblingData));
  
  const siblingTable = document.querySelector('.sibling-info-table');
  console.log('🔍 Sibling table found:', siblingTable);
  
  // Check if siblingData exists and is an array with items
  if (siblingTable && Array.isArray(siblingData) && siblingData.length > 0) {
    const rows = siblingTable.querySelectorAll('tr');
    console.log('🔍 Total sibling table rows:', rows.length);
    let rowIndex = 1; // start after header (row 0)

    siblingData.forEach((sib, i) => {
      if (rowIndex < rows.length) {
        const cells = rows[rowIndex].querySelectorAll('td');
        
        if (cells.length >= 5) {
          cells[0].textContent = sib.fullName || '';
          cells[1].textContent = sib.age || '';
          cells[2].textContent = sib.education || '';
          cells[3].textContent = sib.school || '';
          cells[4].textContent = sib.yearGraduated || '';
        }
        rowIndex++;
      }
    });

    // Clear remaining rows
    for (let i = rowIndex; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      cells.forEach(cell => cell.textContent = '');
    }
    
    console.log('✅ Sibling data populated successfully');
  } else {
    console.log('ℹ️ No siblings to display - clearing all data rows');
    
    // Clear all sibling data rows (leave header intact)
    if (siblingTable) {
      const rows = siblingTable.querySelectorAll('tr');
      for (let i = 1; i < rows.length; i++) {  // Start from 1 to skip header
        const cells = rows[i].querySelectorAll('td');
        cells.forEach(cell => cell.textContent = '');
      }
    }
  }
} catch (err) {
  console.error("❌ Error populating sibling data:", err);
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

   console.log('✅ Form populated successfully from localStorage');  // ADD THIS LINE

    } catch (error) {
      console.error('Error populating form:', error);
    }
  }

  // Run on page load
  populateForm();

  // ====== Initial render ======
  updateSteps();
});

