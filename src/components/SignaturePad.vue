<template>
  <div class="signature">
    <label for="signaturePad">Underskrift</label>
    <div class="signature-box">
      <canvas ref="signaturePad" class="signature-canvas"></canvas>
    </div>
    <button @click="clearSignature" class="clear-signature-btn">Clear</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignaturePad',
  props: {
    user: Object
  },
  data() {
    return {
      isDrawing: false,
      context: null
    }
  },
  methods: {
    resizeCanvas() {
      const canvas = this.$refs.signaturePad
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    },
    startDrawing(event) {
      this.isDrawing = true
      this.context.beginPath()
      this.context.moveTo(event.offsetX, event.offsetY)
    },
    draw(event) {
      if (!this.isDrawing) return
      this.context.lineTo(event.offsetX, event.offsetY)
      this.context.stroke()
    },
    stopDrawing() {
      this.isDrawing = false
    },
    async saveSignature() {
      const canvas = this.$refs.signaturePad
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          const formData = new FormData()
          formData.append('signature', blob, 'signature.png')
          axios
            .post('https://imei-lookup-backend.onrender.com/api/upload-signature', formData)
            .then((response) => {
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
    clearSignature() {
      const canvas = this.$refs.signaturePad
      this.context.clearRect(0, 0, canvas.width, canvas.height)
      this.$emit('update-signature', null)
    }
  },
  mounted() {
    const canvas = this.$refs.signaturePad
    if (canvas) {
      this.context = canvas.getContext('2d')
      this.resizeCanvas()
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
  height: 95px;
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
  margin-top: 24px;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-signature-btn {
  margin-left: 10px;
}
</style>
