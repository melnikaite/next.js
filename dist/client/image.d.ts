/// <reference types="react" />
declare const VALID_LOADING_VALUES: readonly ["lazy", "eager", undefined];
declare type LoadingValue = typeof VALID_LOADING_VALUES[number];
declare const VALID_LAYOUT_VALUES: readonly ["fill", "fixed", "intrinsic", "responsive", undefined];
declare type LayoutValue = typeof VALID_LAYOUT_VALUES[number];
declare type ImageProps = Omit<JSX.IntrinsicElements['img'], 'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading'> & {
    src: string;
    quality?: number | string;
    priority?: boolean;
    loading?: LoadingValue;
    unoptimized?: boolean;
} & ({
    width?: never;
    height?: never;
    /** @deprecated Use `layout="fill"` instead */
    unsized: true;
} | {
    width?: never;
    height?: never;
    layout: 'fill';
} | {
    width: number | string;
    height: number | string;
    layout?: Exclude<LayoutValue, 'fill'>;
});
export default function Image({ src, sizes, unoptimized, priority, loading, className, quality, width, height, ...all }: ImageProps): JSX.Element;
export {};