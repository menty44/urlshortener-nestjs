## Installation (make sure you have node version 18+)

```bash
# install nestjs cli
$ npm install -g @nestjs/cli
```

```bash
# install all depeendencies
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


```aiignore
Endpoints satisfies the below requirements:

● /api/encode - Encodes a URL to a shortened URL
● /api/decode - Decodes a shortened URL to its original URL
● /api/statistic/{url_path} - Return basic stat of a short URL path. Using the above link url_path will be GeAi9K. (Be creative with what details you provide here.)
● /api/list - List all available url
● /{url_path} - This should redirect the user to the long url.
```

