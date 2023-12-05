import React, { useRef, useState } from 'react'
import { config } from '@react-spring/core'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'
import PropTypes from 'prop-types'

const DraggableContainer = ({ onClose, children, ...props }) => {
  const containerRef = useRef()
  const [drag, setDrag] = useState(0)
  let [animation, api] = useSpring(() => ({
    from: { transform: `translateY(1000px)` },
    to: { transform: `translateY(0)` },
    config: { duration: 350 },
  }))

  const bind = useDrag(
    ({ last, movement: [, my], vxvy: [, vy], cancel, canceled }) => {
      let containerHeight = containerRef.current.clientHeight
      let reachedDragThreshold = (100 * my) / containerHeight >= 65 ? true : false
      //Si sube demasiado, volvemos a la posicion original.
      if (my < -50) {
        cancel()
        open({ canceled })
        return
      }
      setDrag(my)
      //Si el user suelta el drag a alta velocidad o llegamos al limite, cerramos.
      if (last && (reachedDragThreshold || vy > 0.6)) {
        close()
        return
      }
      setDrag(my)
      //Movemos el container.
      api.stop()
      api.start({
        to: { transform: `translateY(${my}px)` },
        immediate: true,
      })
    },
    { initial: () => [0, drag], filterTaps: true, bounds: { top: 0 }, rubberband: true },
  )

  const open = async ({ canceled }) => {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    await api.start({
      to: { transform: `translateY(0px)` },
      immediate: false,
      config: canceled ? config.wobbly : config.stiff,
    })
  }

  const close = async () => {
    animation = {}
    await api.delete()
    await api.start({
      config: { ...config.stiff, duration: 350 },
      to: { transform: `translateY(1000px)` },
      immediate: false,
      onRest: onClose,
    })
    setDrag(0)
  }

  return (
    <animated.div
      style={Object.assign({}, animation, { touchAction: 'pan-x' })}
      ref={containerRef}
      {...props}
      {...bind()}
    >
      {children}
    </animated.div>
  )
}

DraggableContainer.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.element,
}

export { DraggableContainer }
