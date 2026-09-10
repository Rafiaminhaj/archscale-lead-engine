document.addEventListener('DOMContentLoaded', () => {
  fetchLeads();

  const form = document.getElementById('leadForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sender_name = document.getElementById('senderName').value;
    const phone = document.getElementById('phoneNum').value;
    const message = document.getElementById('leadMsg').value;

    const res = await fetch('/api/inbound-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_name, phone, message })
    });
    const data = await res.json();
    if (data.status === 'success') {
      fetchLeads();
      alert(`✅ Lead Processed & Project Brief Card Generated! Intent Score: ${data.lead.score}/100`);
    }
  });
});

async function fetchLeads() {
  const res = await fetch('/api/leads');
  const data = await res.json();
  renderLeads(data.leads || []);
}

function renderLeads(leads) {
  const container = document.getElementById('leadsList');
  container.innerHTML = '';

  let qualifiedCount = 0;

  leads.forEach(lead => {
    if (lead.score >= 75) qualifiedCount++;

    const card = document.createElement('div');
    card.className = 'lead-card';
    card.innerHTML = `
      <div class="lead-top-row">
        <div>
          <div class="client-name">${escapeHtml(lead.sender_name)} <span style="font-size:0.75rem; color:#9ca3af; font-family:monospace;">(${lead.lead_id})</span></div>
          <div class="client-meta">
            <span>📱 ${escapeHtml(lead.phone)}</span>
            <span>🕒 ${escapeHtml(lead.timestamp)}</span>
          </div>
        </div>
        <div class="score-badge" style="background: ${lead.badge_color}22; color: ${lead.badge_color}; border: 1px solid ${lead.badge_color}55;">
          🔥 ${lead.score}/100 — ${lead.status}
        </div>
      </div>

      <!-- Raw Inbound Message -->
      <div style="background: rgba(15, 23, 42, 0.8); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; color: #d1d5db; border-left: 3px solid #06b6d4;">
        <span style="font-weight: 700; color: #06b6d4;">WhatsApp Inbound:</span> "${escapeHtml(lead.raw_message)}"
      </div>

      <!-- Machine-Readable Architectural Spec Grid -->
      <div class="spec-grid">
        <div class="spec-item">
          <span class="spec-title">Property Scope</span>
          <span class="spec-value">${escapeHtml(lead.spec.property_type)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-title">Carpet Area</span>
          <span class="spec-value" style="color: #06b6d4;">${escapeHtml(lead.spec.carpet_area)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-title">Estimated Budget</span>
          <span class="spec-value" style="color: #10b981;">${escapeHtml(lead.spec.budget)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-title">Timeline</span>
          <span class="spec-value" style="color: #f59e0b;">${escapeHtml(lead.spec.timeline)}</span>
        </div>
      </div>

      <!-- Automated Triggered Action -->
      <div class="action-bar">
        <span>⚡ <strong>Triggered Workflow:</strong> ${escapeHtml(lead.automated_action)}</span>
        <button onclick="triggerAction('${lead.lead_id}')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
          View Brief PDF
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById('statTotal').innerText = leads.length;
  document.getElementById('statQualified').innerText = qualifiedCount;
}

function setPreset(num) {
  const name = document.getElementById('senderName');
  const msg = document.getElementById('leadMsg');

  if (num === 1) {
    name.value = "Rajesh Singhania";
    msg.value = "Looking for complete luxury villa architecture and interior design for 4500 sqft plot in Whitefield. Budget around 80 Lakhs, start in 1 month.";
  } else if (num === 2) {
    name.value = "Priya Nambiar";
    msg.value = "Need commercial interior design for 3000 sqft IT office space in Electronic City. Budget 50 Lakhs, modern theme.";
  } else if (num === 3) {
    name.value = "Amit Kumar";
    msg.value = "Hi, need interior design quote for home.";
  }
}

function triggerAction(id) {
  alert(`📄 Generating Machine-Readable Architectural Brief Card PDF for Lead ${id}... Ready for Principal Architect review!`);
}

function escapeHtml(text) {
  return String(text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
