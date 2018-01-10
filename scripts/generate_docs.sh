#!/usr/bin/env bash
set -e

transcribe \
  --url 'https://github.com/stuf/obs.remote.kefir/blob/master/{filename}#L{line}' \
  --insert-into README.md \
  --heading-level 4 \
  ./lib/socket.js
