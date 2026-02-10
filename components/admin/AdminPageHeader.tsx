import Link from 'next/link';

interface AdminPageHeaderProps {
  title: string;
  createHref?: string;
  createLabel?: string;
}

export default function AdminPageHeader({
  title,
  createHref,
  createLabel = 'Yeni yarat',
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
        {title}
      </h1>
      {createHref && (
        <Link
          href={createHref}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium tracking-tight hover:bg-primary-600 transition-colors"
        >
          + {createLabel}
        </Link>
      )}
    </div>
  );
}
