#!/bin/bash

source ~/.bashrc

outF="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/images/logo/events"

for ff in $(ls -1r *.json); do
    # jq -r '.[].[0]' "$ff" | xargs -I {} curl -o "${outF}/logo_{}.png" "https://my.raceresult.com/{}/logo"
    jq -r '.[].[0]' "$ff" > temp # get all the ids
    # jq -r '.[].[0]' "events_2025.json" > temp # get all the ids
    while IFS= read -r line; do
        # IFS= → preserves leading/trailing spaces
        # -r → prevents backslash escaping
        cecho -y "JSON: $ff ---- " -g " id=${line}"
        if [ ! -f "${outF}/logo_${line}.png" ]; then # check if logo for this id exists
            echo curl -o "${outF}/temp.png" "https://my.raceresult.com/${line}/logo"
            rm "${outF}/temp.png"
            curl -o "${outF}/temp.png" "https://my.raceresult.com/${line}/logo" # if  not download
            
            if grep -q "not found" "${outF}/temp.png"; then # no logo
                convert -size 100x100 xc:none "${outF}/logo_${line}.png" # create empty png
                cecho -y "\tCreated empty png"
            elif grep -q "too many request" "${outF}/temp.png"; then
                sleep 400
            else
                convert "${outF}/temp.png" -resize x100 "${outF}/logo_${line}.png"
                # echo convert "${outF}/temp.png" -resize x100 "${outF}/logo_${line}.png"
                if [ -f "${outF}/logo_${line}.png" ]; then
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
