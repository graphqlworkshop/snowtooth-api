# Snowtooth API - Lab

In this activity, you'll create an API for Snowtooth Mountain, a fake ski resort.

## Step 0: Setup

1. In your Terminal or Command Prompt, Download or Clone this Repository: `git clone https://github.com/graphqlworkshop/snowtooth-api`
2. Change directory: `cd snowtooth-api`
3. Install dependencies: `npm install`
4. Start the Server: `npm start`
5. Open the browser to: `http://localhost:4000`
6. Send a test query:

```graphql
query {
  liftCount
}
```

## Step 1: Create Lift Type

Take a look at the data folder.

- Lifts Data: `data/lifts.json`

## Step 2: Lift Queries

Create queries and descriptions for lift queries

| Query          | Description                      |
| -------------- | -------------------------------- |
| `liftCount`    | Add a filter by status, required |
| `allLifts`     | Add a filter by status, optional |
| `findLiftById` | Add a filter by status, required |

## Step 3: Create Trail Type

Take a look at the data folder.

- Trails Data: `data/trails.json`

## Step 4: Trail Queries

Add queries for types

| Query             | Description                      |
| ----------------- | -------------------------------- |
| `trailCount`      | Add a filter by status, required |
| `allTrails`       | Add a filter by status, optional |
| `findTrailByName` | Add a filter by name, required   |

## Step 5: Mutations

Add mutations for setting lift status and setting trail status.

| Query           | Description               |
| --------------- | ------------------------- |
| `setLiftStatus` | Arguments: `id`, `status` |
| `allTrails`     | Arguments: `id`, `status` |

## Connections

Add trivial resolvers to connect trails and lifts

| Query                   | Description                                |
| ----------------------- | ------------------------------------------ |
| `Lift.trailAccess`      | Add a field to return trails for each lift |
| `Trail.accessedByLifts` | Add a field to return lifts for each trail |
