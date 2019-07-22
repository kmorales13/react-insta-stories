import React from 'react'
import PropTypes from 'prop-types'
import style from './../styles.css'
import up from './../up.png'

export default function seeMore(props) {
  _renderContent() {
    return (
      <div className={style.seeMoreExpanded}>
        <div onClick={() => { props.toggleMore(false); props.action('play'); }} className={style.seeMoreClose}></div>
        {props.seeMoreContent}
      </div>
    );
  }
  
  return (
    props.showContent
      ? this._renderContent() 
      : <div onClick={() => {
        props.toggleMore(true)
        props.action('pause')
      }} className={style.seeMore}>
        <span className={style.seemoreIcon}><img src={up} /></span>
        <span className={style.seemoreText}>Read more</span>
      </div>
  )
}

seeMore.propTypes = {
  seeMoreContent: PropTypes.object,
  showContent: PropTypes.bool,
  action: PropTypes.func,
  toggleMore: PropTypes.func
}
