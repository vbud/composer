import classnames from 'classnames';
import { AllHTMLAttributes, ElementType, ReactElement } from 'react';
import * as styles from './Button.css';

interface BaseProps {
  as?: ElementType;
  tone?: 'critical';
  icon?: ReactElement;
  'data-testid'?: string;
}

interface ButtonProps
  extends Omit<AllHTMLAttributes<HTMLButtonElement>, 'as'>,
    BaseProps {}

interface LinkProps
  extends Omit<AllHTMLAttributes<HTMLAnchorElement>, 'as'>,
    BaseProps {}

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
      styles.base,
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
