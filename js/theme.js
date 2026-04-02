export function initTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;
    const isNightMode = { value: true };

    function updateButton() {
        if (isNightMode.value) {
            themeBtn.classList.remove('light-mode');
        } else {
            themeBtn.classList.add('light-mode');
        }
    }

    // Load saved theme or time-based
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isNightMode.value = false;
        body.classList.add('light');
    } else if (savedTheme === 'dark') {
        isNightMode.value = true;
        body.classList.remove('light');
    } else {
        const hours = new Date().getHours();
        isNightMode.value = !(hours > 7 && hours < 20);
        if (isNightMode.value) body.classList.remove('light');
        else body.classList.add('light');
    }
    updateButton();

    themeBtn.addEventListener('click', () => {
        isNightMode.value = !isNightMode.value;
        if (isNightMode.value) {
            body.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
        updateButton();
    });
    return isNightMode;
}