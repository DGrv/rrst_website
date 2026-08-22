#!/bin/bash

source ~/.bashrc

# Resolve this script's own directory so DOWNLOAD_ALL.sh can be run from
# anywhere - previously the sourced paths were relative and only worked when
# the current directory happened to be assets/sh.
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${here}/Download_events_types.sh"
source "${here}/Download_events_json.sh"
source "${here}/Download_logos.sh"
