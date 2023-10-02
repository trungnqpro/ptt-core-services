# BTL86

Provides services about online learning management.

## Installation

### install packages

```
npm install

// Install libreoffice to convert pptx to pdf
sudo yum install libreoffice
```

## Configuration

For each environment, make a copy file default.env and change the name to:

-   development.env for develop on local
-   staging.env for testing environment
-   production.env for production environment

Update configurations on the new environment file.

## Running

```
npm run generate-docs
// yarn generate-docs

// local
npm run dev
// yarn dev

// staging
npm run staging
// yarn staging

// production
npm start
// yarn start

```

## Database

### indexing

db.users.createIndex({username: 1}, {unique: true});
db.users.createIndex({email: 1}, {unique: true});
db.users.createIndex({code: -1}, { unique: true})
db.users.createIndex({templateId: 1});
db.users.createIndex({subject: 1});
db.users.createIndex({status: 1});
db.users.createIndex({createdAt: 1});