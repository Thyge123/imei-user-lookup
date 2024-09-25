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
          <img :src="user.picture" alt="User Profile Picture" class="profile-pic" />
        </div>
        <h1>OPKØB AF BRUGT ELEKTRONIK</h1>
      </div>
      <div class="update-image-container">
        <div class="update-image-buttons">
          <button @click="triggerFileInput" class="update-image-btn">Upload Image</button>
          <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" />
        </div>
        <label for="ImageURL">Image URL:</label>
        <input
          type="text"
          v-model="user.picture"
          placeholder="Enter image URL"
          class="image-url-input"
          @change="updateImageUrl"
        />
      </div>
      <br />
      <div class="form-grid">
        <div class="form-row">
          <label for="model">Model</label>
          <input id="model" type="text" v-model="user.model" @input="validateModel" />
          <span v-if="errors.model" class="error">{{ errors.model }}</span>
        </div>
        <div class="form-row">
          <label for="imei">IMEI-/Serienummer</label>
          <input id="imei" type="text" v-model="user.imei" @input="validateIMEI" />
          <span v-if="errors.imei" class="error">{{ errors.imei }}</span>
        </div>
        <div class="form-row">
          <label for="agreedPrice">Aftalt pris (DKK)</label>
          <input
            id="agreedPrice"
            type="text"
            v-model="user.agreedPrice"
            @input="validateAgreedPrice"
          />
          <span v-if="errors.agreedPrice" class="error">{{ errors.agreedPrice }}</span>
        </div>
        <div class="form-row">
          <label for="notes">Bemærkninger</label>
          <textarea id="notes" v-model="user.notes" @input="validateNotes"></textarea>
          <span v-if="errors.notes" class="error">{{ errors.notes }}</span>
        </div>
        <div class="form-row">
          <label for="birthday">Kundens fødselsdato (ddmmåå)</label>
          <input
            id="birthday"
            type="date"
            v-model="user.birthday"
            class="modern-date-input"
            @input="validateBirthday"
          />
          <span v-if="errors.birthday" class="error">{{ errors.birthday }}</span>
        </div>
        <div class="form-row">
          <label for="phoneNumber">Kundens tlf.nummer</label>
          <input
            id="phoneNumber"
            type="text"
            v-model="user.phoneNumber"
            @input="validatePhoneNumber"
          />
          <span v-if="errors.phoneNumber" class="error">{{ errors.phoneNumber }}</span>
        </div>
        <div class="form-row bank-details">
          <label>Kundens bankkonto</label>
          <div class="bank-inputs">
            <input
              type="text"
              v-model="user.bankReg"
              placeholder="Reg. nr."
              @input="validateBankReg"
            />
            <input
              type="text"
              v-model="user.bankAccount"
              placeholder="Konto.nr."
              class="long-input"
              :class="{ copied: copiedField === 'bankAccount' }"
              @input="validateBankAccount"
            />
          </div>
          <span v-if="errors.bankReg" class="error">{{ errors.bankReg }}</span>
          <span v-if="errors.bankAccount" class="error">{{ errors.bankAccount }}</span>
        </div>
        <div class="form-row full-width">
          <label for="name">Kundens navn (blokbogstaver)</label>
          <input
            id="name"
            type="text"
            v-model="user.name"
            class="uppercase"
            @input="validateName"
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>
        <div class="form-row">
          <label for="date">Dato</label>
          <input id="date" type="date" v-model="user.date" @input="validateDate" />
          <span v-if="errors.date" class="error">{{ errors.date }}</span>
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
      <div class="button-container">
        <button @click="goBack" class="back-btn" aria-label="back">
          <span class="back-icon">←</span> Tilbage
        </button>
        <button @click="addUser" class="add-btn" aria-label="add">Tilføj</button>
      </div>
      <Toast ref="toastSuccess" message="Success!" />
    </div>
    <div v-else-if="loading" class="loading" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p>Indlæser brugeroplysninger...</p>
    </div>
    <div v-else class="error" aria-live="polite">
      <p>{{ errorMessage }}</p>
    </div>
    <Toast
      v-show="error"
      ref="toast"
      :message="errorMessage"
      style="background: linear-gradient(135deg, #ff0000, #ff0000)"
    />
  </div>
</template>

<script>
import axios from 'axios'
import Toast from './ToastNotification.vue'

export default {
  name: 'UserInfo',
  components: {
    Toast
  },
  data() {
    return {
      user: {
        id: null,
        imei: null,
        name: null,
        model: null,
        agreedPrice: 0,
        notes: null,
        birthday: null,
        phoneNumber: null,
        bankReg: null,
        bankAccount: null,
        date: null,
        picture: 'https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png',
        signature:
          'https://artlogo.co/cdn/shop/files/Group_31683798-2456-42f0-9aa4-0ccc3dcd7007.svg?v=1681759932'
      },
      loading: true,
      error: false,
      copiedField: null,
      imeiError: '',
      success: false,
      errorMessage: '',
      imageUrl: '',
      errors: {
        imei: '',
        model: '',
        agreedPrice: '',
        notes: '',
        birthday: '',
        phoneNumber: '',
        bankReg: '',
        bankAccount: '',
        name: '',
        date: ''
      }
    }
  },
  methods: {
    async checkImeiExists(imei) {
      try {
        const response = await axios.get(
          `https://imei-lookup-backend.onrender.com/api/users/${imei}`
        )
        return response.data ? true : false
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return false
        } else {
          throw new Error('Error checking IMEI: ' + error.message)
        }
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('https://imei-lookup-backend.onrender.com/api/users')
        return Array.isArray(response.data) ? response.data : []
      } catch (error) {
        throw new Error('Error fetching users: ' + error.message)
      }
    },
    getHighestUserId(users) {
      return users.reduce((maxId, user) => Math.max(maxId, user.id), 0)
    },
    createFormData(user, file, imageUrl) {
      const formData = new FormData()
      formData.append('id', user.id)
      formData.append('imei', user.imei)
      formData.append('name', user.name)
      formData.append('model', user.model)
      formData.append('agreedPrice', user.agreedPrice)
      formData.append('notes', user.notes)
      formData.append('birthday', user.birthday)
      formData.append('phoneNumber', user.phoneNumber)
      formData.append('bankReg', user.bankReg)
      formData.append('bankAccount', user.bankAccount)
      formData.append('date', user.date)

      if (file) {
        formData.append('picture', file)
      } else if (imageUrl) {
        formData.append('webAddress', imageUrl)
      }

      return formData
    },
    async addUser() {
      // Validate the form
      if (!this.validateForm()) {
        console.log(this.errors)
        this.error = true
        this.errorMessage = 'Please correct the errors in the form.'
        this.$refs.toast.show()
        return
      }

      try {
        // Check if IMEI already exists
        const imeiExists = await this.checkImeiExists(this.user.imei)
        if (imeiExists) {
          this.error = true
          this.errorMessage = 'IMEI already exists'
          this.$refs.toast.show()
          return
        }

        // Get all users
        const users = await this.fetchUsers()

        // Determine the highest id
        const highestId = this.getHighestUserId(users)

        // Set the new user's id
        this.user.id = highestId + 1

        // Create form data for the user
        const file = this.$refs.fileInput.files.length > 0 ? this.$refs.fileInput.files[0] : null
        const formData = this.createFormData(this.user, file, this.imageUrl)

        // Add the user
        const response = await axios.post(
          'https://imei-lookup-backend.onrender.com/api/users',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        // Show success message
        if (response.status === 200) {
          this.success = true
          this.$refs.toastSuccess.show()
          setTimeout(() => {
            this.loading = true
          }, 1000)
          setTimeout(() => {
            this.$router.push({ name: 'UserInfo', params: { imei: this.user.imei } })
          }, 3000)
        }
      } catch (error) {
        console.error('Error adding user:', error)
        this.error = true
        this.errorMessage = error.message
        this.$refs.toast.show()
      }
    },
    goBack() {
      this.$router.push({ name: 'IMEILookup' })
    },
    validateIMEI() {
      const imeiPattern = /^[0-9]{15}$/
      if (!imeiPattern.test(this.user.imei)) {
        this.imeiError = 'IMEI must be a 15-digit number'
      } else {
        this.imeiError = ''
      }
    },
    validateModel() {
      if (!this.user.model) {
        this.errors.model = 'Model is required'
      } else {
        this.errors.model = ''
      }
    },
    validateAgreedPrice() {
      if (!this.user.agreedPrice || isNaN(this.user.agreedPrice)) {
        this.errors.agreedPrice = 'Agreed price must be a number'
      } else {
        this.errors.agreedPrice = ''
      }
    },
    validateNotes() {
      if (!this.user.notes) {
        this.errors.notes = 'Notes are required'
      } else {
        this.errors.notes = ''
      }
    },
    validateBirthday() {
      if (!this.user.birthday) {
        this.errors.birthday = 'Birthday is required'
      } else {
        this.errors.birthday = ''
      }
    },
    validatePhoneNumber() {
      const phonePattern = /^[0-9]{8}$/
      if (!phonePattern.test(this.user.phoneNumber)) {
        this.errors.phoneNumber = 'Phone number must be an 8-digit number'
      } else {
        this.errors.phoneNumber = ''
      }
    },
    validateBankReg() {
      if (!this.user.bankReg) {
        this.errors.bankReg = 'Bank registration number is required'
      } else {
        this.errors.bankReg = ''
      }
    },
    validateBankAccount() {
      if (!this.user.bankAccount) {
        this.errors.bankAccount = 'Bank account number is required'
      } else {
        this.errors.bankAccount = ''
      }
    },
    validateName() {
      if (!this.user.name) {
        this.errors.name = 'Name is required'
      } else {
        this.errors.name = ''
      }
    },
    validateDate() {
      if (!this.user.date) {
        this.errors.date = 'Date is required'
      } else {
        this.errors.date = ''
      }
    },
    validateForm() {
      this.validateIMEI()
      this.validateModel()
      this.validateAgreedPrice()
      this.validateNotes()
      this.validateBirthday()
      this.validatePhoneNumber()
      this.validateBankReg()
      this.validateBankAccount()
      this.validateName()
      this.validateDate()

      return Object.values(this.errors).every((error) => !error)
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.user.picture = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async updateImageUrl() {
      if (!this.imageUrl) return
      this.user.picture = this.imageUrl
    }
  },
  created() {
    this.loading = false
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

.modern-date-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.modern-date-input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  outline: none;
}

.modern-date-input::-webkit-calendar-picker-indicator {
  filter: invert(50%);
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
}

input[type='date'] {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  height: 50px;
  font-family: 'Roboto', sans-serif;
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
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
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
  margin-left: auto;
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
  margin-right: auto;
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
  gap: 12px;
}

.bank-details input {
  flex: 1;
}

.bank-details .long-input {
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

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
</style>
