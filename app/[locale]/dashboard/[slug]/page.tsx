export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard: {slug}</h1>
    </div>
  );
}
