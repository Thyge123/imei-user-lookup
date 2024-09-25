import { mount } from '@vue/test-utils'
import UserInfo from '../src/components/UserInfo.vue'
import axios from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock axios
vi.mock('axios')

// Mock ToastNotification component
vi.mock('../src/components/ToastNotification.vue', () => ({
  default: {
    name: 'ToastNotification',
    template: '<div></div>',
    methods: {
      show: vi.fn()
    }
  }
}))

// Mock navigator.clipboard.writeText
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue()
  }
})

describe('UserInfo.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(UserInfo, {
      global: {
        mocks: {
          $route: {
            params: { imei: '123456789' }
          },
          $router: {
            push: vi.fn()
          }
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays error state', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching user info'))
    await wrapper.vm.fetchUserInfo()
    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('fetches and displays user data', async () => {
    const userData = {
      picture: 'user-pic.jpg',
      model: 'iPhone',
      imei: '123456789',
      agreedPrice: '5000',
      notes: 'Some notes',
      birthday: '1990-01-01',
      phoneNumber: '12345678',
      bankReg: '1234',
      bankAccount: '567890',
      name: 'John Doe',
      date: '2023-01-01',
      signature: 'signature.jpg'
    }
    axios.get.mockResolvedValueOnce({ data: userData })
    await wrapper.vm.fetchUserInfo()
    expect(wrapper.vm.user).toEqual(userData)
    expect(wrapper.find('.profile-pic').attributes('src')).toBe(userData.picture)
  })

  it('copies text to clipboard', async () => {
    vi.useFakeTimers()
    const userData = {
      model: 'iPhone'
    }
    axios.get.mockResolvedValueOnce({ data: userData })
    await wrapper.vm.fetchUserInfo()
    await wrapper.vm.copyToClipboard(userData.model, 'model')
    //expect(wrapper.vm.copiedField).toBe('model')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(userData.model)
    vi.runAllTimers() // Ensure setTimeout callback is executed
    expect(wrapper.vm.copiedField).toBe(null) // Check if copiedField is reset after timeout
  })

  it('navigates back on goBack', async () => {
    await wrapper.vm.goBack()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'IMEILookup' })
  })
})
