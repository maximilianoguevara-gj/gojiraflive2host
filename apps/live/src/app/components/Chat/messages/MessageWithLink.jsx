import React from 'react'
import Linkify from 'react-linkify/dist/components/Linkify'
import { AnchorLink } from '../style'
import PropTypes from 'prop-types'
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics'

const MessageWithLink = ({ children, isDesktop }) => {
  const { gaEventTracker } = useGoogleAnalytics()
  const { matomoTrackEvent } = useMatomoAnalytics()

  const handleClickUrlInChat = () => {
    gaEventTracker('InCall > Chat', 'click-url-in-chat')
    matomoTrackEvent('InCall > Chat', 'click-url-in-chat')
  }
  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <AnchorLink
          target="_blank"
          href={decoratedHref}
          key={key}
          isDesktop={isDesktop}
          rel="noreferrer"
          onClick={() => handleClickUrlInChat()}
        >
          {decoratedText}
        </AnchorLink>
      )}
    >
      {children}
    </Linkify>
  )
}
MessageWithLink.propTypes = {
  children: PropTypes.element,
  isDesktop: PropTypes.element,
}
export default MessageWithLink
