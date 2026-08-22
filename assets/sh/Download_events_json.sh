#!/bin/bash

source ~/.bashrc

BASE_URL="https://my.raceresult.com/RREvents/list"
USER=846

in="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/data/events"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

THIS_YEAR=$(date +%Y)
FIRST_YEAR=2005
LAST_YEAR=$((THIS_YEAR + 1)) # next year's events are already being registered

# Number of events per response. Without &limit the endpoint caps at 100 and
# sets "HasMore": true, silently truncating the busier years.
LIMIT=500

for YEAR in $(seq "$FIRST_YEAR" "$LAST_YEAR"); do
    OUTPUT_FILE="${in}/events_${YEAR}.json"
    URL="${BASE_URL}?user=${USER}&year=${YEAR}&limit=${LIMIT}"

    # Decide whether this year needs fetching.
    reason=""
    if [ ! -f "${OUTPUT_FILE}" ]; then
        reason="missing"
    elif [ "$YEAR" -ge "$THIS_YEAR" ]; then
        reason="still live"          # events keep being added to these years
    elif jq -e 'any(.[]; .HasMore)' "${OUTPUT_FILE}" >/dev/null 2>&1; then
        reason="truncated"          # saved before &limit was used - self-healing
    fi

    if [ -z "$reason" ]; then
        cecho -b "${YEAR}: up to date, skipping"
        continue
    fi

    cecho -y "${YEAR}: fetching (${reason}) ..."
    new="${tmp}/events_${YEAR}.json"
    if ! curl -sf "${URL}" -o "${new}"; then
        cecho -r "\t${YEAR}: request failed, keeping existing file"
        continue
    fi

    # Validate before overwriting: a truncated or error response must never
    # replace good data.
    if ! jq empty "${new}" 2>/dev/null; then
        cecho -r "\t${YEAR}: response is not valid JSON, keeping existing file"
        continue
    fi

    new_count=$(jq -r '[.[] | if type == "array" then . else .Events[] end] | length' "${new}" 2>/dev/null)
    if [ -z "$new_count" ] || [ "$new_count" -eq 0 ]; then
        cecho -r "\t${YEAR}: response has no events, keeping existing file"
        continue
    fi

    old_count=0
    if [ -f "${OUTPUT_FILE}" ]; then
        old_count=$(jq -r '[.[] | if type == "array" then . else .Events[] end] | length' "${OUTPUT_FILE}" 2>/dev/null || echo 0)
    fi

    if [ "$new_count" -lt "$old_count" ]; then
        cecho -r "\t${YEAR}: got ${new_count} events but have ${old_count} - refusing to shrink."
        cecho -r "\t  delete ${OUTPUT_FILE} by hand if this is really intended."
        continue
    fi

    mv "${new}" "${OUTPUT_FILE}"

    if jq -e 'any(.[]; .HasMore)' "${OUTPUT_FILE}" >/dev/null 2>&1; then
        cecho -r "\t${YEAR}: still HasMore at limit=${LIMIT} - raise LIMIT, events are being dropped"
    else
        cecho -g "\t${YEAR}: ${old_count} -> ${new_count} events"
    fi

    sleep 2 # be polite to the server
done

cecho -g "Done!"
