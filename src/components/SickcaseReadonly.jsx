import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import WaveformData from "waveform-data";

function copy(src) {
  var dst = new ArrayBuffer(src.byteLength);
  new Uint8Array(dst).set(new Uint8Array(src));
  return dst;
}

export const SickcaseReadonly = ({ sickcase }) => {
  const visualizer = useRef(null);
  let imageSrc = sickcase.image
    ? sickcase.image.url
    : "https://bulma.io/images/placeholders/1280x960.png";

  const isVideo = (image) => {
    if (image && image.url) {
      try {
        const splitArr = image.url.split(".");
        const type = splitArr[splitArr.length - 1];
        return ["mp4", "webm"].indexOf(type.toLowerCase()) >= 0;
      } catch (error) {
        return false;
      }
    }
    return false;
  };
  const isImage = (image) => {
    if (image && image.url) {
      try {
        const splitArr = image.url.split(".");
        const type = splitArr[splitArr.length - 1];
        return ["jpg", "jpeg", "png", "webp"].indexOf(type.toLowerCase()) >= 0;
      } catch (error) {
        return false;
      }
    }
    return false;
  };
  const isAudio = (image) => {
    if (image && image.url) {
      try {
        const splitArr = image.url.split(".");
        const type = splitArr[splitArr.length - 1];
        console.log(type.toLowerCase());
        return ["mp3", "ogg"].indexOf(type.toLowerCase()) >= 0;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const [analyzerOpened, setOpenAnalyzer] = useState(false);

  //const [audioBuffer, setAudioBuffer] = useState(null);

  let audioContext;

  const loadAudio = () => {
    return fetch(imageSrc)
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        //setAudioBuffer(arrayBuffer);
        return arrayBuffer;
      });
  };

  //useEffect(() => loadAudio(), []);

  const playAudio = async () => {
    if (analyzerOpened) {
      return;
    }

    const audioBuffer = await loadAudio();
    setOpenAnalyzer(true);
    audioContext = new AudioContext();

    audioContext
      .decodeAudioData(audioBuffer)
      .then((audio) => {
        const options = {
          audio_context: audioContext,
          audio_buffer: audio,
          scale: 128,
        };

        return new Promise((resolve, reject) => {
          WaveformData.createFromAudio(options, (err, waveform) => {
            if (err) {
              reject(err);
            } else {
              resolve(waveform);
            }
          });
        });
      })
      .then((waveform) => {
        console.log(`Waveform has ${waveform.channels} channels`);
        console.log(`Waveform has length ${waveform.length} points`);
        drawWaveform(waveform, "green");
      });
  };

  const drawWaveform = (waveform, color) => {
    const visualizerDom = visualizer.current;
    const channel = waveform.channel(0);
    const container = d3.select(visualizerDom);
    const x = d3.scaleLinear();
    const y = d3.scaleLinear();
    const offsetX = 100;

    const min = channel.min_array();
    const max = channel.max_array();

    x.domain([0, waveform.length]).rangeRound([0, 1000]);
    y.domain([d3.min(min), d3.max(max)]).rangeRound([offsetX, -offsetX]);

    const area = d3
      .area()
      .x((d, i) => x(i))
      .y0((d, i) => y(min[i]))
      .y1((d, i) => y(d));

    container.select("svg").remove();

    const graph = container
      .append("svg")
      .style("width", "100%")
      .style("height", "200px")
      .datum(max)
      .append("path")
      .attr("transform", () => `translate(0, ${offsetX})`)
      .attr("d", area)
      .attr("fill", color)
      .attr("stroke", color);
  };

  return (
    <div className="readonly-sickcase">
      <div
        className="card-image"
        style={{ position: "relative", padding: "5px" }}
      >
        <div
          ref={visualizer}
          style={{
            zIndex: 0,
            width: "100%",
          }}
        ></div>
        {isImage(sickcase.image) && <img src={imageSrc} alt="Sickness image" />}
        {isVideo(sickcase.image) && (
          <video
            src={imageSrc}
            controls={true}
            controlsList="nodownload"
          ></video>
        )}
        {isAudio(sickcase.image) && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <audio
              src={imageSrc}
              controls={true}
              controlsList="nodownload"
            ></audio>
            <button
              className="button is-secondary"
              style={{ margin: "5px", borderRadius: "10px" }}
              onClick={playAudio}
              disabled={analyzerOpened}
            >
              Analyze
            </button>
          </div>
        )}
      </div>
      <div className="card-content">
        <p className="title is-4">{sickcase.title}</p>
        <div className="content">
          <div className="field">
            <label className="label">Description:</label>
            <p>{sickcase.description}</p>
          </div>
          <div className="field">
            <label className="label">Instruction from doctor:</label>
            <p>{sickcase.instruction}</p>
          </div>
          <div className="field">
            <label className="label">Update at:</label>
            <time>{sickcase.updated_at.toLocaleString()}</time>
          </div>
        </div>
      </div>
    </div>
  );
};
