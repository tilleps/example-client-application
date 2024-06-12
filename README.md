# Example Client Application


Download and Install
```sh
git clone https://github.com/tilleps/example-client-application.git
cd example-client-application
npm install
```

Copy the `.env.template` file and populate the `.env` values
```sh
cp .env.template .env
```

Run application
```
npm start
```


## Development

Run development
```
npm run dev
```

Build image
```sh
docker build -t auth-example:latest .
```

Run local container
```sh
docker run \
  --name auth-example \
  -dp 56000:56000 \
  --add-host=auth.localhost:host-gateway \
  --env-file <(cat .env | sed 's: *#[^"]*$::g' | grep -v '^#' | sed -e "s/=\"/=/g" -e "s/\"$//g") \
  auth-example:latest
```



