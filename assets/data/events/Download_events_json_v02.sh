#!/bin/bash

BASE_URL="https://my.raceresult.com/RREvents/list"
USER=846

for YEAR in $(seq 1990 2025); do
    OUTPUT_FILE="events_${YEAR}.json"
    URL="${BASE_URL}?user=${USER}&year=${YEAR}"

	if [ ! -f "${OUTPUT_FILE}" ]; then
		echo "Fetching ${YEAR} → ${OUTPUT_FILE} ..."
		curl -s "${URL}" -o "${OUTPUT_FILE}"
    	sleep 2
	fi
    # Optional: small delay to avoid spamming server
done

echo "Done!"
