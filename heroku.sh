#!/bin/bash
git add . && \
git add -u && \
git status && \
git commit -m "heroku rebuild" && \
git push heroku master && \
heroku ps:scale web=1 && heroku logs --tail