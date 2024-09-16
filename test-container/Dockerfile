# Create a Dockerfile that:
#     - makes a workdir in `/app`
#     - copies `src/`, `package-lock.json`, `package.json`, `playwright.config.ts`, `tsconfig.json` to the workdir
#     - installs node & typescript
#     - `npm install` dependencies (`npm ci`)
#     - run `npm build`
#     - run `npm test`

FROM node:22-alpine

WORKDIR /app

COPY package-lock.json ./
COPY package.json ./
COPY playwright.config.ts ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/check_env.sh ./scripts/check_env.sh
COPY scripts/entrypoint.sh ./scripts/entrypoint.sh

RUN apk add --no-cache bash
RUN npm ci
RUN npm run build

RUN chmod +x ./scripts/entrypoint.sh

CMD ["./scripts/entrypoint.sh"]

# `npm install --save-dev @playwright/test` - installs Playwright Test
# `npm install --save-dev @types/node` - installs types
# `npx playwright install` - installs playwright browsers

# ```
# ✔ Success! Created a Playwright Test project at /Users/kdunc/Desktop/workspace/tech-proj/qa-pup/test-container2

# Inside that directory, you can run several commands:

#   npx playwright test
#     Runs the end-to-end tests.

#   npx playwright test --ui
#     Starts the interactive UI mode.

#   npx playwright test --project=chromium
#     Runs the tests only on Desktop Chrome.

#   npx playwright test example
#     Runs the tests in a specific file.

#   npx playwright test --debug
#     Runs the tests in debug mode.

#   npx playwright codegen
#     Auto generate tests with Codegen.

# We suggest that you begin by typing:

#     cd test-container2
#   npx playwright test

# And check out the following files:
#   - ./test-container2/tests/example.spec.ts - Example end-to-end test
#   - ./test-container2/tests-examples/demo-todo-app.spec.ts - Demo Todo App end-to-end tests
#   - ./test-container2/playwright.config.ts - Playwright Test configuration

# Visit https://playwright.dev/docs/intro for more information. ✨

# Happy hacking! 🎭
# ```