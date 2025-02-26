## About the aplication.

Repository to deal with the onboarding new memebers into the application. Make sure you have node , uv (package manager for python) installed in your system.

## Backend

```bash
git clone https://github.com/asifrahaman13/probable-enigma.git
```

Next go to the root directory.

```bash
ce probable-enigma/
```

Now set up virtual environment

```bash
uv venv
source .venv/bin/activate
```

Next install the dependencies.

```bash
uv sync
```

Create a .env file from the .env.example file, and ensure you enter correct credentials.

```bash
mv .env.example .env
```

Next enter your mongodob other credentials in .env file. Ensure you enter correct access keys as well as the regions. You can simply export AWS credentails in terminal

```bash
export AWS_ACCESS_KEY_ID=<your aws access key>
export AWS_SECRET_ACCESS_KEY=<your aws secret key>
export AWS_SESSION_TOKEN=<your aws session token>
```

Now you should be able to run the application.

```bash
uv run uvicorn src.main:app --reload
```

## Front end

Go to the front end directory

```bash
cd ui/
```

Create a .env file from the .env.example file and ensure you enter correct credentials.

```bash
mv .env.example .env
```

Now install the dependencies.

```bash
bun install
```

Next run the server in local environment.

```bash
bun run dev
```

## Run as docker container

The appllication can also be run as a docker container serveice. Run the following command at the root folder. Make sure you enter the correcnt credentials in the .env file of both the frontend and backend.


```bash
docker compose up 
```

## Ports

The frontend of the application will run on port 3000. `http://127.0.0.1:3000`

The backend of the application will run on port 8000 `http://127.0.0.1:8000`

## Formatting

For backend:

For linting run the following:

```bash
ruff check --fix
```

For formatting run the following script:

```bash
ruff format
```

For linting run the following:

```bash
bun run lint
```

For the format run the following:

```bash
bun run format
```
