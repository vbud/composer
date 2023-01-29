import React, { ReactNode } from 'react';
import classnames from 'classnames';
import Link from 'next/link';

import * as styles from './ToolbarItem.css';

interface Props {
  children: ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
  ['data-testid']?: string;
}

interface ButtonProps extends Props {
  onClick: () => void;
}

interface LinkProps extends Props {
  href: string;
}

export function ToolbarItemButton({
  children,
  title,
  active = false,
  disabled = false,
  onClick,
  'data-testid': dataTestId,
}: ButtonProps) {
  return (
    <button
      type="button"
      data-testid={dataTestId}
      className={classnames(styles.root, {
        [styles.active]: active,
        [styles.disabled]: disabled,
      })}
      title={title}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export function ToolbarItemLink({
  children,
  title,
  active = false,
  disabled = false,
  href,
  'data-testid': dataTestId,
}: LinkProps) {
  return (
    <Link
      data-testid={dataTestId}
      className={classnames(styles.root, {
        [styles.active]: active,
        [styles.disabled]: disabled,
      })}
      title={title}
      href={href}
    >
      {children}
    </Link>
  );
}
