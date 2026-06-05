const API = '/api';
const store = {
  token: localStorage.getItem('ismo_token') || '',
  user: JSON.parse(localStorage.getItem('ismo_user') || 'null'),
  lastIds: JSON.parse(localStorage.getItem('ismo_ids') || '{}'),
};

function saveAuth(data) {
  store.token = data.token;
  store.user = { _id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email, role: data.role };
  localStorage.setItem('ismo_token', store.token);
  localStorage.setItem('ismo_user', JSON.stringify(store.user));
  saveId('_userId', data._id);
  updateHeader();
}

function clearAuth() {
  store.token = '';
  store.user = null;
  localStorage.removeItem('ismo_token');
  localStorage.removeItem('ismo_user');
  updateHeader();
}

function saveId(key, value) {
  if (!value) return;
  const id = typeof value === 'object' ? (value._id || value.id) : value;
  if (!id) return;
  store.lastIds[key] = id;
  localStorage.setItem('ismo_ids', JSON.stringify(store.lastIds));
}

function getId(key) {
  return store.lastIds[key] || '';
}

function updateHeader() {
  const badge = document.getElementById('auth-badge');
  const userEl = document.getElementById('user-display');
  if (store.user) {
    badge.textContent = 'Connecté';
    badge.className = 'badge connected';
    userEl.textContent = `${store.user.firstName} ${store.user.lastName} (${store.user.role})`;
  } else {
    badge.textContent = 'Non connecté';
    badge.className = 'badge disconnected';
    userEl.textContent = '';
  }
}

function showResponse(method, url, status, data) {
  const panel = document.getElementById('response-panel');
  const ok = status >= 200 && status < 300;
  panel.innerHTML = `<span class="${ok ? 'status-ok' : 'status-err'}">${method} ${url} → ${status}</span>\n\n${JSON.stringify(data, null, 2)}`;
}

async function api(method, path, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && store.token) headers['Authorization'] = `Bearer ${store.token}`;

  const opts = { method, headers };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${API}${path}`, opts);
  let data;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  showResponse(method, path, res.status, data);

  if (data._id) saveId('_last', data._id);
  if (data.data?._id) saveId('_last', data.data._id);
  if (Array.isArray(data) && data[0]?._id) saveId('_last', data[0]._id);
  if (Array.isArray(data.data) && data.data[0]?._id) saveId('_last', data.data[0]._id);

  return { ok: res.ok, status: res.status, data };
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function num(id) {
  const v = val(id);
  return v ? Number(v) : undefined;
}

function jsonVal(id) {
  const v = val(id);
  if (!v) return undefined;
  try { return JSON.parse(v); } catch (e) { throw new Error(`JSON invalide (${id}): ${e.message}`); }
}

function bindNav() {
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.panel).classList.add('active');
    });
  });
}

function bindActions() {
  document.getElementById('btn-health').addEventListener('click', () => api('GET', '/health', undefined, false));

  document.getElementById('btn-register').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/auth/register', {
      firstName: val('reg-first'),
      lastName: val('reg-last'),
      email: val('reg-email'),
      password: val('reg-pass'),
      role: val('reg-role'),
    }, false);
    if (ok) saveAuth(data);
  });

  document.getElementById('btn-login').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/auth/login', {
      email: val('login-email'),
      password: val('login-pass'),
    }, false);
    if (ok) saveAuth(data);
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    clearAuth();
    showResponse('LOCAL', '/logout', 200, { message: 'Déconnecté' });
  });

  document.getElementById('btn-me').addEventListener('click', () => api('GET', '/auth/me'));
  document.getElementById('btn-admin').addEventListener('click', () => api('GET', '/auth/admin-data'));

  document.getElementById('btn-fil-list').addEventListener('click', () => api('GET', '/filieres'));
  document.getElementById('btn-fil-create').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/filieres', { code: val('fil-code'), name: val('fil-name'), description: val('fil-desc') });
    if (ok) saveId('filiere', data.data);
  });
  document.getElementById('btn-fil-get').addEventListener('click', () => api('GET', `/filieres/${val('fil-id') || getId('filiere')}`));
  document.getElementById('btn-fil-update').addEventListener('click', () => api('PUT', `/filieres/${val('fil-id') || getId('filiere')}`, { name: val('fil-name'), description: val('fil-desc') }));
  document.getElementById('btn-fil-delete').addEventListener('click', () => api('DELETE', `/filieres/${val('fil-id') || getId('filiere')}`));

  document.getElementById('btn-mod-list').addEventListener('click', () => api('GET', '/modules'));
  document.getElementById('btn-mod-create').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/modules', { code: val('mod-code'), name: val('mod-name'), filiere: val('mod-filiere') || getId('filiere'), coefficient: num('mod-coef') });
    if (ok) saveId('module', data.data);
  });
  document.getElementById('btn-mod-get').addEventListener('click', () => api('GET', `/modules/${val('mod-id') || getId('module')}`));
  document.getElementById('btn-mod-update').addEventListener('click', () => api('PUT', `/modules/${val('mod-id') || getId('module')}`, { name: val('mod-name'), coefficient: num('mod-coef') }));
  document.getElementById('btn-mod-delete').addEventListener('click', () => api('DELETE', `/modules/${val('mod-id') || getId('module')}`));

  document.getElementById('btn-comp-list').addEventListener('click', () => api('GET', '/competences'));
  document.getElementById('btn-comp-create').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/competences', { code: val('comp-code'), name: val('comp-name'), description: val('comp-desc'), module: val('comp-module') || getId('module') });
    if (ok) saveId('competence', data.data);
  });
  document.getElementById('btn-comp-get').addEventListener('click', () => api('GET', `/competences/${val('comp-id') || getId('competence')}`));
  document.getElementById('btn-comp-update').addEventListener('click', () => api('PUT', `/competences/${val('comp-id') || getId('competence')}`, { name: val('comp-name'), description: val('comp-desc') }));
  document.getElementById('btn-comp-delete').addEventListener('click', () => api('DELETE', `/competences/${val('comp-id') || getId('competence')}`));

  document.getElementById('btn-abs-session').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/absences/session', {
      module: val('abs-module') || getId('module'),
      groupe: val('abs-groupe'),
      date: val('abs-date'),
      startTime: val('abs-start'),
      endTime: val('abs-end'),
    });
    if (ok) saveId('session', data.data);
  });

  document.getElementById('btn-abs-mark').addEventListener('click', () => {
    try {
      const attendances = jsonVal('abs-attendances') || [{ stagiaire: getId('_userId'), status: 'Présent' }];
      api('POST', `/absences/session/${val('abs-session-id') || getId('session')}/mark`, { attendances });
    } catch (e) { showResponse('ERROR', '/absences/mark', 0, { error: e.message }); }
  });

  document.getElementById('btn-abs-mine').addEventListener('click', () => api('GET', '/absences/mes-absences'));
  document.getElementById('btn-abs-stats').addEventListener('click', () => api('GET', `/absences/statistiques/${val('abs-stagiaire') || getId('_userId')}`));

  document.getElementById('btn-bar-list').addEventListener('click', () => api('GET', '/barremes'));
  document.getElementById('btn-bar-create').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/barremes', { nom: val('bar-nom'), description: val('bar-desc'), statut: val('bar-statut') }, false);
    if (ok) saveId('barreme', data);
  });
  document.getElementById('btn-bar-get').addEventListener('click', () => api('GET', `/barremes/${val('bar-id') || getId('barreme')}`, undefined, false));
  document.getElementById('btn-bar-update').addEventListener('click', () => api('PUT', `/barremes/${val('bar-id') || getId('barreme')}`, { nom: val('bar-nom'), description: val('bar-desc') }, false));
  document.getElementById('btn-bar-delete').addEventListener('click', () => api('DELETE', `/barremes/${val('bar-id') || getId('barreme')}`, undefined, false));
  document.getElementById('btn-rub-create').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/barremes/rubriques', {
      nom: val('rub-nom'), poids: num('rub-poids'), ordre: num('rub-ordre'),
      barremeId: val('rub-barreme') || getId('barreme'),
      epreuveId: val('rub-epreuve') || getId('module'),
    }, false);
    if (ok && data.rubrique) saveId('rubrique', data.rubrique);
  });
  document.getElementById('btn-rub-update').addEventListener('click', () => api('PUT', `/barremes/rubriques/${val('rub-id') || getId('rubrique')}`, { nom: val('rub-nom'), poids: num('rub-poids') }, false));
  document.getElementById('btn-rub-delete').addEventListener('click', () => api('DELETE', `/barremes/rubriques/${val('rub-id') || getId('rubrique')}`, undefined, false));

  document.getElementById('btn-note-list').addEventListener('click', () => api('GET', '/notes', undefined, false));
  document.getElementById('btn-note-create').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/notes', {
      candidatId: val('note-candidat') || getId('_userId'),
      epreuveId: val('note-epreuve') || getId('module'),
      note: num('note-value'),
    }, false);
    if (ok) saveId('note', data);
  });
  document.getElementById('btn-note-update').addEventListener('click', () => api('PUT', `/notes/${val('note-id') || getId('note')}`, { note: num('note-value') }, false));
  document.getElementById('btn-note-validate').addEventListener('click', () => api('POST', `/notes/${val('note-id') || getId('note')}/validate`, {}, false));
  document.getElementById('btn-note-publish').addEventListener('click', () => api('POST', `/notes/${val('note-id') || getId('note')}/publish`, {}, false));
  document.getElementById('btn-note-import').addEventListener('click', () => api('POST', '/notes/import-csv', {}, false));

  document.getElementById('btn-qcm-upload').addEventListener('click', () => api('POST', '/qcm/upload', {}, false));
  document.getElementById('btn-qcm-process').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/qcm/process', { scanId: val('qcm-scan-id') || getId('scan') }, false);
    if (ok && data.scan) saveId('scan', data.scan);
  });
  document.getElementById('btn-qcm-report').addEventListener('click', () => api('GET', `/qcm/report/${val('qcm-scan-id') || getId('scan')}`, undefined, false));

  document.getElementById('btn-eval-create').addEventListener('click', async () => {
    try {
      const rubriques = jsonVal('eval-rubriques') || [{ rubriqueId: getId('rubrique'), note: 16 }];
      const { ok, data } = await api('POST', '/evaluations', {
        candidatId: val('eval-candidat') || getId('_userId'),
        examinateurId: val('eval-examinateur') || getId('_userId'),
        rubriques,
        commentaires: jsonVal('eval-comments') || { observation: 'Très bien !' },
      }, false);
      if (ok) saveId('evaluation', data);
    } catch (e) { showResponse('ERROR', '/evaluations', 0, { error: e.message }); }
  });
  document.getElementById('btn-eval-get').addEventListener('click', () => api('GET', `/evaluations/${val('eval-id') || getId('evaluation')}`, undefined, false));
  document.getElementById('btn-eval-update').addEventListener('click', () => {
    try {
      const body = {};
      const rubriques = jsonVal('eval-rubriques');
      if (rubriques) body.rubriques = rubriques;
      const comments = jsonVal('eval-comments');
      if (comments) body.commentaires = comments;
      api('PUT', `/evaluations/${val('eval-id') || getId('evaluation')}`, body, false);
    } catch (e) { showResponse('ERROR', '/evaluations', 0, { error: e.message }); }
  });
  document.getElementById('btn-eval-upload').addEventListener('click', () => api('POST', '/evaluations/upload', {}, false));

  document.getElementById('btn-efm-list').addEventListener('click', () => api('GET', '/efm', undefined, false));
  document.getElementById('btn-efm-create').addEventListener('click', async () => {
    const { ok, data } = await api('POST', '/efm', {
      nom: val('efm-nom'), niveau: val('efm-niveau'),
      dateOuverture: val('efm-ouverture'), dateFermeture: val('efm-fermeture'),
    }, false);
    if (ok) saveId('efm', data);
  });
  document.getElementById('btn-efm-update').addEventListener('click', () => api('PUT', `/efm/${val('efm-id') || getId('efm')}`, { nom: val('efm-nom') }, false));
  document.getElementById('btn-efm-seal').addEventListener('click', () => api('POST', `/efm/${val('efm-id') || getId('efm')}/seal`, { userId: val('efm-user') || getId('_userId') }, false));
  document.getElementById('btn-efm-pdf').addEventListener('click', () => api('GET', `/efm/${val('efm-id') || getId('efm')}/export-pdf`, undefined, false));
  document.getElementById('btn-efm-excel').addEventListener('click', () => api('GET', `/efm/${val('efm-id') || getId('efm')}/export-excel`, undefined, false));
}

function prefillIds() {
  const map = {
    'fil-id': 'filiere', 'mod-filiere': 'filiere', 'mod-id': 'module',
    'comp-module': 'module', 'comp-id': 'competence',
    'abs-module': 'module', 'abs-session-id': 'session', 'abs-stagiaire': '_userId',
    'bar-id': 'barreme', 'rub-barreme': 'barreme', 'rub-epreuve': 'module', 'rub-id': 'rubrique',
    'note-candidat': '_userId', 'note-epreuve': 'module', 'note-id': 'note',
    'qcm-scan-id': 'scan', 'eval-candidat': '_userId', 'eval-examinateur': '_userId', 'eval-id': 'evaluation',
    'efm-id': 'efm', 'efm-user': '_userId',
  };
  Object.entries(map).forEach(([elId, storeKey]) => {
    const el = document.getElementById(elId);
    if (el && !el.value && getId(storeKey)) el.placeholder = getId(storeKey);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeader();
  bindNav();
  bindActions();
  prefillIds();
  document.querySelector('nav button').click();
});
