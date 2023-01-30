# TechieHR

## Deployment

### 1. Check the environments. Make sure git, docker and docker compose plugin are installed.

```shell
$ git -v
```

```shell
$ docker -v
```

```shell
$ docker compose version
```

### 2. Clone the git repository of TechieHR.

```shell
$ git clone https://github.com/Weitian-Wang/TechieHR.git
```

### 3. Enter the root directory of TechieHR.

```shell
$ cd TechieHR
```

### 4. Build the docker containers using docker-compose.

```shell
$ docker compose up
```

### 5. TechieHR is now accessible on http://localhost:3000.
