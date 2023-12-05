import { Icons } from 'icons';
import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  content: string;
}

function Accordion({ title, content }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <button
          type="button"
          className="w-full py-2 text-left font-medium flex justify-between items-center"
          onClick={toggleAccordion}
        >
          <span className="font-semibold">{title}</span>
          <span className={`transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`}><Icons.Expand /></span>
        </button>
      </div>
      {isOpen && (
        <div className="py-4">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}

export default Accordion;
