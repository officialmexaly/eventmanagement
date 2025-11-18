# Testing Documentation

This document describes the testing setup and how to run tests for the EventHub application.

## Testing Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/user-event**: Simulates user interactions
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Coverage

The test suite includes:

### Admin Page Tests (`app/admin/__tests__/page.test.tsx`)
- **Authentication & Access Control**: Verifies admin-only access
- **Sidebar Navigation**: Tests all navigation items and view switching
- **Dashboard View**: Tests analytics display and recent events
- **Events Management**: Tests event creation, editing, and deletion
- **Tickets View**: Tests ticket table display and empty states
- **Analytics View**: Tests event performance data
- **Users, Reviews, Settings Views**: Tests placeholder content

### AppContext Tests (`app/components/__tests__/AppContext.test.tsx`)
- **Initial State**: Tests default values and sample data loading
- **User Management**: Tests user and admin status management
- **Event Management**: Tests CRUD operations for events
- **Ticket Management**: Tests ticket creation
- **Review Management**: Tests review creation
- **Favorites Management**: Tests toggling favorites
- **Notification Management**: Tests notification creation and status updates
- **LocalStorage Persistence**: Tests data persistence
- **Error Handling**: Tests proper error messages

## Continuous Integration

Tests run automatically on:
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches

The CI workflow:
1. Runs tests on Node.js 18.x and 20.x
2. Runs linter
3. Generates code coverage report
4. Builds the application

See `.github/workflows/ci.yml` for the complete workflow configuration.

## Writing New Tests

When writing new tests:

1. Place tests in `__tests__` directories next to the components being tested
2. Use the `.test.tsx` or `.test.ts` extension
3. Mock external dependencies (Next.js router, context providers, etc.)
4. Use descriptive test names following the pattern: "should [expected behavior]"
5. Group related tests using `describe` blocks
6. Use `beforeEach` to reset mocks and state

### Example Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', () => {
    render(<MyComponent />)
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

## Troubleshooting

### Tests failing with "Cannot find module"
Run `npm install` to ensure all dependencies are installed.

### Tests timing out
Increase the timeout in `jest.config.js` or use the `timeout` option for specific tests.

### Mocks not working
Ensure mocks are defined in `jest.setup.js` or at the top of test files before imports.

## Code Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

View detailed coverage reports in the `coverage/` directory after running `npm run test:coverage`.
