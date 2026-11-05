#!/bin/sh
# Makes smaller copies of every project image (…-800.jpg, …-1200.jpg) so phones and small screens
# load only what they need, and writes images/sizes.js with the widths that exist for each image.
# Run it from the website folder after adding or replacing images:  sh tools/make-image-sizes.sh
cd "$(dirname "$0")/.." || exit 1
out=images/sizes.js
echo "// Made by tools/make-image-sizes.sh: the widths each image exists in (smaller copies are named image-800.jpg …)" > $out
echo "window.IMAGE_WIDTHS = {" >> $out
for f in images/*/*.jpg; do
  case "$f" in *-800.jpg|*-1200.jpg) continue ;; esac
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  list=""
  for t in 800 1200; do
    # only when the copy is clearly smaller than the original
    if [ "$w" -gt $((t * 115 / 100)) ]; then
      small="${f%.jpg}-$t.jpg"
      [ "$small" -nt "$f" ] || sips --resampleWidth $t -s format jpeg -s formatOptions 78 "$f" --out "$small" >/dev/null
      list="$list$t, "
    fi
  done
  echo "  \"$f\": [$list$w]," >> $out
done
echo "};" >> $out
