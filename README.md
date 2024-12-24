#  Clone the repository
- git clone https://github.com/dong-0404/be_nodejs.git

## System Requirements
- **Node.js** >= 22.x
- **MySQL**
- **NPM** or **Yarn** (depending on your package manager)

### Run project
- run "npm install" to install the necessary dependencies from package.json or "yarn install"
- create file .env base on env_example
- execute command "npm run dev" or "npm run start" to run project


#### Commands
- Create file migration : "npx sequelize-cli migration:generate --name create-users"
- Migrate the Database (If Needed) : "npx sequelize-cli db:migrate"
- Undo the most recent migration : "npx sequelize-cli db:migrate:undo"
- Seed the Database (If Applicable) : "npx sequelize-cli db:seed:all"


