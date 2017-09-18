#!/bin/bash

##----INTRO
echo
echo "Hi, let's scrape paginebianche.it :)" # of couse this script has been make 'ad hoc'
echo
echo "|---------------------------------------------------------------------------------------|"
echo "| At the time of writing, letters J, X and Y will fail! Needs to be done by hand.       |"
echo "| The elements are empty and have class 'text_cognome' instead of 'text_cognome_small'  |"
echo "| Fortunately, there is only a handful of names in those sections.                      |"
echo "|---------------------------------------------------------------------------------------|"
echo
##----END

##----VARIABLES
# avoid banning
SLEEP_INTERVAL=5 # [2, 5, 10, 15] # the whole process took approximately 5 hours on a 30 Mbps network
# curl almost like a browser
CURL_UA="User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
CURL_CONTENT_TYPE="Content-Type: text/html"
CURL_CACHE_A="Cache-Control: no-chache"
CURL_CACHE_B="Pragma: no-cache"
##----END

##----LOGIC
# loop alphabet
for LETTER in {A..Z}
do  
    # set file path
    FILE="./name_surname_lists/${LETTER}_.txt" # when the script is done, double-check by hand with website and append OK or FAIL
    # set url to scrape
    URL="http://www.paginebianche.it/${LETTER}.htm"
    echo
    echo $URL
    echo
    # curl and save list of subpages
    SECTION=$(curl -H "${CURL_UA}" -H "${CURL_CONTENT_TYPE}" -H "${CURL_CACHE_A}" -H "${CURL_CACHE_B}" $URL | grep href=\"${LETTER}- | awk '{split($0, a, "href=\""); print a[2]}' | awk '{split($0, a, "\">"); print a[1]}')
    sleep $SLEEP_INTERVAL
    # check wether subpages actually exists
    if [[ -z $SECTION ]]
    then
        # set main page as subpage
        SECTION="${LETTER}.htm"
    fi
    # loop subpages
    for PAGE in $SECTION
    do
        # set url to scrape
        PAGE_URL="http://www.paginebianche.it/${PAGE}"
        echo
        echo $PAGE_URL
        echo
        # curl and save from the line with token 'text_cognome_small' to 3 lines after
        curl -H "${CURL_UA}" -H "${CURL_CONTENT_TYPE}" -H "${CURL_CACHE_A}" -H "${CURL_CACHE_B}" $PAGE_URL | grep -A3 'text_cognome_small' >> $FILE
        sleep $SLEEP_INTERVAL
    done
    # some spacing never hurts :)
    echo
done
# we're done!
echo
echo Farewell
echo
##----END