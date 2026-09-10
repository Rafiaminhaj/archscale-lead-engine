let currentLeads = [];

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
      // Show simulated outbound WhatsApp response box
      const replyBox = document.getElementById('outboundReplyBox');
      const outboundText = document.getElementById('outboundText');
      replyBox.style.display = 'block';
      outboundText.innerText = `"${data.lead.conversation_history[1].text}"`;

      fetchLeads();
    }
  });
});

async function fetchLeads() {
  const res = await fetch('/api/leads');
  const data = await res.json();
  currentLeads = data.leads || [];
  renderLeads(currentLeads);
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
        <button onclick="openBriefModal('${lead.lead_id}')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
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

function openBriefModal(leadId) {
  const lead = currentLeads.find(l => l.lead_id === leadId);
  if (!lead) return;

  document.getElementById('modalLeadId').innerText = `Machine-Readable Brief Spec | ID: ${lead.lead_id} | ${lead.timestamp}`;
  const body = document.getElementById('modalBody');
  
  body.innerHTML = `
    <div style="background: rgba(15,23,42,0.8); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <div style="font-size: 1.1rem; font-weight: 800; color: #f3f4f6;">Client: ${escapeHtml(lead.sender_name)}</div>
      <div style="font-size: 0.85rem; color: #9ca3af; margin-top: 4px;">Phone: ${escapeHtml(lead.phone)}</div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-family: monospace;">
      <div style="background: rgba(6,182,212,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(6,182,212,0.3);">
        <div style="color: #9ca3af; font-size: 0.75rem;">PROPERTY SCOPE</div>
        <div style="color: #06b6d4; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.property_type)}</div>
      </div>
      <div style="background: rgba(16,185,129,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.3);">
        <div style="color: #9ca3af; font-size: 0.75rem;">CARPET AREA</div>
        <div style="color: #10b981; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.carpet_area)}</div>
      </div>
      <div style="background: rgba(245,158,11,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(245,158,11,0.3);">
        <div style="color: #9ca3af; font-size: 0.75rem;">ESTIMATED BUDGET</div>
        <div style="color: #f59e0b; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.budget)}</div>
      </div>
      <div style="background: rgba(139,92,246,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(139,92,246,0.3);">
        <div style="color: #9ca3af; font-size: 0.75rem;">TIMELINE</div>
        <div style="color: #c084fc; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.timeline)}</div>
      </div>
    </div>

    <div style="background: rgba(255,255,255,0.03); padding: 14px; border-radius: 10px;">
      <div style="font-size: 0.75rem; color: #9ca3af; font-weight: 700;">DESIGN STYLE PREFERENCE:</div>
      <div style="font-size: 0.95rem; color: #f3f4f6; margin-top: 4px; font-weight: 600;">${escapeHtml(lead.spec.design_style)}</div>
    </div>

    <div style="background: ${lead.badge_color}15; border: 1px solid ${lead.badge_color}44; padding: 14px; border-radius: 10px; color: ${lead.badge_color};">
      <div style="font-size: 0.8rem; font-weight: 700;">QUALIFICATION SCORE: ${lead.score}/100 — ${lead.status}</div>
      <div style="font-size: 0.8rem; margin-top: 4px;">⚡ Automated Workflow: ${escapeHtml(lead.automated_action)}</div>
    </div>
  `;

  document.getElementById('briefModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('briefModal').style.display = 'none';
}

function escapeHtml(text) {
  return String(text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
