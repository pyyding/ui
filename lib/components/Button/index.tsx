import React from "react";
import { cx } from "../common/utils.ts";
import { LoadingSpinner } from "./LoadingSpinner.tsx";

type ButtonColor = "gray" | "purple" | "red" | "black" | "yellow";
type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
} & (
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      onClick?: never;
      disabled?: never;
      loading?: never;
      loadingText?: never;
    })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      href?: never;
      target?: never;
      rel?: never;
      loading?: boolean;
      loadingText?: string;
    })
);

const buttonStyleConfig = {
  base:
    "inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap " +
    "align-middle outline-none rounded-md font-medium transition-colors transition-shadow " +
    "min-w-[2.5rem] gap-2 " +
    "disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none " +
    "focus-visible:shadow-outline",
  size: {
    xs: "text-xs px-2 h-6",
    sm: "text-sm px-3 h-8",
    md: "text-sm px-3 py-1.5 h-8",
    lg: "text-lg px-6 h-12",
  },
  variant: {
    solid: "border shadow-subtle",
    outline: "bg-transparent border hover:bg-opacity-50",
    ghost: "bg-transparent border-none",
  },
  color: {
    gray: {
      solid:
        "text-gray-800 bg-whiteAlpha-900 border-gray-200 hover:bg-gray-100 active:bg-gray-300",
      ghost: "text-gray-800 hover:bg-gray-100 active:bg-gray-200",
      outline:
        "border-gray-200 text-gray-800 hover:bg-gray-100 active:bg-gray-200",
    },
    purple: {
      solid:
        "bg-purple-500 text-white border-current hover:bg-purple-600 active:bg-purple-700",
      ghost:
        "text-purple-500 border-none hover:bg-purple-50 active:bg-purple-100",
      outline: "text-purple-500 hover:bg-purple-50 active:bg-purple-100",
    },
    red: {
      solid:
        "text-white bg-red-500 border-current hover:bg-red-600 active:bg-red-700",
      ghost: "text-red-500 hover:bg-red-50 active:bg-red-100",
      outline: "text-red-500 border-current hover:bg-red-50 active:bg-red-100",
    },
    black: {
      solid:
        "text-whiteAlpha-900 bg-gray-800 border-current hover:bg-gray-900 active:bg-gray-900",
      ghost: "text-gray-800 hover:bg-gray-50 active:bg-gray-100",
      outline:
        "text-gray-800 border-current hover:bg-gray-50 active:bg-gray-100",
    },
    yellow: {
      solid:
        "text-gray-800 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600",
      ghost: "text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100",
      outline:
        "text-yellow-500 border-current hover:bg-yellow-50 hover:bg-opacity-50 active:bg-yellow-100",
    },
  },
};

function buttonStyles({
  variant,
  color,
  size,
}: {
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
}): string {
  const variantStyle = buttonStyleConfig.variant[variant];
  const colorStyle = buttonStyleConfig.color[color][variant];
  const sizeStyle = buttonStyleConfig.size[size];
  return cx(buttonStyleConfig.base, colorStyle, variantStyle, sizeStyle);
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLLinkElement,
  ButtonProps
>((props, ref) => {
  const {
    variant = "solid",
    color = "gray",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const buttonStyle = buttonStyles({ variant, color, size });

  if (rest.href) {
    return (
      <a
        className={cx(buttonStyle, className)}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref as React.RefObject<HTMLAnchorElement>}
      >
        <TouchTarget>{children}</TouchTarget>
      </a>
    );
  }

  const { disabled, loading, loadingText, ...buttonProps } = rest;

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-label={loading && !loadingText ? "Loading, please wait" : undefined}
      className={cx(buttonStyle, className)}
      {...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={ref as React.RefObject<HTMLButtonElement>}
    >
      <LoaderWrapper loading={loading} loadingText={loadingText}>
        <TouchTarget>{children}</TouchTarget>
      </LoaderWrapper>
    </button>
  );
});

/* Expand the hit area to at least 44×44px on touch devices */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <span
        className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
    </>
  );
}

function LoaderWrapper({
  loading,
  loadingText,
  children,
}: {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}) {
  if (!loading) {
    return children;
  }

  return (
    <>
      {loadingText ? (
        <>
          <LoadingSpinner />
          {loadingText}
        </>
      ) : (
        <LoaderWithInitialWidth>{children}</LoaderWithInitialWidth>
      )}
    </>
  );
}

function LoaderWithInitialWidth({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center relative">
      <LoadingSpinner className="absolute inset-0 m-auto" />
      <div className="invisible">{children}</div>
    </div>
  );
}
