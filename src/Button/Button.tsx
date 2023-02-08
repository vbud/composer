import classnames from 'classnames';
import { ComponentProps, ElementType, ReactElement } from 'react';
import * as styles from './Button.css';

interface BaseProps {
  as?: ElementType;
  tone?: 'critical';
  icon?: ReactElement;
  'data-testid'?: string;
}

interface ButtonProps extends Omit<ComponentProps<'button'>, 'as'>, BaseProps {}

interface LinkProps extends Omit<ComponentProps<'a'>, 'as'>, BaseProps {}

type Props = ButtonProps | LinkProps;

export const Button = ({
  as: ButtonComponent = 'button',
  children,
  icon,
  tone,
  className,
  ...props
}: Props) => (
  <ButtonComponent
    className={classnames(
      styles.reset,
      styles.root,
      {
        [styles.critical]: tone === 'critical',
      },
      className
    )}
    {...props}
  >
    {children}
    {icon ? <span className={styles.iconContainer}>{icon}</span> : null}
  </ButtonComponent>
);

export const ButtonLink = ({
  children,
  className,
  ...props
}: ComponentProps<'button'>) => (
  <button
    className={classnames(styles.reset, styles.buttonLink, className)}
    {...props}
  >
    {children}
  </button>
);
