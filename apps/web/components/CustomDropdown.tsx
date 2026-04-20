'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import Portal from './Portal';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  fullWidth = false
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={dropdownRef} 
      style={{ 
        position: 'relative', 
        width: fullWidth ? '100%' : 'auto',
        minWidth: 120
      }}
    >
      {label && (
        <span style={{ 
          display: 'block', 
          fontSize: 10, 
          fontWeight: 800, 
          color: '#c9a84c', 
          letterSpacing: '0.1em', 
          marginBottom: 8,
          textTransform: 'uppercase'
        }}>
          {label}
        </span>
      )}

      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid ' + (isOpen ? '#c9a84c' : 'rgba(255, 255, 255, 0.1)'),
          borderRadius: 12,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          outline: 'none',
          boxShadow: isOpen ? '0 0 20px rgba(201, 168, 76, 0.15)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          style={{ 
            color: '#c9a84c', 
            transition: 'transform 0.3s',
            transform: isOpen ? 'rotate(180deg)' : 'none'
          }} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <Portal>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: 'absolute',
                top: coords.top + 8,
                left: coords.left,
                width: coords.width,
                background: 'rgba(10, 10, 10, 0.98)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                borderRadius: 16,
                padding: 8,
                zIndex: 11000,
                boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
                maxHeight: 300,
                overflowY: 'auto'
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 12px',
                    background: value === option.value ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: 10,
                    color: value === option.value ? '#c9a84c' : 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    if (value !== option.value) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (value !== option.value) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {option.icon && <span>{option.icon}</span>}
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{option.label}</span>
                  </div>
                  {value === option.value && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}
