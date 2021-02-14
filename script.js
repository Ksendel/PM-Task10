function getFromGithub(uri) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "json"
        xhr.open("GET", `https://api.github.com/${uri}`);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject({status: xhr.status, message: xhr.response.message});
            }
        };
        xhr.onerror = () => reject({status: xhr.status, message: xhr.response.message});
        xhr.send(null);
    })
}
//*
function searchUsers(query) {
    return getFromGithub(`search/users?q=${query}`)
}

function drawFoundUsers(users) {
    console.log(users) //ToDo draw dropdown search
}

function initSearch(){
    let timeout;
    function debounce(func, delay) {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    }
    document
        .getElementById("userName")
        .addEventListener("input", ev => debounce(
            () => searchUsers(ev.target.value).then(users => drawFoundUsers(users)), 1000
        ))
}

function drawGetRequestFailed(cause) {
    console.log("Failure: " + cause)
    document.querySelector(".users").innerHTML = `Failure: ${cause.status} ${cause.message}`
}

function getUserInfo() {
    const userName = document.getElementById("userName").value
    return getUser(userName)
        .then(_ => getRepos(userName))
        .then(_ => getFollowers(userName))
}

function getUser(userName) {
    return getFromGithub(`users/${userName}`).then(drawUser, drawGetRequestFailed)
}

function drawUser(user) {
    document.querySelector(".users").innerHTML = `
<img src="${user.avatar_url}" alt="">
<p><a href="${user.html_url}">${user.login}</a></p>`
}

function drawRepos(repos) {
    document.querySelector(".repos").innerHTML =
        repos.reduce((html, repo) => {
            html += `<p>Repository: <a href="${repo.html_url}">${repo.name}</a></p>`
            return html
        }, "")
}

function getRepos(userName) {
    return getFromGithub(`users/${userName}/repos`).then(drawRepos, drawGetRequestFailed)
}

function drawFollowers(followers) {
    document.querySelector(".followers").innerHTML =
        followers.reduce((html, follower) => {
            html += `<p>Follower: <a href="${follower.html_url}">${follower.login}</a></p>`
            return html
        }, "")
}

function getFollowers(userName) {
    return getFromGithub(`users/${userName}/followers`).then(drawFollowers, drawGetRequestFailed)
}
