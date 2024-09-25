<template>
  <transition name="fade">
    <div v-if="visible" class="toast">
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
      setTimeout(() => {
        this.visible = false
      }, 2000)
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeIn 0.5s;
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 200px;
}

.toast span {
  flex-grow: 1;
  text-align: center;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
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
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
