#!/bin/bash

source ~/.bashrc

outF="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/images/logo/events"
in="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/data/events"

for ff in "$in"/*.json; do
    # jq -r '.[].[0]' "$ff" | xargs -I {} curl -o "${outF}/logo_{}.png" "https://my.raceresult.com/{}/logo"
    jq -r '.[].[0]' "$ff" > temp # get all the ids
    # jq -r '.[].[0]' "events_2025.json" > temp # get all the ids
    ff2=$(basename $ff)
    year=$( echo $ff2 | sed -E 's/events_([0-9]{4})\.json/\1/')
    while IFS= read -r eventid; do
        # IFS= → preserves leading/trailing spaces
        # -r → prevents backslash escaping
        cecho -y "JSON: $ff2 ---- " -g " id=${eventid}"

        # out1="${outF}/logo_${eventid}.png"
        out2="${outF}/logo_${year}_${eventid}.png"

        # if [ -f "${out1}" ] || [ ! -f "$out2" ]; then
        #     mv "${out1}" "${out2}"
        # fi

        if [ ! -f "${out2}" ]; then # check if logo for this id exists
            cecho -y curl -o "${outF}/temp.png" "https://my.raceresult.com/${eventid}/logo"
            rm "${outF}/temp.png"
            curl -o "${outF}/temp.png" "https://my.raceresult.com/${eventid}/logo" # if  not download
            
            if grep -q "not found" "${outF}/temp.png"; then # no logo
                convert -size 100x100 xc:none "${out2}" # create empty png
                cecho -y "\tCreated empty png"
            elif grep -q "too many request" "${outF}/temp.png"; then
                sleep 400
            else
                convert "${outF}/temp.png" -resize x100 "${out2}"
                # echo convert "${outF}/temp.png" -resize x100 "${out1}"
                if [ -f "${out2}" ]; then
                    cecho -g "\tDownloaded"
                else 
                    cecho -r "\tNope"
                fi
            fi
            sleep 10
        else
            cecho -b "\tLogo file exists"
        fi
    done < temp
done
