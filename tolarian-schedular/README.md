# Serverless schedular

This is a schedular process to make a POST request call a restful API every 10 minutes.  
  
### Create project

```
serverless create --template aws-nodejs --path {project_name}
```

### Deploy project

```
serverless deploy -v
```

### Usage

```
serverless logs --function cron --tail
```
