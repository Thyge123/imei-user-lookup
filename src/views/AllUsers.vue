<!-- src/views/AllUsers.vue -->
<template>
  <div class="all-users">
    <h1>All Users</h1>
    <table class="table table-striped table-hover">
      <thead class="thead-dark">
        <tr>
          <th>Navn</th>
          <th>IMEI</th>
          <th>Model</th>
          <th>Telefon Nummer</th>
          <th>Aftalt Pris</th>
          <th>Dato</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name || 'N/A' }}</td>
          <td>{{ user.imei || 'N/A' }}</td>
          <td>{{ user.model || 'N/A' }}</td>
          <td>{{ user.phoneNumber || 'N/A' }}</td>
          <td>{{ user.agreedPrice ? `${user.agreedPrice} kr` : 'N/A' }}</td>
          <td style="width: 110px">{{ formatDate(user.date) }}</td>
          <td>
            <button
              @click="editUser(user)"
              class="btn btn-primary btn-sm"
              style="margin-right: 5px"
            >
              Edit
            </button>
            <button @click="deleteUser(user)" class="btn btn-danger btn-sm">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AllUsers',
  data() {
    return {
      users: []
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('https://imei-lookup-backend.onrender.com/api/users')
        this.users = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },
    editUser(user) {
      this.$router.push({ name: 'UserInfo', params: { imei: user.imei } })
    },
    async deleteUser(user) {
      if (confirm('Er du sikker på, at du vil slette denne bruger?')) {
        try {
          await axios.delete(`https://imei-lookup-backend.onrender.com/api/users/${user.imei}`)
          this.fetchUsers()
        } catch (error) {
          console.error('Error deleting user:', error)
        }
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }
  }
}
</script>

<style scoped>
.all-users {
  padding: 2rem;
  margin: auto;
}

.all-users h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
  color: #333;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thead-dark {
  background-color: #343a40;
  color: white;
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  font-weight: bold;
}

.table-hover tbody tr:hover {
  background-color: #f9f9f9;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .table,
  .thead-dark,
  .table tbody,
  .table th,
  .table td,
  .table tr {
    display: block;
    width: 100%;
  }

  .table tr {
    margin-bottom: 1rem;
  }

  .table td {
    padding-left: 50%;
    position: relative;
  }

  .table td:before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    padding-left: 1rem;
    font-weight: bold;
  }
}
</style>
