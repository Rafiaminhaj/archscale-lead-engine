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
      const replyBox = document.getElementById('outboundReplyBox');
      const outboundText = document.getElementById('outboundText');
      replyBox.style.display = 'block';
      outboundText.innerText = `"${data.lead.conversation_history[1].text}"`;

      const ledText = document.getElementById('tuyaLedText');
      const ledDot = document.getElementById('tuyaLedDot');
      if (data.tuya_iot_event && data.lead.score >= 80) {
        if (ledText) ledText.innerText = `💡 Tuya Studio Light: TURNED ON (#00FF00 - ${data.lead.sender_name})`;
        if (ledDot) ledDot.style.boxShadow = "0 0 20px #00ff88, 0 0 35px #00ff88";
      }

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

  let hotCount = 0;
  let warmCount = 0;

  leads.forEach(lead => {
    if (lead.score >= 80) hotCount++;
    else if (lead.score >= 40) warmCount++;

    const scoringReasons = (lead.reasons || []).map(r => `<span style="background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px; font-size:0.7rem; font-family:monospace;">${escapeHtml(r)}</span>`).join(' ');

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

      <!-- Transparent Scoring Allocation -->
      <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
        <span style="font-size: 0.7rem; color: #9ca3af; font-weight: 700;">SCORE ALLOCATION:</span>
        ${scoringReasons}
      </div>

      <!-- Automated Triggered Action -->
      <div class="action-bar">
        <span>⚡ <strong>3-Tier Triage Action:</strong> ${escapeHtml(lead.automated_action)}</span>
        <button onclick="openBriefModal('${lead.lead_id}')" style="background: #10b981; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
          View Brief PDF
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById('statTotal').innerText = leads.length;
  document.getElementById('statQualified').innerText = hotCount;
  if (document.getElementById('statWarm')) {
    document.getElementById('statWarm').innerText = warmCount;
  }
}

function setPreset(num) {
  const name = document.getElementById('senderName');
  const msg = document.getElementById('leadMsg');

  if (num === 1) {
    name.value = "Rajesh Singhania";
    msg.value = "Looking for complete luxury villa architecture and interior design for 4500sqft plot in Whitefield. Budget around 80-90 Lakhs, start in 1 month.";
  } else if (num === 2) {
    name.value = "Priya Nambiar";
    msg.value = "Need commercial interior design for 3000 sq ft IT office space in Electronic City. Budget 45-50L, modern industrial theme.";
  } else if (num === 3) {
    name.value = "Amit Kumar";
    msg.value = "Hi, 3bhk banglore 2200sqft interior quote.";
  }
}

function openBriefModal(leadId) {
  const lead = currentLeads.find(l => l.lead_id === leadId);
  if (!lead) return;

  document.getElementById('modalLeadId').innerText = `Official Studio Brief Card Document | Ref: ${lead.lead_id} | ${lead.timestamp}`;
  const body = document.getElementById('modalBody');

  const scoringList = (lead.reasons || []).map(r => `<li style="margin-bottom:3px;">${escapeHtml(r)}</li>`).join('');

  body.innerHTML = `
    <!-- Studio Header -->
    <div style="background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15)); padding: 18px; border-radius: 12px; border: 1px solid rgba(6,182,212,0.3); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 1.2rem; font-weight: 800; color: #f3f4f6;">ARCHDESIGN STUDIO BRIEF CARD</div>
        <div style="font-size: 0.85rem; color: #06b6d4; font-weight: 600;">Client: ${escapeHtml(lead.sender_name)} (${escapeHtml(lead.phone)})</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.1rem; font-weight: 800; color: ${lead.badge_color};">${lead.score}/100</div>
        <div style="font-size: 0.75rem; color: #9ca3af; font-weight: 700;">${lead.status}</div>
      </div>
    </div>

    <!-- Parameter Table -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-family: monospace;">
      <div style="background: rgba(15,23,42,0.9); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="color: #9ca3af; font-size: 0.75rem;">PROPERTY SCOPE</div>
        <div style="color: #06b6d4; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.property_type)}</div>
      </div>
      <div style="background: rgba(15,23,42,0.9); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="color: #9ca3af; font-size: 0.75rem;">CARPET AREA</div>
        <div style="color: #10b981; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.carpet_area)}</div>
      </div>
      <div style="background: rgba(15,23,42,0.9); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="color: #9ca3af; font-size: 0.75rem;">TARGET BUDGET RANGE</div>
        <div style="color: #f59e0b; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.budget)}</div>
      </div>
      <div style="background: rgba(15,23,42,0.9); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="color: #9ca3af; font-size: 0.75rem;">PROJECT TIMELINE</div>
        <div style="color: #c084fc; font-weight: 700; font-size: 1rem;">${escapeHtml(lead.spec.timeline)}</div>
      </div>
    </div>

    <!-- Design Style -->
    <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
      <div style="font-size: 0.75rem; color: #9ca3af; font-weight: 700;">PREFERRED DESIGN STYLE & LANGUAGE:</div>
      <div style="font-size: 0.9rem; color: #f3f4f6; margin-top: 4px; font-weight: 600;">${escapeHtml(lead.spec.design_style)}</div>
    </div>

    <!-- Transparent Score Allocation Breakdown -->
    <div style="background: rgba(15,23,42,0.9); border: 1px solid rgba(6,182,212,0.3); padding: 12px; border-radius: 10px;">
      <div style="font-size: 0.75rem; font-weight: 700; color: #06b6d4; margin-bottom: 4px;">🎯 SCORING ALLOCATION & RUBRIC (JUDGES VIEW):</div>
      <div style="font-size: 0.7rem; color: #f59e0b; margin-bottom: 6px; font-family: monospace;">
        Rubric: Budget (25) > Area (20) > Scope (15) > Timeline (10-15) > Base (20). Hot ≥ 80 auto-dispatches to architect.
      </div>
      <ul style="font-size: 0.75rem; color: #d1d5db; padding-left: 20px; font-family: monospace;">
        ${scoringList}
      </ul>
    </div>

    <!-- 3-Tier Automated Workflow Action -->
    <div style="background: ${lead.badge_color}15; border: 1px solid ${lead.badge_color}44; padding: 12px; border-radius: 10px; color: ${lead.badge_color};">
      <div style="font-size: 0.8rem; font-weight: 700;">⚡ 3-Tier Automated Triage Action:</div>
      <div style="font-size: 0.8rem; margin-top: 2px;">${escapeHtml(lead.automated_action)}</div>
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
