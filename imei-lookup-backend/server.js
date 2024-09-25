/* eslint-disable no-undef */
// server.js
const express = require('express') // Import express. Express is a web application framework for Node.js.
const cors = require('cors') // Import cors.
const multer = require('multer') // Import multer. Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const path = require('path') // Import path
const fs = require('fs') // Import fs.

const app = express() // Create an express app
const port = 3000 // Set the port

app.use(cors()) // Enable CORS
app.use(express.json()) // Enable JSON body parsing

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Set the file name
  }
})

const upload = multer({ storage }) // Create a multer instance with the storage configuration

let users = []
const usersFilePath = path.join(__dirname, 'users.json') // Set the path to the users file

// Load users from file
try {
  if (fs.existsSync(usersFilePath)) {
    // Check if the file exists
    const usersData = fs.readFileSync(usersFilePath, 'utf8') // Read the file
    users = JSON.parse(usersData) // Parse the JSON data
  } else {
    console.log('No users file found, starting with an empty users array.')
  }
} catch (error) {
  console.error('Error loading users from file:', error)
  users = [] // Set users to an empty array if an error occurs
}

// Save users to file
const saveUsersToFile = () => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)) // Write the users array to the file
}

// Function to update a user
const updateUser = (id, updatedUserData) => {
  try {
    // Read the users file
    const usersData = fs.readFileSync(usersFilePath, 'utf8')
    const users = JSON.parse(usersData)

    // Find the user by id
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      console.log('User not found')
      return
    }

    // Update the user's information
    users[userIndex] = { ...users[userIndex], ...updatedUserData }

    // Write the updated data back to the file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    console.log('User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

// Mock database
/*
const users = [
  {
    imei: '123456789012345',
    name: 'John Doe',
    model: 'iPhone 12 Pro Max',
    agreedPrice: 500.0,
    notes: 'Some notes about the user...',
    birthday: '1990-01-01',
    phoneNumber: '+45 12345678',
    bankDetails: 'Bank: XYZ, Account: 1234567890',
    date: '2023-05-20',
    picture: 'https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png',
    signature:
      'https://artlogo.co/cdn/shop/files/Group_31683798-2456-42f0-9aa4-0ccc3dcd7007.svg?v=1681759932'
  },
  {
    imei: '987654321098765',
    name: 'Jane Smith',
    model: 'iPhone 12 Pro Max',
    agreedPrice: 500.0,
    notes: 'Some notes about the user...',
    birthday: '1990-01-01',
    phoneNumber: '+45 12345678',
    bankReg: '1234',
    bankAccount: '5678',
    date: '2023-05-20',
    picture: 'https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png',
    signature:
      'https://artlogo.co/cdn/shop/files/Group_31683798-2456-42f0-9aa4-0ccc3dcd7007.svg?v=1681759932'
  }
]
*/

// Endpoint to get a user by IMEI
app.get('/api/users/:imei', (req, res) => {
  const imei = req.params.imei // Get the IMEI from the request parameters
  try {
    if (fs.existsSync(usersFilePath)) {
      // Check if the users file exists
      const usersData = fs.readFileSync(usersFilePath, 'utf8') // Read the users file
      const users = JSON.parse(usersData) // Parse the JSON data
      const user = users.find((u) => u.imei === imei) // Find the user with the specified IMEI
      if (user) {
        res.json(user) // Return the user as JSON
      } else {
        res.status(404).json({ message: 'User not found' }) // Return a 404 error if the user is not found
      }
    } else {
      res.status(404).json({ message: 'Users file not found' }) // Return a 404 error if the users file is not found
    }
  } catch (error) {
    // Catch any errors that occur
    console.error('Error reading users file:', error) // Log the error to the console
    res.status(500).json({ message: 'Internal server error' }) // Return a 500 error
  }
})

// Endpoint to get all users
app.get('/api/users', (req, res) => {
  res.json(users) // Return the users array as JSON
})

// Endpoint to add a new user
app.post('/api/users', upload.single('picture'), (req, res) => {
  const user = req.body // Get the user data from the request body

  // Handle profile picture if provided
  if (req.file) {
    // If a file is uploaded, set the picture URL to the uploaded file's path
    user.picture = `http://https://imei-lookup-backend.onrender.com/uploads/${req.file.filename}`
  } else if (req.body.webAddress) {
    // If a web address is provided, set the picture URL to the web address
    user.picture = req.body.webAddress
  }

  // Check for required fields
  if (
    !user.imei ||
    !user.name ||
    !user.model ||
    !user.agreedPrice ||
    !user.birthday ||
    !user.phoneNumber ||
    !user.bankReg ||
    !user.bankAccount ||
    !user.date
  ) {
    return res.status(400).json({ message: 'Missing required fields' }) // Return a 400 error if any required fields are missing
  }

  users.push(user) // Add the user to the users array
  saveUsersToFile() // Save the users array to the file
  res.json({ message: 'User added successfully' }) // Return a success message
})

//Endpoint get user by Id
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id // Get the IMEI from the request parameters
  try {
    if (fs.existsSync('users.json')) {
      // Check if the users file exists
      const usersData = fs.readFileSync(usersFilePath, 'utf8') // Read the users file
      const users = JSON.parse(usersData) // Parse the JSON data
      const user = users.find((u) => u.id === id) // Find the user with the specified IMEI
      if (user) {
        res.json(user) // Return the user as JSON
      } else {
        res.status(404).json({ message: 'User not found' }) // Return a 404 error if the user is not found
      }
    }
  } catch (error) {
    // Catch any errors that occur
    console.error('Error reading users file:', error) // Log the error to the console
    res.status(500).json({ message: 'Internal server error' }) // Return a 500 error
  }
})

//Endpoint to update user based on userId
app.put('/api/users/:id', (req, res) => {
  let id = req.params.id // Get the IMEI from the request parameters
  //convert id to number
  id = Number(id)
  try {
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath, 'utf8') // Read the users file
      const users = JSON.parse(usersData) // Parse the JSON data
      console.log('users', users)
      const user = users.find((u) => u.id === id) // Find the user with the specified IMEI
      if (user) {
        // Check if the user is found
        user.name = req.body.name // Update the user name
        user.model = req.body.model // Update the user model
        user.agreedPrice = req.body.agreedPrice // Update the agreed price
        user.notes = req.body.notes // Update the notes
        user.birthday = req.body.birthday // Update the birthday
        user.phoneNumber = req.body.phoneNumber // Update the phone number
        user.bankReg = req.body.bankReg // Update the bank registration number
        user.bankAccount = req.body.bankAccount // Update the bank account number
        user.date = req.body.date // Update the date
        updateUser(id, user) // Update the user in the users array
        res.json(user) // Return the user as JSON
      } else {
        res.status(404).json({ message: 'User not found' }) // Return a 404 error if the user is not found
      }
    } else {
      res.status(404).json({ message: 'Users file not found' }) // Return a 404 error if the users file is not found
    }
  } catch (error) {
    // Catch any errors that occur
    console.error('Error reading users file:', error) // Log the error to the console
    res.status(500).json({ message: 'Internal server error' }) // Return a 500 error
  }
})

app.post('/api/users/:id/update-picture', upload.single('picture'), (req, res) => {
  let id = req.params.id // Get the IMEI from the request parameters
  id = Number(id)
  const user = users.find((u) => u.id === id) // Find the user with the specified IMEI

  if (user) {
    // Check if the user is found
    if (req.file) {
      // If a file is uploaded, set the picture URL to the uploaded file's path
      user.picture = `https://imei-lookup-backend.onrender.com/uploads/${req.file.filename}`
    } else if (req.body.webAddress) {
      // If a web address is provided, set the picture URL to the web address
      user.picture = req.body.webAddress
    } else {
      return res.status(400).json({ message: 'No picture file or web address provided' })
    }
    updateUser(id, user) // Update the user in the users array
    res.json({ message: 'Picture updated successfully', picture: user.picture }) // Return a success message
  } else {
    // Delete the uploaded file if user is not found
    if (req.file) {
      const fs = require('fs')
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err)
        }
      })
    }
    res.status(404).json({ message: 'User not found' })
  }
})

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Start the server
app.listen(port, () => {
  console.log(`Server running`)
})
