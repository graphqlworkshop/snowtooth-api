# Snowtooth API

In this activity, you'll create an API for Snowtooth Mountain, a fake ski resort.

## Setup

1. In your Terminal or Command Prompt, Download or Clone this Repository: `git clone https://github.com/graphqlworkshop/snowtooth-api`
2. Change directory: `cd snowtooth-api`
3. Install dependencies: `npm install`
4. Start the Server: `npm start`
5. Open the browser to: `http://localhost:4000`

## Deploy to fly.io

1. Install `flyctl`: https://github.com/superfly/flyctl#installation
1. Sign up for Fly: https://fly.io/app/sign-up
1. Login from your CLI: `flyctl auth login`
1. Create fly app: `flyctl apps create --builder node`
1. Deploy: `flyctl deploy`
