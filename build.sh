# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "main" ]; then
  # Run the "production" script in `package.json` on the "production" branch
  # "production" should be replaced with the name of your Production branch

  ng build

elif [ "$CF_PAGES_BRANCH" == "dev" ]; then
  # Run the "staging" script in `package.json` on the "staging" branch
  # "staging" should be replaced with the name of your specific branch

  ng build --c development

else
  # Else run the dev script
  ng build --c development
fi