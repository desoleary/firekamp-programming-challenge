# Firekamp Programming Challenge

#### GitHub Omniauth Configuration

###### Create GitHub OAuth App

- Sign into GitHub via https://github.com/
- Navigate to Developer Settings https://github.com/settings/developers
- Click on "New OAuth App"
- Enter the following details:
  - Application Name e.g. firekamp
  - Homepage URL e.g. https://github.com/desoleary/firekamp-programming-challenge
  - Authorization callback URL e.g. http://127.0.0.1:3000/auth/github/callback

#### Installation

###### Configure environment variables

```bash
cp .env.example .env
```
- Fill in FIREKAMP_GITHUB_CLIENT_ID and FIREKAMP_GITHUB_CLIENT_SECRET with OAuth App values

###### Setup

```bash
$ git clone git@github.com:desoleary/firekamp-programming-challenge.git
$ cd firekamp-programming-challenge
$ bundle install
$ bin/rails db:create
$ bin/rails db:migrate
$ yarn
```

##### Running App
```bash
$ ./bin/shakapacker-dev-server # Adds support for HMR
$ bin/rails s -p 3001 # Ensure you have your .env values filled
```

#### React
- Makes use of `react-rails` gem
- Compilation and HMR is conducted with use of `shakapacker` gem

###### HMR support
`./bin/shakapacker-dev-server` # runs on port 3035

###### Component Generator
`bin/rails g react:component HelloWorld greeting:string`

#### Nice to haves
- Cypress Testing
- Better Controller Error Handling via `rescue_from Exception`
- Add ability to support multiple auth providers per user
- Integrate with nextjs
- Fix findDOMNode is deprecated issue
- Remove hardcoded text and use i18n instead
- Figure out why I wasn't able to simulate submitting the Rails "Sign in with GitHub" form via the AntD form / fetch post
- Configure TSLint and make use of prettier plugins
- pre-commit tasks including linting etc.
- Auto validate GitHub queries / mutations against latest GraphQL schemas via CLI
- Use theme for styles
- Fix the styling on the User Details layout
