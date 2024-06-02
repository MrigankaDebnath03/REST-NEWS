const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const postsContainer = document.getElementById('posts-container');

darkModeToggle.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
  body.classList.toggle('dark-mode');
  const icon = darkModeToggle.querySelector('.material-icons');
  icon.textContent = body.classList.contains('dark-mode') ? 'brightness_7' : 'brightness_4';
  updatePostsContainerStyle();
}

function updatePostsContainerStyle() {
  const isDarkMode = body.classList.contains('dark-mode');
  postsContainer.style.color = isDarkMode ? '#ffffff' : '#000000';
}

document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

async function fetchPosts() {
  try {
    showLoadingIndicator();
    const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await postsResponse.json();
    const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await usersResponse.json();

    postsContainer.innerHTML = '';

    posts.forEach(post => {
      const user = users.find(u => u.id === post.userId);
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>By: ${user.name} (${user.email})</p>
        <p>${post.body}</p>
      `;
      postElement.addEventListener('click', () => displayPostDetails(post));
      postsContainer.appendChild(postElement);
    });

    hideLoadingIndicator();
    updatePostsContainerStyle();
  } catch (error) {
    console.error('Error fetching posts:', error);
    hideLoadingIndicator();
    alert('An error occurred while fetching the posts.');
  }
}

async function displayPostDetails(post) {
  const postElement = event.currentTarget;
  const postDetailsElement = document.createElement('div');
  postDetailsElement.classList.add('post-details');

  const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
  const comments = await commentsResponse.json();

  postDetailsElement.innerHTML = `
    <h3>Post Details</h3>
    <h4>${post.title}</h4>
    <p>${post.body}</p>
    <h3>Comments</h3>
  `;

  const commentsContainer = document.createElement('div');
  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.innerHTML = `
      <h4>${comment.email}</h4>
      <p>${comment.body}</p>
    `;
    commentsContainer.appendChild(commentElement);
  });

  postDetailsElement.appendChild(commentsContainer);
  postElement.appendChild(postDetailsElement);
}

function showLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.classList.remove('hidden');
}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.classList.add('hidden');
}