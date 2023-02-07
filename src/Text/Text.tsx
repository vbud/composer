import classnames from 'classnames';
import React, { ElementType, ReactNode } from 'react';
import * as styles from './Text.css';

export interface TextProps {
  size?: 'xsmall' | 'small' | 'standard' | 'large';
  weight?: 'regular' | 'strong' | 'weak';
  tone?: 'neutral' | 'accent' | 'critical';
  as?: ElementType;
  truncate?: boolean;
  className?: string;
  children: ReactNode;
}

export const Text = ({
  as: component = 'span',
  size = 'standard',
  weight = 'regular',
  tone = 'neutral',
  truncate = false,
  className,
  children,
}: TextProps) =>
  React.createElement(
    component,
    {
      className: classnames(
        className,
        styles.base,
        styles[size],
        styles[tone],
        {
          [styles.strong]: weight === 'strong',
          [styles.weak]: weight === 'weak',
          [styles.truncate]: truncate,
        }
      ),
    },
    children
  );
