import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import MessagesTab from '@/components/messages/MessagesTab.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })
vi.mock('vue-router')

describe('MessagesTab', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()
  const appStore = useAppStore()
  const messagesStore = useMessagesStore()

  beforeEach(() => {
    // create teleport target
    const el = document.createElement(AppDialog)
    el.id = 'modal'
    document.body.appendChild(el)
  })

  afterEach(() => {
    // clean up
    document.body.outerHTML = ''
  })

  /*
  ===============================================
    Data Setup
  ===============================================
  */
  appStore.requestCategories = [
    {
      categoryName: 'Intake & Renewal',
      categoryId: '1e5bedc2-7377-ee11-8179-000d3a09d132',
    },
    {
      categoryName: 'Reporting',
      categoryId: '01839dc9-7377-ee11-8179-000d3a09d132',
    },
    {
      categoryName: 'Account Maintenance',
      categoryId: 'a640abcf-7377-ee11-8179-000d3a09d132',
    },
    {
      categoryName: 'Funding Agreement',
      categoryId: '1eb0aad5-7377-ee11-8179-000d3a09d132',
    },
    {
      categoryName: 'Payments and Funding',
      categoryId: 'aa2ba7e1-7377-ee11-8179-000d3a09d132',
    },
    {
      categoryName: 'Policy Question',
      categoryId: '3a2ca7e1-7377-ee11-8179-000d3a09d132',
    },
    {
      categoryName: 'Technical Support',
      categoryId: '4f749fe7-7377-ee11-8179-000d3a09d132',
    },
    {
      categoryName: 'Other',
      categoryId: '64ce97ed-7377-ee11-8179-000d3a09d132',
    },
  ]

  authStore.userInfo = {
    facilities: [
      {
        facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
        facilityAccountNumber: 'Test-Facility-1',
        facilityName: 'Test Facility #1',
        facilityType: 0,
        facilityStateCode: 0,
        facilityStatusCode: 1,
      },
      {
        facilityId: '6df8623a-447d-ee11-8179-000d3a09d499',
        facilityAccountNumber: 'Viet-Facility-2',
        facilityName: 'Test Facility #2',
        facilityType: 0,
        facilityStateCode: 0,
        facilityStatusCode: 1,
      },
      {
        facilityId: '064effc8-437d-ee11-8179-000d3a09d132',
        facilityAccountNumber: 'Viet-Facility-3',
        facilityName: 'Test Facility #3',
        facilityType: 0,
        facilityStateCode: 0,
        facilityStatusCode: 1,
      },
      {
        facilityId: '40390ee5-be7d-ee11-8179-000d3a09d499',
        facilityAccountNumber: 'Viet-Facility-4',
        facilityName: 'Test Facility #4',
        facilityType: 0,
        facilityStateCode: 1,
        facilityStatusCode: 2,
      },
    ],
  }

  authStore.currentFacility = authStore.userInfo.facilities[0]
  // messagesStore.assistanceRequests = [
  //   {
  //     assistanceRequestId: '2c1c29c7-c984-ee11-8179-000d3a09d4d4',
  //     subject: 'Test Message #1',
  //     referenceNumber: 'REQ-23000076',
  //     statusCode: 6,
  //     stateCode: 1,
  //     categoryName: 'Reporting',
  //     lastUpdatedTime: '2023-12-13T18:17:33Z',
  //     isRead: false,
  //     status: 'Open',
  //     priority: 1,
  //     requestFacilities: [
  //       {
  //         facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
  //         facilityName: 'Viet OFM Active Facility Number 1',
  //       },
  //     ],
  //     lastConversationTime: '2023-11-16T21:47:56Z',
  //   },
  //   {
  //     assistanceRequestId: 'c54ff934-9a93-ee11-be37-000d3a09d4d4',
  //     subject: 'Test Message #2',
  //     referenceNumber: 'REQ-23000272',
  //     statusCode: 2,
  //     stateCode: 0,
  //     categoryName: 'Account Maintenance',
  //     lastUpdatedTime: '2023-12-12T21:32:29Z',
  //     isRead: false,
  //     status: 'Open',
  //     priority: 2,
  //     requestFacilities: [
  //       {
  //         facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
  //         facilityName: 'Viet OFM Active Facility Number 1',
  //       },
  //     ],
  //     lastConversationTime: '2023-12-05T18:17:41Z',
  //   },
  //   {
  //     assistanceRequestId: 'af0c869f-5f95-ee11-be37-000d3a09d699',
  //     subject: 'Test Message #3',
  //     referenceNumber: 'REQ-23000277',
  //     statusCode: 3,
  //     stateCode: 0,
  //     categoryName: 'Reporting',
  //     lastUpdatedTime: '2023-12-13T18:15:53Z',
  //     isRead: true,
  //     status: 'Action required',
  //     priority: 3,
  //     requestFacilities: [
  //       {
  //         facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
  //         facilityName: 'Viet OFM Active Facility Number 1',
  //       },
  //     ],
  //     lastConversationTime: '2023-12-12T20:47:51Z',
  //   },
  //   {
  //     assistanceRequestId: '2d2ca51e-9a88-ee11-8179-000d3af4865d',
  //     subject: 'Test Message #4',
  //     referenceNumber: 'REQ-23000116',
  //     statusCode: 5,
  //     stateCode: 1,
  //     categoryName: 'Intake & Renewal',
  //     lastUpdatedTime: '2023-12-13T18:17:33Z',
  //     isRead: true,
  //     status: 'Closed',
  //     priority: 1,
  //     requestFacilities: [
  //       {
  //         facilityId: '064effc8-437d-ee11-8179-000d3a09d132',
  //         facilityName: 'Viet OFM This is Active Facility #2',
  //       },
  //     ],
  //     lastConversationTime: '2023-11-21T18:17:14Z',
  //   },
  // ]

  // messagesStore.assistanceRequestConversation = [
  //   {
  //     conversationId: '3cc21980-4784-ee11-8179-000d3af4865d',
  //     subject: 'MSG-23000051',
  //     from: 'd8ea4465-1777-ed11-81ac-000d3af4fa76',
  //     sentDate: '2023-11-16T06:15:13Z',
  //     message: 'Final 3rd message from CRM',
  //     ofmSourceSystem: false,
  //     requestValue: 'f9293b70-1584-ee11-8179-000d3a09d699',
  //     statusCode: 1,
  //   },
  //   {
  //     conversationId: '29626e3e-4784-ee11-8179-000d3af4865d',
  //     subject: 'MSG-23000050',
  //     from: 'd8ea4465-1777-ed11-81ac-000d3af4fa76',
  //     sentDate: '2023-11-16T06:13:27Z',
  //     message: 'This is 2nd message from CRM',
  //     ofmSourceSystem: false,
  //     requestValue: 'f9293b70-1584-ee11-8179-000d3a09d699',
  //     statusCode: 1,
  //   },
  //   {
  //     conversationId: 'f0e7fe8c-1b84-ee11-8179-000d3af4865d',
  //     subject: 'MSG-23000041',
  //     from: 'd8ea4465-1777-ed11-81ac-000d3af4fa76',
  //     sentDate: '2023-11-16T01:00:42Z',
  //     message: 'This is 1st message from Portal',
  //     ofmSourceSystem: false,
  //     requestValue: 'f9293b70-1584-ee11-8179-000d3a09d699',
  //     statusCode: 1,
  //   },
  // ]

  test('Create a new assistance request/message', async () => {
    const wrapper = mount(MessagesTab, global)
    // console.log(wrapper.html())

    await wrapper.get('#new-message-button').trigger('click')
    console.log('==================AFTER===================')
    console.log(wrapper.html())

    expect(document.querySelector('#new-request-dialog')).not.toBeNull()
    // const newRequestDialog = wrapper.getComponent(NewRequestDialog)
    // await newRequestDialog.get('input').setValue('valid_username')
    // console.log(newRequestDialog.html())
    // await newRequestDialog.get('input').setValue('valid_username')
    // console.log(newRequestDialog.text())
    // expect(newRequestDialog.emitted().newRequestDialog[0]).toEqual(['valid_username'])
    // expect(wrapper.text()).toContain('Supporting documents (optional)')
  })
})
