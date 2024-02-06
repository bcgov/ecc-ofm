import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { getApplicationResponse, getApplicationsResponse } from './mockResponses/applications'
import { getDocumentsResponse } from './mockResponses/documents'
import { getContactsResponse, getFacilityResponse } from './mockResponses/facilities'
import { getOrganizationResponse } from './mockResponses/organizations'

export const restHandlers = [
  http.get('/api/organizations/b26aeb95-427d-ee11-8179-000d3a09d132', () => {
    return HttpResponse.json(getOrganizationResponse)
  }),
  http.get('/api/applications', () => {
    return HttpResponse.json(getApplicationsResponse)
  }),
  http.get('/api/applications/*', () => {
    return HttpResponse.json(getApplicationResponse)
  }),
  http.get('/api/facilities/c9ecef6c-437d-ee11-8179-000d3a09d132', () => {
    return HttpResponse.json(getFacilityResponse)
  }),
  http.get('/api/facilities/c9ecef6c-437d-ee11-8179-000d3a09d132/contacts', () => {
    return HttpResponse.json(getContactsResponse)
  }),
  http.get('/api/documents', () => {
    return HttpResponse.json(getDocumentsResponse)
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
