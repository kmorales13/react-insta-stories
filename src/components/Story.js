import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import SeeMore from './SeeMore'
import globalStyle from './../styles.css'

export default class Story extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      loaded: false
    }
    
    this.getStoryContent = this.getStoryContent.bind(this)
    this.getStoryHeader = this.getStoryHeader.bind(this)
    this.storyLoaded = this.storyLoaded.bind(this)
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.story !== prevProps.story) {
      this.pauseId && clearTimeout(this.pauseId)
      this.pauseId = setTimeout(() => {
        this.setState({loaded: false})
      }, 300)
      this.props.action('pause', true)
      this.vid && this.vid.addEventListener('waiting', () => {
        this.props.action('pause', true)
      })
      this.vid && this.vid.addEventListener('playing', () => {
        this.props.action('play', true)
      })
    }
    if (this.vid && (this.props.playState !== prevProps.playState) && !this.props.bufferAction) {
      if (this.props.playState) {
        this.vid.pause()
      } else {
        this.vid.play().catch(e => console.log(e))
      }
    }
  }
  
  toggleMore = show => {
    this.setState({ showMore: show })
  }
  
  storyLoaded() {
    try {
      if (this.pauseId) clearTimeout(this.pauseId)
      this.setState({loaded: true})
      this.props.action('play', true)
    } catch (e) {
      console.log(e)
    }
  }
  
  getStoryContent() {
    const { story, renderer } = this.props;
    
    return renderer(story, this.storyLoaded);
  }

  getStoryHeader(data) {
    const { header } = this.props;
    
    return header(data);
  }

  render() {
    const isHeader = typeof this.props.story === 'object' && this.props.story.header
    
    return (
      <div style={{...styles.story, width: this.props.width, height: this.props.height}}>
        {this.getStoryContent()}

        {isHeader && <div style={{position: 'absolute', left: 12, top: 20, zIndex: 19}}>
          {this.props.header ? this.getStoryHeader(this.props.story.header) : <Header heading={this.props.story.header.heading} subheading={this.props.story.header.subheading} profileImage={this.props.story.header.profileImage} />}
        </div>}

        {!this.state.loaded && <div style={{width: this.props.width, height: this.props.height, position: 'absolute', left: 0, top: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 9, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ccc'}}>{this.props.loader || <div className={globalStyle.spinner} />}</div>}
        
        {this.props.story.seeMore &&
          <div style={{position: 'absolute', margin: 'auto', bottom: 0, zIndex: 9999, width: '100%'}}>
            <SeeMore action={this.props.action} toggleMore={this.toggleMore} showContent={this.state.showMore} seeMoreContent={this.props.story.seeMore} />
          </div>
        }
      </div>
    )
  }
}

const styles = {
  story: {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden'
  },
  storyContent: {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  }
}

Story.propTypes = {
  story: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  height: PropTypes.number,
  width: PropTypes.number,
  action: PropTypes.func,
  loader: PropTypes.element,
  header: PropTypes.func,
  playState: PropTypes.bool,
  getVideoDuration: PropTypes.func,
  bufferAction: PropTypes.bool,
  storyContentStyles: PropTypes.object
}
