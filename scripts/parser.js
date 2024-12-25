const puppeteer = require('puppeteer');
const fs = require('fs');

async function parseIcons() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Переходим на страницу и ждём минимальную сетевую активность
        await page.goto('https://fonts.google.com/icons', { waitUntil: 'networkidle2' });

        console.log("Ожидание появления первого элемента...");
        // Подход 1: Ждём появления хотя бы одного элемента
        await page.waitForSelector('.icon-name', { timeout: 15000 });

        console.log("Ожидание загрузки всех элементов...");
        // Подход 2: Ждём определённого количества элементов на странице
        await page.waitForFunction(() => {
            const elements = document.querySelectorAll('.icon-name');
            return elements.length > 100; // Убедитесь, что хотя бы 100 элементов загружено
        }, { timeout: 15000 });

        console.log("Ожидание завершения изменений в DOM...");
        // Подход 3: Ожидание изменений в DOM с использованием MutationObserver
        await page.evaluate(() => {
            return new Promise((resolve) => {
                const observer = new MutationObserver((mutations, obs) => {
                    const elements = document.querySelectorAll('.icon-name');
                    if (elements.length > 3510) { // Если достаточно элементов загружено
                        obs.disconnect(); // Останавливаем наблюдение
                        resolve(); // Завершаем ожидание
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            });
        });

        console.log("Собираем данные...");
        // Подход 4: Собираем данные после всех ожиданий
        const icons = await page.evaluate(() => {
            const nameElements = document.querySelectorAll('.icon-name');
            return Array.from(nameElements).map(item => item.innerText.toLowerCase().replaceAll(" ", '_'));
        });

        console.log(`Найдено ${icons.length} иконок.`);

        // Сохраняем данные в файл
        fs.writeFileSync('icons.json', JSON.stringify(icons, null, 2));
        console.log("Данные успешно записаны в файл icons.json!");

        await browser.close();
        console.log("Браузер закрыт.");
    } catch (error) {
        console.error("Произошла ошибка:", error);
    }
}

// Запускаем парсер
parseIcons();
