<!-- src/components/NavBar.vue -->
<template>
  <nav class="navbar">
    <div class="navbar-container">
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/all-users">Alle oprettelser</a></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
@media print {
  .navbar {
    display: none;
  }
}
.navbar {
  background-color: #f0f4f8;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  align-items: center;
}

.logo a {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin: 0;
}

.nav-links a {
  color: #000000;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.nav-links a:hover {
  background-color: #3498db;
  color: #1e1e1e;
}
</style>
