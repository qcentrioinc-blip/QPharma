import { type ReactNode, type CSSProperties } from "react";
 
type TypographyProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};
 
export const H1 = ({ children, className = "" }: TypographyProps) => {
  return (
    <h1
      className={`
        text-[32px] md:text-[48px] lg:text-[56px]
        font-manrope
        leading-[120%]
        ${className}`}
    >
      {children}
    </h1>
  );
};
 
 
// H2
export const H2 = ({ children, className = "", style }: TypographyProps) => {
  return (
    <h2
      style={style}
      className={`
        text-[24px] md:text-[32px] lg:text-[48px]
        font-manrope
        leading-[120%]
        ${className}`}
    >
      {children}
    </h2>
  );
};
 
 
// H3
export const H3 = ({ children, className = "" }: TypographyProps) => {
  return (
    <h3
      className={`
        text-[20px] md:text-[24px] lg:text-[32px]
        font-manrope
        font-medium
        leading-[120%]
        ${className}`}
    >
      {children}
    </h3>
  );
};
 

 
// H4
export const H4 = ({ children, className = "" }: TypographyProps) => {
  return (
    <h4
      className={`
        text-[16px] md:text-[20px] lg:text-[24px]
        font-manrope
        font-medium
        leading-[120%]
        ${className}`}
    >
      {children}
    </h4>
  );
};

 
// Paragraph
export const P = ({ children, className = "" }: TypographyProps) => {
  return (
    <p
      className={`
        text-[14px] md:text-[16px] dark:text-white lg:text-[16px] xl:text-[18px]
        font-para
        leading-[120%]
        text-[#141414]
        ${className}`}
    >
      {children}
    </p>
  );
};
 
export const P2 = ({ children, className = "" }: TypographyProps) => {
  return (
    <p
      className={`
        text-[14px] md:text-[14px] lg:text-[18px]
        font-para
        leading-[100%]
        ${className}`}
    >
      {children}
    </p>
  );
};
 
export const Li = ({ children, className = "" }: TypographyProps) => {
  return (
    <li
      className={`
        text-[14px] md:text-[16px] lg:text-[16px]
        font-para
        leading-[120%]
        ${className}`}
    >
      {children}
    </li>
  );
};
 
// Supporting text
export const S = ({ children, className = "" }: TypographyProps) => {
  return (
    <p
      className={`
        text-[12px] md:text-[12px] lg:text-[14px]
        font-para
        leading-[120%]
        ${className}`}
    >
      {children}
    </p>
  );
};
 