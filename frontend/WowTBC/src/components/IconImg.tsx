export function IconImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={`/icons/${src}`} alt={alt} className={className} />;
}