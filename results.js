const personalityTraits = [
    {
        name: "Параноидальное",
        questions: [11, 24, 37, 50, 62, 85, 96],
        threshold: 4,
        cluster: "A"
    },
    {
        name: "Шизоидное",
        questions: [9, 22, 34, 47, 60, 71, 95],
        threshold: 4,
        cluster: "A"
    },
    {
        name: "Шизотипическое",
        questions: [10, 23, 36, 48, 61, 72, 74, 60, 86],
        threshold: 5,
        cluster: "A"
    },
    {
        name: "Истерическое",
        questions: [4, 17, 30, 43, 55, 67, 80, 90],
        threshold: 5,
        cluster: "B"
    },
    {
        name: "Нарциссическое",
        questions: [5, 18, 31, 44, 57, 68, 73, 79, 92],
        threshold: 5,
        cluster: "B"
    },
    {
        name: "Пограничное",
        questions: [6, 19, 32, 45, 58, 69, 78, 93, 98],
        threshold: 5,
        cluster: "B"
    },
    {
        name: "Антисоциальное",
        questions: [8, 20, 33, 46, 59, 75, 94, 99],
        threshold: 3,
        requiresQ99: true,
        cluster: "B"
    },
    {
        name: "Избегающее",
        questions: [1, 13, 26, 39, 52, 83, 87],
        threshold: 4,
        cluster: "C"
    },
    {
        name: "Зависимое",
        questions: [2, 15, 27, 40, 53, 65, 82, 88],
        threshold: 5,
        cluster: "C"
    },
    {
        name: "Обсессивно-компульсивное",
        questions: [3, 16, 29, 41, 54, 66, 81, 89],
        threshold: 4,
        cluster: "C"
    },
    {
        name: "Пассивно-агрессивное",
        questions: [7, 21, 35, 49, 63, 77, 91],
        threshold: 4,
        cluster: "C"
    },
    {
        name: "Депрессивное",
        questions: [14, 28, 42, 56, 70, 84, 97],
        threshold: 5,
        cluster: "C"
    }
];

function displayResults() {
    const answers = JSON.parse(localStorage.getItem('testAnswers'));
    if (!answers) {
        document.getElementById("result-container").innerHTML = '<p>Ошибка: ответы не найдены. Пожалуйста, пройдите тест заново.</p>';
        return;
    }

    const q98Answers = answers[97];
    const q99Answers = answers[98];
    answers.length = 97;
    const q98YesCount = q98Answers.filter(answer => answer === 1).length;
    const q99YesCount = q99Answers.filter(answer => answer === 1).length;
    answers.push(q98YesCount >= 2 ? 1 : 0);
    answers.push(q99YesCount >= 3 ? 1 : 0);
    const yesCount = answers.filter(answer => answer === 1).length;

    const clusters = {
        A: { name: "Кластер А", traits: [] },
        B: { name: "Кластер В", traits: [] },
        C: { name: "Кластер С", traits: [] }
    };

    personalityTraits.forEach(trait => {
        let traitYesCount;
        if (trait.name === "Антисоциальное") {
            traitYesCount = trait.questions.reduce((sum, qIndex) => {
                if (qIndex === 99) return sum;
                return sum + (answers[qIndex - 1] || 0);
            }, 0);
            const q99Positive = answers[98] === 1;
            const isExpressed = q99Positive && traitYesCount >= trait.threshold;
            const maxHeight = 100;
            const height = (traitYesCount / (trait.questions.length - 1)) * maxHeight;

            clusters[trait.cluster].traits.push(`
                <div class="chart-bar">
                    <div class="bar" style="height: ${height}px; background-color: ${isExpressed ? '#28a745' : '#dc3545'}"></div>
                    <div class="bar-label">${trait.name}</div>
                    <div class="bar-status">${isExpressed ? 'Есть' : 'Нет'}</div>
                    <div class="bar-score">${traitYesCount} из ${trait.questions.length - 1} (+ Q99: ${q99Positive ? 'Да' : 'Нет'})</div>
                </div>
            `);
        } else {
            traitYesCount = trait.questions.reduce((sum, qIndex) => {
                return sum + (answers[qIndex - 1] || 0);
            }, 0);
            const isExpressed = traitYesCount >= trait.threshold;
            const maxHeight = 100;
            const height = (traitYesCount / trait.questions.length) * maxHeight;

            clusters[trait.cluster].traits.push(`
                <div class="chart-bar">
                    <div class="bar" style="height: ${height}px; background-color: ${isExpressed ? '#28a745' : '#dc3545'}"></div>
                    <div class="bar-label">${trait.name}</div>
                    <div class="bar-status">${isExpressed ? 'Есть' : 'Нет'}</div>
                    <div class="bar-score">${traitYesCount} из ${trait.questions.length}</div>
                </div>
            `);
        }
    });

    let traitsResult = `
        <h3>Черты личности:</h3>
        <div class="clusters-container">
            <div class="cluster">
                <h4>${clusters.A.name}</h4>
                <div class="chart-container">${clusters.A.traits.join('')}</div>
            </div>
            <div class="cluster">
                <h4>${clusters.B.name}</h4>
                <div class="chart-container">${clusters.B.traits.join('')}</div>
            </div>
            <div class="cluster">
                <h4>${clusters.C.name}</h4>
                <div class="chart-container">${clusters.C.traits.join('')}</div>
            </div>
        </div>
    `;

    document.getElementById("result-container").innerHTML = `
        <h2>Ваш результат: ${yesCount} ответов "да"</h2>
        <p>Общий уровень: ${yesCount >= 70 ? "Высокий уровень. Рекомендуется консультация специалиста." : yesCount >= 40 ? "Средний уровень." : "Низкий уровень."}</p>
        ${traitsResult}
    `;
}

displayResults();