#!/bin/bash
for i in {000..024}; do
	i2="${i:1:2}"
	convert -verbose -size 160x90 "xc:gray($i2%)" -gravity center -pointsize 30 \
		-fill red    -annotate -40-$i2 100 \
		-fill green  -annotate +40-$i2 200 \
		-fill blue   -annotate -40+$i2 300 \
		-fill yellow -annotate +40+$i2 400 \
		./example_$i.png
done
for i in {025..499}; do
	convert -verbose -size 160x90 xc:white -gravity center -fill black -pointsize 40  -annotate +0+0 $i ./example_$i.png
done
ffmpeg -f image2 -i ./example_%03d.png -vf scale=1920:1080,eq=2.0 -g 5 -crf 18 -tune fastdecode -preset ultrafast example.mp4
rm -v ./example_???.png
