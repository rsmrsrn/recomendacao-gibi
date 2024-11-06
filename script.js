// Variáveis globais
let userName = "";
let answers = [];
let questionIndex = 0;

// Lista de perguntas e opções
const questions = [
    { question: "Antes de começarmos, qual o seu nome?", type: "text" },
    { question: "", options: ["sim", "não"] },  // A pergunta será personalizada depois
    { question: "Entendi! Agora escolha um desses gêneros", options: ["ficção científica", "romance", "terror", "aventura"] },
    { question: "Maravilha! E você gostaria de ler uma história curta, média ou longa?", options: ["curta", "média", "longa"] }
];

// Função para carregar a próxima pergunta
function loadQuestion() {
    const container = document.getElementById("question-container");
    container.innerHTML = "";  // Limpa o conteúdo anterior

    // Exibe a pergunta baseada no índice atual
    const currentQuestion = questions[questionIndex];

    if (questionIndex === 0) {
        // Pergunta inicial para o nome
        const label = document.createElement("label");
        label.textContent = currentQuestion.question;
        const input = document.createElement("input");
        input.type = "text";
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                userName = input.value;
                questionIndex++;
                questions[1].question = `Vamos começar, ${userName}! Você gostaria de ler um gibi de super-heróis?`;
                loadQuestion();
            }
        });
        container.appendChild(label);
        container.appendChild(input);
    } else if (currentQuestion.options) {
        // Pergunta com opções
        const label = document.createElement("label");
        label.textContent = currentQuestion.question;
        container.appendChild(label);

        currentQuestion.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.addEventListener("click", () => {
                answers.push(option);
                questionIndex++;
                if (questionIndex < questions.length) {
                    loadQuestion();
                } else {
                    recommendComic();
                }
            });
            container.appendChild(button);
        });
    }
}

// Função para recomendar um gibi
async function recommendComic() {
    const responseContainer = document.getElementById("response-container");
    responseContainer.innerHTML = "Carregando recomendação...";
    
    try {
        const response = await fetch("data/gibis.json");
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const data = await response.json();

        // Filtra os gibis com base nas respostas
        const filteredComics = data.filter(comic => {
            const isSuperhero = (answers[0] === "sim" ? comic.superhero : !comic.superhero);
            const matchesGenre = comic.genre.toLowerCase() === answers[1].toLowerCase();
            const matchesLength = comic.length.toLowerCase() === answers[2].toLowerCase();
            return isSuperhero && matchesGenre && matchesLength;
        });

        // Seleciona um gibi aleatório
        const recommendedComic = filteredComics[Math.floor(Math.random() * filteredComics.length)];
        
        responseContainer.innerHTML = recommendedComic ? 
            `Recomendação: ${recommendedComic.title} - ${recommendedComic.description}` :
            "Nenhum gibi encontrado com essas especificações.";
    } catch (error) {
        console.error("Erro ao carregar o JSON:", error);
        responseContainer.innerHTML = `Erro ao carregar a base de dados: ${error.message}`;
    }
}
// Inicia o questionário
loadQuestion();