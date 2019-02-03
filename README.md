# Sync Discogs user catalog in elastic Search

### Run elastic and kibana

`docker-compose up --force-recreate`

# App

### Config

```
{
  "user": {
    "name": "<NAME>",
    "token": "<TOKEN>"
  },
  "elasticsearch": {
    "httpAuth": "",
    "host": "http://localhost:9200/",
    "index": "discogs_catalog"
  }
}
```

### Commands

##### Sync 

`npm run sync`

##### Clean 

Clean index defined in config:

`npm run clean`

Clean custom index:

`npm run clean --index=<INDEX_NAME>`

##### Info 

`npm run info`

### TODO

- Autentication
