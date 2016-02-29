import React from 'react';

const baseClasses = "captionLink";
const selectedClasses = "captionLink selectedCaption";

class Caption extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      classes:baseClasses
    };

    //checks to see if video is in time window for caption to highlight
    this.checkForCaptionTime = this.checkForCaptionTime.bind(this);

    //set and remove highlight CSS
    this.setHighlight = this.setHighlight.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);

    //parent callback. calls skipTo function
    this.itemClick = this.itemClick.bind(this);
  }

  componentDidMount() {
    //in case caption starts at 0 (componentWillReceiveProps won't fire)
    this.checkForCaptionTime(this.props.videoTime);
  }

  componentWillReceiveProps(newProps) {
    this.checkForCaptionTime(newProps.videoTime);
  }

  checkForCaptionTime(timeComparison)
  {
    if (timeComparison >= this.props.captionStart  && timeComparison < this.props.captionEnd)
    {
      this.setHighlight();
    }
    else {
      this.removeHighlight();
    }
  }

  setHighlight()
  {
    this.setState({classes: selectedClasses});
  }

  removeHighlight()
  {
    this.setState({classes: baseClasses});
  }

  itemClick()
  {
    this.props.callbackParent( this.props.captionStart);
  }

  render() {
    return (
      <p><a className={this.state.classes} onClick={this.itemClick}>{this.props.captionText}</a></p>
    );
  }
}

module.exports = Caption;
