import { HttpResponse, graphql, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { getApplicationsResponse } from './test/utils/mockResponses'

export const restHandlers = [
  http.get('https://rest-endpoint.example/path/to/posts', () => {
    return HttpResponse.json(getApplicationsResponse)
  }),
]

const graphqlHandlers = [
  graphql.query('ListPosts', () => {
    return HttpResponse.json({
      data: { getApplicationsResponse },
    })
  }),
]

const server = setupServer(...restHandlers, ...graphqlHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
