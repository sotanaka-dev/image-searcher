#!/bin/bash
set -e

rm -f /rails-api/tmp/pids/server.pid

exec "$@"
