(() => {
  const text = {
    th: {
      githubKicker: 'กิจกรรมบน GitHub',
      githubTitle: 'Public repositories',
      heatmapTitle: 'Contribution heat map',
      heatmapNote: 'การมีส่วนร่วมตลอดปีที่ผ่านมา',
      repoLoading: 'กำลังโหลด public repositories…',
      noDescription: 'ยังไม่มีคำอธิบายสำหรับ repository นี้',
      repoError: 'ไม่สามารถโหลดรายการ repository ได้ในขณะนี้ — ดูทั้งหมดได้ที่ GitHub',
      title: 'ฮากิม มูดอ (Hakim Mudor) — Full‑Stack Developer & System Analyst',
      avatarAlt: 'ภาพการ์ตูนของฮากิม มูดอ'
    },
    en: {
      githubKicker: 'GitHub activity',
      githubTitle: 'Public repositories',
      heatmapTitle: 'Contribution heat map',
      heatmapNote: 'Contributions during the past year',
      repoLoading: 'Loading public repositories…',
      noDescription: 'No description is available for this repository.',
      repoError: 'Repositories are temporarily unavailable — see them all on GitHub.',
      title: 'Hakim Mudor — Full‑Stack Developer & System Analyst',
      avatarAlt: 'Cartoon portrait of Hakim Mudor'
    }
  };
  let repos = [];

  const currentLang = () => document.documentElement.lang === 'en' ? 'en' : 'th';

  function renderExtras() {
    const lang = currentLang();
    document.querySelectorAll('[data-extra]').forEach(el => {
      const value = text[lang][el.dataset.extra];
      if (value) el.textContent = value;
    });
    document.title = text[lang].title;
    document.querySelector('#avatar').alt = text[lang].avatarAlt;
    document.querySelector('.hero h1 em').textContent = lang === 'th' ? 'ฮากิม มูดอ' : 'Hakim Mudor';
    if (repos.length) renderRepos();
  }

  function renderRepos() {
    const lang = currentLang();
    const root = document.querySelector('#publicRepos');
    root.innerHTML = repos.map(repo => `
      <article class="repo-card">
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || text[lang].noDescription)}</p>
        <div class="repo-meta">
          ${repo.language ? `<span class="repo-language">${escapeHtml(repo.language)}</span>` : ''}
          <span aria-label="${repo.stargazers_count} stars">★ ${repo.stargazers_count}</span>
          <span aria-label="${repo.forks_count} forks">⑂ ${repo.forks_count}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="${escapeHtml(repo.name)} on GitHub"></a>
      </article>`).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  async function loadRepos() {
    try {
      const response = await fetch('https://api.github.com/users/kimookpong/repos?per_page=100&sort=updated', {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error('GitHub API unavailable');
      const allRepos = (await response.json()).filter(repo => !repo.fork && !repo.archived);
      repos = allRepos
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 9);
      const stars = allRepos.reduce((total, repo) => total + repo.stargazers_count, 0);
      document.querySelector('#ghRepos').textContent = allRepos.length;
      document.querySelector('#ghStars').textContent = stars;
      const languageCounts = allRepos.reduce((result, repo) => {
        if (repo.language) result[repo.language] = (result[repo.language] || 0) + 1;
        return result;
      }, {});
      document.querySelector('#languageStats').innerHTML = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([language, count]) => `<span class="language-chip"><i></i>${escapeHtml(language)} · ${count}</span>`).join('');
      const profileResponse = await fetch('https://api.github.com/users/kimookpong', {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        document.querySelector('#ghFollowers').textContent = profile.followers;
        document.querySelector('#ghFollowing').textContent = profile.following;
      }
      renderRepos();
    } catch {
      const lang = currentLang();
      document.querySelector('#publicRepos').innerHTML =
        `<p class="repo-error">${text[lang].repoError} <a href="https://github.com/kimookpong?tab=repositories" target="_blank" rel="noopener">GitHub ↗</a></p>`;
    }
  }

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => setTimeout(renderExtras));
  });
  const requestedLang = new URLSearchParams(location.search).get('lang');
  if (requestedLang === 'en') document.querySelector('[data-lang="en"]').click();
  renderExtras();
  loadRepos();
})();
