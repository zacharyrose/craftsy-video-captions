import React from 'react';
import request from 'superagent';
import ClassNames from 'classnames';
import Caption from './Caption';

class Video extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      videoLength:0,
      captions:[],
      time: 0,
      playing: false
    };

    //Counter function
    this.tick = this.tick.bind(this);

    //These functions manage the interval than runs the counter
    this.startCount = this.startCount.bind(this);
    this.stopCount = this.stopCount.bind(this);

    //These functions abstract the counter and manage "playing" state
    this.startVideo = this.startVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);

    //skips to specified time in the video. Used as a callback in Caption
    this.skipTo = this.skipTo.bind(this);

    /* Returns boolean as to whether video is over.
       This way it will returnToStart if user attempts
       to hit play at the end  */
    this.videoIsOver = this.videoIsOver.bind(this);

    //skipTo(0).  Used in the button and also when user plays video at end
    this.returnToStart = this.returnToStart.bind(this);
  }

  componentDidMount() {

    request(this.props.videoData).end( (err, res) => {
      if (err || !res.ok) {
        console.log('Error getting video data');
      } else {
        this.setState({videoLength: res.body.videoLength});
        this.setState({captions: res.body.captions});
      }
    });

    this.startVideo(); //Start Video automatically
  }

  componentWillUnmount() {
    this.stopVideo();
  }

  tick() {
    this.setState({time: this.state.time + 1});
    if (this.state.time >= this.state.videoLength) {
      this.stopVideo();
    }
  }

  startCount() {
      this.interval = setInterval(this.tick, 1000);
  }

  stopCount()
  {
    clearInterval(this.interval);
  }

  skipTo(skipTime)
  {
    if (skipTime >= this.state.videoLength)
    {
      this.stopVideo();
      this.setState({time: this.state.videoLength});
    }
    else {
      this.stopCount(); //reset interval so that it will start at 0ms after skipTime
      this.setState({time: skipTime});
      if (this.state.playing) {
        this.startCount();
      }
    }
  }

  startVideo()
  {
    if(!this.state.playing) //check to make sure video is stopped so that we don't start a second interval
    {
      if (this.videoIsOver())
      {
        this.returnToStart();
      }

      this.startCount();
      this.setState({playing: true});
    }
  }

  stopVideo()
  {
    this.stopCount();
    this.setState({playing:false});
  }

  videoIsOver()
  {
    return (this.state.time === this.state.videoLength);
  }

  returnToStart()
  {
    this.skipTo(0);
  }

  render() {
    return (
      <div className="videoContainer">
        <div className="videoBox">
          <h1 className="videoCounter">{this.state.time}</h1>
        </div>

        <h1 className="videoControls">
          <a onClick={this.returnToStart}>
            <i className="fa fa-backward"></i>
          </a>
          <a onClick={this.startVideo} className={ClassNames({"videoControlState" : this.state.playing})}>
            <i className="fa fa-play"></i>
          </a>
          <a onClick={this.stopVideo} className={ClassNames({"videoControlState" : !this.state.playing})}>
            <i className="fa fa-pause"></i>
          </a>
        </h1>

        <div className="captionContainer">
        {
          this.state.captions.map( videoCaption => {
            return (
              <Caption key={videoCaption.id} videoTime={this.state.time} captionText={videoCaption.captionText} captionStart={videoCaption.captionStart} captionEnd={videoCaption.captionEnd} callbackParent={this.skipTo} />
            );
          })
        }
        </div>
      </div>
    );
  }
}

module.exports = Video;
