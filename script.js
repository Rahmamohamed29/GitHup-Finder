const searchForm = document.getElementById("search-form");
const usernameInput = document.getElementById("username-input");
const statusMessage = document.getElementById("status-message");
const resultContainer = document.getElementById("result-container");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    fetchProfile(username);
  }
});

function searchUser(username) {
  usernameInput.value = username;
  fetchProfile(username);
}

async function fetchProfile(username) {
  resultContainer.innerHTML = "";
  statusMessage.textContent = "Loading...";
  statusMessage.classList.remove("hidden", "text-red-500");
  statusMessage.classList.add("text-gray-400");

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      throw new Error("User not found");
    }
    const userData = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=created&per_page=6`
    );
    const reposData = await reposRes.json();

    statusMessage.classList.add("hidden");
    renderProfile(userData, reposData);
  } catch (error) {
    statusMessage.textContent = error.message;
    statusMessage.classList.remove("hidden", "text-gray-400");
    statusMessage.classList.add("text-red-500");
  }
}

function renderProfile(user, repos) {
  const bioText = user.bio ? user.bio : "No bio yet.";

  let reposHTML = "";
  repos.forEach((repo) => {
    reposHTML += `
      <a href="${repo.html_url}" target="_blank" class="bg-[#121e2d] p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition flex flex-col justify-between">
        <div>
          <h4 class="font-bold text-blue-400 hover:underline mb-1 truncate">${repo.name}</h4>
          <p class="text-xs text-gray-400 mb-4 line-clamp-2">${repo.description || "No description"}</p>
        </div>
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <span class="flex items-center gap-1">
            <i class="fa-regular fa-star text-amber-400"></i> ${repo.stargazers_count}
          </span>
          <span class="flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> ${repo.language || "N/A"}
          </span>
        </div>
      </a>`;
  });

  resultContainer.innerHTML = `
    <div class="bg-[#121e2d] p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-gray-800">
      <img src="${user.avatar_url}" alt="${user.name}" class="w-24 h-24 rounded-full border-2 border-amber-400 object-cover">
      <div class="flex-1 text-center sm:text-left">
        <h2 class="text-2xl font-bold">${user.name || user.login}</h2>
        <p class="text-gray-400 text-sm mb-2">@${user.login}</p>
        <p class="text-gray-300 text-sm mb-4">${bioText}</p>
        
        <div class="flex justify-center sm:justify-start gap-6 text-sm text-gray-300">
          <div><strong class="text-white">${user.public_repos}</strong> repos</div>
          <div><strong class="text-white">${user.followers}</strong> followers</div>
          <div><strong class="text-white">${user.following}</strong> following</div>
        </div>
      </div>
    </div>
    <div>
      <h3 class="text-xl font-bold mb-4">Latest repositories</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        ${reposHTML}
      </div>
    </div>`;
}
