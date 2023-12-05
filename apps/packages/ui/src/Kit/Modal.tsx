import React from 'react';
import {
  motion, PanInfo, Variants,
} from 'framer-motion';
import classNames from 'classnames';
import { useDevices } from '@gojiraf/responsive';
import { useViews } from 'state';

type Size = 'FULL' | 'LARGE' | 'SMALL';

interface ModalProps {
  size: Size
  onClose: () => void
  children: React.ReactNode
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { y: 1000 },
  visible: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
};

type SizeClass = {
  [size in Size]: string
};

const sizeClass: SizeClass = {
  FULL: 'h-full',
  LARGE: 'h-48',
  SMALL: 'h-12',
};

function Modal({ size = 'FULL', children, onClose }: ModalProps) {
  const { state } = useViews();
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 200) {
      onClose();
    }
  };
  const { isMd } = useDevices();

  const getBorderRadius = () => (state.matches('main.showingPDP') === true ? '1rem 1rem 0 0' : '1rem');

  return (
    <div className="absolute z-10 w-full h-full flex flex-col">
      {size === 'LARGE' || size === 'FULL' ? (
        <motion.div
          className={`${classNames(sizeClass[size])} grow`}
          id="modal-overlay"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        />
      ) : null}
      <motion.div
        className="relative h-full pb-8 bg-base-100"
        style={{ borderRadius: getBorderRadius() }}
        id="modal-panel"
        initial="hidden"
        animate="visible"
        exit="hidden"
        drag="y"
        dragConstraints={{
          top: 0,
          bottom: 0,
        }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        variants={panelVariants}
      >
        {isMd === false ? (
          <div className="my-4 mx-auto w-16 h-2 bg-slate-300 rounded-xl" />
        ) : null}
        <motion.div
          className="h-full"
          drag="y"
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          dragElastic={0}
          dragMomentum={false}
          dragDirectionLock
        >
          {children}
        </motion.div>

      </motion.div>
    </div>
  );
}

export { Modal };
