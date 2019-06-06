# Email Interceptor Server

Server connect to your gmail inbox via IMAP and as soon as you request e.g.
```
http://127.0.0.1:3500/api/v1/activation-link/joe@gmail.com
```
the server looks for unseen recent messages and performs `parseActivationLink` function on the body of each.
If the activation link successfully extracted the server returns it as `{ value: "link" }`

## Installation

- If you exported the project into this directory for the first time, please run `npm install` to install dependencies.
- Setup env variables:
```bash
EID_EMAIL=joe@gmail.com
EID_PASSWORD=secret
EID_NODE_SERVER_PORT=3500
EID_NODE_SERVER_HOST=127.0.0.1
```
- start the server `npm start`

