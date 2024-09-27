<template>
  <div class="imei-lookup">
    <div class="card">
      <h1>IMEI User Lookup</h1>
      <!-- Form to lookup user by IMEI -->
      <form @submit.prevent="lookupUser">
        <div class="input-group" :class="{ 'input-error': error }">
          <!-- Input field for IMEI number -->
          <input
            type="text"
            id="imei"
            v-model="imei"
            :disabled="isLoading"
            required
            @input="debouncedValidateInput"
            aria-describedby="imeiHelp"
          />
          <label for="imei">IMEI Nummer</label>
          <!-- Button to clear the input field -->
          <button type="button" class="clear-btn" @click="clearInput" v-if="imei.length > 0">
            ×
          </button>
          <!-- Display IMEI input length -->
          <transition name="fade">
            <div class="input-status" v-if="imei.length > 0">{{ imei.length }}/15</div>
          </transition>
        </div>
        <!-- Submit button to lookup user -->
        <button type="submit" :disabled="isLoading || !isValidIMEI" class="submit-btn">
          <span v-if="!isLoading">Søg</span>
          <div v-else class="spinner"></div>
        </button>
      </form>

      <!-- Error message display -->
      <transition name="slide-fade">
        <div v-if="error" class="error-message">
          {{ error }}
          <button @click="lookupUser" class="retry-btn">Prøv igen</button>
        </div>
      </transition>

      <!-- Display recent searches -->
      <transition name="fade">
        <div class="recent-searches" v-if="recentSearches.length > 0">
          <h2>Seneste Søgninger</h2>
          <transition-group name="list" tag="ul">
            <li
              v-for="search in recentSearches"
              :key="search"
              @click="setIMEI(search)"
              class="recent-search-item"
              tabindex="0"
              role="button"
              aria-label="Select recent search {{ search }}"
            >
              {{ search }}
              <!-- Button to remove a recent search -->
              <button type="button" class="delete-btn" @click.stop="removeSearch(search)">×</button>
            </li>
          </transition-group>
        </div>
      </transition>
      <!-- Button to route to add new user -->
      <button @click="RouteAddUser" class="add-user-btn">Opret ny</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'IMEILookup',
  data() {
    return {
      imei: '', // IMEI input value
      isLoading: false, // Loading state
      error: null, // Error message
      recentSearches: [] // List of recent searches
    }
  },
  computed: {
    // Check if the IMEI is valid
    isValidIMEI() {
      return this.imei.length === 15 && /^\d+$/.test(this.imei)
    }
  },
  methods: {
    // Lookup user by IMEI
    async lookupUser() {
      this.error = null

      if (!this.isValidIMEI) {
        this.error = 'Indtast venligst et gyldigt 15-cifret IMEI-nummer.'
        return
      }

      this.isLoading = true

      try {
        await axios.get(`https://imei-lookup-backend.onrender.com/api/users/${this.imei}`)
        this.addToRecentSearches(this.imei)
        this.$router.push({ name: 'UserInfo', params: { imei: this.imei } })
        this.imei = ''
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.error = 'Ingen bruger fundet med det givne IMEI-nummer.'
        } else {
          this.error = 'Der opstod en fejl under søgning af brugeren. Prøv venligst igen.'
        }
      } finally {
        this.isLoading = false
      }
    },
    // Validate the IMEI input
    validateInput() {
      this.imei = this.imei.replace(/[^0-9]/g, '').slice(0, 15)
      this.error = null
    },
    // Add IMEI to recent searches
    addToRecentSearches(imei) {
      if (!this.recentSearches.includes(imei)) {
        this.recentSearches.unshift(imei)
        if (this.recentSearches.length > 5) {
          this.recentSearches.pop()
        }
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))
      }
    },
    // Set IMEI input value
    setIMEI(imei) {
      this.imei = imei
    },
    // Clear the IMEI input field
    clearInput() {
      this.imei = ''
    },
    // Remove a recent search
    removeSearch(search) {
      this.recentSearches = this.recentSearches.filter((item) => item !== search)
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))
    },
    // Route to add new user page
    RouteAddUser() {
      this.$router.push({ name: 'AddNew' })
    }
  },
  mounted() {
    // Load recent searches from local storage
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      this.recentSearches = JSON.parse(savedSearches)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.imei-lookup {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  background-color: #f0f4f8;
  padding: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.input-error input {
  border-color: #e74c3c;
}

label {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

input:focus + label,
input:not(:placeholder-shown) + label {
  top: 0;
  font-size: 12px;
  color: #3498db;
  background-color: #ffffff;
  padding: 0 5px;
}

.input-status {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #999;
}

.clear-btn {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.clear-btn:hover {
  color: #e74c3c;
}

.submit-btn,
.add-user-btn {
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-user-btn {
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  margin-top: 20px;
  padding: 15px;
  background-color: #fdf0ed;
  border-radius: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.error-message i {
  margin-right: 10px;
  font-size: 20px;
}

.retry-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-left: 10px;
}

.retry-btn:hover {
  background-color: #c0392b;
}

.recent-searches {
  margin-top: 30px;
}

.recent-searches h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.recent-searches ul {
  list-style-type: none;
  padding: 0;
}

.recent-search-item {
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.recent-search-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.delete-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  color: #e74c3c;
  cursor: pointer;
}

.delete-btn:hover {
  color: #c0392b;
}

.tooltip {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.3s ease;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .card {
    padding: 30px;
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Slide fade transition */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* List transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.5s;
}

.submit-btn:not(:disabled):hover {
  animation: pulse 0.5s infinite;
}

.input-group {
  transition: all 0.3s ease;
}

.input-group.input-error {
  transform: translateX(5px);
}

.input-group.input-error input {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

.recent-searches li {
  transition: all 0.3s ease;
}

.recent-searches li:hover {
  transform: translateX(5px) scale(1.02);
}
</style>
