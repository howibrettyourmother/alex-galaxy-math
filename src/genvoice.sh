# Piper (ryan) clips for spoken questions -> voice/*.mp3 (same filter chain as the hubs)
set -e; D=$(cd $(dirname $0)/..;pwd); mkdir -p $D/voice /tmp/gmv; node $D/src/genvoice.js > /tmp/gmv/lines.txt
while IFS='|' read -r k t; do [ -f $D/voice/$k.mp3 ] && [ "$FORCE" != 1 ] && continue
  echo "$t" | /workspace/.tts/venv/bin/piper -m /workspace/.tts/en_US-ryan-medium.onnx -f /tmp/gmv/raw.wav --length-scale 0.95 >/dev/null 2>&1
  ffmpeg -y -loglevel error -i /tmp/gmv/raw.wav -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,aresample=24000,highpass=f=120,acompressor=threshold=-18dB:ratio=3,volume=1.7,alimiter=limit=0.95" -ac 1 -ar 24000 -b:a 32k $D/voice/$k.mp3
done < /tmp/gmv/lines.txt
