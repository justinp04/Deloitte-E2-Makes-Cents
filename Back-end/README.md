# Running locally
If you got error, cannot find module tiktoken, follow these steps:

python3 -m venv venv

source venv/bin/activate

and 

pip install -r requirements.txt
npm install cors
npm install mssql

-- To run --
npm run dev

## For Docker file
Command to build the docker image (specified within the dockerfile) \
```
docker build --platform=linux/amd64 -t makes-cents-back-end-image:latest .

```

The command to build and run a docker container using this image is: \
```
docker run -it --rm -v $(pwd):/app -p 8080:8080 makes-cents-back-end-image:latest
```