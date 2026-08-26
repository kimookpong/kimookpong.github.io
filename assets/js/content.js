(() => {
  const skills = [
    ['Frontend', [['Next.js','Advanced'],['TypeScript','Advanced'],['Tailwind CSS','Advanced'],['Bootstrap','Advanced'],['React Native','Advanced'],['Line OA / LIFF','Intermediate']]],
    ['Backend', [['Node.js / Express','Advanced'],['Yii2','Advanced'],['CodeIgniter','Advanced'],['PHP / Laravel','Intermediate'],['Python','Intermediate'],['Go','Basic'],['REST API','Advanced']]],
    ['Database', [['PostgreSQL','Advanced'],['MongoDB','Advanced'],['MySQL','Advanced'],['Oracle','Intermediate'],['Redis','Basic'],['Neon','Basic'],['Supabase','Basic']]],
    ['Infrastructure', [['Git / GitHub','Advanced'],['Docker','Intermediate'],['Ubuntu Server','Intermediate'],['Nginx','Basic'],['Apache','Basic'],['Vercel / Railway','Advanced']]]
  ];
  const projects = [
    ['💊','Pharmacy WU Clerkship','A platform for managing pharmacy clerkship programs at Walailak University. Handles scheduling, student progress tracking, and supervisor evaluations.',['Next.js','PostgreSQL (Neon)'],'web','https://www.pharmwuclerkship.com/'],
    ['🏥','TCNAP – Thailand Community Network Assessment','A data collection and reporting platform for community health network assessments across Thailand.',['PHP','PostgreSQL'],'web','https://tcnap.org/'],
    ['🎓','Pharmacy WU Alumni','A platform for managing pharmacy alumni relations, graduate careers, events, and alumni networking.',['Next.js','PostgreSQL (Neon)'],'web','https://www.pharmwualumni.com/'],
    ['👥','HRMS – Walailak University','Human Resource Management System for employee records, leave requests, payroll data, and organisation charts.',['Yii2','Oracle'],'web','https://hrms.wu.ac.th/'],
    ['📦','StockLazer','Real-time stock management with QR scanning, multi-warehouse support, and a live dashboard.',['TypeScript','Next.js','Yahoo Finance'],'web','https://stocklazer.vercel.app/'],
    ['🌱','Farm-D Project','Digital tools for agricultural personnel to log crop data, receive LINE notifications, and manage farm operations.',['Next.js','MongoDB','Line OA'],'web',''],
    ['🍽️','Wanderwoods POS','Restaurant POS with table management, real-time orders, kitchen display, and end-of-day reports.',['Yii2','PWA','MySQL'],'web',''],
    ['▦','Stock Management System','QR-based real-time inventory verification and monitoring across multiple locations.',['Next.js','PostgreSQL','QR Code'],'web',''],
    ['✈️','Udon City Tourism','Tourism platform for attractions, accommodation, local services, maps, and ratings.',['Yii2','MySQL'],'web',''],
    ['🏛️','Gov Asset Information System','Government asset and documentation platform covering procurement, depreciation, and physical location.',['React','PostgreSQL'],'web',''],
    ['🎮','AB Game','Multiplayer 4-digit guessing game built with real-time WebSocket synchronisation.',['TypeScript','Socket.io'],'hobby','https://ab-game.vercel.app/'],
    ['⏱️','Timere','A clean minimal time-tracking app built to explore modern frontend tooling with Vite.',['Vite'],'hobby','https://timere.vercel.app/'],
    ['⚡','Level Up','Game top-up storefront with item selection and secure payment processing through Omise.',['Next.js','Omise'],'hobby','https://levelup-plus.vercel.app/'],
    ['🐄','Tracer','End-to-end cattle tracking across farm management, transport logistics, and marketplace trading.',['Vite','React Native','Go'],'fullstack','https://new.tracer.in.th/'],
    ['🎙️','Rama Hospital Voice Interview','Voice-driven patient questionnaire using Text-to-Speech, Speech-to-Text, and structured clinical data processing.',['Yii2','TTS','STT'],'web',''],
    ['📱','WU Thasala','Mobile application providing Walailak University staff access to internal services and information.',['React Native'],'mobile','https://wuthasala.vercel.app/']
  ];
  const careers = [
    ['Nov 2020 – Present','System Analyst','Walailak University, Nakhon Si Thammarat','Full-time','Design and develop internal university systems including HRMS, alumni portals, clerkship platforms, and asset tracking. Primary stack: Next.js, React, PostgreSQL, and Node.js.'],
    ['Jun 2019 – Present','Co-Founder','Chailai Intertrade Co., Ltd, Songkhla','Co-Founder','Co-founded a company handling business operations and technology solutions; overseeing strategy and product development.'],
    ['2017 – Present','Freelance Developer','Freelancer.com (Remote)','Freelance','Building full-stack applications for clients in Thailand and abroad: POS, tourism, farming tools, and government asset management.'],
    ['Dec 2016 – Nov 2020','Co-Founder & Manufacturing Manager','Ottoman Enterprise Co., Ltd, Songkhla','Full-time','Managed production planning, quality control, process optimisation, and cross-functional teams.'],
    ['2014 – 2016','Lead Developer','City Variety Corporation Co., Ltd, Songkhla','Full-time','Led the web development team, project delivery, code reviews, and technical architecture decisions.'],
    ['2013 – 2014','Developer','City Variety Corporation Co., Ltd, Songkhla','Full-time','Built and maintained client-facing web applications and internal business tools with PHP frameworks.'],
    ['2008 – 2012','B.Eng. Computer Engineering','Prince of Songkla University (PSU), Songkhla','Education','Bachelor of Engineering. Project: Human Ear Recognition using C#, machine learning, neural networks, and image processing.']
  ];

  const skillGrid = document.querySelector('#techStackGrid');
  skillGrid.innerHTML = skills.map(group => `<article class="stack-card"><h3>${group[0]}</h3><div>${group[1].map(item => `<p><span>${item[0]}</span><small class="level level-${item[1].toLowerCase()}">${item[1]}</small></p>`).join('')}</div></article>`).join('');

  const projectGrid = document.querySelector('#projects');
  projectGrid.innerHTML = projects.map((p, i) => {
    const preview = p[5]
      ? `<div class="project-preview"><img src="https://image.thum.io/get/width/1200/crop/760/noanimate/${p[5]}" alt="Preview of ${p[1]}" loading="lazy" width="1200" height="760"><span class="preview-fallback" aria-hidden="true">${p[0]}</span></div>`
      : `<div class="project-preview project-preview-private"><span aria-hidden="true">${p[0]}</span><small>Private project</small></div>`;
    return `<article class="project legacy-project" data-category="${p[4]}">${preview}<div class="project-content"><span class="num">${String(i + 1).padStart(2,'0')}</span><h3>${p[1]}</h3><p>${p[2]}</p><div class="tags">${p[3].map(tag => `<span>${tag}</span>`).join('')}</div>${p[5] ? `<a href="${p[5]}" target="_blank" rel="noopener" aria-label="${p[1]}"></a>` : '<span class="private-label">Private project</span>'}</div></article>`;
  }).join('');
  projectGrid.querySelectorAll('.project-preview img').forEach(image => {
    image.addEventListener('error', () => image.parentElement.classList.add('preview-error'), { once: true });
  });

  const timeline = document.querySelector('#timeline');
  timeline.innerHTML = careers.map(c => `<li><time>${c[0]}</time><h3>${c[1]}</h3><strong>${c[2]}</strong> <small class="career-type">${c[3]}</small><p>${c[4]}</p></li>`).join('');

  const localise = () => {
    const th = document.documentElement.lang === 'th';
    document.querySelector('[data-content="stackIntro"]').textContent = th ? 'เครื่องมือและเทคโนโลยีที่ใช้สร้างระบบตั้งแต่ frontend ถึง infrastructure' : 'Tools and technologies used to build systems from frontend through infrastructure.';
    document.querySelector('[data-content="languages"]').textContent = th ? 'ภาษาที่ใช้มากที่สุด' : 'Most used languages';
  };
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setTimeout(localise)));
  localise();
})();
