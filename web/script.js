// Draws the member ring around the pot and animates which member is
// "active" (i.e. receiving this round's payout) — a literal depiction
// of the rotation mechanic, not a decorative animation.

const MEMBER_COUNT = 6;
const RADIUS = 140;
const CENTER = 180;

const membersGroup = document.getElementById('members');
const nodes = [];

for (let i = 0; i < MEMBER_COUNT; i++) {
  const angle = (i / MEMBER_COUNT) * 2 * Math.PI - Math.PI / 2;
  const x = CENTER + RADIUS * Math.cos(angle);
  const y = CENTER + RADIUS * Math.sin(angle);

  const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  node.setAttribute('cx', x);
  node.setAttribute('cy', y);
  node.setAttribute('r', 22);
  node.setAttribute('class', 'member-node');
  membersGroup.appendChild(node);

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', x);
  label.setAttribute('y', y + 4);
  label.setAttribute('class', 'member-label');
  label.textContent = `M${i + 1}`;
  membersGroup.appendChild(label);

  nodes.push({ node, label });
}

let activeIndex = 2; // matches the "Round 3 of 8" caption in the HTML

function setActive(index) {
  nodes.forEach(({ node, label }, i) => {
    const isActive = i === index;
    node.classList.toggle('active', isActive);
    label.classList.toggle('active', isActive);
  });
}

setActive(activeIndex);

// Respect reduced-motion preference — no auto-advance if the user has
// asked for less motion.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  setInterval(() => {
    activeIndex = (activeIndex + 1) % MEMBER_COUNT;
    setActive(activeIndex);
  }, 2600);
}
