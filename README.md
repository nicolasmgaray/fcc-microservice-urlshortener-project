# FCC: Microservice URL Shortener Project

Part of the FCC Infosec Certification challenges

Hosted on Glitch: [https://fcc-microservice-urlshortener-project.glitch.me/](https://fcc-microservice-urlshortener-project.glitch.me/).

## NOTE !

This is a proof of concept. Because it is hosted on a long domain, using this microservice is pointless. But it can be hosted in a short domain and modify the endpoints so that it has practical utility.

### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. *HINT*: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.


#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[this_project_url]/api/shorturl/3

#### Will redirect to:

https://www.freecodecamp.org/forum/
