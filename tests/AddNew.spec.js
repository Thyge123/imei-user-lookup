import { mount } from '@vue/test-utils'
import AddNew from '../src/views/AddNew.vue'
import { describe, beforeEach, it, expect, vi } from 'vitest'

vi.mock('axios')

describe('AddNew.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(AddNew, {
      data() {
        return {
          user: {
            id: null,
            imei: '',
            name: '',
            model: '',
            agreedPrice: 0,
            notes: '',
            birthday: '',
            phoneNumber: '',
            bankReg: '',
            bankAccount: '',
            date: '',
            picture: '',
            signature: ''
          },
          loading: false,
          error: false,
          copiedField: null,
          imeiError: '',
          success: false,
          errorMessage: ''
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('binds form inputs correctly', async () => {
    const modelInput = wrapper.find('#model')
    await modelInput.setValue('iPhone 12')
    expect(wrapper.vm.user.model).toBe('iPhone 12')

    const imeiInput = wrapper.find('#imei')
    await imeiInput.setValue('123456789012345')
    expect(wrapper.vm.user.imei).toBe('123456789012345')

    const agreedPriceInput = wrapper.find('#agreedPrice')
    await agreedPriceInput.setValue('5000')
    expect(wrapper.vm.user.agreedPrice).toBe('5000')

    const notesInput = wrapper.find('#notes')
    await notesInput.setValue('Some notes')
    expect(wrapper.vm.user.notes).toBe('Some notes')

    const birthdayInput = wrapper.find('#birthday')
    await birthdayInput.setValue('1990-01-01')
    expect(wrapper.vm.user.birthday).toBe('1990-01-01')

    const phoneNumberInput = wrapper.find('#phoneNumber')
    await phoneNumberInput.setValue('12345678')
    expect(wrapper.vm.user.phoneNumber).toBe('12345678')

    const bankRegInput = wrapper.find('input[placeholder="Reg. nr."]')
    await bankRegInput.setValue('1234')
    expect(wrapper.vm.user.bankReg).toBe('1234')

    const bankAccountInput = wrapper.find('input[placeholder="Konto.nr."]')
    await bankAccountInput.setValue('567890')
    expect(wrapper.vm.user.bankAccount).toBe('567890')

    const nameInput = wrapper.find('#name')
    await nameInput.setValue('John Doe')
    expect(wrapper.vm.user.name).toBe('John Doe')

    const dateInput = wrapper.find('#date')
    await dateInput.setValue('2023-12-01')
    expect(wrapper.vm.user.date).toBe('2023-12-01')
  })

  it('validates IMEI correctly', async () => {
    const imeiInput = wrapper.find('#imei')
    await imeiInput.setValue('123456789012345')
    wrapper.vm.validateIMEI()
    expect(wrapper.vm.imeiError).toBe('')

    await imeiInput.setValue('12345')
    wrapper.vm.validateIMEI()
    expect(wrapper.vm.errors.imei).toBe('IMEI must be a 15-digit number')
  })

  it('navigates back correctly', async () => {
    wrapper.vm.$router = { push: vi.fn() }
    await wrapper.vm.goBack()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'IMEILookup' })
  })

  it('handles loading state correctly', async () => {
    wrapper.setData({ loading: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('displays error toast correctly', async () => {
    wrapper.setData({ error: true, errorMessage: 'Test error' })
    wrapper.vm.$refs.toast.show() // Ensure the show method is called
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.toast').exists()).toBe(true)
    expect(wrapper.find('.toast').text()).toBe('Test error')
  })
})
