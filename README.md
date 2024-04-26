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
```

##### Running
```bash
$ bin/rails s -p 3001
```








This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
