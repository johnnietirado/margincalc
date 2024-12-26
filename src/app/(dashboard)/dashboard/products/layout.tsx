export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="col-span-3">{children}</div>;
}
