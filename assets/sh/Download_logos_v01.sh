#!/bin/bash

source ~/.bashrc
source /mnt/c/Users/doria/Downloads/GitHub/dorian.gravier.github.io/files/bash/source/cecho.sh

outF="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/images/logo/events"
in="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/data/events"

# Scratch files go to a real temp dir, not $PWD - otherwise running this from
# the repo leaves a stray `temp` / `temp.png` in the working tree.
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

THIS_YEAR=$(date +%Y)

# Events with no logo get a transparent 100x100 placeholder so they are not
# re-requested forever. But organisers often add a logo closer to race day, so
# for years that are still live the placeholder is re-checked once per run.
is_placeholder() { # $1 = png path -> 0 if fully transparent
    [ "$(convert "$1" -alpha extract -format "%[fx:mean]" info: 2>/dev/null)" = "0" ]
}

for ff in "$in"/*.json; do
    ff2=$(basename "$ff")
    year=$(echo "$ff2" | sed -E 's/events_([0-9]{4})\.json/\1/')

    # Two archive shapes exist:
    #   new  -> [{"Mode":..,"HasMore":..,"Events":[{"id":123,..},..]}]
    #   old  -> [[123,0,"name","2025-01-26",..],..]
    # so branch on the element type instead of assuming positional arrays.
    # tr -d '\r' because jq built for Windows emits CRLF; a trailing \r would
    # end up inside the filename, making every logo look missing.
    jq -r '[.[] | if type == "array" then .[0] else .Events[].id end] | .[]' "$ff" | tr -d '\r' > "${tmp}/ids"

    while IFS= read -r eventid; do
        # IFS= → preserves leading/trailing spaces
        # -r → prevents backslash escaping
        [ -z "$eventid" ] && continue
        cecho -y "JSON: $ff2 ---- " -g " id=${eventid}"

        out2="${outF}/logo_${year}_${eventid}.png"

        if [ -f "${out2}" ]; then
            if [ "$year" -ge "$THIS_YEAR" ] && is_placeholder "${out2}"; then
                cecho -y "\tPlaceholder for a live year - re-checking"
            else
                cecho -b "\tLogo file exists"
                continue
            fi
        fi

        # -L is required: /<id>/logo now answers 301 -> /<id>/api/logo.
        # Without it curl saves a 0-byte file and every convert fails.
        # Branch on the HTTP status rather than grepping the body: a missing
        # logo is a clean 404 with {"error":"not found"}.
        dl="${tmp}/temp.png"
        rm -f "$dl"
        http=$(curl -sL -o "$dl" -w "%{http_code}" "https://my.raceresult.com/${eventid}/logo")

        if [ "$http" = "404" ]; then # no logo for this event
            if [ -f "${out2}" ]; then
                cecho -b "\tStill no logo - keeping placeholder"
            else
                convert -size 100x100 xc:none "${out2}" # create empty png
                cecho -y "\tCreated empty png"
            fi
        elif [ "$http" = "429" ] || grep -qi "too many request" "$dl"; then
            cecho -r "\tRate limited (HTTP $http) - waiting"
            sleep 400
            continue # picked up again on the next run
        elif [ "$http" = "200" ]; then
            convert "$dl" -resize x100 "${out2}"
            if [ -f "${out2}" ] && ! is_placeholder "${out2}"; then
                cecho -g "\tDownloaded"
            else
                cecho -r "\tNope - convert failed"
            fi
        else
            cecho -r "\tUnexpected HTTP $http - skipped"
        fi
        sleep 10
    done < "${tmp}/ids"
done

cecho -g "Logos done!"
