const engagementData = [
  { name: "Aurora Learning Network", work: "Developer platform discovery", stage: "Discovery", owner: "Maya Chen", region: "Americas", age: 48, signal: "Watch" },
  { name: "Harborlight Transit", work: "Delivery workflow design", stage: "Planning", owner: "Jordan Bell", region: "Europe", age: 36, signal: "Watch" },
  { name: "Juniper Health Labs", work: "Engineering enablement", stage: "Delivery", owner: "Priya Rao", region: "Asia Pacific", age: 74, signal: "Risk" },
  { name: "Silverline Energy", work: "Automation foundations", stage: "Delivery", owner: "Maya Chen", region: "Americas", age: 29, signal: "Healthy" },
  { name: "Atlas Community Bank", work: "Platform operating model", stage: "Planning", owner: "Luis Moreno", region: "Americas", age: 58, signal: "Risk" },
  { name: "Ember Arts Foundation", work: "Collaboration assessment", stage: "Discovery", owner: "Jordan Bell", region: "Europe", age: 18, signal: "Healthy" },
  { name: "Bluebird Foods", work: "Developer experience roadmap", stage: "Delivery", owner: "Priya Rao", region: "Asia Pacific", age: 41, signal: "Watch" },
  { name: "Cedar Peak Robotics", work: "Workflow modernization", stage: "Complete", owner: "Luis Moreno", region: "Americas", age: 83, signal: "Healthy" },
  { name: "Mosaic Civic Works", work: "Team enablement series", stage: "Complete", owner: "Jordan Bell", region: "Europe", age: 67, signal: "Healthy" },
  { name: "Tidal Research Group", work: "Automation readiness", stage: "Intake", owner: "Priya Rao", region: "Asia Pacific", age: 12, signal: "Healthy" },
  { name: "Pioneer Housing Co-op", work: "Platform strategy", stage: "Intake", owner: "Maya Chen", region: "Americas", age: 9, signal: "Healthy" },
  { name: "Willowfield Media", work: "Delivery measurement", stage: "Complete", owner: "Luis Moreno", region: "Europe", age: 62, signal: "Healthy" }
];

const trendData = [
  { month: "Jun", started: 7, completed: 4 },
  { month: "Jul", started: 9, completed: 6 },
  { month: "Aug", started: 8, completed: 7 },
  { month: "Sep", started: 11, completed: 8 },
  { month: "Oct", started: 10, completed: 10 },
  { month: "Nov", started: 13, completed: 11 }
];

const people = [
  { name: "Avery Brooks", initials: "AB", discipline: "Program", color: "#4555a9", weeks: [72, 84, 92, 76], assignments: [["Orchid Launch", "40%"], ["Beacon Research", "32%"]], note: "Available for a small advisory role in the final week." },
  { name: "Noah Kim", initials: "NK", discipline: "Engineering", color: "#17636b", weeks: [96, 104, 88, 82], assignments: [["Atlas Portal", "64%"], ["Workflow automation", "32%"]], note: "Week two exceeds planned capacity; consider shifting automation work." },
  { name: "Sofia Martin", initials: "SM", discipline: "Design", color: "#7b405e", weeks: [62, 70, 78, 70], assignments: [["Orchid Launch", "38%"], ["Nova Journey", "24%"]], note: "Has room for discovery or critique sessions." },
  { name: "Eli Turner", initials: "ET", discipline: "Engineering", color: "#6b501e", weeks: [82, 90, 108, 94], assignments: [["Beacon Research", "46%"], ["Atlas Portal", "36%"]], note: "Week three needs a staffing conversation before commitments change." },
  { name: "Zara Okafor", initials: "ZO", discipline: "Program", color: "#514393", weeks: [54, 68, 72, 80], assignments: [["Nova Journey", "34%"], ["Team enablement", "20%"]], note: "Good fit for near-term coordination support." },
  { name: "Mateo Silva", initials: "MS", discipline: "Data", color: "#286246", weeks: [88, 92, 86, 74], assignments: [["Beacon Research", "52%"], ["Insights model", "36%"]], note: "Capacity opens as research synthesis completes." }
];

const journey = [
  { week: "Before day one", title: "Get oriented", text: "Meet your support network and understand how the team communicates." },
  { week: "Week one", title: "See the system", text: "Trace a project from intake through learning and closeout." },
  { week: "Weeks two–three", title: "Practice with support", text: "Co-lead a real workflow using templates and peer review." },
  { week: "Week four", title: "Own and improve", text: "Run a workflow, capture feedback, and suggest one improvement." }
];

const guides = [
  { title: "Shape a new request", phase: "Intake", roles: ["Delivery Lead", "Program Partner"], time: "15 min", description: "Turn an incoming need into a clear problem statement and next decision.", steps: ["Name the audience and desired change.", "Capture constraints and known dependencies.", "Write the next decision and its owner."] },
  { title: "Plan a healthy kickoff", phase: "Plan", roles: ["Delivery Lead", "Technical Guide"], time: "20 min", description: "Align outcomes, roles, working agreements, and early risks.", steps: ["Confirm the outcome and non-goals.", "Map decision owners and communication rhythm.", "Record risks and the first learning checkpoint."] },
  { title: "Run a weekly pulse", phase: "Deliver", roles: ["Delivery Lead", "Program Partner", "Technical Guide"], time: "10 min", description: "Use signals and exceptions to keep work moving without status theater.", steps: ["Review movement since the last pulse.", "Discuss only blocked or changed items.", "Confirm owners and dates for next actions."] },
  { title: "Capture reusable learning", phase: "Learn", roles: ["Program Partner", "Technical Guide"], time: "25 min", description: "Turn project observations into guidance another team can use.", steps: ["Separate evidence from interpretation.", "Describe the context where the learning applies.", "Publish the smallest reusable artifact."] },
  { title: "Close with intention", phase: "Close", roles: ["Delivery Lead", "Program Partner"], time: "15 min", description: "Confirm completion, ownership, follow-up, and lessons before moving on.", steps: ["Validate completion signals.", "Transfer open ownership explicitly.", "Schedule the learning review if needed."] },
  { title: "Ask for an expert review", phase: "Collaborate", roles: ["Technical Guide"], time: "8 min", description: "Give reviewers enough context to provide fast, useful feedback.", steps: ["State the decision or risk.", "Link only the essential context.", "Set the response window and fallback."] }
];

const principles = [
  { icon: "◇", title: "Make the decision visible", text: "A good process clarifies what choice is being made, by whom, and with which evidence." },
  { icon: "⌁", title: "Prefer useful defaults", text: "Templates should remove setup work while leaving room for judgment and context." },
  { icon: "◎", title: "Close the learning loop", text: "Every workflow should create a signal that improves the next version of the system." },
  { icon: "↗", title: "Escalate with options", text: "Raise risk early and pair it with the clearest available paths forward." },
  { icon: "✦", title: "Document for the next person", text: "Write enough context that someone outside the original conversation can act." },
  { icon: "◫", title: "Protect sustainable pace", text: "Capacity, focus, and recovery are design constraints—not afterthoughts." }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);

function initNavigation() {
  const toggle = $(".nav-toggle");
  const nav = $("#primary-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#primary-nav a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function filteredEngagements() {
  const region = $("#engagement-region").value;
  const owner = $("#engagement-owner").value;
  return engagementData.filter((item) => (region === "all" || item.region === region) && (owner === "all" || item.owner === owner));
}

let showAllAttention = false;

function renderEngagementDashboard() {
  const data = filteredEngagements();
  const active = data.filter((item) => item.stage !== "Complete");
  const completed = data.filter((item) => item.stage === "Complete");
  const attention = data.filter((item) => item.signal !== "Healthy").sort((a, b) => b.age - a.age);
  const averageAge = active.length ? Math.round(active.reduce((sum, item) => sum + item.age, 0) / active.length) : 0;
  const kpis = [
    ["Active engagements", active.length, `${data.length} in selected portfolio`],
    ["Completed", completed.length, "Ready for learning review"],
    ["Needs attention", attention.length, attention.length ? "Prioritize this week" : "No exceptions found"],
    ["Average active age", `${averageAge}d`, "Across current work"]
  ];
  $("#engagement-kpis").innerHTML = kpis.map(([label, value, note]) => `<div class="kpi-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");

  const maxTrend = Math.max(...trendData.flatMap((item) => [item.started, item.completed]));
  $("#trend-chart").setAttribute("aria-label", `Monthly engagement momentum: ${trendData.map((item) => `${item.month}, ${item.started} started and ${item.completed} completed`).join("; ")}`);
  $("#trend-chart").innerHTML = trendData.map((item) => `<div class="month-bars" title="${item.month}: ${item.started} started, ${item.completed} completed"><i style="height:${(item.started / maxTrend) * 92}%"></i><i style="height:${(item.completed / maxTrend) * 92}%"></i><span>${item.month}</span></div>`).join("");

  const stages = ["Intake", "Discovery", "Planning", "Delivery", "Complete"];
  const counts = stages.map((stage) => [stage, data.filter((item) => item.stage === stage).length]);
  const maxStage = Math.max(1, ...counts.map(([, count]) => count));
  $("#pipeline-chart").setAttribute("aria-label", `Lifecycle mix: ${counts.map(([stage, count]) => `${stage}, ${count}`).join("; ")}`);
  $("#pipeline-chart").innerHTML = counts.map(([stage, count]) => `<div class="pipeline-row"><span>${stage}</span><div class="pipeline-track"><div class="pipeline-fill" style="width:${(count / maxStage) * 100}%"></div></div><strong>${count}</strong></div>`).join("");

  const visible = showAllAttention ? attention : attention.slice(0, 3);
  $("#attention-table").innerHTML = visible.length ? visible.map((item) => `<tr><td><span class="table-title">${escapeHtml(item.name)}</span><span class="table-subtitle">${escapeHtml(item.work)}</span></td><td><span class="stage-pill">${item.stage}</span></td><td>${escapeHtml(item.owner)}</td><td>${item.age} days</td><td><span class="signal-pill signal-pill--${item.signal.toLowerCase()}">${item.signal}</span></td></tr>`).join("") : `<tr><td colspan="5"><div class="empty-state">No attention signals match these filters.</div></td></tr>`;
  const button = $("#attention-toggle");
  button.hidden = attention.length <= 3;
  button.textContent = showAllAttention ? "Show fewer" : `Show all (${attention.length})`;
}

function initEngagementDashboard() {
  const ownerSelect = $("#engagement-owner");
  [...new Set(engagementData.map((item) => item.owner))].sort().forEach((owner) => ownerSelect.insertAdjacentHTML("beforeend", `<option value="${owner}">${owner}</option>`));
  ["#engagement-region", "#engagement-owner"].forEach((selector) => $(selector).addEventListener("change", renderEngagementDashboard));
  $("#attention-toggle").addEventListener("click", () => { showAllAttention = !showAllAttention; renderEngagementDashboard(); });
  renderEngagementDashboard();
}

const utilizationState = (value) => value > 100 ? "over" : value >= 90 ? "high" : value >= 70 ? "balanced" : "available";
let selectedPerson = people[0].name;

function renderCapacityPlanner() {
  const discipline = $("#capacity-discipline").value;
  const view = $("#capacity-view").value;
  const filtered = people.filter((person) => discipline === "all" || person.discipline === discipline);
  if (!filtered.some((person) => person.name === selectedPerson)) selectedPerson = filtered[0]?.name;
  const allValues = filtered.flatMap((person) => person.weeks);
  const average = allValues.length ? Math.round(allValues.reduce((sum, value) => sum + value, 0) / allValues.length) : 0;
  const available = allValues.filter((value) => value < 70).length;
  const overloaded = allValues.filter((value) => value > 100).length;
  $("#capacity-summary").innerHTML = [
    ["Average utilization", `${average}%`, "#2d8d85"],
    ["Available weeks", available, "#7ca9a5"],
    ["Over-capacity weeks", overloaded, overloaded ? "#c85a66" : "#7ca9a5"]
  ].map(([label, value, color]) => `<div class="summary-card"><div><span>${label}</span><strong>${value}</strong></div><i style="background:${color}"></i></div>`).join("");

  const weekLabels = ["November 23", "November 30", "December 7", "December 14"];
  $("#resource-list").innerHTML = filtered.length ? filtered.map((person) => `<button class="resource-row ${person.name === selectedPerson ? "active" : ""}" type="button" data-person="${escapeHtml(person.name)}" aria-pressed="${person.name === selectedPerson}"><span class="person"><span class="avatar" style="background:${person.color}">${person.initials}</span><span><strong>${escapeHtml(person.name)}</strong><span>${person.discipline}</span></span></span><span class="week-blocks">${person.weeks.map((value, index) => { const display = view === "capacity" ? Math.max(0, 100 - value) : value; const measure = view === "capacity" ? "available capacity" : "utilization"; return `<span class="week-block week-block--${utilizationState(value)}" title="${measure}: ${display}%" aria-label="${weekLabels[index]}: ${display}% ${measure}">${display}%</span>`; }).join("")}</span></button>`).join("") : `<div class="empty-state">No team members match this discipline.</div>`;
  $$(".resource-row").forEach((button) => button.addEventListener("click", () => { selectedPerson = button.dataset.person; renderCapacityPlanner(); }));
  renderPersonDetail(filtered.find((person) => person.name === selectedPerson));
}

function renderPersonDetail(person) {
  const root = $("#resource-detail");
  if (!person) {
    root.innerHTML = `<div class="empty-state">Choose a team member to see details.</div>`;
    return;
  }
  const average = Math.round(person.weeks.reduce((sum, value) => sum + value, 0) / person.weeks.length);
  root.innerHTML = `<span class="avatar detail-avatar" style="background:${person.color}">${person.initials}</span><h4>${escapeHtml(person.name)}</h4><p>${person.discipline} · Four-week plan</p><div class="detail-stat"><span>Average utilization</span><strong>${average}%</strong></div><p class="demo-kicker">Current assignments</p><ul class="assignment-list">${person.assignments.map(([name, allocation]) => `<li><strong>${escapeHtml(name)}</strong><span>${allocation} planned allocation</span></li>`).join("")}</ul><div class="detail-note">${escapeHtml(person.note)}</div>`;
}

function initCapacityPlanner() {
  const disciplineSelect = $("#capacity-discipline");
  [...new Set(people.map((person) => person.discipline))].sort().forEach((discipline) => disciplineSelect.insertAdjacentHTML("beforeend", `<option value="${discipline}">${discipline}</option>`));
  ["#capacity-discipline", "#capacity-view"].forEach((selector) => $(selector).addEventListener("change", renderCapacityPlanner));
  renderCapacityPlanner();
}

let activePlaybookView = "journey";

function visibleGuides() {
  const role = $("#playbook-role").value;
  const query = $("#playbook-search").value.trim().toLowerCase();
  return guides.filter((guide) => guide.roles.includes(role) && (!query || [guide.title, guide.phase, guide.description, ...guide.steps].join(" ").toLowerCase().includes(query)));
}

function guideMarkup(guide) {
  return `<article class="guide-card"><div class="guide-card-top"><strong>${escapeHtml(guide.title)}</strong></div><p>${escapeHtml(guide.description)}</p><div class="guide-meta"><span>${guide.phase}</span><span>${guide.time}</span></div><details><summary>View steps</summary><ol>${guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></details></article>`;
}

function renderPlaybook() {
  const root = $("#playbook-content");
  const role = $("#playbook-role").value;
  const results = visibleGuides();
  $$(".sidebar-link").forEach((button) => {
    const active = button.dataset.playbookView === activePlaybookView;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (activePlaybookView === "journey") {
    root.innerHTML = `<section class="playbook-welcome"><p class="demo-kicker">Welcome, ${escapeHtml(role)}</p><h3>Your first month at Canopy</h3><p>Follow the journey in sequence, or use the process library whenever you need an answer in the flow of work.</p></section><div class="journey-grid">${journey.map((item) => `<article class="journey-card"><span>${item.week}</span><strong>${item.title}</strong><p>${item.text}</p></article>`).join("")}</div><div class="guide-heading"><h4>Recommended for your role</h4><span>${results.length} guides</span></div><div class="guide-list">${results.length ? results.slice(0, 4).map(guideMarkup).join("") : `<div class="empty-state">No guides match your search.</div>`}</div>`;
  } else if (activePlaybookView === "library") {
    root.innerHTML = `<div class="guide-heading"><div><p class="demo-kicker">Reusable guidance</p><h3>Process library</h3></div><span>${results.length} guides for ${escapeHtml(role)}</span></div><div class="guide-list">${results.length ? results.map(guideMarkup).join("") : `<div class="empty-state">No guides match your search and role.</div>`}</div>`;
  } else {
    const query = $("#playbook-search").value.trim().toLowerCase();
    const filteredPrinciples = principles.filter((principle) => !query || `${principle.title} ${principle.text}`.toLowerCase().includes(query));
    root.innerHTML = `<div class="guide-heading"><div><p class="demo-kicker">Shared expectations</p><h3>Working principles</h3></div><span>${filteredPrinciples.length} principles</span></div><div class="principles-grid">${filteredPrinciples.length ? filteredPrinciples.map((principle) => `<article class="principle-card"><span aria-hidden="true">${principle.icon}</span><strong>${principle.title}</strong><p>${principle.text}</p></article>`).join("") : `<div class="empty-state">No principles match your search.</div>`}</div>`;
  }
}

function initPlaybook() {
  $$(".sidebar-link").forEach((button) => button.addEventListener("click", () => { activePlaybookView = button.dataset.playbookView; renderPlaybook(); }));
  $("#playbook-role").addEventListener("change", renderPlaybook);
  $("#playbook-search").addEventListener("input", renderPlaybook);
  renderPlaybook();
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  initNavigation();
  initEngagementDashboard();
  initCapacityPlanner();
  initPlaybook();
});
