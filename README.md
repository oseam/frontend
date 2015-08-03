# Frontend
oseam Frontend.

Here you will find all the info on how to get the server up & running.

# Install
```sh
npm install --global gulp
npm install
```

# Build LESS Files
```sh
gulp
```

# Run
```
npm start
```

# User-Only Features
Encapsulate your code with this IF statement to only allow access to logged in users
```javascript
if(localStorage.token) {
  your code
}
```
