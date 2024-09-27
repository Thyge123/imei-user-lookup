import { mount } from '@vue/test-utils'
import axios from 'axios'
import IMEILookup from '../src/views/IMEILookup.vue'
import { describe, beforeEach, it, expect, vi } from 'vitest'

vi.mock('axios')

describe('IMEILookup.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(IMEILookup)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('has a submit button', () => {
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
  })

  it('calls axios.get when form is submitted', async () => {
    const mockGet = vi.fn().mockResolvedValue({ data: { success: true } })
    axios.get.mockImplementationOnce(mockGet)

    const input = wrapper.find('input#imei')
    await input.setValue('123456789012345')

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockGet).toHaveBeenCalled()
  })

  it('displays an error message when axios.get fails', async () => {
    const mockGet = vi.fn().mockRejectedValue({ response: { status: 500 } })
    axios.get.mockImplementationOnce(mockGet)

    const input = wrapper.find('input#imei')
    await input.setValue('123456789012345')

    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick() // Wait for DOM updates
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for transition to complete

    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain(
      'An error occurred while looking up the user. Please try again.'
    )
  })
})
