
const expandBtn = document.querySelector('.expand-btn');
const details = document.querySelector('.details');

expandBtn.addEventListener('click', () => {
    const isHidden = details.classList.contains('hidden');

    details.classList.toggle('hidden');
    expandBtn.textContent = isHidden ? '-' : '+';
    expandBtn.setAttribute('aria-label', isHidden ? 'Collapse card' : 'Expand card');
    expandBtn.setAttribute('aria-expanded', !isHidden);
});