#!/bin/bash

source ~/.bashrc

BASE_URL="https://my.raceresult.com/RREvents/list"
USER=846

in="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/data/events"

for YEAR in $(seq 2005 2025); do
    OUTPUT_FILE="${in}/events_${YEAR}.json"
    URL="${BASE_URL}?user=${USER}&year=${YEAR}"

	if [ ! -f "${OUTPUT_FILE}" ]; then
		echo "Fetching ${YEAR} → ${OUTPUT_FILE} ..."
		curl -s "${URL}" -o "${OUTPUT_FILE}"
    	sleep 2
	fi
    # Optional: small delay to avoid spamming server
done

cecho -g "Done!"
