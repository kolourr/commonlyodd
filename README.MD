## API Usage

`export APP_ENV=local
CompileDaemon -command="./main" -build="go build cmd/server/main.go"
`

`export APP_ENV=production
CompileDaemon -command="./main" -build="go build cmd/server/main.go"
`

`go get github.com/githubnemo/CompileDaemon
export PATH=$PATH:$(go env GOPATH)/bin
source ~/.zshrc # or ~/.bashrc
CompileDaemon -command="./main" -build="go build cmd/server/main.go"`

`go build -o ./main cmd/server/main.go`

## UI Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
