
const GITHUB_TOKEN = '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';  

const usernames = ["DecemberAmaral", "matteuszera", "GlawckHSilva", "VictorPjt", "F0Xdesuu"];
const userGrid = document.getElementById('user-grid');

async function fetchGitHubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`  
            }
        });
        console.log(`Resposta da API para ${username}:`, response);

        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário ${username}: ${response.statusText}`);
        }
        const userData = await response.json();
        console.log(`Dados do usuário ${username}:`, userData);
        return userData;
    } catch (error) {
        console.error(error);
        return null;  // Retorna null se houver erro
    }
}

async function fetchUserLanguages(username) {
    try {
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`  
            }
        });
        console.log(`Resposta da API para repositórios de ${username}:`, reposResponse);

        if (!reposResponse.ok) {
            throw new Error(`Erro ao buscar repositórios de ${username}: ${reposResponse.statusText}`);
        }
        const repos = await reposResponse.json();
        console.log(`Repositórios de ${username}:`, repos);

        const languages = new Set();
        for (let repo of repos) {
            const langResponse = await fetch(repo.languages_url, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}` 
                }
            });
            const langData = await langResponse.json();
            Object.keys(langData).forEach(language => languages.add(language));
        }

        console.log(`Linguagens principais de ${username}:`, Array.from(languages));
        return Array.from(languages);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Função para criar o card do usuário com as tecnologias principais
async function createUserCard(user) {
    if (!user) {
        return;  // Se o usuário for nulo, não cria o card
    }

    const languages = await fetchUserLanguages(user.login);

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <img src="${user.avatar_url}" alt="Foto de perfil de ${user.login}">
        <h3>${user.name || user.login}</h3>
        <p>Username: ${user.login}</p>
        <p><strong>Principais Tecnologias:</strong> ${languages.join(', ') || 'Não disponível'}</p>
        <a href="${user.html_url}" target="_blank">Perfil no GitHub</a>
    `;

    userGrid.appendChild(card);
}

// Função para buscar informações de todos os usuários e criar os cards
async function loadGitHubUsers() {
    for (let username of usernames) {
        const user = await fetchGitHubUser(username);
        await createUserCard(user);  // Espera criar o card antes de continuar
    }
}

// Carregar os usuários ao iniciar a página
window.onload = loadGitHubUsers;