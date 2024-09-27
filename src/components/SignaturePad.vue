<template>
  <div class="signature">
    <!-- Label for the signature pad -->
    <label for="signaturePad">Underskrift</label>
    <div class="signature-box">
      <!-- Canvas element for drawing the signature -->
      <canvas ref="signaturePad" class="signature-canvas"></canvas>
    </div>
    <!-- Button to clear the signature -->
    <button @click="clearSignature" class="clear-signature-btn">Clear</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignaturePad',
  props: {
    user: Object // User object passed as a prop
  },
  data() {
    return {
      isDrawing: false, // Flag to track if drawing is in progress
      context: null // Canvas 2D context
    }
  },
  methods: {
    // Resize the canvas to fit its container
    resizeCanvas() {
      const canvas = this.$refs.signaturePad
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    },
    // Start drawing on the canvas
    startDrawing(event) {
      this.isDrawing = true
      this.context.beginPath()
      this.context.moveTo(event.offsetX, event.offsetY)
    },
    // Draw on the canvas
    draw(event) {
      if (!this.isDrawing) return
      this.context.lineTo(event.offsetX, event.offsetY)
      this.context.stroke()
    },
    // Stop drawing on the canvas
    stopDrawing() {
      this.isDrawing = false
    },
    // Save the signature as an image and upload it
    async saveSignature() {
      const canvas = this.$refs.signaturePad
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          const formData = new FormData()
          formData.append('signature', blob, 'signature.png')
          axios
            .post('https://imei-lookup-backend.onrender.com/api/upload-signature', formData)
            .then((response) => {
              // Emit the signature URL to the parent component
              this.$emit('update-signature', response.data.signatureUrl)
              resolve(response.data.signatureUrl)
            })
            .catch((error) => {
              console.error('Error uploading signature:', error)
              reject(error)
            })
        }, 'image/png')
      })
    },
    // Clear the signature from the canvas
    clearSignature() {
      const canvas = this.$refs.signaturePad
      this.context.clearRect(0, 0, canvas.width, canvas.height)
      // Emit null to indicate the signature has been cleared
      this.$emit('update-signature', null)
    }
  },
  mounted() {
    const canvas = this.$refs.signaturePad
    if (canvas) {
      this.context = canvas.getContext('2d')
      this.resizeCanvas()
      // Add event listeners for drawing on the canvas
      window.addEventListener('resize', this.resizeCanvas)
      canvas.addEventListener('mousedown', this.startDrawing)
      canvas.addEventListener('mousemove', this.draw)
      canvas.addEventListener('mouseup', this.stopDrawing)
      canvas.addEventListener('mouseleave', this.stopDrawing)
    }
  },
  beforeUnmount() {
    const canvas = this.$refs.signaturePad
    if (canvas) {
      // Remove event listeners when the component is destroyed
      window.removeEventListener('resize', this.resizeCanvas)
      canvas.removeEventListener('mousedown', this.startDrawing)
      canvas.removeEventListener('mousemove', this.draw)
      canvas.removeEventListener('mouseup', this.stopDrawing)
      canvas.removeEventListener('mouseleave', this.stopDrawing)
    }
  }
}
</script>

<style scoped>
@media print {
  .clear-signature-btn {
    display: none;
  }
}

.signature {
  width: 100%;
}

.signature label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: black;
  margin-bottom: 6px;
  font-weight: 600;
}

.signature-box {
  width: 100%;
  height: 110px;
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  margin: 0 auto;
}

.signature-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.signature-canvas {
  width: 100%;
  height: 100%;
}

.clear-signature-btn,
.save-signature-btn {
  margin-top: 10px;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.save-signature-btn {
  margin-left: 10px;
}
</style>
