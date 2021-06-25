let counter = 1;

// login
async function handleLogin(e) {
  try {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5500/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const result = await response.json();

      localStorage.setItem("access_token", result.access_token);

      location.href = "/posts";
    }
  } catch (err) {
    console.log(err);
  }
}

// posts
const handleRequestInterval = () => {
  setInterval(handleGetPosts, 1000);
}

const displayPosts = (posts) => {
  const div = document.getElementById("posts");
  div.innerHTML = "";
  posts.map((post) => {
    const li = document.createElement("li");
    li.innerHTML = post;
    div.appendChild(li);
  });
};

const handleGetPosts = async () => {
  const access_token = localStorage.getItem("access_token");
  const response = await fetch("http://localhost:5000/api/posts", {
    headers: { authorization: access_token },
  });

  if (response.ok) {
    const result = await response.json();
    return displayPosts(result);
  }

  // refresh the token
  if (response.status === 401) {

    const refreshResponse = await fetch("http://localhost:5500/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token
      },
    });

    if (refreshResponse.ok) {
      const refreshResult = await refreshResponse.json();

      localStorage.setItem("access_token", refreshResult.access_token);
      const refreshParagraph = document.getElementById('time-refreshed');
      refreshParagraph.innerHTML = `times refreshsed: ${counter++}`;

      const newResponse = await fetch("http://localhost:5000/api/posts", {
        headers: { authorization: refreshResult.access_token },
      });

      if (newResponse.ok) {
        const newResult = await newResponse.json();
        displayPosts(newResult);
      }
    }
  }
};
