#!/bin/bash

source ~/.bashrc
cdd "C:\Users\doria\Downloads\GitHub\rrst_website\assets\images\logo\eventtypes"

for i in {0..40}; do 
    curl -s "https://my.raceresult.com/RREvents/eventtypes/$i.png" -o temp.png
    convert temp.png -colorspace gray -contrast-stretch 0 +level-colors "none,#201823" $i.png
    rm temp.png
done

mogrify -resize x89 *.png