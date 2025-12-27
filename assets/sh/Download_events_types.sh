#!/bin/bash

source ~/.bashrc


out="/mnt/c/Users/doria/Downloads/GitHub/rrst_website/assets/images/logo/eventtypes"

domo=0

for i in {0..37}; do 
    if [ ! -f "${out}/${i}.png" ] && [ ! $i -eq 32 ]; then
        curl -s "https://my.raceresult.com/RREvents/eventtypes/$i.png" -o temp.png
        convert temp.png -colorspace gray -contrast-stretch 0 +level-colors "#3b3b3b" "${out}/${i}.png"
        # convert temp.png -colorspace gray -contrast-stretch 0 +level-colors "none,#3b3b3b" "${out}/${i}.png"
        rm temp.png
        cecho -g "Event type icon $i downloaded."
        domo=1
    else 
        cecho -y "Event type icon $i exists."
    fi
done

if [ $domo -eq 1 ]; then 
    mogrify -resize x89 "${out}/*.png"
fi