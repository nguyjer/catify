import React, { useState, useEffect } from "react";
import popCat from "../assets/pixil-frame-0.png"
import hipHopCat from "../assets/pixil-frame-0 4.png";
import edmCat from "../assets/edmcat.png";


const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback(props) {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "catify",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>
              {" "}
              Instance not active. Transfer your playback using your Spotify app{" "}
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container spotify-play">
          <div className="main-wrapper drip">
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />

            <div className="now-playing__side">
              <div className="helpme now-playing__name">
                {current_track.name}
              </div>
              <div className="helpme now-playing__artist">
                {current_track.artists[0].name}
              </div>
              <div className="box-button">
                <button
                  className="helpme btn-spotify"
                  onClick={() => {
                    player.previousTrack();
                  }}
                >
                  &lt;&lt;
                </button>

                <button
                  className="helpme btn-spotify"
                  onClick={() => {
                    player.togglePlay();
                  }}
                >
                  {is_paused ? "PLAY" : "PAUSE"}
                </button>

                <button
                  className="helpme btn-spotify"
                  onClick={() => {
                    player.nextTrack();
                  }}
                >
                  &gt;&gt;
                </button>
              </div>
            </div>
          </div>
        </div>
        <img src={popCat} alt="my-popCat" className="cat" />
        <img src={hipHopCat} alt="my-hipHopCat" className="cat" />
        <img src={edmCat} alt="my-edmCat" className="cat" />
      </>
    );
  }
}

export default WebPlayback;
