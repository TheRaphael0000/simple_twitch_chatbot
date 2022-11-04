a simple twitch chat bot that load textual commands from json

# install

```bash
python -m pip install -r requirements.txt
```

# configure

create the config.json from the example

you need to create an app in the twitch development console

fill all the fields

```
python request_access_token.py
```

allow your account to be used via oauth

copy the access_token from the redirected url

put it in the config.json

and voilà.

you can enter your commands in commands.json

# run

```
flask --app bot run
```