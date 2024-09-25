<template>
  <div class="user-info-page">
    <div class="card" v-if="!loading && !error">
      <div class="header">
        <img
          src="https://telegiganten.dk/wp-content/uploads/2023/12/cropped-logo-Telegiganten.png.webp"
          alt="Telegiganten Logo"
          class="logo"
        />
        <div class="id-placeholder">
          <img
            :src="user.picture"
            alt="User Profile Picture"
            class="profile-pic"
            v-if="user.picture"
          />
          <div v-else class="placeholder-text">Placér kundens billed-ID her</div>
        </div>
        <h1>OPKØB AF BRUGT ELEKTRONIK</h1>
      </div>
      <div class="update-image-container">
        <div class="update-image-buttons">
          <button v-if="user.picture" @click="triggerFileInput" class="update-image-btn">
            Update Image
          </button>
          <input type="file" ref="fileInput" @change="updateImage" style="display: none" />
        </div>
        <label for="ImageURL">Image URL:</label>
        <input
          type="text"
          v-model="user.picture"
          placeholder="Enter image URL"
          class="image-url-input"
          @onchange="updateImageUrl"
        />
      </div>
      <br />
      <div class="form-grid">
        <div class="form-row">
          <label for="model">Model</label>
          <div class="input-wrapper">
            <input
              id="model"
              type="text"
              v-model="user.model"
              :readonly="!editMode.model"
              @click="copyToClipboard(user.model, 'model', editMode.model)"
              :class="{ copied: copiedField === 'model' }"
            />
            <span class="edit-icon" @click="toggleEditMode('model')">
              {{ editMode.model ? '✔' : '✎' }}
            </span>
          </div>
          <span v-if="!editMode.model" class="copy-tooltip">Click to copy</span>
        </div>
        <div class="form-row">
          <label for="imei">IMEI-/Serienummer</label>
          <div class="input-wrapper">
            <input
              id="imei"
              type="text"
              v-model="user.imei"
              :readonly="!editMode.imei"
              @click="copyToClipboard(user.imei, 'imei', editMode.imei)"
              :class="{ copied: copiedField === 'imei' }"
            />
            <span class="edit-icon" @click="toggleEditMode('imei')">
              {{ editMode.imei ? '✔' : '✎' }}
            </span>
          </div>
          <span v-if="!editMode.imei" class="copy-tooltip">Click to copy</span>
        </div>
        <div class="form-row">
          <label for="agreedPrice">Aftalt pris (DKK)</label>
          <div class="input-wrapper">
            <input
              id="agreedPrice"
              type="text"
              v-model="user.agreedPrice"
              :readonly="!editMode.agreedPrice"
              @click="copyToClipboard(user.agreedPrice, 'agreedPrice', editMode.agreedPrice)"
              :class="{ copied: copiedField === 'agreedPrice' }"
            />
            <span class="edit-icon" @click="toggleEditMode('agreedPrice')">
              {{ editMode.agreedPrice ? '✔' : '✎' }}
            </span>
          </div>
          <span v-if="!editMode.agreedPrice" class="copy-tooltip">Click to copy</span>
        </div>
        <div class="form-row">
          <label for="notes">Bemærkninger</label>
          <div class="input-wrapper">
            <textarea
              id="notes"
              v-model="user.notes"
              :readonly="!editMode.notes"
              @click="copyToClipboard(user.notes, 'notes')"
              :class="{ copied: copiedField === 'notes' }"
            ></textarea>
            <span class="edit-icon" @click="toggleEditMode('notes')">
              {{ editMode.notes ? '✔' : '✎' }}
            </span>
          </div>
          <span class="copy-tooltip">Click to copy</span>
        </div>
        <div class="form-row">
          <label for="birthday">Kundens fødselsdato (ddmmåå)</label>
          <div class="input-wrapper">
            <input
              id="birthday"
              type="text"
              :value="formatDate(user.birthday)"
              :readonly="!editMode.birthday"
              @click="copyToClipboard(user.birthday, 'birthday', editMode.birthday)"
              :class="{ copied: copiedField === 'birthday' }"
            />
            <span class="edit-icon" @click="toggleEditMode('birthday')">
              {{ editMode.birthday ? '✔' : '✎' }}
            </span>
          </div>
          <span v-if="!editMode.birthday" class="copy-tooltip">Click to copy</span>
        </div>
        <div class="form-row">
          <label for="phoneNumber">Kundens tlf.nummer</label>
          <div class="input-wrapper">
            <input
              id="phoneNumber"
              type="text"
              v-model="user.phoneNumber"
              :readonly="!editMode.phoneNumber"
              @click="copyToClipboard(user.phoneNumber, 'phoneNumber', editMode.phoneNumber)"
              :class="{ copied: copiedField === 'phoneNumber' }"
            />
            <span class="edit-icon" @click="toggleEditMode('phoneNumber')">
              {{ editMode.phoneNumber ? '✔' : '✎' }}
            </span>
          </div>
          <span v-if="!editMode.phoneNumber" class="copy-tooltip">Click to copy</span>
        </div>
        <div class="form-row bank-details">
          <label>Kundens bankkonto</label>
          <div class="bank-inputs">
            <div class="input-wrapper">
              <input
                type="text"
                v-model="user.bankReg"
                :readonly="!editMode.bankReg"
                placeholder="Reg. nr."
                @click="copyToClipboard(user.bankReg, 'bankReg')"
                :class="{ copied: copiedField === 'bankReg' }"
              />
              <span class="edit-icon" @click="toggleEditMode('bankReg')">
                {{ editMode.bankReg ? '✔' : '✎' }}
              </span>
            </div>
            <div class="input-wrapper">
              <input
                type="text"
                v-model="user.bankAccount"
                :readonly="!editMode.bankAccount"
                placeholder="Konto.nr."
                class="long-input"
                @click="copyToClipboard(user.bankAccount, 'bankAccount', editMode.bankAccount)"
                :class="{ copied: copiedField === 'bankAccount' }"
              />
              <span class="edit-icon" @click="toggleEditMode('bankAccount')">
                {{ editMode.bankAccount ? '✔' : '✎' }}
              </span>
            </div>
            <span v-if="!editMode.bankAccount" class="copy-tooltip">Click to copy</span>
          </div>
        </div>
        <div class="form-row full-width">
          <label for="name">Kundens navn (blokbogstaver)</label>
          <div class="input-wrapper">
            <input
              id="name"
              type="text"
              v-model="user.name"
              :readonly="!editMode.name"
              class="uppercase"
              @click="copyToClipboard(user.name, 'name', editMode.name)"
              :class="{ copied: copiedField === 'name' }"
            />
            <span class="edit-icon" @click="toggleEditMode('name')">
              {{ editMode.name ? '✔' : '✎' }}
            </span>
          </div>
          <span v-if="!editMode.name" class="copy-tooltip">Click to copy</span>
        </div>
        <div class="form-row">
          <label for="date">Dato</label>
          <div class="input-wrapper">
            <input
              id="date"
              type="text"
              :value="formatDate(user.date)"
              :readonly="!editMode.date"
              @click="copyToClipboard(user.date, 'date')"
              :class="{ copied: copiedField === 'date' }"
            />
            <span class="edit-icon" @click="toggleEditMode('date')">
              {{ editMode.date ? '✔' : '✎' }}
            </span>
          </div>
          <span v-if="!editMode.date" class="copy-tooltip">Click to copy</span>
        </div>
        <br />
        <div class="form-row signature full-width">
          <label>Underskrift</label>
          <div class="signature-box">
            <img :src="user.signature" alt="User Signature" v-if="user.signature" />
            <span v-else>Klik for at se underskrift</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>
          Alle salg er endelige. Efter underskrift er der ikke fortrydelsesret på salg af brugt
          elektronik.
        </p>
        <p>Bemærk: der kan gå 1-3 hverdage før pengene er på din konto.</p>
        <p class="company-info">
          CVR: 34589224 | +45 70 70 78 56 | info@telegiganten.com | www.telegiganten.dk | Taastrup
          hovedgade 68, 2630 Taastrup
        </p>
      </div>
      <button @click="goBack" class="back-btn" aria-label="Tilbage til søgning">
        <span class="back-icon">←</span> Tilbage til søgning
      </button>
    </div>
    <div v-else-if="loading" class="loading" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p>Indlæser brugeroplysninger...</p>
    </div>
    <div v-else class="error" aria-live="assertive">
      <p>Fejl ved indlæsning af brugeroplysninger. Prøv venligst igen senere.</p>
      <button @click="goBack" class="back-btn" aria-label="Tilbage til søgning">
        <span class="back-icon">←</span> Tilbage til søgning
      </button>
    </div>

    <Toast ref="toast" message="Field copied to clipboard!" />
  </div>
</template>

<script>
import axios from 'axios'
import Toast from './ToastNotification.vue'
export default {
  name: 'UserInfo',
  components: { Toast },
  data() {
    return {
      user: null,
      loading: true,
      error: false,
      copiedField: null,
      editMode: {
        model: false,
        imei: false,
        agreedPrice: false,
        notes: false,
        birthday: false,
        phoneNumber: false,
        bankReg: false,
        bankAccount: false,
        name: false,
        date: false
      },
      imageUrl: ''
    }
  },
  created() {
    this.loading = true
    this.fetchUserInfo()
  },
  methods: {
    async fetchUserInfo() {
      this.loading = true
      this.error = false
      const imei = this.$route.params.imei
      try {
        const response = await axios.get(
          `https://imei-lookup-backend.onrender.com/api/users/${imei}`
        )
        if (response && response.data) {
          this.user = response.data
        } else {
          throw new Error('Invalid response')
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        this.error = true
      } finally {
        this.loading = false
      }
    },
    // Update user with inline editing
    async updateUser() {
      try {
        await axios.put(
          `https://imei-lookup-backend.onrender.com/api/users/${this.user.id}`,
          this.user
        )
      } catch (error) {
        console.error('Error updating user:', error)
      }
    },
    goBack() {
      this.$router.push({ name: 'IMEILookup' })
    },
    copyToClipboard(text, field, isEditing) {
      if (isEditing) return // Disable copying while editing
      navigator.clipboard.writeText(text).then(() => {
        this.copiedField = field
        this.$refs.toast.show()
        setTimeout(() => {
          this.copiedField = null
        }, 2000)
      })
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    },
    toggleEditMode(field) {
      this.editMode[field] = !this.editMode[field]
      this.updateUser()
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    async updateImage(event) {
      const file = event.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('picture', file)

      try {
        const response = await axios.post(
          `https://imei-lookup-backend.onrender.com/api/users/${this.user.id}/update-picture`,
          formData
        )
        this.user.picture = response.data.picture
      } catch (error) {
        console.error('Error updating image:', error)
      }
    },
    async updateImageUrl() {
      if (!this.user.picture) return

      try {
        const response = await axios.post(
          `https://imei-lookup-backend.onrender.com/api/users/${this.user.id}/update-picture`,
          {
            webAddress: this.user.picture
          }
        )
        this.user.picture = response.data.picture
      } catch (error) {
        console.error('Error updating image via URL:', error)
      }
    }
  }
}
</script>

<style scoped>
.user-info-page {
  animation: fadeIn 0.5s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 800px;
  transition: all 0.3s ease;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0px;
  flex-wrap: wrap;
}

.logo {
  height: auto;
}

/*
.id-placeholder {
  width: 120px;
  height: 120px;
  border: 2px dashed #bdc3c7;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 12px;
  color: #7f8c8d;
}
*/
.profile-pic {
  height: 200px;
  object-fit: cover;
  margin-bottom: -20px;
}

.update-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 200px;
  margin-left: auto;
}

.update-image-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.update-image-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  flex: 1;
  margin: 0 5px;
}

.update-image-btn:hover {
  background-color: #0056b3;
}

.image-url-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 14px;
}

.image-url-input:focus {
  border-color: #007bff;
  outline: none;
}

h1 {
  font-size: 24px;
  color: black;
  font-weight: bold;
  margin-top: -75px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-row {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

label {
  font-size: 14px;
  color: black;
  margin-bottom: 6px;
  font-weight: 600;
}

input,
textarea {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  height: 50px;
  min-width: 100%;
}

textarea {
  resize: vertical;
  min-height: 50px;
  overflow: hidden;
  height: 50px;
  font-family: 'Roboto', sans-serif;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.bank-details {
  grid-column: 1 / -1; /* This makes the bank details span full width */
}

.bank-details .bank-inputs {
  display: flex;
  gap: 12px;
}

.bank-details .reg-input {
  flex: 1;
  max-width: 100px; /* Adjust this value as needed */
}

.bank-details .account-input {
  flex: 3; /* This makes the account number input take up more space */
}

.signature {
  width: 100%;
}

.signature label {
  display: block;
  margin-bottom: 10px;
}

.signature-box {
  width: 100%;
  max-width: 600px; /* Adjust this value to control the maximum width */
  height: 120px;
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  margin: 0 auto; /* This centers the signature box */
}

.signature-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.footer {
  margin-top: 40px;
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
  line-height: 1.6;
}

.company-info {
  font-size: 10px;
  margin-top: 10px;
}

.back-btn {
  margin-top: 24px;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-icon {
  margin-right: 8px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.uppercase {
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;

    text-align: center;
  }

  .logo,
  .id-placeholder {
    margin-bottom: 20px;
  }

  h1 {
    font-size: 20px;
    margin: 10px 0;
  }
}
.form-row {
  position: relative;
}

.copy-tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.copy-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.form-row:hover .copy-tooltip {
  bottom: 10px;
  opacity: 1;
}

input:hover,
textarea:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.copied {
  background-color: #e8f5e9 !important;
  transition: background-color 0.3s ease;
}

.signature-box:hover {
  cursor: pointer;
  background-color: #f0f0f0;
}

.signature-box:focus {
  outline: 2px solid #3498db;
}

.placeholder-text {
  color: #7f8c8d;
  font-size: 14px;
  text-align: center;
}

/* Ensure inputs and textareas have the same height */
input,
textarea {
  min-height: 50px;
}

/* Add focus styles for better accessibility */
input:focus,
textarea:focus,
.back-btn:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* Improve loading and error states */
.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

/* Add a subtle hover effect to the back button */
.back-btn:hover {
  background-color: #2980b9;
}

/* Ensure consistent styling for bank account inputs */
.bank-details {
  display: flex;
}

.bank-details input {
  flex: 1;
}

.bank-details .long-input {
  width: 487px;
  flex: 3;
}

/* Add responsive adjustments */
@media (max-width: 768px) {
  .bank-details {
    flex-direction: column;
  }

  .bank-details input {
    width: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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

.input-wrapper {
  position: relative;
}
.edit-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #000000;
}

.edit-icon:hover {
  color: #2980b9;
}
</style>
