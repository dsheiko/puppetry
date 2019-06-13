# Gmail Bridge

Script starts up a web-server connected to your gmail inbox via IMAP. As soon as you request `activation-link` resource e.g.
```
http://127.0.0.1:3500/api/v1/activation-link/joe@gmail.com?secret=secret
```
the server looks for unseen recent messages and performs `parseActivationLink` function on the body of each.
If the activation link successfully extracted the server returns it as `{ value: "link" }`

## Installation

- If you exported the project into this directory for the first time, please run `npm install` to install dependencies.
- Setup env variables:
```bash
EID_EMAIL=joe@gmail.com
EID_PASSWORD=gmail password
EID_SECRET=secret
EID_NODE_SERVER_PORT=3500
EID_NODE_SERVER_HOST=127.0.0.1

```
- start the server `npm start`

## NOTE
To make it really work with Gmail, please, [enable 2-step verification](https://www.google.com/landing/2step/) and
generate an [App password](https://security.google.com/settings/security/apppasswords). This password you shall use
for `EID_PASSWORD`

