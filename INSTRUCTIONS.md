## Installation (make sure you have node version 18+)

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:debug
```

```bash
# unit test
$ npm run test
```

Access the code on http://localhost:5000/

For 3rd party API access use the below payloads

### Encode (POST)
```
http://localhost:5000/api/encode

payload

{
    "originalUrl": "https://www.minipay.to/send-internationally"
}
```

### Decode (POST)
```
http://localhost:5000/api/decode

payload

{
    "shortUrl": "ada5521"
}
```

### Listing (GET)
```
http://localhost:5000/api/list
```

### Statistics (GET)
```
http://localhost:5000/api/statistic/7d6a45d
```

### Redirect (GET)
```
http://localhost:5000/api/7d6a45d
``` 
