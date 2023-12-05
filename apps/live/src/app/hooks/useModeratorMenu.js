import { useEffect, useRef, useState } from 'react'
import { CustomerRoles } from '../constants/customerRoles'

export const useModeratorMenu = (user) => {
  const [showModeratorMenu, setShowModeratorMenu] = useState(false)
  const [parentStyles, setParentStyles] = useState({ height: 0, marginRight: 0 })
  const ref = useRef(null)
  const [showMenuOptions, setShowMenuOptions] = useState(false)

  const handleShowModeratorMenu = (isIconButton) => {
    setShowMenuOptions(!showMenuOptions)
    if (!isIconButton) setShowModeratorMenu(false)
  }

  const onMouseOver = () => {
    if (user.role === CustomerRoles.MODERATOR) {
      setShowModeratorMenu(true)
    }
  }
  const onMouseLeave = () => {
    setShowModeratorMenu(false)
    setShowMenuOptions(false)
  }

  useEffect(() => {
    if (ref?.current) {
      setParentStyles({
        height: ref.current.clientHeight,
        marginRight: ref.current.offsetLeft,
      })
    }
  }, [])

  return {
    showModeratorMenu,
    handleShowModeratorMenu,
    onMouseOver,
    onMouseLeave,
    ref,
    parentStyles,
    showMenuOptions,
  }
}
