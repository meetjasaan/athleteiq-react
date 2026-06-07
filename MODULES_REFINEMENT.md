# Messaging, Members & Roster Modules Refinement

## OVERVIEW
This document provides the JavaScript functions and HTML templates for the three refined modules:
1. **Messaging** - Threaded history with archive system
2. **Members** - Directory with add member functionality
3. **Roster** - Simplified with edit profile capability

---

## STATE UPDATES

Add these to the STATE object initialization:

```javascript
const STATE = {
  // ... existing properties ...
  messageThreads: [
    // Format: { id, recipientGroup, lastMessage, timestamp, messageCount, isArchived, messages: [...] }
  ],
  members: [
    // Format: { id, name, role, email, phone, assignedTeams }
  ],
  messagingState: {
    selectedThreadId: null,
    showArchived: false,
    displayLimit: 10
  },
  rosterEditModal: {
    show: false,
    playerId: null,
    formData: {}
  }
};
```

---

## JAVASCRIPT FUNCTIONS

### MESSAGING MODULE

```javascript
// Initialize message threads (call on dashboard load)
function initMessageThreads() {
  if (STATE.messageThreads.length === 0) {
    STATE.messageThreads = [
      {
        id: 1,
        recipientGroup: 'All Parents',
        lastMessage: 'Practice moved to Thursday at 5 PM',
        timestamp: new Date(Date.now() - 3600000),
        messageCount: 5,
        isArchived: false,
        messages: []
      }
    ];
  }
}

function renderMessagingThreads() {
  const threadList = document.getElementById('messaging-threads-list');
  if (!threadList) return;
  threadList.innerHTML = '';

  const filtered = STATE.messageThreads.filter(t => t.isArchived === STATE.messagingState.showArchived);
  
  if (filtered.length === 0) {
    threadList.innerHTML = `<div class="p-4 text-xs text-gray-400 text-center">${STATE.messagingState.showArchived ? 'No archived threads' : 'No active threads yet'}</div>`;
    return;
  }

  filtered.forEach(thread => {
    const div = document.createElement('div');
    const isSelected = STATE.messagingState.selectedThreadId === thread.id;
    const bgClass = isSelected ? 'bg-white border-l-4 border-brand' : 'hover:bg-clinical2 border-l-4 border-transparent';
    
    div.className = `p-3 cursor-pointer ${bgClass} border border-borderLight transition-all`;
    div.onclick = () => selectMessageThread(thread.id);
    
    div.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="font-bold text-dark text-sm truncate">${thread.recipientGroup}</div>
          <div class="text-xs text-gray-500 mt-0.5 truncate">${thread.lastMessage}</div>
        </div>
        <span class="text-[10px] text-gray-400 font-mono whitespace-nowrap">${new Date(thread.timestamp).toLocaleTimeString()}</span>
      </div>
      <div class="flex items-center justify-between mt-2">
        <span class="text-[9px] bg-brand/10 text-brand font-bold px-2 py-0.5">${thread.messageCount} messages</span>
      </div>
    `;
    
    threadList.appendChild(div);
  });
}

function selectMessageThread(threadId) {
  STATE.messagingState.selectedThreadId = threadId;
  renderMessagingThreads();
  renderMessagingDetail();
}

function renderMessagingDetail() {
  const detailPanel = document.getElementById('messaging-detail-panel');
  if (!detailPanel) return;
  
  const thread = STATE.messageThreads.find(t => t.id === STATE.messagingState.selectedThreadId);
  
  if (!thread) {
    detailPanel.innerHTML = '<div class="text-center text-gray-400 text-xs py-8">Select a thread to view details</div>';
    return;
  }
  
  let html = `
    <div class="space-y-2 max-h-96 overflow-y-auto mb-4">
  `;
  
  if (thread.messages.length === 0) {
    html += '<div class="text-xs text-gray-400 text-center py-6">No messages in this thread yet</div>';
  } else {
    thread.messages.forEach(msg => {
      const isInbound = msg.sender !== 'You';
      const alignClass = isInbound ? 'flex-start' : 'flex-end';
      const bgClass = isInbound ? 'bg-clinical border border-borderLight' : 'bg-brand text-white';
      
      html += `
        <div class="flex ${alignClass}">
          <div class="${bgClass} px-3 py-2 rounded max-w-xs text-sm font-body">
            ${msg.text}
            <div class="text-[9px] ${isInbound ? 'text-gray-500' : 'text-white/70'} mt-1">${new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      `;
    });
  }
  
  html += `
    </div>
    <div class="border-t border-borderLight pt-3 flex gap-2">
      <input type="text" id="messaging-reply-input" placeholder="Type your response..." class="flex-1 px-3 py-2 border border-borderLight bg-white text-xs outline-none focus:border-brand">
      <button onclick="sendMessageReply(${thread.id})" class="bg-dark text-white px-4 py-2 text-xs font-bold hover:bg-brand hover:text-dark transition-colors">Send</button>
    </div>
    <div class="mt-2 flex gap-2">
      <button onclick="archiveThread(${thread.id})" class="text-[10px] text-gray-500 hover:text-dark transition-colors">📦 Archive</button>
      <button onclick="toggleThreadArchive(${thread.id})" class="text-[10px] text-gray-500 hover:text-dark transition-colors">${thread.isArchived ? 'Restore' : 'Archive'}</button>
    </div>
  `;
  
  detailPanel.innerHTML = html;
}

function sendMessageReply(threadId) {
  const input = document.getElementById('messaging-reply-input');
  if (!input || !input.value.trim()) return;
  
  const thread = STATE.messageThreads.find(t => t.id === threadId);
  if (!thread) return;
  
  thread.messages.push({
    id: thread.messages.length + 1,
    sender: 'You',
    text: input.value,
    timestamp: new Date()
  });
  
  thread.lastMessage = input.value;
  thread.timestamp = new Date();
  thread.messageCount++;
  
  input.value = '';
  renderMessagingDetail();
  renderMessagingThreads();
}

function toggleThreadArchive(threadId) {
  const thread = STATE.messageThreads.find(t => t.id === threadId);
  if (thread) {
    thread.isArchived = !thread.isArchived;
    STATE.messagingState.selectedThreadId = null;
    renderMessagingThreads();
    renderMessagingDetail();
  }
}

function toggleShowArchived() {
  STATE.messagingState.showArchived = !STATE.messagingState.showArchived;
  STATE.messagingState.selectedThreadId = null;
  renderMessagingThreads();
  renderMessagingDetail();
}

function loadMoreMessages() {
  STATE.messagingState.displayLimit += 10;
  renderMessagingThreads();
}
```

### MEMBERS MODULE

```javascript
function renderMembersDirectory() {
  const tbody = document.getElementById('members-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = STATE.members.filter(m => 
    m.name.toLowerCase().includes(STATE.membersSearch) ||
    m.email.toLowerCase().includes(STATE.membersSearch)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-xs text-gray-400">No members found</td></tr>';
    return;
  }

  filtered.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-2.5 font-bold text-dark">${m.name}</td>
      <td class="p-2.5 text-xs text-gray-600">${m.role}</td>
      <td class="p-2.5 text-xs text-gray-600">${m.assignedTeams.join(', ') || 'All Teams'}</td>
      <td class="p-2.5 text-xs text-gray-500">${m.email}</td>
      <td class="p-2.5 text-xs text-gray-500">${m.phone || '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddMemberModal() {
  const modal = document.getElementById('add-member-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeAddMemberModal() {
  const modal = document.getElementById('add-member-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('add-member-form').reset();
  }
}

function submitAddMember(e) {
  e.preventDefault();
  
  const name = document.getElementById('new-member-name').value.trim();
  const role = document.getElementById('new-member-role').value;
  const email = document.getElementById('new-member-email').value.trim();
  const phone = document.getElementById('new-member-phone').value.trim();
  const teams = Array.from(document.querySelectorAll('#new-member-teams input:checked')).map(cb => cb.value);

  if (!name || !role || !email) {
    alert('Name, role, and email are required');
    return;
  }

  const newMember = {
    id: STATE.members.length ? Math.max(...STATE.members.map(m => m.id)) + 1 : 1,
    name,
    role,
    email,
    phone,
    assignedTeams: teams
  };

  STATE.members.push(newMember);
  
  // Update messaging dropdown
  updateMessagingRecipients();
  
  renderMembersDirectory();
  closeAddMemberModal();
  alert(`${name} has been added to the members directory.`);
}

function updateMessagingRecipients() {
  const recipientSelect = document.getElementById('messaging-recipient-select');
  if (!recipientSelect) return;
  
  const currentValue = recipientSelect.value;
  recipientSelect.innerHTML = '<option value="all">All Members</option>';
  
  const roles = [...new Set(STATE.members.map(m => m.role))];
  roles.forEach(role => {
    const count = STATE.members.filter(m => m.role === role).length;
    const opt = document.createElement('option');
    opt.value = role;
    opt.textContent = `${role} (${count})`;
    recipientSelect.appendChild(opt);
  });
  
  recipientSelect.value = currentValue || 'all';
}
```

### ROSTER MODULE

```javascript
function openEditProfileModal(playerId) {
  const player = STATE.players.find(p => p.id === playerId);
  if (!player) return;
  
  STATE.rosterEditModal.show = true;
  STATE.rosterEditModal.playerId = playerId;
  STATE.rosterEditModal.formData = { ...player };
  
  const modal = document.getElementById('edit-profile-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    populateEditProfileForm(player);
  }
}

function closeEditProfileModal() {
  STATE.rosterEditModal.show = false;
  STATE.rosterEditModal.playerId = null;
  STATE.rosterEditModal.formData = {};
  
  const modal = document.getElementById('edit-profile-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function populateEditProfileForm(player) {
  document.getElementById('edit-player-name').value = player.name || '';
  document.getElementById('edit-player-jersey').value = player.jersey || '';
  document.getElementById('edit-player-position').value = player.position || 'Unassigned';
  document.getElementById('edit-player-height').value = player.height || '';
  document.getElementById('edit-player-weight').value = player.weight || '';
  document.getElementById('edit-player-dob').value = player.dob || '';
}

function submitEditProfile(e) {
  e.preventDefault();
  
  const playerId = STATE.rosterEditModal.playerId;
  const player = STATE.players.find(p => p.id === playerId);
  if (!player) return;

  player.name = document.getElementById('edit-player-name').value.trim();
  player.jersey = document.getElementById('edit-player-jersey').value.trim();
  player.position = document.getElementById('edit-player-position').value;
  player.height = document.getElementById('edit-player-height').value.trim();
  player.weight = document.getElementById('edit-player-weight').value.trim();
  player.dob = document.getElementById('edit-player-dob').value;

  renderRosterTabList();
  closeEditProfileModal();
  alert(`${player.name}'s profile has been updated.`);
}

function renderRosterTabList() {
  const container = document.getElementById('director-roster-list');
  if (!container) return;
  container.innerHTML = '';

  const filtered = STATE.players.filter(p => 
    p.name.toLowerCase().includes(STATE.rosterSearch)
  );

  if (filtered.length === 0 && STATE.players.length > 0) {
    container.innerHTML = '<div class="text-xs text-gray-400 text-center py-4">No players match your search</div>';
    return;
  }

  if (STATE.players.length === 0) {
    container.innerHTML = '<div class="text-xs text-gray-400 text-center py-8">No players added yet</div>';
    return;
  }

  filtered.forEach(p => {
    const div = document.createElement('div');
    const isStub = p.status === 'Administrative Pending';
    const bgClass = isStub ? 'bg-blue-50' : 'bg-clinical hover:bg-white';
    
    div.className = `border border-borderLight p-3 flex flex-wrap items-center justify-between gap-2 ${bgClass} text-xs`;
    div.innerHTML = `
      <div class="font-mono">
        <strong class="text-sm font-display uppercase tracking-tight text-dark block">${p.name}</strong>
        <span class="text-gray-400 text-[10px]">Jersey #${p.jersey} | ${p.position} ${p.dob ? `| DOB: ${p.dob}` : '| Profile Pending'}</span>
        <div class="flex gap-1 mt-1">
          ${p.teams.map(t => `<span class="bg-dark text-white text-[9px] px-1 font-bold">${t}</span>`).join('')}
          ${isStub ? `<span class="bg-blue-600 text-white text-[9px] px-1 font-bold">ADMIN PLAYER</span>` : ''}
        </div>
      </div>
      <div class="flex items-center gap-3 font-mono">
        <div class="text-right">
          <span class="text-[9px] text-gray-400 block">Statement Due</span>
          <strong class="text-dark">${p.balance === 0 ? '$0.00' : `$${p.balance.toFixed(2)}`}</strong>
        </div>
        <button type="button" onclick="openEditProfileModal(${p.id})" class="border border-dark hover:bg-dark hover:text-white px-2 py-1 font-bold text-[10px] uppercase transition-all brutal-clip">
          Edit Profile
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}
```

---

## HTML TEMPLATES

### MESSAGING TAB

Replace the entire `dir-content-messaging` section with:

```html
<!-- MESSAGING TAB -->
<div id="dir-content-messaging" class="dir-tab-panel hidden grid grid-cols-1 lg:grid-cols-3 gap-6">
  
  <!-- THREADS LIST -->
  <div class="lg:col-span-1 border border-borderDark bg-white p-4">
    <div class="mb-4 pb-3 border-b border-borderLight flex justify-between items-center">
      <h4 class="font-display text-lg font-bold text-dark uppercase">Messages</h4>
      <button onclick="toggleShowArchived()" class="text-[10px] font-mono text-brand hover:text-dark transition-colors">
        ${STATE.messagingState.showArchived ? 'Active' : 'Archived'}
      </button>
    </div>
    <div id="messaging-threads-list" class="space-y-1 max-h-96 overflow-y-auto"></div>
    <button onclick="loadMoreMessages()" class="w-full text-[10px] text-gray-500 hover:text-dark mt-3 py-2 border-t border-borderLight transition-colors">
      Show More
    </button>
  </div>

  <!-- MESSAGE COMPOSE & DETAIL -->
  <div class="lg:col-span-2 space-y-4">
    <!-- Compose Section -->
    <div class="border border-borderDark p-5 bg-white">
      <h4 class="font-mono text-[10px] text-brand font-bold uppercase mb-3">Send New Message</h4>
      <div class="space-y-3">
        <div>
          <label class="block font-mono text-[9px] text-gray-400 uppercase font-bold mb-1">Recipients</label>
          <select id="messaging-recipient-select" class="w-full bg-clinical border border-borderLight p-2 text-xs font-mono outline-none focus:border-brand">
            <option value="all">All Members</option>
            <option value="staff">Staff</option>
            <option value="parents">Parents</option>
          </select>
        </div>
        <div>
          <label class="block font-mono text-[9px] text-gray-400 uppercase font-bold mb-1">Message</label>
          <textarea id="new-message-text" placeholder="Type your message..." rows="4" class="w-full bg-clinical border border-borderLight p-2 text-xs font-body outline-none focus:border-brand resize-none"></textarea>
        </div>
        <button onclick="sendNewMessage()" class="w-full bg-dark text-white py-2 font-display font-bold text-sm uppercase hover:bg-brand hover:text-dark transition-all brutal-clip">
          Send Message Blast
        </button>
      </div>
    </div>

    <!-- Message Detail -->
    <div class="border border-borderDark p-5 bg-white">
      <h4 class="font-mono text-[10px] text-gray-500 font-bold uppercase mb-3">Thread Detail</h4>
      <div id="messaging-detail-panel" class="text-xs text-gray-400 text-center py-6">Select a thread to view</div>
    </div>
  </div>
</div>
```

### MEMBERS TAB

Replace the entire `dir-content-members` section with:

```html
<!-- MEMBERS TAB -->
<div id="dir-content-members" class="dir-tab-panel hidden space-y-4">
  <div class="border border-borderDark p-4 bg-white">
    <div class="mb-3 pb-2 border-b border-borderLight flex justify-between items-center flex-wrap gap-2">
      <h3 class="font-display text-xl font-black text-dark uppercase">Members Directory</h3>
      <div class="flex gap-2">
        <input type="text" id="members-search" placeholder="Search by name or email..." onkeyup="filterMembers()" class="px-3 py-1.5 border border-borderLight bg-clinical font-mono text-xs rounded outline-none focus:border-brand w-48">
        <button onclick="openAddMemberModal()" class="bg-dark text-white px-4 py-1.5 text-xs font-bold hover:bg-brand hover:text-dark transition-all">
          + Add Member
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border border-borderLight">
        <thead>
          <tr class="bg-clinical border-b border-borderLight font-bold text-gray-500 text-[10px]">
            <th class="p-2.5">Member Name</th>
            <th class="p-2.5">Role Type</th>
            <th class="p-2.5">Assigned Teams</th>
            <th class="p-2.5">Email</th>
            <th class="p-2.5">Phone Number</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-borderLight text-gray-700" id="members-table-body"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ADD MEMBER MODAL -->
<div id="add-member-modal" class="hidden fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
  <div class="bg-white max-w-md w-full p-6 border border-dark brutal-clip">
    <div class="mb-4 pb-3 border-b border-borderLight">
      <h3 class="font-display text-xl font-black text-dark uppercase">Add Team Member</h3>
      <p class="font-body text-xs text-gray-500 mt-1">Add a staff member, parent, or coach to your directory</p>
    </div>

    <form id="add-member-form" onsubmit="submitAddMember(event)" class="space-y-3">
      <div>
        <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Full Name *</label>
        <input type="text" id="new-member-name" required class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
      </div>

      <div>
        <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Role *</label>
        <select id="new-member-role" required class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
          <option value="">— Select Role —</option>
          <option value="Coach">Coach / Staff</option>
          <option value="Parent">Parent / Guardian</option>
          <option value="Assistant">Assistant Coach</option>
          <option value="Admin">Administrator</option>
        </select>
      </div>

      <div>
        <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Email *</label>
        <input type="email" id="new-member-email" required class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
      </div>

      <div>
        <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Phone Number</label>
        <input type="tel" id="new-member-phone" class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
      </div>

      <div>
        <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-2">Assigned Teams</label>
        <div id="new-member-teams" class="space-y-1">
          ${STATE.activeDivisions.map(div => `
            <label class="flex items-center gap-2 text-xs">
              <input type="checkbox" value="${div}" class="w-4 h-4 border border-borderDark">
              <span>${div}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="flex gap-2 pt-4 border-t border-borderLight">
        <button type="button" onclick="closeAddMemberModal()" class="flex-1 border border-dark text-dark px-3 py-2 text-xs font-bold hover:bg-dark hover:text-white transition-all">
          Cancel
        </button>
        <button type="submit" class="flex-1 bg-dark text-white px-3 py-2 text-xs font-bold hover:bg-brand hover:text-dark transition-all brutal-clip">
          Add Member
        </button>
      </div>
    </form>
  </div>
</div>
```

### ROSTER TAB

Replace the `director-roster-list` rendering and remove the Override button:

```html
<!-- ROSTER TAB (keep existing structure, update list rendering) -->
<div id="dir-content-roster" class="dir-tab-panel hidden space-y-6">
  <!-- Stats remain the same -->
  <div class="grid grid-cols-2 gap-3 max-w-md">
    <div class="border border-borderDark p-3 bg-white">
      <span class="font-mono text-[10px] text-gray-400 uppercase block">Active Players</span>
      <div id="stat-active-count" class="font-display text-3xl font-black text-dark mt-0.5">0</div>
    </div>
    <div class="border border-borderDark p-3 bg-white">
      <span class="font-mono text-[10px] text-gray-400 uppercase block">Roster Limit</span>
      <div id="stat-bracket-cap" class="font-display text-3xl font-black text-red-700 mt-0.5">0</div>
    </div>
  </div>

  <!-- Add Player Form -->
  <div class="border border-borderDark p-5 bg-white">
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-dashed border-borderLight flex-wrap gap-2">
      <h3 class="font-display text-lg font-bold uppercase text-dark">Player Roster</h3>
      <input type="text" id="roster-search" placeholder="Search roster..." onkeyup="filterRoster()" class="px-3 py-1.5 border border-borderLight bg-clinical font-mono text-[10px] rounded outline-none focus:border-brand w-40">
    </div>

    <div class="space-y-2" id="director-roster-list"></div>
  </div>
</div>

<!-- EDIT PROFILE MODAL -->
<div id="edit-profile-modal" class="hidden fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
  <div class="bg-white max-w-md w-full p-6 border border-dark brutal-clip">
    <div class="mb-4 pb-3 border-b border-borderLight">
      <h3 class="font-display text-xl font-black text-dark uppercase">Edit Player Profile</h3>
      <p class="font-body text-xs text-gray-500 mt-1">Update player statistics and information</p>
    </div>

    <form onsubmit="submitEditProfile(event)" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Player Name</label>
          <input type="text" id="edit-player-name" class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
        </div>
        <div>
          <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Jersey #</label>
          <input type="text" id="edit-player-jersey" class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
        </div>
      </div>

      <div>
        <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Position</label>
        <select id="edit-player-position" class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
          <option value="Unassigned">Unassigned</option>
          <option value="Guard">Guard</option>
          <option value="Forward">Forward</option>
          <option value="Center">Center</option>
          <option value="Pitcher">Pitcher</option>
          <option value="Catcher">Catcher</option>
          <option value="Infield">Infield</option>
          <option value="Outfield">Outfield</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Height</label>
          <input type="text" id="edit-player-height" placeholder="e.g., 6'2\"" class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
        </div>
        <div>
          <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Weight</label>
          <input type="text" id="edit-player-weight" placeholder="e.g., 180 lbs" class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
        </div>
      </div>

      <div>
        <label class="block font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">Date of Birth</label>
        <input type="date" id="edit-player-dob" class="w-full bg-clinical border border-borderDark px-3 py-2 text-xs outline-none focus:border-brand">
      </div>

      <div class="flex gap-2 pt-4 border-t border-borderLight">
        <button type="button" onclick="closeEditProfileModal()" class="flex-1 border border-dark text-dark px-3 py-2 text-xs font-bold hover:bg-dark hover:text-white transition-all">
          Cancel
        </button>
        <button type="submit" class="flex-1 bg-dark text-white px-3 py-2 text-xs font-bold hover:bg-brand hover:text-dark transition-all brutal-clip">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>
```

---

## INTEGRATION STEPS

1. Add new state properties to STATE object
2. Add all JavaScript functions to the script tag
3. Replace the three tab content sections with new HTML
4. Call `initMessageThreads()` in `renderDirectorDashboard()`
5. Call `updateMessagingRecipients()` after adding members
6. Call `renderMessagingThreads()` in `renderDirectorDashboard()`
7. Ensure `filterMembers()` calls `renderMembersDirectory()`

---

## KEY FEATURES IMPLEMENTED

✅ **Messaging**
- Threaded message history (left panel)
- Archive system with show/hide toggle
- Message replies inline
- Show More button for older messages

✅ **Members**
- Add Member modal with form
- Role, email, phone, team assignment
- Search by name/email
- Synced with messaging recipients

✅ **Roster**
- Removed Override button
- Added Edit Profile button
- Modal for editing: Name, Jersey, Position, Height, Weight, DOB
- Maintains financial display
