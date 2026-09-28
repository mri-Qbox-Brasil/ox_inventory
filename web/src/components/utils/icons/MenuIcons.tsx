import React from 'react';

const MenuIcon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg
    className={className ?? 'context-menu-icon'}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

export const UseIcon: React.FC = () => (
  <MenuIcon>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </MenuIcon>
);

export const GiveIcon: React.FC = () => (
  <MenuIcon>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </MenuIcon>
);

export const DropIcon: React.FC = () => (
  <MenuIcon>
    <path d="M12 17V3" />
    <path d="m6 11 6 6 6-6" />
    <path d="M19 21H5" />
  </MenuIcon>
);

export const CopyIcon: React.FC = () => (
  <MenuIcon>
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </MenuIcon>
);

export const RemoveIcon: React.FC = () => (
  <MenuIcon>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
  </MenuIcon>
);

export const WrenchIcon: React.FC = () => (
  <MenuIcon>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </MenuIcon>
);

export const ActionIcon: React.FC = () => (
  <MenuIcon>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </MenuIcon>
);

export const ChevronRightIcon: React.FC = () => (
  <MenuIcon className="context-menu-chevron">
    <path d="m9 18 6-6-6-6" />
  </MenuIcon>
);

export const ClockIcon: React.FC = () => (
  <MenuIcon className="tooltip-icon">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </MenuIcon>
);

export const CheckIcon: React.FC = () => (
  <MenuIcon className="tooltip-icon">
    <path d="M20 6 9 17l-5-5" />
  </MenuIcon>
);

export const CrossIcon: React.FC = () => (
  <MenuIcon className="tooltip-icon">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </MenuIcon>
);
