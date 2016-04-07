# gif_responder
Respond to `Github` `PR`s with a gif based on number of additions vs deletions.
A webtask that can be used as a `Github` webhook to reply to `PR`s with an animated gif just to add some fun to them.

Check the [closed `PR`s](https://github.com/esttorhe/gif_responder/pulls?q=is%3Apr+is%3Aclosed) for an example of this `webhook`'s responses.

## Installation instructions:

1. Install the webtask cli: `npm install -g wt-cli`
1. Create a webtask profile: `wt init`
1. Create a Github API token with `repo` access from: https://github.com/settings/tokens/new
1. Generate the webhook url, substituting <YOUR_TOKEN> with the one from step #3: `wt create --name gif_responder --secret GITHUB_TOKEN=<YOUR_TOKEN> --prod https://github.com/esttorhe/gif_responder/blob/master/gif_responder.js`
1. Install the webhook with the default settings on your repo by subsituting <USERNAME> and <REPO>, at: `https://github.com/<USERNAME>/<REPO>/settings/hooks/new`
1. Optionally inspect any errors using the cli: `wt logs`
 
_Notes:_

* `@webtask_option pb 1`: _This webtask requires that the body automatically be parsed_
* `@webtask_secret`: _`GITHUB_TOKEN` - A Github access token_

## Inspiration:

This project is greatly inspired by the [`Github Tag Hook`](https://github.com/auth0/wt-cli/blob/master/sample-webtasks/github-tag-hook.js)

## Author:

__Esteban Torres__ 

- [![](https://img.shields.io/badge/twitter-esttorhe-brightgreen.svg)](https://twitter.com/esttorhe) 
- :email: me@estebantorr.es
