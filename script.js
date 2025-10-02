/* ================================
   IQ Quiz Script
   - Put images in /images/ named:
     q1.png, q1a.png, q1b.png, q1c.png, q1d.png, q1e.png
     ... up to q10.png and q10a..q10e.png
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Elements
  const landing = document.getElementById('landing');
  const quizSection = document.getElementById('quizSection');
  const resultSection = document.getElementById('resultSection');

const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const exitBtn = document.getElementById('exitBtn');
const nextBtn = document.getElementById('nextBtn');
const quitBtn = document.getElementById('quitBtn');
const retryBtn = document.getElementById('retryBtn');
const homeBtn = document.getElementById('homeBtn');
const skipBtn = document.getElementById('skipBtn');


  

  const qIndexEl = document.getElementById('qIndex');
  const qImgEl = document.getElementById('qImg');
  const optionsGrid = document.getElementById('optionsGrid');
  const progressFill = document.getElementById('progressFill');
  const scoreValue = document.getElementById('scoreValue');
  

  const resultIQ = document.getElementById('resultIQ');
  const resultText = document.getElementById('resultText');

  // --- Questions (10) - image-based; each has 5 image options
  const questions = [
    { img: 'images/q1.png', options: ['images/q1a.png','images/q1b.png','images/q1c.png','images/q1d.png','images/q1e.png'], correct: 0 },
    { img: 'images/q2.png', options: ['images/q2a.png','images/q2b.png','images/q2c.png','images/q2d.png','images/q2e.png'], correct: 3 },
    { img: 'images/q3.png', options: ['images/q3a.png','images/q3b.png','images/q3c.png','images/q3d.png','images/q3e.png'], correct: 3 },
    { img: 'images/q4.png', options: ['images/q4a.png','images/q4b.png','images/q4c.png','images/q4d.png','images/q4e.png'], correct: 3 },
    { img: 'images/q5.png', options: ['images/q5a.png','images/q5b.png','images/q5c.png','images/q5d.png','images/q5e.png'], correct: 0 },
    { img: 'images/q6.png', options: ['images/q6a.png','images/q6b.png','images/q6c.png','images/q6d.png','images/q6e.png'], correct: 1 },
    { img: 'images/q7.png', options: ['images/q7a.png','images/q7b.png','images/q7c.png','images/q7d.png','images/q7e.png'], correct: 2 },
    { img: 'images/q8.png', options: ['images/q8a.png','images/q8b.png','images/q8c.png','images/q8d.png','images/q8e.png'], correct: 0 },
    { img: 'images/q9.png', options: ['images/q9a.png','images/q9b.png','images/q9c.png','images/q9d.png','images/q9e.png'], correct: 3 },
    { img: 'images/q10.png', options: ['images/q10a.png','images/q10b.png','images/q10c.png','images/q10d.png','images/q10e.png'], correct: 4 }
  ];

  // --- State
  let cur = 0;
  let score = 0;
  let selectedIndex = null;
  let lock = false;

  // --- Chart (landing)
  const ctx = document.getElementById('iqChart').getContext('2d');
  const countryLabels = ['Uzbekistan','USA','Russia','Arab (avg)','China','Japan','South Korea','Israel','Palestine'];
  const countryIQs = [87,98,97,85,104,106,108,95,86];
  new Chart(ctx, {
    type:'bar',
    data:{
      labels: countryLabels,
      datasets:[{
        label:'Average IQ',
        data: countryIQs,
        backgroundColor: countryLabels.map((l,i)=>`rgba(${50+i*10},${120-i*8},${200-i*6},0.85)`)
      }]
    },
    options:{
      plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, suggestedMax:120 } }
    }
  });

  // --- Helpers
  function showLanding() {
    landing.classList.remove('hidden');
    quizSection.classList.add('hidden');
    resultSection.classList.add('hidden');
  }
  function showQuiz() {
    landing.classList.add('hidden');
    quizSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    cur = 0; score = 0; selectedIndex = null; lock = false;
    updateScore();
    renderQuestion();
  }
  function showResult() {
    landing.classList.add('hidden');
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // simple IQ mapping (example):
    // 0-2 -> 75, 3-4 -> 90, 5-6 -> 105, 7-8 -> 120, 9-10 -> 135
    let iq;
    if (score <= 2) iq = 75;
    else if (score <= 4) iq = 100;
    else if (score <= 6) iq = 115;
    else if (score <= 8) iq = 120;
    else iq = 135;

    resultIQ.textContent = iq;
    resultText.textContent = `You answered ${score} of ${questions.length} correctly. This is an approximate IQ estimate.`;
  }

  function updateScore() {
    scoreValue.textContent = String(score);
  }

  function renderQuestion() {
    lock = false;
    selectedIndex = null;
    nextBtn.classList.add('disabled');
    nextBtn.disabled = true;

    const q = questions[cur];
    qIndexEl.textContent = `Question ${cur+1} / ${questions.length}`;
    qImgEl.src = q.img;
    qImgEl.alt = `Question ${cur+1}`;

    // progress
    const pct = Math.round((cur / questions.length) * 100);
    progressFill.style.width = `${pct}%`;

    // render options
    optionsGrid.innerHTML = '';
    q.options.forEach((opt, i) => {
      const box = document.createElement('div');
      box.className = 'option-item';
      box.dataset.index = String(i);

      const img = document.createElement('img');
      img.src = opt;
      img.alt = `Option ${i+1}`;

      box.appendChild(img);

      // click handler
      box.addEventListener('click', () => {
        if (lock) return;
        selectedIndex = i;
        // highlight selection visually
        Array.from(optionsGrid.children).forEach(c=>c.classList.remove('selected'));
        box.classList.add('selected');
        nextBtn.classList.remove('disabled');
        nextBtn.disabled = false;
      });

      optionsGrid.appendChild(box);
    });
  }

  function markAndNext() {
    if (selectedIndex === null) return;
    lock = true;

    const q = questions[cur];
    const children = Array.from(optionsGrid.children);
    // mark correct / wrong
    children.forEach((child, idx) => {
      child.classList.remove('selected');
      if (idx === q.correct) {
        child.classList.add('correct');
      } else if (idx === selectedIndex && idx !== q.correct) {
        child.classList.add('wrong');
      }
      // disable pointer
      child.style.pointerEvents = 'none';
    });

    if (selectedIndex === q.correct) score++;
    updateScore();

    // after short delay go to next or show result
    setTimeout(() => {
      cur++;
      if (cur < questions.length) {
        renderQuestion();
      } else {
        // fill progress to 100
        progressFill.style.width = '100%';
        showResult();
      }
    }, 900);
  }

  // --- Events
  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showQuiz();
    // scroll to top of quiz
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backBtn.addEventListener('click', () => { showLanding(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  exitBtn.addEventListener('click', () => { if(confirm('Exit quiz and return home?')) showLanding(); });
  backQuestionBtn.addEventListener('click', () => {
  if (cur > 0) {
    cur--; 
    renderQuestion();
  } else {
    showLanding(); // agar 1-savoldan qaytsa, home sahifaga qaytadi
  }
});
skipBtn.addEventListener('click', () => {
  if (cur < questions.length - 1) {
    cur++;
    renderQuestion();
  } else {
    showResult(); // oxirgi savolni skip qilsa, natija chiqadi
  }
});

  quitBtn.addEventListener('click', () => { if(confirm('Quit quiz? Your progress will be lost.')) showLanding(); });

  nextBtn.addEventListener('click', () => { markAndNext(); });

  retryBtn.addEventListener('click', () => { showQuiz(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  homeBtn.addEventListener('click', () => { showLanding(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // keyboard support: Enter -> Next if option selected
  document.addEventListener('keydown', (ev) => {
    if (!quizSection.classList.contains('hidden') && ev.key === 'Enter' && !nextBtn.disabled) {
      markAndNext();
    }
  });

  // initial landing show
  showLanding();
});
