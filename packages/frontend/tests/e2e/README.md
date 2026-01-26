# E2E Tests for BACKit-onStellar

This directory contains end-to-end tests for the BACKit prediction market platform using Playwright.

## Test Coverage

### Critical User Flows Tested

1. **Wallet Connection Flow**
   - Connect wallet successfully
   - Show wallet address after connection
   - Persist wallet connection across navigation
   - Handle wallet disconnection

2. **Call Creation Flow**
   - Create new prediction calls
   - Form validation
   - Token search functionality
   - Form data persistence

3. **Staking Flow**
   - Stake YES/NO on calls
   - Validation for stake amounts
   - Stake visualization updates
   - User stake history

4. **Profile Viewing Flow**
   - View user profiles
   - Display profile statistics
   - Tab navigation (Created/Participated/Resolved)
   - Follow/unfollow functionality
   - Handle profile not found

5. **Integration Flows**
   - Complete user journeys combining multiple features
   - Cross-page navigation and state persistence
   - End-to-end workflows

## Setup Instructions

### Prerequisites

- Node.js >= 18.0.0
- npm or pnpm

### Installation

1. Install Playwright test dependencies:
```bash
cd packages/frontend
npm install --save-dev @playwright/test
```

2. Install browser dependencies:
```bash
npx playwright install
```

### Running Tests

#### Run all E2E tests:
```bash
npm run test:e2e
```

#### Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

#### Run specific test file:
```bash
npx playwright test wallet-connection.spec.ts
```

#### Run tests with UI mode:
```bash
npm run test:e2e:ui
```

#### View test report:
```bash
npm run test:e2e:report
```

## Test Configuration

The tests are configured in `playwright.config.ts` with the following settings:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 times on CI, 0 locally
- **Reporters**: HTML, JSON, and list reporters
- **Tracing**: Enabled on first retry
- **Screenshots**: Taken on failure
- **Video**: Recorded on failure

## Mock Data and Utilities

### Test Utilities (`utils.ts`)

Contains helper functions and mock data:

- `TestHelpers`: Common test actions (connect wallet, create call, etc.)
- `ApiMocks`: Mock API responses for consistent testing
- `TEST_WALLET_ADDRESS`: Mock Stellar wallet address
- `TEST_CALL_DATA`: Sample call creation data

### Mock Wallet Implementation

Tests use localStorage mocking to simulate wallet connections since actual wallet interactions require user approval. In production, you would integrate with Freighter wallet APIs.

## CI Integration

To integrate with your CI pipeline, add this to your workflow:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd packages/frontend
          npm ci
          npx playwright install chromium
          
      - name: Build frontend
        run: |
          cd packages/frontend
          npm run build
          
      - name: Run E2E tests
        run: |
          cd packages/frontend
          npm run test:e2e
          
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: packages/frontend/test-results/
```

## Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure `@playwright/test` is installed in `packages/frontend`
2. **Browser not found**: Run `npx playwright install` to install browser dependencies
3. **Tests failing due to timing**: Adjust `waitForTimeout` values or use more specific wait conditions
4. **API mocking issues**: Verify routes are correctly mocked in `utils.ts`

### Debugging Tips

- Use `--headed` flag to see tests running in browser
- Use `page.pause()` to pause test execution for manual inspection
- Check `test-results/` directory for screenshots and traces
- Use Playwright Inspector: `npx playwright test --debug`

## Adding New Tests

1. Create new test files with `.spec.ts` extension
2. Import necessary utilities from `./utils`
3. Use `test.describe()` for test suites
4. Use `test.beforeEach()` for setup
5. Follow existing patterns for consistency

## Test Data Management

Test data is managed through:
- Mock API responses in `ApiMocks` class
- Static test data constants
- Dynamic data generation where needed

Modify `utils.ts` to update mock responses or add new test scenarios.

## Screenshot and Video Recording

Tests automatically capture:
- Screenshots on failure
- Videos on failure
- Trace files for debugging

These are stored in the `test-results/` directory and can be viewed in the HTML report.